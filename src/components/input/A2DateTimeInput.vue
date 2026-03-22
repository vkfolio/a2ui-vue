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

const isFocused = ref(false)
const isFloating = computed(() => isFocused.value || resolvedValue.value !== '')

const onInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  const path = getValuePath(props.definition.value)
  if (path) updateValue(path, target.value)
}
</script>

<template>
  <div class="a2-dt-field">
    <div class="a2-dt-wrap">
      <input
        :type="inputType"
        :value="resolvedValue"
        @input="onInput"
        @focus="isFocused = true"
        @blur="isFocused = false"
        :min="resolvedMin"
        :max="resolvedMax"
        class="a2-dt-input"
        :class="{ 'a2-dt-input--focused': isFocused, 'a2-dt-input--filled': isFloating }"
      />
      <label v-if="resolvedLabel" class="a2-dt-label" :class="{ 'a2-dt-label--floating': isFloating }">
        {{ resolvedLabel }}
      </label>
      <span class="material-icons a2-dt-icon">
        {{ inputType === 'time' ? 'schedule' : 'calendar_today' }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.a2-dt-field {
  display: flex;
  flex-direction: column;
}
.a2-dt-wrap {
  position: relative;
}
.a2-dt-input {
  width: 100%;
  padding: 18px 40px 6px 14px;
  border-radius: 10px;
  border: 1.5px solid var(--a2ui-border);
  background: var(--a2ui-input-bg);
  color: var(--a2ui-text);
  font-size: 0.9375rem;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  box-sizing: border-box;
  appearance: none;
  -webkit-appearance: none;
}
.a2-dt-input::-webkit-calendar-picker-indicator {
  opacity: 0;
  position: absolute;
  right: 0;
  width: 40px;
  height: 100%;
  cursor: pointer;
}
.a2-dt-input--focused {
  border-color: var(--a2ui-primary);
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
}
.a2-dt-label {
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
.a2-dt-label--floating {
  transform: translateY(-110%) scale(0.78);
  color: var(--a2ui-primary);
  font-weight: 500;
}
.a2-dt-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  color: var(--a2ui-text-secondary);
  pointer-events: none;
}
</style>
