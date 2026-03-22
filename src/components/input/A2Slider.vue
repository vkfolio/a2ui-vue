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
const resolvedValue = computed(() => {
  const v = resolve(props.definition.value)
  return typeof v === 'number' ? v : Number(v) || 0
})

const onInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  const path = getValuePath(props.definition.value)
  if (path) {
    updateValue(path, Number(target.value))
  }
}
</script>

<template>
  <div class="flex flex-col gap-1">
    <div class="flex justify-between">
      <label class="text-sm font-medium" style="color: var(--a2ui-text)">{{ resolvedLabel }}</label>
      <span class="text-sm" style="color: var(--a2ui-text-secondary)">{{ resolvedValue }}</span>
    </div>
    <input type="range" :min="(definition.min as number) ?? 0" :max="(definition.max as number)" :value="resolvedValue" @input="onInput"
      class="w-full h-2 rounded-lg appearance-none cursor-pointer" style="accent-color: var(--a2ui-primary)" />
  </div>
</template>
