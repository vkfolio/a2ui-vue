<script setup lang="ts">
import { computed, inject } from 'vue'
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
const resolvedValue = computed(() => !!resolve(props.definition.value))

const onToggle = () => {
  const path = getValuePath(props.definition.value)
  if (path) updateValue(path, !resolvedValue.value)
}
</script>

<template>
  <label class="a2-checkbox" @click.prevent="onToggle">
    <input
      type="checkbox"
      :checked="resolvedValue"
      class="a2-checkbox__input"
      @change.prevent
    />
    <span class="a2-checkbox__box" :class="{ 'a2-checkbox__box--checked': resolvedValue }">
      <svg v-if="resolvedValue" class="a2-checkbox__check" viewBox="0 0 12 9" fill="none">
        <path d="M1 4L4.5 7.5L11 1" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </span>
    <span class="a2-checkbox__label">{{ resolvedLabel }}</span>
  </label>
</template>

<style scoped>
.a2-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
}
.a2-checkbox__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}
.a2-checkbox__box {
  width: 18px;
  height: 18px;
  border-radius: 5px;
  border: 1.5px solid var(--a2ui-border);
  background: var(--a2ui-input-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}
.a2-checkbox:hover .a2-checkbox__box {
  border-color: var(--a2ui-primary);
}
.a2-checkbox__box--checked {
  background: linear-gradient(135deg, #7c3aed, #4f46e5);
  border-color: transparent;
  box-shadow: 0 2px 8px rgba(124, 58, 237, 0.3);
}
.a2-checkbox__check {
  width: 12px;
  height: 9px;
}
.a2-checkbox__label {
  font-size: 0.9375rem;
  color: var(--a2ui-text);
  line-height: 1.4;
}
</style>
