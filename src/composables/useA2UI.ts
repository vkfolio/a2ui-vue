/**
 * useA2UI — high-level composable that wires everything together.
 *
 * Usage:
 * ```ts
 * const { send, surfaces, streamingText, isConnected } = useA2UI({
 *   agentUrl: 'http://localhost:8006/agent',
 *   threadId: 'my-thread',
 * })
 * await send('Show me the weather in Tokyo')
 * ```
 */
import { ref } from 'vue'
import { useDataModel } from './useDataModel'
import { useSurface } from './useSurface'
import { connectSSE } from '../protocol/parser'
import { sendAction, createAction } from '../protocol/emitter'

export interface UseA2UIOptions {
  agentUrl: string
  threadId?: string
  onText?: (delta: string) => void
  onAction?: (action: any) => void
  onFinished?: () => void
  onError?: (error: any) => void
}

export function useA2UI(options: UseA2UIOptions) {
  const dataModel = useDataModel()
  const surface = useSurface()
  const streamingText = ref('')
  const fullText = ref('')
  const isConnected = ref(false)
  const threadId = options.threadId || `thread-${Date.now()}`
  let msgCounter = 0

  async function send(text: string) {
    streamingText.value = ''
    fullText.value = ''
    isConnected.value = true
    msgCounter++

    try {
      await connectSSE(options.agentUrl, {
        threadId,
        runId: `run-${msgCounter}`,
        messages: [{ id: `msg-${msgCounter}`, role: 'user', content: text }],
        state: {},
        tools: [],
        context: [],
        forwardedProps: {},
      }, {
        onText: (delta: string) => {
          streamingText.value += delta
          fullText.value += delta
          options.onText?.(delta)
        },
        onA2UI: (messages: any[]) => {
          for (const msg of messages) {
            surface.handleMessage(msg)
          }
        },
        onFinished: () => {
          isConnected.value = false
          options.onFinished?.()
        },
        onError: (err: any) => {
          isConnected.value = false
          options.onError?.(err)
        },
      })
    } catch (err) {
      isConnected.value = false
      options.onError?.(err)
    }
  }

  async function emitAction(
    name: string,
    surfaceId: string,
    sourceComponentId: string,
    context: Record<string, any>,
  ) {
    const action = createAction(name, surfaceId, sourceComponentId, context)
    options.onAction?.(action)
    await sendAction(options.agentUrl, action)
  }

  /** Load static A2UI messages (e.g. from JSON file) */
  function loadMessages(messages: any[]) {
    for (const msg of messages) {
      surface.handleMessage(msg)
    }
  }

  return {
    send,
    emitAction,
    loadMessages,
    streamingText,
    fullText,
    isConnected,
    dataModel,
    surface,
    surfaces: surface.surfaces,
  }
}
