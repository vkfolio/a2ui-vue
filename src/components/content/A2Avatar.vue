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

const src  = computed(() => resolve((props.definition as any).src))
const name = computed(() => resolve((props.definition as any).name ?? ''))
const size = computed(() => ((props.definition as any).size ?? 'md') as string)
const status = computed(() => ((props.definition as any).status ?? '') as string)

const initials = computed(() => {
  const n = name.value.trim()
  if (!n) return '?'
  const parts = n.split(/\s+/)
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
})

const gradients = [
  'linear-gradient(135deg, #7c3aed, #4f46e5)',
  'linear-gradient(135deg, #ec4899, #f97316)',
  'linear-gradient(135deg, #06b6d4, #3b82f6)',
  'linear-gradient(135deg, #10b981, #059669)',
  'linear-gradient(135deg, #f59e0b, #ef4444)',
  'linear-gradient(135deg, #8b5cf6, #ec4899)',
  'linear-gradient(135deg, #14b8a6, #6366f1)',
]

const gradientIndex = computed(() => {
  const n = name.value
  let h = 0
  for (let i = 0; i < n.length; i++) h = n.charCodeAt(i) + ((h << 5) - h)
  return Math.abs(h) % gradients.length
})

const bgGradient = computed(() => gradients[gradientIndex.value])

// Pixel dimensions per size
const sizePx: Record<string, number> = { xs: 24, sm: 32, md: 40, lg: 56, xl: 80 }
const fontPx: Record<string, string>  = { xs: '10px', sm: '12px', md: '14px', lg: '20px', xl: '28px' }
// Status dot diameter per size (fixed px — never percentage)
const dotPx: Record<string, number>   = { xs: 7, sm: 9, md: 10, lg: 13, xl: 16 }

const px      = computed(() => sizePx[size.value] ?? 40)
const dot     = computed(() => dotPx[size.value] ?? 10)
// Padding added around the circle so the dot can overflow into it
const padding = computed(() => Math.ceil(dot.value * 0.4))

const imgLoaded = ref(false)
const imgError  = ref(false)
const showImage = computed(() => src.value && !imgError.value)
</script>

<template>
  <!--
    Outer shell: sized to (circle + padding on each side) so the absolutely-
    positioned status dot has room to overflow outside the circle without
    being clipped by the flex row. overflow:visible is the default.
  -->
  <div
    class="a2-avatar-shell"
    :style="{
      width:  `${px + padding * 2}px`,
      height: `${px + padding * 2}px`,
      padding: `${padding}px`,
    }"
  >
    <!-- Circle: clips the image but NOT the dot -->
    <div
      class="a2-avatar-circle"
      :style="{
        width:    `${px}px`,
        height:   `${px}px`,
        fontSize: fontPx[size] ?? '14px',
      }"
    >
      <img
        v-if="showImage"
        :src="src"
        :alt="name"
        class="a2-avatar__img"
        :class="{ 'a2-avatar__img--loaded': imgLoaded }"
        @load="imgLoaded = true"
        @error="imgError = true"
      />
      <span v-else class="a2-avatar__initials" :style="{ background: bgGradient }">
        {{ initials }}
      </span>
    </div>

    <!-- Status dot — absolutely positioned on the shell (not the circle) -->
    <span
      v-if="status"
      class="a2-avatar__status"
      :class="`a2-avatar__status--${status}`"
      :style="{
        width:  `${dot}px`,
        height: `${dot}px`,
        /* bottom-right corner of the circle, sitting on the padding area */
        bottom: `${padding - Math.ceil(dot * 0.3)}px`,
        right:  `${padding - Math.ceil(dot * 0.3)}px`,
      }"
    />
  </div>
</template>

<style scoped>
/* Shell: transparent, sized wider than the circle to absorb the dot overflow.
   position:relative is the containing block for the dot. */
.a2-avatar-shell {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-sizing: border-box;
}

/* Circle: clips only the image/initials, not the dot */
.a2-avatar-circle {
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  /* ring */
  box-shadow:
    0 0 0 2.5px var(--a2ui-bg-surface, #fff),
    0 2px 8px rgba(0, 0, 0, 0.14);
}

.a2-avatar__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.a2-avatar__img--loaded { opacity: 1; }

.a2-avatar__initials {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  letter-spacing: 0.02em;
  user-select: none;
}

/* Status dot */
.a2-avatar__status {
  position: absolute;
  border-radius: 50%;
  border: 2px solid var(--a2ui-bg-surface, #fff);
  box-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.08);
}
.a2-avatar__status--online  { background: #22c55e; }
.a2-avatar__status--offline { background: #9ca3af; }
.a2-avatar__status--away    { background: #f59e0b; }
.a2-avatar__status--busy    { background: #ef4444; }
</style>
