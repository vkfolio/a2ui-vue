<script setup lang="ts">
/**
 * A2Surface — the main entry point for rendering A2UI from an agent.
 *
 * Usage:
 * <A2Surface
 *   agent-url="http://localhost:8006/agent"
 *   :thread-id="threadId"
 *   :dark="isDark"
 *   @action="onAction"
 *   @message="onTextMessage"
 * />
 */
import { ref, provide, onMounted, watch } from 'vue'
import { useDataModel } from '../composables/useDataModel'
import { useSurface } from '../composables/useSurface'
import { connectSSE } from '../protocol/parser'
import { sendAction } from '../protocol/emitter'
import { formatA2UIValidationErrors, validateA2UIMessages } from '../protocol/validation'
import { injectThemeStyles } from '../theme/tokens'
import A2Renderer from './A2Renderer.vue'

const props = withDefaults(defineProps<{
  /** URL of the agent SSE endpoint */
  agentUrl?: string
  /** Thread ID for the conversation */
  threadId?: string
  /** Enable dark mode */
  dark?: boolean
  /** Custom theme overrides */
  theme?: Record<string, any>
  /** Static messages to render (instead of SSE) */
  messages?: any[]
}>(), {
  dark: false,
  threadId: () => `thread-${Date.now()}`,
})

const emit = defineEmits<{
  action: [action: any]
  message: [text: string]
  finished: []
  error: [error: any]
}>()

const dataModel = useDataModel()
const surface = useSurface()
const streamingText = ref('')
const isConnected = ref(false)

provide('a2ui-data-model', dataModel)
provide('a2ui-surface', {
  ...surface,
  emitAction: async (name: string, surfaceId: string, sourceComponentId: string, context: Record<string, any>) => {
    const action = {
      name,
      surfaceId,
      sourceComponentId,
      context,
      timestamp: new Date().toISOString(),
    }
    emit('action', action)
    if (props.agentUrl) {
      await sendAction(props.agentUrl, action)
    }
  },
})

// Inject theme styles
watch(() => props.dark, (isDark) => {
  injectThemeStyles(props.theme || {}, isDark)
}, { immediate: true })

watch(() => props.theme, (theme) => {
  injectThemeStyles(theme || {}, props.dark)
}, { deep: true })

// Process static messages if provided
watch(() => props.messages, (msgs) => {
  if (msgs && msgs.length > 0) {
    for (const msg of msgs) {
      surface.handleMessage(msg)
    }
  }
}, { immediate: true, deep: true })

/** Send a message to the agent and stream the response */
async function send(text: string) {
  if (!props.agentUrl) return
  streamingText.value = ''
  isConnected.value = true

  try {
    await connectSSE(props.agentUrl, {
      threadId: props.threadId,
      runId: `run-${Date.now()}`,
      messages: [{ id: `msg-${Date.now()}`, role: 'user', content: text }],
      state: {},
      tools: [],
      context: [],
      forwardedProps: {},
    }, {
      onText: (delta: string) => {
        streamingText.value += delta
        emit('message', delta)
      },
      onA2UI: (messages: any[]) => {
        const errors = validateA2UIMessages(messages, { mode: 'stream' })
        if (errors.length > 0) {
          isConnected.value = false
          emit('error', new Error(formatA2UIValidationErrors(errors)))
          return
        }
        for (const msg of messages) {
          surface.handleMessage(msg)
        }
      },
      onFinished: () => {
        isConnected.value = false
        emit('finished')
      },
      onError: (err: any) => {
        isConnected.value = false
        emit('error', err)
      },
    })
  } catch (err) {
    isConnected.value = false
    emit('error', err)
  }
}

defineExpose({
  send,
  streamingText,
  isConnected,
  dataModel,
  surface,
})
</script>

<template>
  <div class="a2ui-surface" :class="{ dark: dark }">
    <template v-for="sid in surface.getAllSurfaces()" :key="sid">
      <A2Renderer
        v-if="surface.getSurface(sid)?.rootId"
        :component-id="surface.getSurface(sid)!.rootId"
        :surface-id="sid"
      />
    </template>
    <slot
      :send="send"
      :streaming-text="streamingText"
      :is-connected="isConnected"
    />
  </div>
</template>
