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

const valuePath = computed(() => (props.definition as any).dataPath ?? getValuePath(valueField.value))

const resolvedLabel = computed(() => resolve(props.definition.label))

// Support both v0.10 (value) and v0.8 (text) field names
const valueField = computed(() => (props.definition as any).value ?? (props.definition as any).text)
const resolvedValue = computed(() => resolve(valueField.value))

// Support both v0.10 (variant) and v0.8 (textFieldType) field names
const variant = computed(() => {
  const v = (props.definition as any).variant ?? (props.definition as any).textFieldType ?? 'shortText'
  return v as string
})
const isFocused = ref(false)
const showPassword = ref(false)

const isFloating = computed(() => isFocused.value || String(resolvedValue.value).length > 0)

const inputType = computed(() => {
  if (variant.value === 'number') return 'number'
  if (variant.value === 'obscured') return showPassword.value ? 'text' : 'password'
  return 'text'
})

const onInput = (e: Event) => {
  const target = e.target as HTMLInputElement | HTMLTextAreaElement
  const path = valuePath.value
  if (path) {
    const val = variant.value === 'number' ? Number(target.value) : target.value
    updateValue(path, val)
  }
}
</script>

<template>
  <div class="a2-field">
    <!-- Textarea for longText -->
    <div v-if="variant === 'longText'" class="a2-field-wrap">
      <textarea
        :value="resolvedValue as string"
        @input="onInput"
        @focus="isFocused = true"
        @blur="isFocused = false"
        class="a2-input a2-textarea"
        :class="{ 'a2-input--focused': isFocused, 'a2-input--filled': isFloating }"
        rows="4"
        placeholder=""
      />
      <label v-if="resolvedLabel" class="a2-label" :class="{ 'a2-label--floating': isFloating }">
        {{ resolvedLabel }}
      </label>
    </div>

    <!-- Regular input -->
    <div v-else class="a2-field-wrap">
      <input
        :type="inputType"
        :value="resolvedValue as string"
        @input="onInput"
        @focus="isFocused = true"
        @blur="isFocused = false"
        class="a2-input"
        :class="{ 'a2-input--focused': isFocused, 'a2-input--filled': isFloating, 'a2-input--has-icon': variant === 'obscured' }"
        placeholder=""
      />
      <label v-if="resolvedLabel" class="a2-label" :class="{ 'a2-label--floating': isFloating }">
        {{ resolvedLabel }}
      </label>
      <!-- Password toggle -->
      <button
        v-if="variant === 'obscured'"
        type="button"
        class="a2-field-icon"
        @click="showPassword = !showPassword"
        :title="showPassword ? 'Hide' : 'Show'"
      >
        <span class="material-icons" style="font-size: 18px; color: var(--a2ui-text-secondary)">
          {{ showPassword ? 'visibility_off' : 'visibility' }}
        </span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.a2-field {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.a2-field-wrap {
  position: relative;
}
.a2-input {
  width: 100%;
  padding: 18px 14px 6px;
  border-radius: 10px;
  border: 1.5px solid var(--a2ui-border);
  background: var(--a2ui-input-bg);
  color: var(--a2ui-text);
  font-size: 0.9375rem;
  line-height: 1.4;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  box-sizing: border-box;
}
.a2-input::placeholder {
  color: var(--a2ui-text-secondary);
  opacity: 0.6;
}
.a2-input--focused {
  border-color: var(--a2ui-primary);
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
}
.a2-input--has-icon {
  padding-right: 40px;
}
.a2-textarea {
  resize: vertical;
  min-height: 100px;
}
.a2-label {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.9375rem;
  color: var(--a2ui-text-secondary);
  pointer-events: none;
  transition: transform 0.15s ease, font-size 0.15s ease, color 0.15s ease;
  transform-origin: left center;
}
/* Textarea label positioning */
.a2-textarea + .a2-label,
.a2-field-wrap:has(.a2-textarea) .a2-label {
  top: 18px;
  transform: none;
}
.a2-label--floating {
  transform: translateY(-110%) scale(0.78);
  font-size: 0.9375rem;
  color: var(--a2ui-primary);
  font-weight: 500;
}
/* When textarea is used, floating label adjusts differently */
.a2-field-wrap:has(.a2-textarea) .a2-label--floating {
  transform: translateY(-100%) scale(0.78);
}
.a2-field-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
}
.a2-field-icon:hover {
  background: rgba(0,0,0,0.05);
}
</style>
