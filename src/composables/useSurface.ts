import { reactive } from 'vue'
import type {
  ComponentDefinition,
  SurfaceState,
  Theme,
} from '../types'
import { useDataModel } from './useDataModel'

// Re-export for convenience — but the real import is from useDataModel
const dataModel = useDataModel()

// ---------------------------------------------------------------------------
// Shared surface store
// ---------------------------------------------------------------------------

const surfaces = reactive(new Map<string, SurfaceState>())

// ---------------------------------------------------------------------------
// Surface lifecycle
// ---------------------------------------------------------------------------

function createSurface(
  surfaceId: string,
  catalogId: string,
  theme?: Theme,
  sendDataModel?: boolean,
): SurfaceState {
  const dm = dataModel.createDataModel(surfaceId)
  const state: SurfaceState = reactive({
    components: new Map<string, ComponentDefinition>(),
    dataModel: dm,
    theme: theme ?? {},
    rootId: 'root',
    catalogId,
    sendDataModel: sendDataModel ?? false,
  })
  surfaces.set(surfaceId, state)
  return state
}

function updateComponents(
  surfaceId: string,
  components: ComponentDefinition[],
): void {
  let surface = surfaces.get(surfaceId)
  if (!surface) {
    // Auto-create surface if not yet present (v0.8 may send components first)
    surface = createSurface(surfaceId, '')
  }
  for (const comp of components) {
    surface.components.set(comp.id, comp)
  }
}

function updateDataModel(
  surfaceId: string,
  path: string,
  value: unknown,
): void {
  dataModel.setPath(surfaceId, path, value)
}

function deleteSurface(surfaceId: string): void {
  surfaces.delete(surfaceId)
}

function getComponent(
  surfaceId: string,
  componentId: string,
): ComponentDefinition | undefined {
  return surfaces.get(surfaceId)?.components.get(componentId)
}

function getSurface(surfaceId: string): SurfaceState | undefined {
  return surfaces.get(surfaceId)
}

// ---------------------------------------------------------------------------
// v0.8 data model helpers
// ---------------------------------------------------------------------------

/**
 * Apply a v0.8 `dataModelUpdate.contents` array.
 * Each entry has `key` and `valueString`; the value may be JSON-encoded.
 */
function applyV08DataModelUpdate(
  surfaceId: string,
  contents: Array<{ key: string; valueString: string }>,
): void {
  for (const { key, valueString } of contents) {
    let parsed: unknown = valueString
    try {
      parsed = JSON.parse(valueString)
    } catch {
      // Keep raw string
    }
    dataModel.setPath(surfaceId, `/${key}`, parsed)
  }
}

// ---------------------------------------------------------------------------
// Message dispatcher  (supports both v0.10 and v0.8 formats)
// ---------------------------------------------------------------------------

function handleMessage(msg: Record<string, unknown>): void {
  // --- v0.10 messages ---
  if ('createSurface' in msg) {
    const cs = msg.createSurface as {
      surfaceId: string
      catalogId: string
      theme?: Theme
      sendDataModel?: boolean
    }
    createSurface(cs.surfaceId, cs.catalogId, cs.theme, cs.sendDataModel)
    return
  }

  if ('updateComponents' in msg) {
    const uc = msg.updateComponents as {
      surfaceId: string
      components: ComponentDefinition[]
    }
    updateComponents(uc.surfaceId, uc.components)
    return
  }

  if ('updateDataModel' in msg) {
    const ud = msg.updateDataModel as {
      surfaceId: string
      path?: string
      value?: unknown
    }
    if (ud.value !== undefined) {
      updateDataModel(ud.surfaceId, ud.path ?? '/', ud.value)
    } else if (ud.path) {
      dataModel.deletePath(ud.surfaceId, ud.path)
    }
    return
  }

  if ('deleteSurface' in msg) {
    const ds = msg.deleteSurface as { surfaceId: string }
    deleteSurface(ds.surfaceId)
    return
  }

  // --- v0.8 messages ---
  if ('surfaceUpdate' in msg) {
    const su = msg.surfaceUpdate as {
      surfaceId: string
      components: ComponentDefinition[]
    }
    updateComponents(su.surfaceId, su.components)
    return
  }

  if ('dataModelUpdate' in msg) {
    const dmu = msg.dataModelUpdate as {
      surfaceId: string
      contents: Array<{ key: string; valueString: string }>
    }
    applyV08DataModelUpdate(dmu.surfaceId, dmu.contents)
    return
  }

  if ('beginRendering' in msg) {
    const br = msg.beginRendering as { surfaceId: string; root: string }
    const surface = surfaces.get(br.surfaceId)
    if (surface) {
      surface.rootId = br.root
    }
    return
  }
}

// ---------------------------------------------------------------------------
// Composable
// ---------------------------------------------------------------------------

function getAllSurfaces(): string[] {
  return Array.from(surfaces.keys())
}

export function useSurface() {
  return {
    surfaces,
    createSurface,
    updateComponents,
    updateDataModel,
    deleteSurface,
    getComponent,
    getSurface,
    getAllSurfaces,
    handleMessage,
  }
}
