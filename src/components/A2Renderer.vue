<script setup lang="ts">
import { computed, inject, defineAsyncComponent } from 'vue'

const props = defineProps<{
  componentId: string
  surfaceId: string
}>()

const surface = inject('a2ui-surface') as any

const definition = computed(() => {
  return surface?.getComponent(props.surfaceId, props.componentId)
})

const componentType = computed(() => {
  const def = definition.value
  if (!def) return null
  // v0.10 format: { id, component: "Text", text: ... }
  if (typeof def.component === 'string') return def.component
  // v0.8 format: { id, component: { Text: { text: ... } } }
  if (typeof def.component === 'object') {
    return Object.keys(def.component)[0]
  }
  return null
})

const normalizedDef = computed(() => {
  const def = definition.value
  if (!def) return null
  // v0.10 format: already flat
  if (typeof def.component === 'string') return def
  // v0.8 format: { id, component: { Text: { text: ... } } }
  if (typeof def.component === 'object') {
    const type = Object.keys(def.component)[0]
    const inner = (def.component as any)[type]
    return { ...inner, id: def.id, component: type }
  }
  return def
})

// Lazy-load components to avoid circular dependencies
const componentMap: Record<string, ReturnType<typeof defineAsyncComponent>> = {
  // Layout
  Row: defineAsyncComponent(() => import('./layout/A2Row.vue')),
  Column: defineAsyncComponent(() => import('./layout/A2Column.vue')),
  List: defineAsyncComponent(() => import('./layout/A2List.vue')),
  Card: defineAsyncComponent(() => import('./layout/A2Card.vue')),
  Tabs: defineAsyncComponent(() => import('./layout/A2Tabs.vue')),
  Modal: defineAsyncComponent(() => import('./layout/A2Modal.vue')),
  Divider: defineAsyncComponent(() => import('./layout/A2Divider.vue')),
  // Content
  Text: defineAsyncComponent(() => import('./content/A2Text.vue')),
  Image: defineAsyncComponent(() => import('./content/A2Image.vue')),
  Icon: defineAsyncComponent(() => import('./content/A2Icon.vue')),
  Video: defineAsyncComponent(() => import('./content/A2Video.vue')),
  AudioPlayer: defineAsyncComponent(() => import('./content/A2AudioPlayer.vue')),
  // Input
  TextField: defineAsyncComponent(() => import('./input/A2TextField.vue')),
  CheckBox: defineAsyncComponent(() => import('./input/A2CheckBox.vue')),
  ChoicePicker: defineAsyncComponent(() => import('./input/A2ChoicePicker.vue')),
  Slider: defineAsyncComponent(() => import('./input/A2Slider.vue')),
  DateTimeInput: defineAsyncComponent(() => import('./input/A2DateTimeInput.vue')),
  // Navigation
  Button: defineAsyncComponent(() => import('./navigation/A2Button.vue')),
  // Extended content
  Badge: defineAsyncComponent(() => import('./content/A2Badge.vue')),
  Progress: defineAsyncComponent(() => import('./content/A2Progress.vue')),
  Rating: defineAsyncComponent(() => import('./content/A2Rating.vue')),
  Avatar: defineAsyncComponent(() => import('./content/A2Avatar.vue')),
  Alert: defineAsyncComponent(() => import('./content/A2Alert.vue')),
  Stat: defineAsyncComponent(() => import('./content/A2Stat.vue')),
}

const resolvedComponent = computed(() => {
  const type = componentType.value
  if (!type) return null
  return componentMap[type] || null
})

const weightStyle = computed(() => {
  const def = normalizedDef.value
  if (def?.weight !== undefined) {
    return { flex: `${def.weight} 1 0%` }
  }
  return {}
})
</script>

<template>
  <component
    v-if="resolvedComponent && normalizedDef"
    :is="resolvedComponent"
    :definition="normalizedDef"
    :surface-id="surfaceId"
    :style="weightStyle"
  />
  <div
    v-else-if="componentType"
    class="p-2 text-xs rounded border border-dashed opacity-50"
    style="color: var(--a2ui-text-secondary); border-color: var(--a2ui-border)"
  >
    Unknown component: {{ componentType }}
  </div>
</template>
