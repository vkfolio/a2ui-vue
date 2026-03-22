<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue'
import type { ComponentDefinition } from '../../types'

const props = defineProps<{
  definition: ComponentDefinition
  surfaceId: string
}>()

const dataModel = inject('a2ui-data-model') as any

const resolve = (val: any) => {
  if (val === undefined || val === null) return ''
  if (typeof val === 'string') return val
  if (typeof val === 'number') return val
  if (val.literalString !== undefined) return val.literalString
  if (val.path) return dataModel?.getPath(props.surfaceId, val.path) ?? ''
  return val
}

const rawValue = computed(() => {
  const v = resolve((props.definition as any).value ?? props.definition.label)
  return typeof v === 'number' ? v : Number(v) || 0
})

const clampedValue = computed(() => Math.min(100, Math.max(0, rawValue.value)))

const label = computed(() => {
  const l = (props.definition as any).label
  return l ? String(resolve(l)) : ''
})

const variant = computed(() => ((props.definition as any).variant ?? 'linear') as string)

// Animate fill on mount
const displayValue = ref(0)
onMounted(() => {
  requestAnimationFrame(() => {
    setTimeout(() => { displayValue.value = clampedValue.value }, 50)
  })
})

// Circular SVG
const radius = 36
const circumference = 2 * Math.PI * radius
const strokeDash = computed(() => {
  const offset = circumference - (displayValue.value / 100) * circumference
  return `${circumference - (displayValue.value / 100) * circumference} ${circumference}`
})
</script>

<template>
  <!-- Circular -->
  <div v-if="variant === 'circular'" class="a2-progress a2-progress--circular">
    <svg width="96" height="96" viewBox="0 0 96 96">
      <!-- Track -->
      <circle cx="48" cy="48" :r="radius" fill="none" stroke="var(--a2ui-border)" stroke-width="6" />
      <!-- Fill -->
      <circle
        cx="48" cy="48" :r="radius"
        fill="none"
        stroke="url(#progress-grad)"
        stroke-width="6"
        stroke-linecap="round"
        :stroke-dasharray="`${(displayValue / 100) * circumference} ${circumference}`"
        :stroke-dashoffset="0"
        transform="rotate(-90 48 48)"
        style="transition: stroke-dasharray 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
      />
      <defs>
        <linearGradient id="progress-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#7c3aed" />
          <stop offset="100%" stop-color="#4f46e5" />
        </linearGradient>
      </defs>
      <!-- Value text -->
      <text x="48" y="52" text-anchor="middle" font-size="16" font-weight="700" fill="var(--a2ui-text)">
        {{ Math.round(displayValue) }}%
      </text>
    </svg>
    <p v-if="label" class="a2-progress__label">{{ label }}</p>
  </div>

  <!-- Linear (default) -->
  <div v-else class="a2-progress">
    <div v-if="label || clampedValue >= 0" class="a2-progress__header">
      <span v-if="label" class="a2-progress__label-text">{{ label }}</span>
      <span class="a2-progress__pct">{{ Math.round(clampedValue) }}%</span>
    </div>
    <div class="a2-progress__track">
      <div
        class="a2-progress__fill"
        :style="{ width: `${displayValue}%`, transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }"
      />
    </div>
  </div>
</template>

<style scoped>
.a2-progress {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.a2-progress--circular {
  align-items: center;
}
.a2-progress__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.a2-progress__label-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--a2ui-text);
}
.a2-progress__pct {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--a2ui-primary);
}
.a2-progress__track {
  height: 6px;
  border-radius: 3px;
  background: var(--a2ui-border);
  overflow: hidden;
}
.a2-progress__fill {
  height: 100%;
  background: linear-gradient(90deg, #7c3aed, #4f46e5);
  border-radius: 3px;
}
.a2-progress__label {
  font-size: 0.8125rem;
  color: var(--a2ui-text-secondary);
  margin: 0;
  text-align: center;
}
</style>
