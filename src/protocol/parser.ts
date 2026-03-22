// ---------------------------------------------------------------------------
// SSE / JSONL stream parser for A2UI messages
// ---------------------------------------------------------------------------

/** Handlers supplied by the caller of connectSSE. */
export interface SSEHandlers {
  onText?: (delta: string) => void
  onA2UI?: (messages: Record<string, unknown>[]) => void
  onFinished?: () => void
  onError?: (event: Record<string, unknown>) => void
}

// ---------------------------------------------------------------------------
// A2UI message detection
// ---------------------------------------------------------------------------

const A2UI_KEYS = [
  'createSurface',
  'updateComponents',
  'updateDataModel',
  'deleteSurface',
  'callFunction',
  // v0.8
  'surfaceUpdate',
  'dataModelUpdate',
  'beginRendering',
] as const

function isA2UIMessage(obj: unknown): obj is Record<string, unknown> {
  if (obj == null || typeof obj !== 'object') return false
  return A2UI_KEYS.some((k) => k in (obj as Record<string, unknown>))
}

// ---------------------------------------------------------------------------
// parseA2UIMessages
// ---------------------------------------------------------------------------

/**
 * Parse A2UI messages from a tool-call result or raw content.
 *
 * Accepts:
 * - A JSON string encoding an array or single A2UI message
 * - An already-parsed object / array
 *
 * Returns an array of A2UI message objects, or an empty array if nothing
 * recognisable is found.
 */
export function parseA2UIMessages(
  content: string | object,
): Record<string, unknown>[] {
  let parsed: unknown = content

  if (typeof content === 'string') {
    try {
      parsed = JSON.parse(content)
    } catch {
      return []
    }
  }

  if (Array.isArray(parsed)) {
    return parsed.filter(isA2UIMessage)
  }

  if (isA2UIMessage(parsed)) {
    return [parsed as Record<string, unknown>]
  }

  return []
}

// ---------------------------------------------------------------------------
// connectSSE
// ---------------------------------------------------------------------------

/**
 * Connect to an AG-UI / A2UI streaming endpoint via POST.
 *
 * The server is expected to return an SSE or JSONL stream.  Each `data:`
 * line is parsed as JSON and dispatched to the appropriate handler.
 *
 * Also handles raw JSONL (lines that are not prefixed with `data:`) where
 * each line is a standalone A2UI message.
 */
export async function connectSSE(
  url: string,
  body: object,
  handlers: SSEHandlers,
): Promise<void> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    handlers.onError?.({
      type: 'HTTP_ERROR',
      status: response.status,
      statusText: response.statusText,
    })
    return
  }

  const reader = response.body?.getReader()
  if (!reader) {
    handlers.onError?.({ type: 'NO_BODY' })
    return
  }

  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      // Keep the last (possibly incomplete) line in the buffer
      buffer = lines.pop() ?? ''

      for (const rawLine of lines) {
        const line = rawLine.trim()
        if (line === '' || line.startsWith(':')) continue

        // SSE `data:` line
        if (line.startsWith('data:')) {
          const payload = line.slice(5).trim()
          if (payload === '[DONE]') {
            handlers.onFinished?.()
            continue
          }
          processPayload(payload, handlers)
          continue
        }

        // Raw JSONL fallback
        processPayload(line, handlers)
      }
    }

    // Process any remaining buffer content
    if (buffer.trim()) {
      processPayload(buffer.trim(), handlers)
    }
  } catch (err) {
    handlers.onError?.({
      type: 'STREAM_ERROR',
      message: err instanceof Error ? err.message : String(err),
    })
  } finally {
    reader.releaseLock()
  }
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function processPayload(payload: string, handlers: SSEHandlers): void {
  let parsed: unknown
  try {
    parsed = JSON.parse(payload)
  } catch {
    // Not valid JSON – ignore
    return
  }

  if (parsed == null || typeof parsed !== 'object') return
  const event = parsed as Record<string, unknown>

  // AG-UI typed events
  if ('type' in event) {
    switch (event.type) {
      case 'TEXT_MESSAGE_CONTENT':
        if (typeof event.delta === 'string') {
          handlers.onText?.(event.delta)
        }
        return

      case 'TOOL_CALL_RESULT': {
        const content = event.content
        if (content != null) {
          const messages = parseA2UIMessages(
            typeof content === 'string' ? content : content as object,
          )
          if (messages.length > 0) {
            handlers.onA2UI?.(messages)
          }
        }
        return
      }

      case 'RUN_FINISHED':
        handlers.onFinished?.()
        return

      case 'RUN_ERROR':
        handlers.onError?.(event)
        return
    }
  }

  // Direct A2UI message (raw JSONL or non-AG-UI envelope)
  if (isA2UIMessage(event)) {
    handlers.onA2UI?.([event])
    return
  }

  // Array of A2UI messages
  if (Array.isArray(parsed)) {
    const messages = (parsed as unknown[]).filter(isA2UIMessage) as Record<string, unknown>[]
    if (messages.length > 0) {
      handlers.onA2UI?.(messages)
    }
  }
}
