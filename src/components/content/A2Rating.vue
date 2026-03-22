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
  if (val === undefined || val === null) return 0
  if (typeof val === 'number') return val
  if (typeof val === 'string') return Number(val) || 0
  if (val.literalString !== undefined) return Number(val.literalString) || 0
  if (val.path) return Number(dataModel?.getPath(props.surfaceId, val.path)) || 0
  return 0
}

const rawValue = computed(() => resolve((props.definition as any).value ?? props.definition.label))
const maxStars = computed(() => Number((props.definition as any).maxStars ?? 5))
const label = computed(() => (props.definition as any).label ?? '')
const isInteractive = computed(() => !!(props.definition as any).interactive)

const hoverIndex = ref(-1)
const displayValue = computed(() => hoverIndex.value >= 0 ? hoverIndex.value + 1 : rawValue.value)

const getStarType = (i: number): 'full' | 'half' | 'empty' => {
  const val = displayValue.value
  if (i + 1 <= val) return 'full'
  if (i < val && i + 1 > val) return 'half'
  return 'empty'
}

const rate = (i: number) => {
  if (!isInteractive.value) return
  const action = (props.definition as any).action
  if (action?.event) {
    surface?.emitAction(action.event.name, props.surfaceId, props.definition.id, { rating: i + 1 })
  }
}
</script>

<template>
  <div class="a2-rating">
    <div class="a2-rating__stars">
      <button
        v-for="i in maxStars"
        :key="i"
        class="a2-rating__star"
        :class="{ 'a2-rating__star--interactive': isInteractive }"
        @mouseenter="isInteractive && (hoverIndex = i - 1)"
        @mouseleave="isInteractive && (hoverIndex = -1)"
        @click="rate(i - 1)"
        :disabled="!isInteractive"
      >
        <span class="material-icons" :class="`a2-star--${getStarType(i - 1)}`">
          {{ getStarType(i - 1) === 'full' ? 'star' : getStarType(i - 1) === 'half' ? 'star_half' : 'star_outline' }}
        </span>
      </button>
    </div>
    <span v-if="label" class="a2-rating__label">{{ label }}</span>
    <span class="a2-rating__value">{{ rawValue.toFixed(1) }}</span>
  </div>
</template>

<style scoped>
.a2-rating {
  display: flex;
  align-items: center;
  gap: 6px;
}
.a2-rating__stars {
  display: flex;
  align-items: center;
  gap: 1px;
}
.a2-rating__star {
  background: none;
  border: none;
  padding: 2px;
  cursor: default;
  display: flex;
  align-items: center;
  line-height: 1;
  transition: transform 0.1s ease;
}
.a2-rating__star--interactive {
  cursor: pointer;
}
.a2-rating__star--interactive:hover {
  transform: scale(1.15);
}
.a2-star--full,
.a2-star--half {
  color: #f59e0b;
  font-size: 20px;
}
.a2-star--empty {
  color: var(--a2ui-border);
  font-size: 20px;
}
.a2-rating__label {
  font-size: 0.875rem;
  color: var(--a2ui-text-secondary);
}
.a2-rating__value {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--a2ui-text);
}
</style>
