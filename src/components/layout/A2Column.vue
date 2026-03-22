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

const justifyClass = computed(() => {
  const j = props.definition.justify ?? props.definition.distribution as string
  const map: Record<string, string> = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    spaceBetween: 'justify-between',
    spaceAround: 'justify-around',
    spaceEvenly: 'justify-evenly',
    stretch: 'justify-stretch',
  }
  return map[j as string] ?? 'justify-start'
})

const alignClass = computed(() => {
  const a = props.definition.align ?? props.definition.alignment as string
  const map: Record<string, string> = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  }
  return map[a as string] ?? 'items-stretch'
})

const weightStyle = computed(() => {
  const w = props.definition.weight
  return w != null ? { flex: `${w} ${w} 0%` } : undefined
})
</script>

<template>
  <div class="flex flex-col gap-1" :class="[justifyClass, alignClass]" :style="weightStyle">
    <A2Renderer v-for="childId in resolvedChildren" :key="childId" :component-id="childId" :surface-id="surfaceId" />
  </div>
</template>
