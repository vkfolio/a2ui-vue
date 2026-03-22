<script setup lang="ts">
import { computed, inject, defineAsyncComponent } from 'vue'
import type { ComponentDefinition } from '../../types'

const A2Renderer = defineAsyncComponent(() => import('../A2Renderer.vue'))

const props = defineProps<{
  definition: ComponentDefinition
  surfaceId: string
}>()

const dataModel = inject('a2ui-data-model') as any
const surface = inject('a2ui-surface') as any

const resolve = (val: any) => {
  if (val === undefined || val === null) return ''
  if (typeof val === 'string') return val
  if (typeof val === 'number' || typeof val === 'boolean') return val
  if (val.literalString !== undefined) return String(val.literalString)
  if (val.path) return dataModel?.getPath(props.surfaceId, val.path) ?? ''
  return val
}

const variant = computed(() => (props.definition.variant ?? 'default') as string)

const variantClass = computed(() => {
  switch (variant.value) {
    case 'primary':
      return 'a2-btn-primary'
    case 'borderless':
      return 'a2-btn-borderless'
    default:
      return 'a2-btn-default'
  }
})

const handleClick = () => {
  const action = props.definition.action as any
  if (!action) return

  // v0.10 format: { event: { name, context } }
  if (action.event) {
    const context: Record<string, any> = {}
    if (action.event.context) {
      for (const [key, val] of Object.entries(action.event.context)) {
        context[key] = resolve(val)
      }
    }
    surface?.emitAction(action.event.name, props.surfaceId, props.definition.id, context)
    return
  }

  // v0.8 format: { name, context } (flat)
  if (action.name) {
    const context: Record<string, any> = {}
    if (action.context && typeof action.context === 'object' && !Array.isArray(action.context)) {
      for (const [key, val] of Object.entries(action.context)) {
        context[key] = resolve(val)
      }
    }
    surface?.emitAction(action.name, props.surfaceId, props.definition.id, context)
  }
}
</script>

<template>
  <button @click="handleClick" :class="variantClass"
    class="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer select-none active:scale-[0.97]">
    <A2Renderer :component-id="definition.child as string" :surface-id="surfaceId" />
  </button>
</template>

<style scoped>
.a2-btn-primary {
  background: var(--a2ui-primary, #7c3aed);
  color: white;
  border: none;
  box-shadow: 0 1px 3px rgba(0,0,0,0.15);
}
/* Override ALL child text color inside primary button */
.a2-btn-primary :deep(*) {
  color: white !important;
}
.a2-btn-primary:hover {
  filter: brightness(1.08);
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.a2-btn-default {
  background: var(--a2ui-bg-surface, #fff);
  color: var(--a2ui-text);
  border: 1px solid var(--a2ui-border, #e5e7eb);
}
.a2-btn-default:hover {
  background: var(--a2ui-input-bg, #f3f4f6);
}

.a2-btn-borderless {
  background: transparent;
  color: var(--a2ui-primary, #7c3aed);
  border: none;
}
.a2-btn-borderless:hover {
  background: rgba(124, 58, 237, 0.08);
}
</style>
