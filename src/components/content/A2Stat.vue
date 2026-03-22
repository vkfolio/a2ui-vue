<script setup lang="ts">
import { computed, inject } from 'vue'
import type { ComponentDefinition } from '../../types'

const props = defineProps<{
  definition: ComponentDefinition
  surfaceId: string
}>()

const dataModel = inject('a2ui-data-model') as any

const resolve = (val: any): string => {
  if (!val && val !== 0) return ''
  if (typeof val === 'string') return val
  if (typeof val === 'number') return String(val)
  if (val.literalString !== undefined) return String(val.literalString)
  if (val.path) return String(dataModel?.getPath(props.surfaceId, val.path) ?? '')
  return String(val)
}

const value = computed(() => resolve((props.definition as any).value ?? props.definition.text))
const label = computed(() => resolve((props.definition as any).label ?? ''))
const trend = computed(() => resolve((props.definition as any).trend ?? ''))
const trendDirection = computed(() => ((props.definition as any).trendDirection ?? 'neutral') as string)
const icon = computed(() => resolve((props.definition as any).icon ?? ''))
</script>

<template>
  <div class="a2-stat">
    <!-- Icon (optional) -->
    <div v-if="icon" class="a2-stat__icon-wrap">
      <span class="material-icons a2-stat__icon">{{ icon }}</span>
    </div>
    <!-- Value -->
    <p class="a2-stat__value">{{ value }}</p>
    <!-- Label -->
    <p v-if="label" class="a2-stat__label">{{ label }}</p>
    <!-- Trend -->
    <div v-if="trend" class="a2-stat__trend" :class="`a2-stat__trend--${trendDirection}`">
      <span class="material-icons a2-stat__trend-icon">
        {{ trendDirection === 'up' ? 'trending_up' : trendDirection === 'down' ? 'trending_down' : 'trending_flat' }}
      </span>
      <span>{{ trend }}</span>
    </div>
  </div>
</template>

<style scoped>
.a2-stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;
}
.a2-stat__icon-wrap {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(124, 58, 237, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}
.a2-stat__icon {
  font-size: 20px;
  color: var(--a2ui-primary);
}
.a2-stat__value {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1;
  color: var(--a2ui-text);
}
.a2-stat__label {
  margin: 0;
  font-size: 0.8125rem;
  color: var(--a2ui-text-secondary);
  font-weight: 500;
}
.a2-stat__trend {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 0.8125rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 50px;
  width: fit-content;
  margin-top: 2px;
}
.a2-stat__trend-icon {
  font-size: 14px;
}
.a2-stat__trend--up {
  background: rgba(16, 185, 129, 0.12);
  color: #059669;
}
.a2-stat__trend--down {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}
.a2-stat__trend--neutral {
  background: rgba(107, 114, 128, 0.1);
  color: #6b7280;
}
</style>
