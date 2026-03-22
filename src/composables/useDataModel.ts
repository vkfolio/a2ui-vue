import { reactive } from 'vue'
import type {
  DynamicString,
  DynamicNumber,
  DynamicBoolean,
  DynamicValue,
  DynamicStringList,
  ChildList,
  DataBinding,
  FunctionCall,
  ComponentId,
} from '../types'

// ---------------------------------------------------------------------------
// Shared store – one reactive object per surface
// ---------------------------------------------------------------------------

const store = reactive(new Map<string, Record<string, unknown>>())

// ---------------------------------------------------------------------------
// JSON Pointer helpers
// ---------------------------------------------------------------------------

/**
 * Split a JSON Pointer (RFC 6901) into an array of unescaped tokens.
 * E.g. "/forecast/0/temp" → ["forecast", "0", "temp"]
 */
function pointerTokens(path: string): string[] {
  if (path === '' || path === '/') return []
  if (!path.startsWith('/')) {
    throw new Error(`Invalid JSON Pointer: "${path}" (must start with "/")`)
  }
  return path
    .substring(1)
    .split('/')
    .map((t) => t.replace(/~1/g, '/').replace(/~0/g, '~'))
}

/**
 * Walk into `obj` following `tokens`, creating intermediate objects/arrays as
 * needed when `create` is true.  Returns `[parent, lastKey]` so the caller
 * can set / delete the leaf.
 */
function walk(
  obj: Record<string, unknown>,
  tokens: string[],
  create: boolean,
): [Record<string, unknown> | unknown[], string] {
  let current: unknown = obj
  for (let i = 0; i < tokens.length - 1; i++) {
    const key = tokens[i]
    if (current == null || typeof current !== 'object') {
      throw new Error(`Cannot traverse into non-object at token "${key}"`)
    }
    const container = current as Record<string, unknown>
    if (container[key] === undefined) {
      if (!create) throw new Error(`Path not found at token "${key}"`)
      // Peek ahead: if next token looks numeric, create an array
      const nextKey = tokens[i + 1]
      container[key] = /^\d+$/.test(nextKey) ? [] : {}
    }
    current = container[key]
  }
  return [current as Record<string, unknown>, tokens[tokens.length - 1]]
}

// ---------------------------------------------------------------------------
// Core API
// ---------------------------------------------------------------------------

function createDataModel(surfaceId: string): Record<string, unknown> {
  const model = reactive<Record<string, unknown>>({})
  store.set(surfaceId, model)
  return model
}

function getDataModel(surfaceId: string): Record<string, unknown> | undefined {
  return store.get(surfaceId)
}

function setPath(surfaceId: string, path: string, value: unknown): void {
  let model = store.get(surfaceId)
  if (!model) {
    model = createDataModel(surfaceId)
  }

  const tokens = pointerTokens(path)
  if (tokens.length === 0) {
    // Replace entire model contents
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      // Clear existing keys
      for (const k of Object.keys(model)) {
        delete model[k]
      }
      Object.assign(model, value)
    }
    return
  }

  const [parent, lastKey] = walk(model, tokens, true)
  if (Array.isArray(parent)) {
    const idx = Number(lastKey)
    parent[idx] = value
  } else {
    ;(parent as Record<string, unknown>)[lastKey] = value
  }
}

function getPath(surfaceId: string, path: string): unknown {
  const model = store.get(surfaceId)
  if (!model) return undefined

  const tokens = pointerTokens(path)
  if (tokens.length === 0) return model

  let current: unknown = model
  for (const token of tokens) {
    if (current == null || typeof current !== 'object') return undefined
    current = (current as Record<string, unknown>)[token]
  }
  return current
}

function deletePath(surfaceId: string, path: string): void {
  const model = store.get(surfaceId)
  if (!model) return

  const tokens = pointerTokens(path)
  if (tokens.length === 0) {
    // Clear entire model
    for (const k of Object.keys(model)) {
      delete model[k]
    }
    return
  }

  try {
    const [parent, lastKey] = walk(model, tokens, false)
    if (Array.isArray(parent)) {
      parent.splice(Number(lastKey), 1)
    } else {
      delete (parent as Record<string, unknown>)[lastKey]
    }
  } catch {
    // Path does not exist – nothing to delete
  }
}

// ---------------------------------------------------------------------------
// Dynamic resolution
// ---------------------------------------------------------------------------

function isDataBinding(v: unknown): v is DataBinding {
  return v != null && typeof v === 'object' && 'path' in v && typeof (v as DataBinding).path === 'string' && !('call' in v)
}

function isFunctionCall(v: unknown): v is FunctionCall {
  return v != null && typeof v === 'object' && 'call' in v && typeof (v as FunctionCall).call === 'string'
}

/**
 * Resolve a dynamic value (DynamicString | DynamicNumber | DynamicBoolean |
 * DynamicValue | DynamicStringList) to its concrete runtime value.
 *
 * - Literal string / number / boolean / array → returned as-is
 * - DataBinding `{path}` → reads from the surface data model
 * - FunctionCall `{call, args, returnType}` → resolves args, then delegates
 *   to the builtin function registry (placeholder for now)
 */
function resolveDynamic(
  value: DynamicString | DynamicNumber | DynamicBoolean | DynamicValue | DynamicStringList,
  surfaceId: string,
): unknown {
  // Literal primitives
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value
  }

  // Literal arrays (DynamicStringList literal case)
  if (Array.isArray(value)) {
    return value
  }

  // DataBinding
  if (isDataBinding(value)) {
    return getPath(surfaceId, value.path)
  }

  // FunctionCall
  if (isFunctionCall(value)) {
    // Resolve arguments first
    const resolvedArgs: Record<string, unknown> = {}
    if (value.args) {
      for (const [key, arg] of Object.entries(value.args)) {
        resolvedArgs[key] = resolveDynamic(arg as DynamicValue, surfaceId)
      }
    }

    // TODO: delegate to evaluateFunction from builtins once available
    // For now return a placeholder indicating the call
    return `__fn:${value.call}(${JSON.stringify(resolvedArgs)})`
  }

  return value
}

// ---------------------------------------------------------------------------
// ChildList resolution
// ---------------------------------------------------------------------------

/**
 * Resolve a `ChildList` to a concrete array of component IDs.
 *
 * - `string[]` (explicit list) → returned as-is
 * - `{componentId, path}` → reads the array at `path` from the data model
 *   and generates IDs like `${componentId}_0`, `${componentId}_1`, ...
 */
function resolveChildList(
  children: ChildList,
  surfaceId: string,
  _componentRegistry?: Map<string, unknown>,
): ComponentId[] {
  // Static list
  if (Array.isArray(children)) {
    return children
  }

  // v0.8 explicit list
  if ('explicitList' in children && Array.isArray((children as any).explicitList)) {
    return (children as any).explicitList
  }

  // Dynamic template
  const tmpl = children as { componentId?: string; path?: string }
  if (!tmpl.componentId || !tmpl.path) return []
  const listData = getPath(surfaceId, tmpl.path)
  if (!Array.isArray(listData)) return []

  return listData.map((_, index) => `${tmpl.componentId}_${index}`)
}

// ---------------------------------------------------------------------------
// Composable
// ---------------------------------------------------------------------------

export function useDataModel() {
  return {
    createDataModel,
    getDataModel,
    setPath,
    getPath,
    deletePath,
    resolveDynamic,
    resolveChildList,
  }
}
