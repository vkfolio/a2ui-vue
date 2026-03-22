<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import type { ComponentDefinition } from '../../types'

const props = defineProps<{
  definition: ComponentDefinition
  surfaceId: string
}>()

const dataModel = inject('a2ui-data-model') as any

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
const displayStyle = computed(() => (props.definition.displayStyle ?? 'chips') as string)

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

const isSelected = (value: string): boolean => selectedValues.value.includes(value)

const toggleOption = (value: string) => {
  const path = getValuePath(props.definition.value)
  if (!path) return

  if (variant.value === 'mutuallyExclusive') {
    updateValue(path, [value])
  } else {
    const current = [...selectedValues.value]
    const idx = current.indexOf(value)
    if (idx >= 0) current.splice(idx, 1)
    else current.push(value)
    updateValue(path, current)
  }
}
</script>

<template>
  <div class="a2-choice">
    <label v-if="resolvedLabel" class="a2-choice__label">{{ resolvedLabel }}</label>

    <!-- Search -->
    <input
      v-if="definition.filterable"
      v-model="searchQuery"
      type="text"
      placeholder="Search..."
      class="a2-choice__search"
    />

    <!-- Chips -->
    <div v-if="displayStyle === 'chips'" class="a2-chips">
      <button
        v-for="opt in filteredOptions"
        :key="opt.value"
        @click="toggleOption(opt.value)"
        class="a2-chip"
        :class="{ 'a2-chip--selected': isSelected(opt.value) }"
      >
        {{ resolveOptionLabel(opt.label) }}
      </button>
    </div>

    <!-- Radio (mutually exclusive) -->
    <div v-else-if="variant === 'mutuallyExclusive'" class="a2-choice__list">
      <label
        v-for="opt in filteredOptions"
        :key="opt.value"
        class="a2-radio"
        @click.prevent="toggleOption(opt.value)"
      >
        <span class="a2-radio__circle" :class="{ 'a2-radio__circle--selected': isSelected(opt.value) }">
          <span v-if="isSelected(opt.value)" class="a2-radio__dot" />
        </span>
        <span class="a2-choice__opt-label">{{ resolveOptionLabel(opt.label) }}</span>
      </label>
    </div>

    <!-- Checkboxes (multi-select) -->
    <div v-else class="a2-choice__list">
      <label
        v-for="opt in filteredOptions"
        :key="opt.value"
        class="a2-radio"
        @click.prevent="toggleOption(opt.value)"
      >
        <span class="a2-checkbox-box" :class="{ 'a2-checkbox-box--checked': isSelected(opt.value) }">
          <svg v-if="isSelected(opt.value)" viewBox="0 0 12 9" fill="none" width="12" height="9">
            <path d="M1 4L4.5 7.5L11 1" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
        <span class="a2-choice__opt-label">{{ resolveOptionLabel(opt.label) }}</span>
      </label>
    </div>
  </div>
</template>

<style scoped>
.a2-choice {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.a2-choice__label {
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--a2ui-text-secondary);
}
.a2-choice__search {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1.5px solid var(--a2ui-border);
  background: var(--a2ui-input-bg);
  color: var(--a2ui-text);
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.a2-choice__search:focus {
  border-color: var(--a2ui-primary);
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
}
/* Chips */
.a2-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.a2-chip {
  padding: 6px 16px;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1.5px solid var(--a2ui-border);
  background: var(--a2ui-bg-surface);
  color: var(--a2ui-text-secondary);
  cursor: pointer;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}
.a2-chip:hover {
  border-color: var(--a2ui-primary);
  color: var(--a2ui-primary);
}
.a2-chip--selected {
  background: linear-gradient(135deg, #7c3aed, #4f46e5);
  border-color: transparent;
  color: white;
  box-shadow: 0 2px 8px rgba(124, 58, 237, 0.3);
}
/* Radio / Checkbox list */
.a2-choice__list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.a2-radio {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
}
.a2-radio__circle {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1.5px solid var(--a2ui-border);
  background: var(--a2ui-input-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s ease;
}
.a2-radio:hover .a2-radio__circle {
  border-color: var(--a2ui-primary);
}
.a2-radio__circle--selected {
  border-color: var(--a2ui-primary);
  background: var(--a2ui-primary);
}
.a2-radio__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: white;
  animation: dot-in 0.12s ease;
}
@keyframes dot-in {
  from { transform: scale(0); }
  to { transform: scale(1); }
}
.a2-checkbox-box {
  width: 18px;
  height: 18px;
  border-radius: 5px;
  border: 1.5px solid var(--a2ui-border);
  background: var(--a2ui-input-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s ease;
}
.a2-radio:hover .a2-checkbox-box {
  border-color: var(--a2ui-primary);
}
.a2-checkbox-box--checked {
  background: linear-gradient(135deg, #7c3aed, #4f46e5);
  border-color: transparent;
}
.a2-choice__opt-label {
  font-size: 0.9375rem;
  color: var(--a2ui-text);
}
</style>
