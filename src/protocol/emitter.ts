// ---------------------------------------------------------------------------
// Action emitter — sends user-initiated actions and function responses
// ---------------------------------------------------------------------------

/** Shape of an outbound action. */
export interface OutboundAction {
  name: string
  surfaceId: string
  sourceComponentId: string
  context: Record<string, unknown>
  timestamp: string
}

/** Shape of a function call identifier. */
export interface FunctionCallId {
  callId: string
  agentId?: string
}

// ---------------------------------------------------------------------------
// createAction
// ---------------------------------------------------------------------------

/**
 * Build an `OutboundAction` with the current ISO timestamp.
 */
export function createAction(
  name: string,
  surfaceId: string,
  sourceComponentId: string,
  context: Record<string, unknown> = {},
): OutboundAction {
  return {
    name,
    surfaceId,
    sourceComponentId,
    context,
    timestamp: new Date().toISOString(),
  }
}

// ---------------------------------------------------------------------------
// sendAction
// ---------------------------------------------------------------------------

/**
 * POST an action to the server.
 */
export async function sendAction(
  url: string,
  action: OutboundAction,
): Promise<Response> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(action),
  })
  return response
}

// ---------------------------------------------------------------------------
// sendFunctionResponse
// ---------------------------------------------------------------------------

/**
 * POST a function response back to the server.
 */
export async function sendFunctionResponse(
  url: string,
  functionCallId: FunctionCallId,
  value: unknown,
): Promise<Response> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      functionCallId,
      value,
    }),
  })
  return response
}
