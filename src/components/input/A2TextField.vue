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
const resolvedValue = computed(() => resolve(props.definition.value))

const variant = computed(() => (props.definition.variant ?? 'shortText') as string)

const inputType = computed(() => {
  switch (variant.value) {
    case 'obscured': return 'password'
    case 'number': return 'number'
    default: return 'text'
  }
})

const onInput = (e: Event) => {
  const target = e.target as HTMLInputElement | HTMLTextAreaElement
  const path = getValuePath(props.definition.value)
  if (path) {
    const val = variant.value === 'number' ? Number(target.value) : target.value
    updateValue(path, val)
  }
}
</script>

<template>
  <div class="flex flex-col gap-1">
    <label class="text-sm font-medium" style="color: var(--a2ui-text)">{{ resolvedLabel }}</label>
    <input v-if="variant !== 'longText'" :type="inputType" :value="resolvedValue" @input="onInput"
      class="px-3 py-2 rounded-lg border text-sm outline-none transition-colors focus:ring-2"
      style="background: var(--a2ui-input-bg); border-color: var(--a2ui-border); color: var(--a2ui-text); --tw-ring-color: var(--a2ui-primary)"
      :placeholder="resolvedLabel" />
    <textarea v-else :value="resolvedValue" @input="onInput" rows="3"
      class="px-3 py-2 rounded-lg border text-sm outline-none resize-y transition-colors focus:ring-2"
      style="background: var(--a2ui-input-bg); border-color: var(--a2ui-border); color: var(--a2ui-text); --tw-ring-color: var(--a2ui-primary)"
      :placeholder="resolvedLabel" />
  </div>
</template>
