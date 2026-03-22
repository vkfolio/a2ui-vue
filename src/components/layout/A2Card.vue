<script setup lang="ts">
import { computed, inject } from 'vue'
import type { ComponentDefinition } from '../../types'
import A2Renderer from '../A2Renderer.vue'

const props = defineProps<{
  definition: ComponentDefinition
  surfaceId: string
}>()

const dataModel = inject('a2ui-data-model') as any

const resolve = (val: any): string => {
  if (!val) return ''
  if (typeof val === 'string') return val
  if (val.literalString !== undefined) return String(val.literalString)
  if (val.path) return String(dataModel?.getPath(props.surfaceId, val.path) ?? '')
  return String(val)
}

const cardStyle = computed(() => {
  const style: Record<string, string> = {}
  const w = props.definition.weight
  if (w != null) { style.flex = `${w} ${w} 0%` }
  const bg = resolve((props.definition as any).backgroundColor)
  if (bg) style.background = bg
  const color = resolve((props.definition as any).color ?? (props.definition as any).textColor)
  if (color) style.color = color
  const padding = resolve((props.definition as any).padding)
  if (padding) style.padding = padding
  const borderRadius = resolve((props.definition as any).borderRadius)
  if (borderRadius) style.borderRadius = borderRadius
  return style
})
</script>

<template>
  <div class="a2-card" :style="cardStyle">
    <A2Renderer :component-id="definition.child as string" :surface-id="surfaceId" />
  </div>
</template>

<style scoped>
.a2-card {
  background: var(--a2ui-card-bg, rgba(255, 255, 255, 0.8));
  border: 1px solid var(--a2ui-card-border, rgba(255, 255, 255, 0.8));
  border-radius: 16px;
  padding: 1.25rem;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}
.a2-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}
</style>
