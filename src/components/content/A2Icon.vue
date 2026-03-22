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

const sizeClass = computed(() => {
  return 'text-2xl'
})
</script>

<template>
  <span class="material-icons" :class="sizeClass" style="color: var(--a2ui-text)">{{ materialName }}</span>
</template>
