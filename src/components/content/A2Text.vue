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

const tag = computed(() => {
  const headings: Record<string, string> = { h1: 'h1', h2: 'h2', h3: 'h3', h4: 'h4', h5: 'h5' }
  return headings[variant.value] ?? 'p'
})

const renderedText = computed(() => {
  const raw = resolve(props.definition.text)
  return raw
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="a2-inline-code">$1</code>')
})
</script>

<template>
  <component :is="tag" :class="`a2-text a2-text--${variant}`" v-html="renderedText" />
</template>

<style scoped>
.a2-text {
  margin: 0;
  color: var(--a2ui-text);
}
.a2-text--h1 {
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.1;
}
.a2-text--h2 {
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.2;
}
.a2-text--h3 {
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: -0.015em;
  line-height: 1.3;
}
.a2-text--h4 {
  font-size: 1.0625rem;
  font-weight: 600;
  line-height: 1.4;
}
.a2-text--h5 {
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.4;
  color: var(--a2ui-text-secondary);
}
.a2-text--body {
  font-size: 0.9375rem;
  line-height: 1.65;
  font-weight: 400;
}
.a2-text--caption {
  font-size: 0.8125rem;
  line-height: 1.5;
  font-weight: 400;
  color: var(--a2ui-text-secondary);
}
.a2-text--label {
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--a2ui-text-secondary);
}
:deep(.a2-inline-code) {
  font-size: 0.8125em;
  font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(124, 58, 237, 0.08);
  color: #7c3aed;
}
</style>
