<script setup lang="ts">
import { computed, inject } from 'vue'
import type { ComponentDefinition } from '../../types'

const props = defineProps<{
  definition: ComponentDefinition
  surfaceId: string
}>()

const dataModel = inject('a2ui-data-model') as any

const resolve = (val: any) => {
  if (!val) return ''
  if (typeof val === 'string') return val
  if (typeof val === 'number') return String(val)
  if (val.literalString !== undefined) return String(val.literalString)
  if (val.path) return dataModel?.getPath(props.surfaceId, val.path) ?? ''
  return String(val)
}

const resolvedUrl = computed(() => resolve(props.definition.url))

const accessibilityLabel = computed(() => {
  const a11y = props.definition.accessibility as any
  return a11y?.label ? resolve(a11y.label) : ''
})

const fitClass = computed(() => {
  const map: Record<string, string> = {
    contain: 'object-contain',
    cover: 'object-cover',
    fill: 'object-fill',
    none: 'object-none',
    scaleDown: 'object-scale-down',
  }
  const fit = (props.definition.fit as string) ?? 'cover'
  return map[fit] ?? 'object-cover'
})

const variantClass = computed(() => {
  const map: Record<string, string> = {
    icon: 'w-8 h-8',
    avatar: 'w-20 h-20 rounded-full ring-2 ring-white shadow-md',
    smallFeature: 'w-32 h-32 rounded-xl',
    mediumFeature: 'w-full max-w-xs h-48 rounded-xl',
    largeFeature: 'w-full max-h-72 rounded-xl',
    header: 'w-full h-52 rounded-xl',
  }
  const variant = (props.definition.variant ?? props.definition.usageHint ?? 'mediumFeature') as string
  return map[variant] ?? map.mediumFeature
})
</script>

<template>
  <img :src="resolvedUrl" :class="[fitClass, variantClass]" :alt="accessibilityLabel" loading="lazy" />
</template>
