<script setup lang="ts">
import { computed, inject } from 'vue'
import type { ComponentDefinition } from '../../types'

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

const updateValue = (path: string, value: any) => {
  if (path) dataModel?.setPath(props.surfaceId, path, value)
}

const getValuePath = (val: any): string | null => {
  if (val && typeof val === 'object' && val.path) return val.path
  return null
}

const resolvedLabel = computed(() => resolve(props.definition.label))
const resolvedValue = computed(() => !!resolve(props.definition.value))

const onToggle = (e: Event) => {
  const target = e.target as HTMLInputElement
  const path = getValuePath(props.definition.value)
  if (path) {
    updateValue(path, target.checked)
  }
}
</script>

<template>
  <label class="flex items-center gap-2 cursor-pointer">
    <input type="checkbox" :checked="resolvedValue" @change="onToggle"
      class="w-4 h-4 rounded" style="accent-color: var(--a2ui-primary)" />
    <span class="text-sm" style="color: var(--a2ui-text)">{{ resolvedLabel }}</span>
  </label>
</template>
