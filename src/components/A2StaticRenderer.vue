<script setup lang="ts">
/**
 * A2StaticRenderer — renders A2UI JSON without an SSE connection.
 * Pass in an array of A2UI messages (v0.8 or v0.10 format) and it renders them.
 * Perfect for gallery previews, static examples, and testing.
 */
import { provide, watch, ref, computed } from 'vue'
import { useDataModel } from '../composables/useDataModel'
import { useSurface } from '../composables/useSurface'
import { formatA2UIValidationErrors, validateA2UIMessages } from '../protocol/validation'
import A2Renderer from './A2Renderer.vue'

const props = defineProps<{
  /** Array of A2UI messages (surfaceUpdate, dataModelUpdate, beginRendering, or v0.10 format) */
  messages: any[]
  /** Override surface ID (optional, auto-detected from messages) */
  surfaceId?: string
}>()

const emit = defineEmits<{
  action: [event: { name: string; surfaceId: string; sourceComponentId: string; context: Record<string, any> }]
  error: [error: Error]
}>()

const dataModel = useDataModel()
const surface = useSurface()

provide('a2ui-data-model', dataModel)
provide('a2ui-surface', {
  ...surface,
  emitAction: (name: string, surfaceId: string, sourceComponentId: string, context: Record<string, any>) => {
    emit('action', { name, surfaceId, sourceComponentId, context })
  },
})

// Track which surfaceIds belong to THIS renderer instance
const ownedSurfaceIds = ref<Set<string>>(new Set())

function extractSurfaceId(msg: any): string | undefined {
  if (msg.surfaceUpdate?.surfaceId) return msg.surfaceUpdate.surfaceId
  if (msg.dataModelUpdate?.surfaceId) return msg.dataModelUpdate.surfaceId
  if (msg.beginRendering?.surfaceId) return msg.beginRendering.surfaceId
  if (msg.createSurface?.surfaceId) return msg.createSurface.surfaceId
  if (msg.updateComponents?.surfaceId) return msg.updateComponents.surfaceId
  if (msg.updateDataModel?.surfaceId) return msg.updateDataModel.surfaceId
  return undefined
}

function processMessages(messages: any[]) {
  if (!messages || messages.length === 0) return
  for (const msg of messages) {
    const sid = extractSurfaceId(msg)
    if (sid) ownedSurfaceIds.value.add(sid)
    surface.handleMessage(msg)
  }
}

// Use immediate watch instead of onMounted so messages are processed
// BEFORE the first render — prevents a blank flash on mount
watch(() => props.messages, (newMsgs) => {
  // Clean up previously owned surfaces before processing new messages
  for (const sid of ownedSurfaceIds.value) {
    surface.deleteSurface(sid)
  }
  ownedSurfaceIds.value.clear()
  const errors = validateA2UIMessages(newMsgs, { mode: 'batch' })
  if (errors.length > 0) {
    emit('error', new Error(formatA2UIValidationErrors(errors)))
    return
  }
  processMessages(newMsgs)
}, { deep: true, immediate: true })

const renderSurfaceIds = computed(() => {
  if (props.surfaceId) return [props.surfaceId]
  return Array.from(ownedSurfaceIds.value)
})

function getRootId(sid: string): string | undefined {
  const s = surface.getSurface(sid)
  return s?.rootId
}
</script>

<template>
  <div class="a2ui-static-renderer">
    <template v-for="sid in renderSurfaceIds" :key="sid">
      <A2Renderer
        v-if="getRootId(sid)"
        :component-id="getRootId(sid)!"
        :surface-id="sid"
      />
    </template>
  </div>
</template>
