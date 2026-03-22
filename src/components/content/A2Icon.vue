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

function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

const materialName = computed(() => {
  const name = resolve(props.definition.name)
  return camelToSnake(name)
})

const sizeMap: Record<string, string> = {
  xs: '14px',
  sm: '16px',
  md: '20px',
  lg: '24px',
  xl: '32px',
  '2xl': '40px',
}

const iconSize = computed(() => {
  const size = (props.definition as any).size as string
  return sizeMap[size] ?? '20px'
})

const iconColor = computed(() => {
  return (props.definition as any).color || 'var(--a2ui-text)'
})

const isFilled = computed(() => !!(props.definition as any).filled)
</script>

<template>
  <span
    class="a2-icon"
    :class="{ 'a2-icon--filled': isFilled }"
    :style="{ fontSize: iconSize, color: iconColor }"
  >
    <span class="material-icons" :style="{ fontSize: 'inherit' }">{{ materialName }}</span>
  </span>
</template>

<style scoped>
.a2-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  line-height: 1;
}
.a2-icon--filled {
  width: calc(1em + 16px);
  height: calc(1em + 16px);
  border-radius: 50%;
  background: var(--a2ui-primary-light, rgba(124, 58, 237, 0.1));
}
</style>
