<script setup lang="ts">
import { computed, inject } from 'vue'
import type { ComponentDefinition } from '../../types'

const props = defineProps<{
  definition: ComponentDefinition
  surfaceId: string
}>()

const dataModel = inject('a2ui-data-model') as any

const resolve = (val: any): string => {
  if (!val) return ''
  if (typeof val === 'string') return val
  if (typeof val === 'number') return String(val)
  if (val.literalString !== undefined) return String(val.literalString)
  if (val.path) return String(dataModel?.getPath(props.surfaceId, val.path) ?? '')
  return String(val)
}

const variant = computed(() => {
  return (props.definition.variant ?? props.definition.usageHint ?? 'body') as string
})

const variantClass = computed(() => {
  const map: Record<string, string> = {
    h1: 'text-3xl font-bold tracking-tight',
    h2: 'text-2xl font-bold tracking-tight',
    h3: 'text-lg font-semibold',
    h4: 'text-base font-semibold',
    h5: 'text-sm font-semibold',
    caption: 'text-sm text-[var(--a2ui-muted)]',
    body: 'text-sm leading-relaxed',
  }
  return map[variant.value] ?? map.body
})

const tag = computed(() => {
  const headings: Record<string, string> = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
  }
  return headings[variant.value] ?? 'p'
})

const renderedText = computed(() => {
  const raw = resolve(props.definition.text)
  return raw
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="text-xs px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-700">$1</code>')
})
</script>

<template>
  <component :is="tag" :class="variantClass" style="color: var(--a2ui-text); margin: 0" v-html="renderedText" />
</template>
