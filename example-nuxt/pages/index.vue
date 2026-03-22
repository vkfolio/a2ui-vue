<template>
  <div class="min-h-full flex flex-col">
    <!-- Hero section -->
    <div class="flex-1 flex flex-col items-center justify-center px-6 py-16">
      <div class="max-w-2xl w-full text-center">
        <h1 class="text-4xl font-bold mb-3 tracking-tight" style="color: var(--a2ui-text)">
          What would you like to build?
        </h1>
        <p class="text-base mb-8" style="color: var(--a2ui-muted)">
          Describe a UI widget and watch it come to life with A2UI
        </p>

        <!-- Input area -->
        <div
          class="flex items-center gap-3 p-2 rounded-xl border transition-all duration-200"
          style="background: var(--a2ui-card-bg); border-color: var(--a2ui-card-border)"
          :style="inputFocused ? { borderColor: 'var(--a2ui-primary)', boxShadow: '0 0 0 3px var(--a2ui-primary-light)' } : {}"
        >
          <input
            v-model="prompt"
            @focus="inputFocused = true"
            @blur="inputFocused = false"
            @keydown.enter="handleCreate"
            type="text"
            placeholder="Describe your A2UI widget..."
            class="flex-1 px-4 py-3 text-base border-0 outline-none bg-transparent"
            style="color: var(--a2ui-text)"
          />
          <button
            @click="handleCreate"
            :disabled="!prompt.trim() || loading"
            class="px-6 py-3 rounded-lg text-sm font-semibold text-white border-0 cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style="background: var(--a2ui-primary)"
          >
            <span v-if="loading" class="flex items-center gap-2">
              <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Creating...
            </span>
            <span v-else>Create</span>
          </button>
        </div>

        <!-- Quick actions -->
        <div class="flex items-center justify-center gap-4 mt-4">
          <button
            @click="loadBlank"
            class="text-sm border-0 bg-transparent cursor-pointer underline"
            style="color: var(--a2ui-muted)"
          >
            or Start Blank
          </button>
        </div>

        <!-- Suggestions -->
        <div class="flex flex-wrap items-center justify-center gap-2 mt-6">
          <button
            v-for="suggestion in suggestions"
            :key="suggestion"
            @click="prompt = suggestion"
            class="px-3 py-1.5 rounded-full text-xs border cursor-pointer transition-all duration-150 hover:border-[var(--a2ui-primary)]"
            style="background: var(--a2ui-card-bg); border-color: var(--a2ui-card-border); color: var(--a2ui-muted)"
          >
            {{ suggestion }}
          </button>
        </div>

        <!-- Status message -->
        <div v-if="statusText" class="mt-8 px-4 py-3 rounded-lg text-sm" style="background: var(--a2ui-card-bg); border: 1px solid var(--a2ui-card-border); color: var(--a2ui-text)">
          <span class="flex items-center gap-2 justify-center">
            <span v-if="loading" class="w-3 h-3 border-2 rounded-full animate-spin" style="border-color: var(--a2ui-primary); border-top-color: transparent"></span>
            <span v-else class="material-icons text-[16px]" style="color: var(--a2ui-primary)">auto_awesome</span>
            {{ statusText }}
          </span>
        </div>

        <!-- Error -->
        <div v-if="errorText" class="mt-4 px-4 py-3 rounded-lg text-sm bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
          {{ errorText }}
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="text-center py-6">
      <p class="text-xs" style="color: var(--a2ui-muted)">
        Powered by <span class="font-semibold" style="color: var(--a2ui-primary)">A2UI Vue</span> · Google A2UI Protocol
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { connectSSE, parseA2UIMessages } from 'a2ui-vue'

const prompt = ref('')
const inputFocused = ref(false)
const loading = ref(false)
const statusText = ref('')
const errorText = ref('')

const suggestions = [
  'Weather dashboard card',
  'User profile with avatar',
  'Login form with validation',
  'Shopping cart summary',
  'Music player controls',
  'Notification preferences',
]

const agentUrl = 'http://localhost:8006/agent'

async function handleCreate() {
  if (!prompt.value.trim() || loading.value) return

  loading.value = true
  statusText.value = 'Generating your widget...'
  errorText.value = ''

  // Collect A2UI messages from the agent
  let collectedMessages: any[] = []
  let agentText = ''

  try {
    await connectSSE(agentUrl, {
      threadId: `thread-${Date.now()}`,
      runId: `run-${Date.now()}`,
      messages: [{ id: `msg-${Date.now()}`, role: 'user', content: prompt.value }],
      state: {},
      tools: [],
      context: [],
      forwardedProps: {},
    }, {
      onText: (delta: string) => {
        agentText += delta
        // Show a progress indicator but don't show raw text
        statusText.value = 'AI is designing your widget...'
      },
      onA2UI: (messages: any[]) => {
        collectedMessages.push(...messages)
        statusText.value = 'Widget generated! Opening designer...'
      },
      onFinished: () => {
        // Done
      },
      onError: (err: any) => {
        errorText.value = `Error: ${err.message || err.statusText || 'Connection failed. Is the Python server running on port 8006?'}`
        loading.value = false
        statusText.value = ''
      },
    })

    // If we got A2UI messages, navigate to designer
    if (collectedMessages.length > 0) {
      navigateToDesigner(collectedMessages, prompt.value)
    } else {
      // No A2UI messages returned — agent just responded with text
      // Try to parse text as JSON in case it returned raw A2UI
      const parsed = parseA2UIMessages(agentText)
      if (parsed.length > 0) {
        navigateToDesigner(parsed, prompt.value)
      } else {
        errorText.value = 'The agent did not return a widget. Make sure the Python backend is running with: python server.py'
        loading.value = false
        statusText.value = ''
      }
    }
  } catch (err: any) {
    errorText.value = `Connection failed: ${err.message || 'Is the Python server running on port 8006?'}`
    loading.value = false
    statusText.value = ''
  }
}

function navigateToDesigner(messages: any[], description: string) {
  // Store in sessionStorage to avoid URL length limits
  sessionStorage.setItem('a2ui-designer-json', JSON.stringify(messages))
  sessionStorage.setItem('a2ui-designer-name', description)

  navigateTo('/designer')
}

function loadBlank() {
  const blankMessages = [
    {
      surfaceUpdate: {
        surfaceId: 'blank',
        components: [
          { id: 'root', component: { Card: { child: 'col' } } },
          { id: 'col', component: { Column: { children: { explicitList: ['title', 'body'] }, alignment: 'center' } } },
          { id: 'title', component: { Text: { text: { path: '/title' }, usageHint: 'h2' } } },
          { id: 'body', component: { Text: { text: { path: '/body' }, usageHint: 'body' } } },
        ],
      },
    },
    {
      dataModelUpdate: {
        surfaceId: 'blank',
        contents: [
          { key: 'title', valueString: 'My Widget' },
          { key: 'body', valueString: 'Start building your A2UI widget here.' },
        ],
      },
    },
    { beginRendering: { surfaceId: 'blank', root: 'root' } },
  ]
  navigateToDesigner(blankMessages, 'Blank Widget')
}
</script>
