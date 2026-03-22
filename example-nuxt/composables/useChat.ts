import { ref } from 'vue'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export function useChat(agentUrl: string) {
  const messages = ref<ChatMessage[]>([])
  const isLoading = ref(false)
  const streamingText = ref('')

  async function send(text: string) {
    if (!text.trim()) return

    messages.value.push({ role: 'user', content: text })
    isLoading.value = true
    streamingText.value = ''

    try {
      const response = await fetch(agentUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.value.map((m, i) => ({
            id: `msg-${i}`,
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') continue
              try {
                const parsed = JSON.parse(data)
                if (parsed.type === 'TEXT_MESSAGE_CONTENT' && parsed.value) {
                  streamingText.value += parsed.value
                }
              } catch {
                // Skip non-JSON lines
              }
            }
          }
        }
      }

      if (streamingText.value) {
        messages.value.push({ role: 'assistant', content: streamingText.value })
      }
    } catch (err: any) {
      messages.value.push({
        role: 'assistant',
        content: `Connection error: ${err.message}. Make sure an A2UI agent is running at ${agentUrl}`,
      })
    } finally {
      isLoading.value = false
      streamingText.value = ''
    }
  }

  function clear() {
    messages.value = []
  }

  return { messages, isLoading, streamingText, send, clear }
}
