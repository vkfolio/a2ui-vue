<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import type { ComponentDefinition } from '../../types'

const props = defineProps<{
  definition: ComponentDefinition
  surfaceId: string
}>()

const dataModel = inject('a2ui-data-model') as any

const resolve = (val: any): string => {
  if (!val) return ''
  if (typeof val === 'string') return val
  if (val.literalString !== undefined) return String(val.literalString)
  if (val.path) return String(dataModel?.getPath(props.surfaceId, val.path) ?? '')
  return String(val)
}

const message = computed(() => resolve((props.definition as any).message ?? props.definition.text))
const title = computed(() => resolve((props.definition as any).title ?? ''))
const severity = computed(() => ((props.definition as any).severity ?? 'info') as string)
const dismissible = computed(() => !!(props.definition as any).dismissible)

const dismissed = ref(false)

const iconMap: Record<string, string> = {
  info: 'info_outline',
  success: 'check_circle_outline',
  warning: 'warning_amber',
  error: 'error_outline',
}

const icon = computed(() => iconMap[severity.value] ?? 'info_outline')
</script>

<template>
  <div
    v-if="!dismissed"
    class="a2-alert"
    :class="`a2-alert--${severity}`"
  >
    <span class="material-icons a2-alert__icon">{{ icon }}</span>
    <div class="a2-alert__body">
      <p v-if="title" class="a2-alert__title">{{ title }}</p>
      <p class="a2-alert__message">{{ message }}</p>
    </div>
    <button
      v-if="dismissible"
      class="a2-alert__dismiss"
      @click="dismissed = true"
      aria-label="Dismiss"
    >
      <span class="material-icons" style="font-size: 16px">close</span>
    </button>
  </div>
</template>

<style scoped>
.a2-alert {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 10px;
  border-left: 4px solid;
}
.a2-alert__icon {
  font-size: 20px;
  flex-shrink: 0;
  margin-top: 1px;
}
.a2-alert__body {
  flex: 1;
  min-width: 0;
}
.a2-alert__title {
  margin: 0 0 2px;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.3;
}
.a2-alert__message {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
  opacity: 0.85;
}
.a2-alert__dismiss {
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  opacity: 0.6;
  transition: opacity 0.15s;
  flex-shrink: 0;
}
.a2-alert__dismiss:hover { opacity: 1; }

/* Severity colors */
.a2-alert--info {
  background: rgba(124, 58, 237, 0.06);
  border-color: #7c3aed;
  color: var(--a2ui-text);
}
.a2-alert--info .a2-alert__icon { color: #7c3aed; }

.a2-alert--success {
  background: rgba(16, 185, 129, 0.08);
  border-color: #10b981;
  color: var(--a2ui-text);
}
.a2-alert--success .a2-alert__icon { color: #10b981; }

.a2-alert--warning {
  background: rgba(245, 158, 11, 0.08);
  border-color: #f59e0b;
  color: var(--a2ui-text);
}
.a2-alert--warning .a2-alert__icon { color: #d97706; }

.a2-alert--error {
  background: rgba(239, 68, 68, 0.08);
  border-color: #ef4444;
  color: var(--a2ui-text);
}
.a2-alert--error .a2-alert__icon { color: #ef4444; }
</style>
