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
const resolvedValue = computed(() => String(resolve(props.definition.value)))
const resolvedMin = computed(() => {
  const m = props.definition.min
  return m ? String(resolve(m)) : undefined
})
const resolvedMax = computed(() => {
  const m = props.definition.max
  return m ? String(resolve(m)) : undefined
})

const inputType = computed(() => {
  const enableDate = props.definition.enableDate ?? false
  const enableTime = props.definition.enableTime ?? false
  if (enableDate && enableTime) return 'datetime-local'
  if (enableTime) return 'time'
  return 'date'
})

const onInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  const path = getValuePath(props.definition.value)
  if (path) {
    updateValue(path, target.value)
  }
}
</script>

<template>
  <div class="flex flex-col gap-1">
    <label v-if="resolvedLabel" class="text-sm font-medium" style="color: var(--a2ui-text)">{{ resolvedLabel }}</label>
    <input :type="inputType" :value="resolvedValue" @input="onInput" :min="resolvedMin" :max="resolvedMax"
      class="px-3 py-2 rounded-lg border text-sm outline-none transition-colors focus:ring-2"
      style="background: var(--a2ui-input-bg); border-color: var(--a2ui-border); color: var(--a2ui-text); --tw-ring-color: var(--a2ui-primary)" />
  </div>
</template>
