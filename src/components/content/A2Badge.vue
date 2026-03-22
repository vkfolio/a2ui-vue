<script setup lang="ts">
import { computed, inject } from 'vue'
import type { ComponentDefinition } from '../../types'

const props = defineProps<{
  definition: ComponentDefinition
  surfaceId: string
}>()

const dataModel = inject('a2ui-data-model') as any

const resolve = (val: any): string => {
  if (!val) return ''
  if (typeof val === 'string') return val
  if (typeof val === 'number') return String(val)
  if (val.literalString !== undefined) return String(val.literalString)
  if (val.path) return String(dataModel?.getPath(props.surfaceId, val.path) ?? '')
  return String(val)
}

const label = computed(() => resolve(props.definition.label ?? (props.definition as any).text))
const variant = computed(() => ((props.definition as any).variant ?? 'neutral') as string)
</script>

<template>
  <span class="a2-badge" :class="`a2-badge--${variant}`">
    <span class="a2-badge__dot" />
    {{ label }}
  </span>
</template>

<style scoped>
.a2-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  white-space: nowrap;
}
.a2-badge__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
/* Variants */
.a2-badge--neutral {
  background: rgba(107, 114, 128, 0.12);
  color: #6b7280;
}
.a2-badge--neutral .a2-badge__dot { background: #9ca3af; }

.a2-badge--success {
  background: rgba(16, 185, 129, 0.12);
  color: #059669;
}
.a2-badge--success .a2-badge__dot { background: #10b981; }

.a2-badge--warning {
  background: rgba(245, 158, 11, 0.12);
  color: #d97706;
}
.a2-badge--warning .a2-badge__dot { background: #f59e0b; }

.a2-badge--error {
  background: rgba(239, 68, 68, 0.12);
  color: #dc2626;
}
.a2-badge--error .a2-badge__dot { background: #ef4444; }

.a2-badge--info {
  background: rgba(124, 58, 237, 0.1);
  color: #7c3aed;
}
.a2-badge--info .a2-badge__dot { background: #7c3aed; }

.a2-badge--primary {
  background: linear-gradient(135deg, #7c3aed, #4f46e5);
  color: white;
}
.a2-badge--primary .a2-badge__dot { background: rgba(255,255,255,0.7); }
</style>
