<script setup lang="ts">
import { computed, inject } from 'vue'
import type { ComponentDefinition } from '../../types'
import A2Renderer from '../A2Renderer.vue'

const props = defineProps<{
  definition: ComponentDefinition
  surfaceId: string
}>()

const dataModel = inject('a2ui-data-model') as any

const resolvedChildren = computed(() => {
  const children = props.definition.children as any
  if (!children) return []
  if (Array.isArray(children)) return children
  if (children.explicitList && Array.isArray(children.explicitList)) return children.explicitList as string[]
  if (children.componentId && children.path) {
    const items = dataModel?.getPath(props.surfaceId, children.path)
    if (Array.isArray(items)) return items.map((_: any, i: number) => `${children.componentId}_${i}`)
  }
  return []
})

const directionClass = computed(() => {
  return (props.definition.direction as string) === 'horizontal' ? 'flex-row' : 'flex-col'
})

const alignClass = computed(() => {
  const map: Record<string, string> = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  }
  return map[props.definition.align as string] ?? 'items-stretch'
})

const weightStyle = computed(() => {
  const w = props.definition.weight
  return w != null ? { flex: `${w} ${w} 0%` } : undefined
})
</script>

<template>
  <div class="flex overflow-auto" :class="[directionClass, alignClass]" :style="weightStyle">
    <A2Renderer v-for="childId in resolvedChildren" :key="childId" :component-id="childId" :surface-id="surfaceId" />
  </div>
</template>
