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
const resolvedValue = computed(() => {
  const v = resolve(props.definition.value)
  return typeof v === 'number' ? v : Number(v) || 0
})
const min = computed(() => (props.definition.min as number) ?? 0)
const max = computed(() => (props.definition.max as number) ?? 100)

const fillPercent = computed(() => {
  const range = max.value - min.value
  if (range === 0) return 0
  return ((resolvedValue.value - min.value) / range) * 100
})

const isDragging = ref(false)

const onInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  const path = getValuePath(props.definition.value)
  if (path) updateValue(path, Number(target.value))
}
</script>

<template>
  <div class="a2-slider">
    <div class="a2-slider__header">
      <span class="a2-slider__label">{{ resolvedLabel }}</span>
      <span class="a2-slider__value">{{ resolvedValue }}</span>
    </div>
    <div class="a2-slider__track-wrap">
      <div class="a2-slider__track">
        <div class="a2-slider__fill" :style="{ width: `${fillPercent}%` }" />
      </div>
      <input
        type="range"
        :min="min"
        :max="max"
        :value="resolvedValue"
        @input="onInput"
        @mousedown="isDragging = true"
        @mouseup="isDragging = false"
        @touchstart="isDragging = true"
        @touchend="isDragging = false"
        class="a2-slider__input"
      />
    </div>
    <div class="a2-slider__limits">
      <span>{{ min }}</span>
      <span>{{ max }}</span>
    </div>
  </div>
</template>

<style scoped>
.a2-slider {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.a2-slider__header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
.a2-slider__label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--a2ui-text);
}
.a2-slider__value {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--a2ui-primary);
  background: rgba(124, 58, 237, 0.08);
  padding: 2px 8px;
  border-radius: 50px;
  min-width: 32px;
  text-align: center;
}
.a2-slider__track-wrap {
  position: relative;
  height: 20px;
  display: flex;
  align-items: center;
}
.a2-slider__track {
  position: absolute;
  left: 0;
  right: 0;
  height: 4px;
  border-radius: 2px;
  background: var(--a2ui-border);
  overflow: hidden;
}
.a2-slider__fill {
  height: 100%;
  background: linear-gradient(90deg, #7c3aed, #4f46e5);
  border-radius: 2px;
  transition: width 0.05s linear;
}
.a2-slider__input {
  position: relative;
  width: 100%;
  height: 20px;
  background: transparent;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  outline: none;
  z-index: 1;
}
.a2-slider__input::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  border: 2px solid #7c3aed;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.15);
  transition: transform 0.1s ease, box-shadow 0.1s ease;
  cursor: grab;
}
.a2-slider__input::-webkit-slider-thumb:hover,
.a2-slider__input:active::-webkit-slider-thumb {
  transform: scale(1.15);
  box-shadow: 0 2px 10px rgba(124, 58, 237, 0.35);
  cursor: grabbing;
}
.a2-slider__input::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  border: 2px solid #7c3aed;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.15);
  cursor: grab;
}
.a2-slider__limits {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--a2ui-text-secondary);
}
</style>
