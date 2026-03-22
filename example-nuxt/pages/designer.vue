<template>
  <div class="flex flex-col h-full">
    <!-- Top bar -->
    <div
      class="flex items-center justify-between px-4 py-2.5 border-b shrink-0"
      style="background: var(--a2ui-sidebar-bg); border-color: var(--a2ui-sidebar-border)"
    >
      <div class="flex items-center gap-3">
        <span class="material-icons text-[18px]" style="color: var(--a2ui-primary)">design_services</span>
        <input
          v-model="widgetName"
          class="text-sm font-semibold bg-transparent border-0 outline-none min-w-[200px]"
          style="color: var(--a2ui-text)"
        />
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="formatJson"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer transition-colors hover:opacity-80"
          style="background: var(--a2ui-input-bg); border-color: var(--a2ui-card-border); color: var(--a2ui-muted)"
        >
          <span class="material-icons text-[14px]">code</span>
          Format
        </button>
        <button
          @click="copyJson"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer transition-colors hover:opacity-80"
          style="background: var(--a2ui-input-bg); border-color: var(--a2ui-card-border); color: var(--a2ui-muted)"
        >
          <span class="material-icons text-[14px]">content_copy</span>
          Copy JSON
        </button>
        <button
          @click="downloadJson"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white border-0 cursor-pointer transition-colors hover:opacity-90"
          style="background: var(--a2ui-primary)"
        >
          <span class="material-icons text-[14px]">download</span>
          Download
        </button>
      </div>
    </div>

    <!-- Three-panel layout -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Left: JSON editor -->
      <div
        class="w-[420px] shrink-0 flex flex-col border-r overflow-hidden"
        style="border-color: var(--a2ui-sidebar-border)"
      >
        <div class="flex items-center justify-between px-4 py-2 border-b" style="border-color: var(--a2ui-sidebar-border)">
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold uppercase tracking-wider" style="color: var(--a2ui-muted)">Components</span>
            <span class="text-[10px] font-mono px-1.5 py-0.5 rounded" style="background: var(--a2ui-input-bg); color: var(--a2ui-muted)">JSON</span>
          </div>
          <span
            v-if="jsonError"
            class="text-[10px] font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
          >
            {{ jsonError }}
          </span>
          <span
            v-else-if="parsedMessages"
            class="text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
          >
            Valid
          </span>
        </div>
        <div class="flex-1 overflow-hidden relative">
          <!-- Line numbers + textarea -->
          <div class="flex h-full">
            <div class="py-4 pl-3 pr-2 text-right select-none shrink-0 overflow-hidden" style="color: var(--a2ui-muted); font-size: 11px; font-family: monospace; line-height: 1.65">
              <div v-for="n in lineCount" :key="n">{{ n }}</div>
            </div>
            <textarea
              v-model="jsonText"
              @input="onJsonChange"
              class="flex-1 py-4 pr-4 text-[11px] font-mono leading-relaxed resize-none border-0 outline-none"
              style="background: var(--a2ui-code-bg); color: #a6e3a1; line-height: 1.65"
              spellcheck="false"
              wrap="off"
            ></textarea>
          </div>
        </div>

        <!-- Data model section -->
        <div class="border-t" style="border-color: var(--a2ui-sidebar-border)">
          <button
            @click="showDataModel = !showDataModel"
            class="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold uppercase tracking-wider border-0 bg-transparent cursor-pointer"
            style="color: var(--a2ui-muted)"
          >
            <span class="flex items-center gap-2">
              <span class="text-xs">Data Model</span>
              <span class="text-[10px] font-mono px-1.5 py-0.5 rounded" style="background: var(--a2ui-input-bg)">{{ dataEntryCount }} entries</span>
            </span>
            <span class="material-icons text-[14px] transition-transform" :class="showDataModel ? 'rotate-180' : ''">expand_more</span>
          </button>
          <div v-if="showDataModel" class="max-h-[200px] overflow-y-auto">
            <textarea
              v-model="dataModelText"
              @input="onDataModelChange"
              class="w-full p-4 text-[11px] font-mono leading-relaxed resize-none border-0 outline-none"
              style="background: var(--a2ui-code-bg); color: #89b4fa; line-height: 1.65; min-height: 100px"
              spellcheck="false"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Center: Live preview -->
      <div class="flex-1 flex flex-col overflow-hidden" style="background: var(--a2ui-bg)">
        <div class="flex items-center justify-between px-4 py-2 border-b" style="border-color: var(--a2ui-sidebar-border)">
          <span class="text-xs font-semibold uppercase tracking-wider" style="color: var(--a2ui-muted)">Live Preview</span>
          <button
            @click="refreshPreview"
            class="flex items-center gap-1 px-2 py-1 rounded text-[10px] border-0 bg-transparent cursor-pointer hover:opacity-80"
            style="color: var(--a2ui-muted)"
          >
            <span class="material-icons text-[12px]">refresh</span>
            Refresh
          </button>
        </div>
        <div class="flex-1 overflow-y-auto p-8 flex items-start justify-center">
          <div class="w-full max-w-md">
            <A2StaticRenderer
              v-if="parsedMessages"
              :messages="parsedMessages"
              :key="renderKey"
              @action="handleWidgetAction"
            />
            <div v-else class="text-center py-16">
              <span class="material-icons text-[48px] mb-4 block" style="color: var(--a2ui-muted)">widgets</span>
              <p class="text-sm font-medium mb-1" style="color: var(--a2ui-text)">No preview available</p>
              <p class="text-xs" style="color: var(--a2ui-muted)">Fix JSON errors or paste valid A2UI JSON</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Chat panel -->
      <div
        class="w-[320px] shrink-0 flex flex-col border-l overflow-hidden"
        style="border-color: var(--a2ui-sidebar-border); background: var(--a2ui-sidebar-bg)"
      >
        <div class="flex items-center px-4 py-2 border-b" style="border-color: var(--a2ui-sidebar-border)">
          <span class="text-xs font-semibold uppercase tracking-wider" style="color: var(--a2ui-muted)">AI Assistant</span>
        </div>

        <!-- Messages -->
        <div class="flex-1 overflow-y-auto p-4 space-y-3" ref="chatContainer">
          <div v-if="chatMessages.length === 0" class="text-center py-8">
            <span class="material-icons text-[32px] mb-3 block" style="color: var(--a2ui-muted)">auto_awesome</span>
            <p class="text-xs font-medium mb-1" style="color: var(--a2ui-text)">Modify your widget with AI</p>
            <p class="text-[10px] mt-1" style="color: var(--a2ui-muted)">Try: "Add a submit button" or "Change the layout to horizontal"</p>
          </div>
          <div
            v-for="(msg, i) in chatMessages"
            :key="i"
            class="flex"
            :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
          >
            <div
              class="max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed"
              :style="{
                background: msg.role === 'user' ? 'var(--a2ui-primary)' : 'var(--a2ui-input-bg)',
                color: msg.role === 'user' ? 'white' : 'var(--a2ui-text)',
              }"
            >
              {{ msg.content }}
            </div>
          </div>
          <div v-if="chatLoading" class="flex justify-start">
            <div class="px-3 py-2 rounded-xl text-xs" style="background: var(--a2ui-input-bg); color: var(--a2ui-muted)">
              <span class="inline-flex gap-1">
                <span class="w-1.5 h-1.5 rounded-full animate-bounce" style="background: var(--a2ui-muted); animation-delay: 0ms"></span>
                <span class="w-1.5 h-1.5 rounded-full animate-bounce" style="background: var(--a2ui-muted); animation-delay: 150ms"></span>
                <span class="w-1.5 h-1.5 rounded-full animate-bounce" style="background: var(--a2ui-muted); animation-delay: 300ms"></span>
              </span>
            </div>
          </div>
        </div>

        <!-- Chat input -->
        <div class="p-3 border-t" style="border-color: var(--a2ui-sidebar-border)">
          <div class="flex items-center gap-2">
            <input
              v-model="chatInput"
              @keydown.enter="sendChat"
              type="text"
              placeholder="Ask to modify widget..."
              class="flex-1 px-3 py-2 rounded-lg border text-xs outline-none"
              style="background: var(--a2ui-input-bg); border-color: var(--a2ui-input-border); color: var(--a2ui-text)"
            />
            <button
              @click="sendChat"
              :disabled="!chatInput.trim() || chatLoading"
              class="p-2 rounded-lg border-0 cursor-pointer transition-colors disabled:opacity-50"
              style="background: var(--a2ui-primary); color: white"
            >
              <span class="material-icons text-[16px]">send</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Copied toast -->
    <Transition name="fade">
      <div
        v-if="showCopied"
        class="fixed bottom-6 right-6 px-4 py-2.5 rounded-lg text-sm font-medium text-white shadow-lg z-50"
        style="background: var(--a2ui-primary)"
      >
        {{ copiedMessage }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { A2StaticRenderer, connectSSE, parseA2UIMessages } from 'a2ui-vue'

const route = useRoute()

const widgetName = ref('New Widget')
const showCopied = ref(false)
const copiedMessage = ref('')
const renderKey = ref(0)
const jsonError = ref('')
const chatContainer = ref<HTMLElement | null>(null)
const showDataModel = ref(false)
const dataModelText = ref('[]')
const dataEntryCount = ref(0)

// Load initial JSON from sessionStorage or query or default
const defaultJson = [
  {
    surfaceUpdate: {
      surfaceId: 'designer',
      components: [
        { id: 'root', component: { Card: { child: 'col' } } },
        { id: 'col', component: { Column: { children: { explicitList: ['icon-row', 'title', 'desc'] }, alignment: 'center' } } },
        { id: 'icon-row', component: { Row: { children: { explicitList: ['icon'] }, alignment: 'center' } } },
        { id: 'icon', component: { Icon: { name: 'widgets' } } },
        { id: 'title', component: { Text: { text: { path: '/title' }, usageHint: 'h2' } } },
        { id: 'desc', component: { Text: { text: { path: '/desc' }, usageHint: 'caption' } } },
      ],
    },
  },
  {
    dataModelUpdate: {
      surfaceId: 'designer',
      contents: [
        { key: 'title', valueString: 'Hello A2UI' },
        { key: 'desc', valueString: 'Edit the JSON on the left to customize this widget' },
      ],
    },
  },
  { beginRendering: { surfaceId: 'designer', root: 'root' } },
]

function loadInitialJson(): any[] {
  // Priority: sessionStorage > query param > default
  if (import.meta.client) {
    const stored = sessionStorage.getItem('a2ui-designer-json')
    const storedName = sessionStorage.getItem('a2ui-designer-name')
    if (stored) {
      sessionStorage.removeItem('a2ui-designer-json')
      sessionStorage.removeItem('a2ui-designer-name')
      if (storedName) widgetName.value = storedName
      try {
        return JSON.parse(stored)
      } catch {
        // fall through
      }
    }
  }

  if (route.query.json) {
    try {
      return JSON.parse(route.query.json as string)
    } catch {
      // fall through
    }
  }

  return defaultJson
}

const initialJson = loadInitialJson()

const jsonText = ref(JSON.stringify(initialJson, null, 2))
const parsedMessages = ref<any[] | null>(initialJson)

// Extract data model from messages for the data model editor
function extractDataModel(messages: any[]): any[] {
  for (const msg of messages) {
    if (msg.dataModelUpdate?.contents) return msg.dataModelUpdate.contents
  }
  return []
}

// Initialize data model text
const initialData = extractDataModel(initialJson)
dataModelText.value = JSON.stringify(initialData, null, 2)
dataEntryCount.value = initialData.length

const lineCount = computed(() => {
  return jsonText.value.split('\n').length
})

// Chat state
const chatMessages = ref<{ role: 'user' | 'assistant'; content: string }[]>([])
const chatInput = ref('')
const chatLoading = ref(false)

function onJsonChange() {
  try {
    const parsed = JSON.parse(jsonText.value)
    parsedMessages.value = parsed
    jsonError.value = ''
    renderKey.value++
    // Update data model view
    const dm = extractDataModel(parsed)
    dataModelText.value = JSON.stringify(dm, null, 2)
    dataEntryCount.value = dm.length
  } catch (e: any) {
    jsonError.value = 'Invalid JSON'
    parsedMessages.value = null
  }
}

function onDataModelChange() {
  try {
    const newData = JSON.parse(dataModelText.value)
    dataEntryCount.value = newData.length
    // Update the dataModelUpdate in parsedMessages
    if (parsedMessages.value) {
      const updated = parsedMessages.value.map((msg: any) => {
        if (msg.dataModelUpdate) {
          return { ...msg, dataModelUpdate: { ...msg.dataModelUpdate, contents: newData } }
        }
        return msg
      })
      parsedMessages.value = updated
      jsonText.value = JSON.stringify(updated, null, 2)
      renderKey.value++
    }
  } catch {
    // Invalid JSON in data model - ignore
  }
}

function refreshPreview() {
  renderKey.value++
}

function formatJson() {
  try {
    const parsed = JSON.parse(jsonText.value)
    jsonText.value = JSON.stringify(parsed, null, 2)
    jsonError.value = ''
  } catch {
    // Keep as-is if invalid
  }
}

function copyJson() {
  navigator.clipboard.writeText(jsonText.value)
  copiedMessage.value = 'JSON copied to clipboard'
  showCopied.value = true
  setTimeout(() => { showCopied.value = false }, 2000)
}

function downloadJson() {
  const blob = new Blob([jsonText.value], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${widgetName.value.replace(/\s+/g, '-').toLowerCase()}.json`
  a.click()
  URL.revokeObjectURL(url)
  copiedMessage.value = 'Downloaded!'
  showCopied.value = true
  setTimeout(() => { showCopied.value = false }, 2000)
}

function handleWidgetAction(action: any) {
  chatMessages.value.push({
    role: 'assistant',
    content: `Action triggered: "${action.name}" from component "${action.sourceComponentId}"`,
  })
}

async function sendChat() {
  if (!chatInput.value.trim() || chatLoading.value) return

  const text = chatInput.value
  chatInput.value = ''
  chatMessages.value.push({ role: 'user', content: text })
  chatLoading.value = true

  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }

  // Send to agent with current JSON as context
  try {
    const currentJson = jsonText.value
    let collectedMessages: any[] = []
    let agentText = ''

    await connectSSE('http://localhost:8006/agent', {
      threadId: `designer-${Date.now()}`,
      runId: `run-${Date.now()}`,
      messages: [{
        id: `msg-${Date.now()}`,
        role: 'user',
        content: `I have an existing A2UI widget. Here is the current JSON:\n\n${currentJson}\n\nPlease modify it based on this request: ${text}\n\nReturn the complete updated A2UI JSON array.`,
      }],
      state: {},
      tools: [],
      context: [],
      forwardedProps: {},
    }, {
      onText: (delta: string) => {
        agentText += delta
      },
      onA2UI: (messages: any[]) => {
        collectedMessages.push(...messages)
      },
      onFinished: () => {
        // Done
      },
      onError: (err: any) => {
        chatMessages.value.push({
          role: 'assistant',
          content: `Error: Could not connect to AI agent. Make sure the Python server is running.`,
        })
        chatLoading.value = false
      },
    })

    // If we got A2UI messages from the tool result, update the editor
    if (collectedMessages.length > 0) {
      const newJson = JSON.stringify(collectedMessages, null, 2)
      jsonText.value = newJson
      parsedMessages.value = collectedMessages
      renderKey.value++

      const dm = extractDataModel(collectedMessages)
      dataModelText.value = JSON.stringify(dm, null, 2)
      dataEntryCount.value = dm.length

      chatMessages.value.push({
        role: 'assistant',
        content: 'Widget updated! Check the preview.',
      })
    } else {
      // Try parsing agent text as A2UI JSON
      const parsed = parseA2UIMessages(agentText)
      if (parsed.length > 0) {
        const newJson = JSON.stringify(parsed, null, 2)
        jsonText.value = newJson
        parsedMessages.value = parsed
        renderKey.value++

        const dm = extractDataModel(parsed)
        dataModelText.value = JSON.stringify(dm, null, 2)
        dataEntryCount.value = dm.length

        chatMessages.value.push({
          role: 'assistant',
          content: 'Widget updated! Check the preview.',
        })
      } else {
        // Just show agent's text response
        chatMessages.value.push({
          role: 'assistant',
          content: agentText || 'No response from agent.',
        })
      }
    }

    chatLoading.value = false
  } catch (err: any) {
    chatMessages.value.push({
      role: 'assistant',
      content: `Connection error. Make sure the Python server is running on port 8006.`,
    })
    chatLoading.value = false
  }

  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
