<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue'
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

// Support both url and src field names
const resolvedUrl = computed(() =>
  resolve((props.definition as any).url ?? (props.definition as any).src)
)

const alt = computed(() => {
  const a = (props.definition as any).alt ?? (props.definition as any).accessibility?.label
  return a ? resolve(a) : ''
})

const fitClass = computed(() => {
  const map: Record<string, string> = {
    contain: 'object-contain',
    cover: 'object-cover',
    fill: 'object-fill',
    none: 'object-none',
    scaleDown: 'object-scale-down',
  }
  const fit = ((props.definition as any).fit as string) ?? 'cover'
  return map[fit] ?? 'object-cover'
})

const variant = computed(() =>
  ((props.definition as any).variant ?? (props.definition as any).usageHint ?? 'mediumFeature') as string
)

const borderRadius = computed(() => {
  const r = (props.definition as any).borderRadius
  if (r) return typeof r === 'number' ? `${r}px` : String(r)
  const map: Record<string, string> = {
    avatar: '50%',
    icon: '8px',
    smallFeature: '12px',
    mediumFeature: '14px',
    largeFeature: '14px',
    header: '0px',
    cover: '0px',
    banner: '0px',
  }
  return map[variant.value] ?? '14px'
})

const isLoaded = ref(false)
const hasError = ref(false)

watch(resolvedUrl, () => {
  isLoaded.value = false
  hasError.value = false
})

const onLoad = () => { isLoaded.value = true }
const onError = () => { hasError.value = true; isLoaded.value = true }
</script>

<template>
  <div class="a2-image-wrap" :class="`a2-image-wrap--${variant}`" :style="{ borderRadius }">

    <!-- Shimmer while loading -->
    <div v-if="!isLoaded && resolvedUrl && !hasError" class="a2-image-skeleton" />

    <!-- No URL placeholder -->
    <div v-if="!resolvedUrl" class="a2-image-placeholder">
      <span class="material-icons" style="font-size: 28px; opacity: 0.35">image</span>
    </div>

    <!-- Error state -->
    <div v-else-if="hasError" class="a2-image-error">
      <span class="material-icons" style="font-size: 28px">broken_image</span>
      <span class="a2-image-error-text">Failed to load</span>
    </div>

    <!-- Actual image -->
    <img
      v-else
      :src="resolvedUrl"
      :class="[fitClass, 'a2-image', { 'a2-image--loaded': isLoaded }]"
      :alt="alt"
      loading="lazy"
      @load="onLoad"
      @error="onError"
    />
  </div>
</template>

<style scoped>
.a2-image-wrap {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--a2ui-bg-hover);
  flex-shrink: 0;
}

/* ── Variant sizing ── */
.a2-image-wrap--icon       { width: 2rem;  height: 2rem; }
.a2-image-wrap--avatar     { width: 4rem;  height: 4rem;
  box-shadow: 0 0 0 3px rgba(255,255,255,0.55), 0 4px 12px rgba(0,0,0,0.12); }
.a2-image-wrap--smallFeature { width: 6rem; height: 6rem; }
.a2-image-wrap--mediumFeature { width: 100%; aspect-ratio: 16 / 9; flex-shrink: unset; }
.a2-image-wrap--largeFeature  { width: 100%; aspect-ratio: 4 / 3;  flex-shrink: unset; }
.a2-image-wrap--header        { width: 100%; aspect-ratio: 21 / 9; flex-shrink: unset; border-radius: 0 !important; }
.a2-image-wrap--cover         { width: 100%; height: 100%;          flex-shrink: unset; border-radius: 0 !important; }
.a2-image-wrap--banner        { width: 100%; aspect-ratio: 3 / 1;  flex-shrink: unset; border-radius: 0 !important; }

/* ── Image ── */
.a2-image {
  width: 100%;
  height: 100%;
  display: block;
  opacity: 0;
  transition: opacity 0.35s ease;
}
.a2-image--loaded { opacity: 1; }

/* ── Shimmer skeleton ── */
.a2-image-skeleton {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    var(--a2ui-bg-hover) 0%,
    var(--a2ui-bg-surface) 45%,
    var(--a2ui-bg-hover) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.6s ease-in-out infinite;
}
@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── Placeholder (no URL) ── */
.a2-image-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--a2ui-text-secondary);
}

/* ── Error state ── */
.a2-image-error {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background: var(--a2ui-bg-hover);
  color: var(--a2ui-text-secondary);
}
.a2-image-error-text {
  font-size: 0.75rem;
}
</style>
