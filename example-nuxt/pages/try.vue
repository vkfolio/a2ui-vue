<template>
  <div class="try-page">
    <!-- LEFT: Chat panel -->
    <div class="chat-panel">
      <!-- Header -->
      <div class="chat-header">
        <div class="agent-avatar">
          <span class="material-icons">smart_toy</span>
        </div>
        <div class="agent-info">
          <span class="agent-name">A2UI Agent</span>
          <span class="agent-status">
            <span class="status-dot" :class="backendOnline ? 'online' : 'offline'"></span>
            {{ backendOnline ? 'Online' : 'Offline — start Python server' }}
          </span>
        </div>
        <button class="clear-btn" @click="clearChat" title="Clear conversation">
          <span class="material-icons">refresh</span>
        </button>
      </div>

      <!-- Messages -->
      <div class="messages-area" ref="messagesEl">
        <!-- Empty state / suggestions -->
        <div v-if="messages.length === 0" class="empty-state">
          <div class="empty-icon">
            <span class="material-icons">chat_bubble_outline</span>
          </div>
          <p class="empty-title">Try the A2UI Agent</p>
          <p class="empty-sub">Ask for a widget or start a conversation. The agent can show UI, ask for confirmation, or collect your input.</p>
          <div class="suggestions">
            <button
              v-for="s in suggestions"
              :key="s.text"
              class="suggestion-chip"
              @click="send(s.text)"
            >
              <span class="material-icons">{{ s.icon }}</span>
              {{ s.text }}
            </button>
          </div>
        </div>

        <!-- Message list -->
        <template v-else>
          <div
            v-for="msg in messages"
            :key="msg.id"
            class="message-row"
            :class="msg.role"
          >
            <!-- Tool call indicator -->
            <div v-if="msg.type === 'tool'" class="tool-indicator">
              <span class="material-icons spin">{{ toolIcon(msg.toolName) }}</span>
              <span>{{ toolLabel(msg.toolName) }}</span>
            </div>

            <!-- Regular message bubble -->
            <div v-else class="bubble" :class="msg.role">
              <span class="bubble-text" v-html="formatMessage(msg.content)"></span>
            </div>
          </div>

          <!-- Streaming / typing indicator -->
          <div v-if="isStreaming" class="message-row assistant">
            <div v-if="streamingText" class="bubble assistant">
              <span class="bubble-text">{{ streamingText }}</span>
              <span class="cursor"></span>
            </div>
            <div v-else class="typing-indicator">
              <span></span><span></span><span></span>
            </div>
          </div>
        </template>
      </div>

      <!-- Input bar -->
      <div class="input-area">
        <div class="input-wrap" :class="{ focused: inputFocused, disabled: isStreaming }">
          <input
            ref="inputEl"
            v-model="inputText"
            @focus="inputFocused = true"
            @blur="inputFocused = false"
            @keydown.enter.exact.prevent="send()"
            :disabled="isStreaming"
            placeholder="Ask anything..."
            class="chat-input"
          />
          <button
            class="send-btn"
            :disabled="!inputText.trim() || isStreaming"
            @click="send()"
          >
            <span class="material-icons">{{ isStreaming ? 'hourglass_empty' : 'send' }}</span>
          </button>
        </div>
        <p class="input-hint">Enter to send · Widgets render live on the right</p>
      </div>
    </div>

    <!-- RIGHT: Live widget preview -->
    <div class="preview-panel">
      <div class="preview-header">
        <span class="material-icons">widgets</span>
        <span>Live Widget</span>
        <span v-if="currentMessages" class="preview-badge">
          <span class="dot"></span> Live
        </span>
      </div>

      <div class="preview-body">
        <!-- Loading state while streaming a widget -->
        <div v-if="isStreaming && !currentMessages" class="preview-loading">
          <div class="preview-spinner"></div>
          <p>Generating widget...</p>
        </div>

        <!-- Rendered widget -->
        <Transition name="widget-fade">
          <div v-if="currentMessages" class="widget-wrap" :key="widgetKey">
            <A2StaticRenderer
              :messages="currentMessages"
              @action="handleWidgetAction"
              @error="handleWidgetError"
            />
          </div>
        </Transition>

        <!-- Empty state -->
        <div v-if="!currentMessages && !isStreaming" class="preview-empty">
          <span class="material-icons">view_quilt</span>
          <p>No widget yet</p>
          <p class="sub">Ask the agent to show a weather card, user profile, task list, and more.</p>
        </div>
      </div>

      <!-- Quick action chips for the preview -->
      <div v-if="currentMessages" class="preview-actions">
        <button
          v-for="s in followUpSuggestions"
          :key="s"
          class="action-chip"
          @click="send(s)"
        >{{ s }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { A2StaticRenderer, connectSSE, parseA2UIMessages, useDataModel } from 'a2ui-vue'
import { nextTick, ref, onMounted } from 'vue'

// ── State ────────────────────────────────────────────────────
const AGENT_URL = 'http://localhost:8006/agent'
const threadId = `thread-${Date.now()}`

interface Message {
  id: string
  role: 'user' | 'assistant' | 'tool'
  type?: 'text' | 'tool'
  content: string
  toolName?: string
}

const messages = ref<Message[]>([])
const inputText = ref('')
const inputFocused = ref(false)
const isStreaming = ref(false)
const streamingText = ref('')
const currentMessages = ref<any[] | null>(null)
const widgetKey = ref(0)
const backendOnline = ref(false)
const messagesEl = ref<HTMLElement | null>(null)
const inputEl = ref<HTMLInputElement | null>(null)

// Accumulated API messages for multi-turn
const apiMessages = ref<{ role: string; content: string }[]>([])

const suggestions = [
  { text: 'Show me the weather in Tokyo', icon: 'wb_sunny' },
  { text: 'Show a user profile card', icon: 'person' },
  { text: 'Create a task list for my day', icon: 'checklist' },
  { text: 'Show me a stats dashboard', icon: 'bar_chart' },
  { text: 'Delete all tasks', icon: 'delete_outline' },
  { text: 'Design a product card', icon: 'shopping_bag' },
]

const followUpSuggestions = ref<string[]>([])

// ── Helpers ───────────────────────────────────────────────────
function uid() {
  return Math.random().toString(36).slice(2)
}

function toolLabel(name?: string) {
  const labels: Record<string, string> = {
    show_weather: 'Getting weather data...',
    show_profile: 'Building profile card...',
    show_task_list: 'Creating task list...',
    show_login_form: 'Building login form...',
    show_stats_card: 'Generating stats...',
    confirm_action: 'Asking for confirmation...',
    collect_user_input: 'Showing input form...',
    design_widget: 'Designing custom widget...',
  }
  return labels[name ?? ''] ?? `Running ${name}...`
}

function toolIcon(name?: string) {
  const icons: Record<string, string> = {
    show_weather: 'wb_sunny',
    show_profile: 'person',
    show_task_list: 'checklist',
    show_login_form: 'lock',
    show_stats_card: 'bar_chart',
    confirm_action: 'help_outline',
    collect_user_input: 'edit',
    design_widget: 'auto_awesome',
  }
  return icons[name ?? ''] ?? 'settings'
}

function formatMessage(content: string) {
  // Basic markdown: **bold**, `code`
  return content
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>')
}

// Strip code fences and large JSON arrays from agent text before displaying
function cleanAgentText(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, '')           // remove code fences
    .replace(/\[\s*\{[\s\S]{80,}\}\s*\]/g, '') // remove large JSON arrays
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesEl.value) {
      messagesEl.value.scrollTop = messagesEl.value.scrollHeight
    }
  })
}

// ── Chat logic ────────────────────────────────────────────────
async function send(text?: string) {
  const content = (text ?? inputText.value).trim()
  if (!content || isStreaming.value) return

  inputText.value = ''

  // Add user message to UI
  messages.value.push({ id: uid(), role: 'user', type: 'text', content })

  // Add to API history
  apiMessages.value.push({ role: 'user', content })

  scrollToBottom()
  await runAgent()
}

async function runAgent() {
  isStreaming.value = true
  streamingText.value = ''
  backendOnline.value = true

  let assistantText = ''
  let collectedA2UI: any[] = []
  let currentToolName = ''

  try {
    await connectSSE(
      AGENT_URL,
      {
        threadId,
        runId: `run-${Date.now()}`,
        messages: apiMessages.value.map((m, i) => ({
          id: `msg-${i}`,
          role: m.role,
          content: m.content,
        })),
        state: {},
        tools: [],
        context: [],
        forwardedProps: {},
      },
      {
        onText: (delta: string) => {
          assistantText += delta
          streamingText.value = assistantText
          scrollToBottom()
        },
        onToolCall: (toolName: string) => {
          currentToolName = toolName
          messages.value.push({
            id: uid(),
            role: 'tool',
            type: 'tool',
            content: toolLabel(toolName),
            toolName,
          })
          streamingText.value = ''
          scrollToBottom()
        },
        onA2UI: (a2uiMessages: any[]) => {
          collectedA2UI.push(...a2uiMessages)
        },
        onFinished: () => {
          // handled below
        },
        onError: (err: any) => {
          backendOnline.value = false
          messages.value.push({
            id: uid(),
            role: 'assistant',
            type: 'text',
            content: `⚠️ Could not reach the agent. Make sure the Python server is running:\n\`cd example-python && python server.py\``,
          })
          isStreaming.value = false
          streamingText.value = ''
        },
      }
    )

    // Also try to parse text as A2UI if no structured messages came
    if (collectedA2UI.length === 0 && assistantText) {
      const parsed = parseA2UIMessages(assistantText)
      if (parsed.length > 0) collectedA2UI = parsed
    }

    // Finalize assistant text message — clean up raw JSON/code from display
    const displayText = cleanAgentText(assistantText)
    if (displayText && displayText.length > 4) {
      messages.value.push({
        id: uid(),
        role: 'assistant',
        type: 'text',
        content: displayText,
      })
    }
    // Always keep raw text in API history so the agent has context
    if (assistantText.trim()) {
      apiMessages.value.push({ role: 'assistant', content: assistantText.trim() })
    }

    // Render collected A2UI widget — spread into new array to trigger deep watch
    if (collectedA2UI.length > 0) {
      currentMessages.value = [...collectedA2UI]
      widgetKey.value++

      if (currentToolName === 'confirm_action' || currentToolName === 'collect_user_input') {
        followUpSuggestions.value = []
      } else {
        followUpSuggestions.value = getFollowUps(currentToolName)
      }
    }
  } catch (err: any) {
    backendOnline.value = false
    messages.value.push({
      id: uid(),
      role: 'assistant',
      type: 'text',
      content: `⚠️ Connection error: ${err.message}`,
    })
  } finally {
    isStreaming.value = false
    streamingText.value = ''
    scrollToBottom()
    nextTick(() => inputEl.value?.focus())
  }
}

function handleWidgetAction(action: any) {
  const name = action?.name ?? action?.action ?? ''
  const componentId = action?.sourceComponentId ?? ''

  if (name === 'confirm') {
    send('I confirmed')
  } else if (name === 'cancel') {
    send('I cancelled')
  } else if (name === 'submit') {
    // Read the TextField value from the shared data model
    const surfaceId = action?.surfaceId ?? ''
    const dataModel = useDataModel()
    const inputValue = surfaceId ? dataModel.getPath(surfaceId, '/userInput') : null
    const userText = (inputValue != null && String(inputValue).trim())
      ? String(inputValue).trim()
      : null
    if (userText) {
      send(userText)
    } else {
      // Fallback: ask user to type in chat
      messages.value.push({
        id: uid(),
        role: 'assistant',
        type: 'text',
        content: 'Please type your answer in the chat below.',
      })
    }
  } else if (name) {
    send(`Action: ${name} (from ${componentId})`)
  }
}

function handleWidgetError(err: Error) {
  messages.value.push({
    id: uid(),
    role: 'assistant',
    type: 'text',
    content: `⚠️ Widget validation failed.\n\n${err.message}`,
  })
  scrollToBottom()
}

function getFollowUps(toolName: string): string[] {
  const map: Record<string, string[]> = {
    show_weather: ['Show 5-day forecast', 'Weather in London', 'Show a profile card'],
    show_profile: ['Show their tasks', 'Show a stats dashboard', 'Show a login form'],
    show_task_list: ['Add more tasks', 'Clear all tasks', 'Show a stats dashboard'],
    show_stats_card: ['Show a profile card', 'Show weather in Paris'],
    design_widget: ['Make the background blue', 'Add a button', 'Show a weather card'],
    show_login_form: ['Show a profile card', 'Show a stats dashboard'],
  }
  return map[toolName] ?? ['Show weather', 'Show a profile', 'Create a task list']
}

function clearChat() {
  messages.value = []
  currentMessages.value = null
  apiMessages.value = []
  streamingText.value = ''
  isStreaming.value = false
  widgetKey.value = 0
  followUpSuggestions.value = []
  nextTick(() => inputEl.value?.focus())
}

// ── Health check ──────────────────────────────────────────────
onMounted(async () => {
  try {
    const res = await fetch('http://localhost:8006/health', { signal: AbortSignal.timeout(2000) })
    backendOnline.value = res.ok
  } catch {
    backendOnline.value = false
  }
  inputEl.value?.focus()
})
</script>

<style scoped>
/* ── Layout ── */
.try-page {
  display: flex;
  height: 100%;
  gap: 0;
  overflow: hidden;
}

/* ── Chat panel ── */
.chat-panel {
  width: 380px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--a2ui-card-border);
  height: 100%;
  overflow: hidden;
}

.chat-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 16px 14px;
  border-bottom: 1px solid var(--a2ui-card-border);
  flex-shrink: 0;
}

.agent-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7c3aed, #4f46e5);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.agent-avatar .material-icons {
  color: white;
  font-size: 18px;
}

.agent-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.agent-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--a2ui-text);
}

.agent-status {
  font-size: 11px;
  color: var(--a2ui-muted);
  display: flex;
  align-items: center;
  gap: 4px;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.status-dot.online { background: #22c55e; }
.status-dot.offline { background: #ef4444; }

.clear-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--a2ui-muted);
  padding: 4px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  transition: color 0.15s, background 0.15s;
}

.clear-btn:hover {
  color: var(--a2ui-text);
  background: var(--a2ui-card-border);
}

.clear-btn .material-icons { font-size: 18px; }

/* ── Messages ── */
.messages-area {
  flex: 1;
  overflow-y: auto;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  scroll-behavior: smooth;
}

/* Empty state */
.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 24px 8px;
}

.empty-icon .material-icons {
  font-size: 40px;
  color: var(--a2ui-muted);
  margin-bottom: 12px;
}

.empty-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--a2ui-text);
  margin: 0 0 6px;
}

.empty-sub {
  font-size: 12px;
  color: var(--a2ui-muted);
  margin: 0 0 20px;
  line-height: 1.5;
}

.suggestions {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.suggestion-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 14px;
  border-radius: 10px;
  border: 1px solid var(--a2ui-card-border);
  background: var(--a2ui-card-bg);
  color: var(--a2ui-text);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s;
}

.suggestion-chip .material-icons { font-size: 16px; color: var(--a2ui-primary); }

.suggestion-chip:hover {
  border-color: var(--a2ui-primary);
  background: rgba(124, 58, 237, 0.06);
}

/* Message rows */
.message-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.message-row.user { align-items: flex-end; }
.message-row.assistant,
.message-row.tool { align-items: flex-start; }

/* Bubbles */
.bubble {
  max-width: 88%;
  padding: 9px 13px;
  border-radius: 14px;
  font-size: 13px;
  line-height: 1.5;
}

.bubble.user {
  background: linear-gradient(135deg, #7c3aed, #4f46e5);
  color: white;
  border-bottom-right-radius: 4px;
}

.bubble.assistant {
  background: var(--a2ui-card-bg);
  border: 1px solid var(--a2ui-card-border);
  color: var(--a2ui-text);
  border-bottom-left-radius: 4px;
}

.bubble-text :deep(strong) { font-weight: 600; }
.bubble-text :deep(code) {
  background: rgba(0,0,0,0.1);
  border-radius: 3px;
  padding: 1px 4px;
  font-size: 11px;
  font-family: monospace;
}

/* Tool indicator */
.tool-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 20px;
  background: rgba(124, 58, 237, 0.08);
  border: 1px solid rgba(124, 58, 237, 0.2);
  color: var(--a2ui-primary);
  font-size: 11px;
  font-weight: 500;
  width: fit-content;
}

.tool-indicator .material-icons { font-size: 14px; }

/* Typing indicator */
.typing-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 10px 14px;
  background: var(--a2ui-card-bg);
  border: 1px solid var(--a2ui-card-border);
  border-radius: 14px;
  border-bottom-left-radius: 4px;
  width: fit-content;
}

.typing-indicator span {
  width: 6px;
  height: 6px;
  background: var(--a2ui-muted);
  border-radius: 50%;
  animation: bounce 1.2s infinite;
}

.typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

@keyframes bounce {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-6px); }
}

.cursor {
  display: inline-block;
  width: 2px;
  height: 13px;
  background: currentColor;
  margin-left: 2px;
  vertical-align: middle;
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.spin { animation: spin 1.2s linear infinite; }

/* ── Input area ── */
.input-area {
  padding: 12px;
  border-top: 1px solid var(--a2ui-card-border);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 8px 8px 14px;
  border-radius: 12px;
  border: 1.5px solid var(--a2ui-card-border);
  background: var(--a2ui-card-bg);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-wrap.focused {
  border-color: var(--a2ui-primary);
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
}

.input-wrap.disabled { opacity: 0.6; }

.chat-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-size: 13px;
  color: var(--a2ui-text);
}

.chat-input::placeholder { color: var(--a2ui-muted); }

.send-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: linear-gradient(135deg, #7c3aed, #4f46e5);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: opacity 0.15s;
}

.send-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.send-btn:not(:disabled):hover { opacity: 0.85; }
.send-btn .material-icons { font-size: 17px; }

.input-hint {
  font-size: 10px;
  color: var(--a2ui-muted);
  text-align: center;
  margin: 0;
}

/* ── Preview panel ── */
.preview-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--a2ui-bg);
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 24px;
  border-bottom: 1px solid var(--a2ui-card-border);
  font-size: 13px;
  font-weight: 600;
  color: var(--a2ui-text);
  flex-shrink: 0;
}

.preview-header .material-icons { font-size: 18px; color: var(--a2ui-primary); }

.preview-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 20px;
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
  font-size: 11px;
  font-weight: 500;
  margin-left: auto;
}

.preview-badge .dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #22c55e;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.preview-body {
  flex: 1;
  overflow-y: auto;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 32px 24px;
  position: relative;
}

.widget-wrap {
  width: 100%;
  max-width: 480px;
}

/* Empty state */
.preview-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: var(--a2ui-muted);
  text-align: center;
  padding: 40px;
  margin: auto;
}

.preview-empty .material-icons { font-size: 48px; margin-bottom: 4px; }

.preview-empty p {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--a2ui-text);
}

.preview-empty .sub {
  font-size: 12px;
  font-weight: 400;
  color: var(--a2ui-muted);
  max-width: 280px;
  line-height: 1.5;
}

/* Loading */
.preview-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: var(--a2ui-muted);
  font-size: 13px;
  margin: auto;
}

.preview-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--a2ui-card-border);
  border-top-color: var(--a2ui-primary);
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}

/* Quick action chips below preview */
.preview-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 12px 24px 16px;
  border-top: 1px solid var(--a2ui-card-border);
  flex-shrink: 0;
}

.action-chip {
  padding: 5px 12px;
  border-radius: 20px;
  border: 1px solid var(--a2ui-card-border);
  background: var(--a2ui-card-bg);
  color: var(--a2ui-text);
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.action-chip:hover {
  border-color: var(--a2ui-primary);
  color: var(--a2ui-primary);
}

/* ── Widget fade transition ── */
.widget-fade-enter-active,
.widget-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.widget-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.widget-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
