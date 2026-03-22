<script setup lang="ts">
import { computed, inject, ref } from 'vue'
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

const resolveOptionLabel = (label: any) => resolve(label)

const resolvedLabel = computed(() => resolve(props.definition.label))

const variant = computed(() => (props.definition.variant ?? 'mutuallyExclusive') as string)
const displayStyle = computed(() => (props.definition.displayStyle ?? 'checkbox') as string)

const selectedValues = computed((): string[] => {
  const raw = resolve(props.definition.value)
  if (Array.isArray(raw)) return raw
  if (typeof raw === 'string' && raw) return [raw]
  return []
})

const options = computed(() => {
  return (props.definition.options as Array<{ label: any; value: string }>) ?? []
})

const searchQuery = ref('')

const filteredOptions = computed(() => {
  if (!searchQuery.value) return options.value
  const q = searchQuery.value.toLowerCase()
  return options.value.filter((opt) => {
    const label = String(resolveOptionLabel(opt.label)).toLowerCase()
    return label.includes(q)
  })
})

const isSelected = (value: string): boolean => {
  return selectedValues.value.includes(value)
}

const toggleOption = (value: string) => {
  const path = getValuePath(props.definition.value)
  if (!path) return

  if (variant.value === 'mutuallyExclusive') {
    updateValue(path, [value])
  } else {
    const current = [...selectedValues.value]
    const idx = current.indexOf(value)
    if (idx >= 0) {
      current.splice(idx, 1)
    } else {
      current.push(value)
    }
    updateValue(path, current)
  }
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <label v-if="resolvedLabel" class="text-sm font-medium" style="color: var(--a2ui-text)">{{ resolvedLabel }}</label>
    <input v-if="definition.filterable" v-model="searchQuery" type="text" placeholder="Search..."
      class="px-3 py-1.5 rounded-lg border text-sm"
      style="background: var(--a2ui-input-bg); border-color: var(--a2ui-border); color: var(--a2ui-text)" />
    <!-- chips mode -->
    <div v-if="displayStyle === 'chips'" class="flex flex-wrap gap-2">
      <button v-for="opt in filteredOptions" :key="opt.value" @click="toggleOption(opt.value)"
        class="px-3 py-1 rounded-full text-sm border transition-colors"
        :style="isSelected(opt.value)
          ? 'background: var(--a2ui-primary); color: var(--a2ui-text-on-primary); border-color: var(--a2ui-primary)'
          : 'background: var(--a2ui-bg-surface); color: var(--a2ui-text); border-color: var(--a2ui-border)'">
        {{ resolveOptionLabel(opt.label) }}
      </button>
    </div>
    <!-- checkbox/radio mode -->
    <div v-else class="flex flex-col gap-1.5">
      <label v-for="opt in filteredOptions" :key="opt.value" class="flex items-center gap-2 cursor-pointer">
        <input :type="variant === 'mutuallyExclusive' ? 'radio' : 'checkbox'" :checked="isSelected(opt.value)"
          @change="toggleOption(opt.value)"
          class="w-4 h-4" style="accent-color: var(--a2ui-primary)" />
        <span class="text-sm" style="color: var(--a2ui-text)">{{ resolveOptionLabel(opt.label) }}</span>
      </label>
    </div>
  </div>
</template>
