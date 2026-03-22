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
  if (typeof val === 'number') return String(val)
  if (val.literalString !== undefined) return String(val.literalString)
  if (val.path) return String(dataModel?.getPath(props.surfaceId, val.path) ?? '')
  return ''
}

const resolvedUrl = computed(() => resolve((props.definition as any).url  ?? (props.definition as any).src))
const title       = computed(() => resolve((props.definition as any).title ?? (props.definition as any).description ?? (props.definition as any).label))
const artist      = computed(() => resolve((props.definition as any).artist ?? (props.definition as any).subtitle))
const coverArt    = computed(() => resolve((props.definition as any).cover ?? (props.definition as any).image ?? (props.definition as any).thumbnail))

// ── State ──────────────────────────────────────────────────────────────────
const audioEl    = ref<HTMLAudioElement | null>(null)
const isPlaying  = ref(false)
const isLoading  = ref(false)
const hasError   = ref(false)
const currentTime = ref(0)
const duration   = ref(0)
const volume     = ref(1)
const isMuted    = ref(false)
const showVolume = ref(false)

// ── Computed ───────────────────────────────────────────────────────────────
const progress = computed(() => duration.value ? (currentTime.value / duration.value) * 100 : 0)

const volumeIcon = computed(() => {
  if (isMuted.value || volume.value === 0) return 'volume_off'
  if (volume.value < 0.4) return 'volume_down'
  return 'volume_up'
})

// ── Helpers ────────────────────────────────────────────────────────────────
const fmt = (s: number): string => {
  if (!s || isNaN(s)) return '0:00'
  const m   = Math.floor(s / 60)
  const sec = Math.floor(s % 60).toString().padStart(2, '0')
  return `${m}:${sec}`
}

// ── Actions ────────────────────────────────────────────────────────────────
const togglePlay = () => {
  const el = audioEl.value
  if (!el) return
  isPlaying.value ? el.pause() : el.play()
}

const toggleMute = () => {
  const el = audioEl.value
  if (!el) return
  el.muted = !el.muted
  isMuted.value = el.muted
}

const seek = (e: MouseEvent) => {
  const el  = audioEl.value
  const bar = e.currentTarget as HTMLElement
  if (!el || !bar || !el.duration) return
  const rect  = bar.getBoundingClientRect()
  const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
  el.currentTime = ratio * el.duration
}

const skip = (delta: number) => {
  const el = audioEl.value
  if (!el) return
  el.currentTime = Math.max(0, Math.min(el.duration || 0, el.currentTime + delta))
}

const setVolume = (e: Event) => {
  const el = audioEl.value
  if (!el) return
  const v   = Number((e.target as HTMLInputElement).value) / 100
  el.volume  = v
  volume.value = v
  isMuted.value = v === 0
  if (v > 0) el.muted = false
}

// ── Audio events ───────────────────────────────────────────────────────────
const onTimeUpdate      = () => { currentTime.value = audioEl.value?.currentTime ?? 0 }
const onLoadedMetadata  = () => { duration.value = audioEl.value?.duration ?? 0 }
const onCanPlay         = () => { isLoading.value = false }
const onWaiting         = () => { isLoading.value = true }
const onEnded           = () => { isPlaying.value = false; currentTime.value = 0 }
const onPlay            = () => { isPlaying.value = true }
const onPause           = () => { isPlaying.value = false }
const onError           = () => { hasError.value = true; isLoading.value = false }
const onVolumeChange    = () => {
  const el = audioEl.value
  if (el) { isMuted.value = el.muted; volume.value = el.volume }
}
</script>

<template>
  <div class="a2-audio">
    <!-- Hidden native audio -->
    <audio
      ref="audioEl"
      :src="resolvedUrl"
      preload="metadata"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
      @canplay="onCanPlay"
      @waiting="onWaiting"
      @ended="onEnded"
      @play="onPlay"
      @pause="onPause"
      @error="onError"
      @volumechange="onVolumeChange"
    />

    <!-- Error state -->
    <div v-if="hasError" class="a2-audio__error">
      <span class="material-icons" style="font-size: 18px">error_outline</span>
      Failed to load audio
    </div>

    <template v-else>
      <!-- Track row: cover + meta + volume -->
      <div class="a2-audio__track-row">

        <!-- Cover art / disc -->
        <div class="a2-audio__cover" :class="{ 'a2-audio__cover--spin': isPlaying }">
          <img v-if="coverArt" :src="coverArt" :alt="title || 'Cover'" class="a2-audio__cover-img" />
          <span v-else class="material-icons" style="font-size: 22px; color: white">music_note</span>
        </div>

        <!-- Title + artist -->
        <div class="a2-audio__meta">
          <div v-if="title" class="a2-audio__title">{{ title }}</div>
          <div v-if="artist" class="a2-audio__artist">{{ artist }}</div>
          <div v-if="!title && !artist" class="a2-audio__artist">Audio track</div>
        </div>

        <!-- Volume button + popup -->
        <div class="a2-audio__vol-wrap" @mouseenter="showVolume = true" @mouseleave="showVolume = false">
          <button class="a2-audio__icon-btn" @click="toggleMute">
            <span class="material-icons" style="font-size: 18px">{{ volumeIcon }}</span>
          </button>
          <Transition name="vol-pop">
            <div v-if="showVolume" class="a2-audio__vol-popup">
              <input
                type="range" min="0" max="100"
                :value="isMuted ? 0 : Math.round(volume * 100)"
                class="a2-audio__vol-slider"
                @input="setVolume"
              />
            </div>
          </Transition>
        </div>
      </div>

      <!-- Seek bar -->
      <div class="a2-audio__progress" @click="seek">
        <div class="a2-audio__progress-fill" :style="{ width: `${progress}%` }" />
        <div class="a2-audio__progress-thumb" :style="{ left: `${progress}%` }" />
      </div>

      <!-- Time labels -->
      <div class="a2-audio__times">
        <span>{{ fmt(currentTime) }}</span>
        <span>{{ fmt(duration) }}</span>
      </div>

      <!-- Playback controls -->
      <div class="a2-audio__controls">
        <button class="a2-audio__icon-btn" @click="skip(-10)" title="−10s">
          <span class="material-icons" style="font-size: 22px">replay_10</span>
        </button>

        <button class="a2-audio__play-btn" @click="togglePlay">
          <span v-if="isLoading" class="a2-audio__spinner" />
          <span v-else class="material-icons" style="font-size: 26px; color: white">
            {{ isPlaying ? 'pause' : 'play_arrow' }}
          </span>
        </button>

        <button class="a2-audio__icon-btn" @click="skip(10)" title="+10s">
          <span class="material-icons" style="font-size: 22px">forward_10</span>
        </button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.a2-audio {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ── Error ── */
.a2-audio__error {
  display: flex; align-items: center; gap: 6px;
  font-size: 0.8125rem; color: var(--a2ui-text-secondary);
  padding: 10px 12px; border-radius: 10px;
  background: var(--a2ui-bg-hover);
}

/* ── Track row ── */
.a2-audio__track-row {
  display: flex; align-items: center; gap: 12px;
}

/* ── Cover art ── */
.a2-audio__cover {
  width: 52px; height: 52px;
  border-radius: 10px;
  background: linear-gradient(135deg, #7c3aed, #4f46e5);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; overflow: hidden;
  box-shadow: 0 4px 14px rgba(124, 58, 237, 0.35);
  transition: border-radius 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.a2-audio__cover--spin {
  border-radius: 50%;
  animation: disc-spin 10s linear infinite;
}
@keyframes disc-spin { to { transform: rotate(360deg); } }

.a2-audio__cover-img {
  width: 100%; height: 100%; object-fit: cover;
}

/* ── Meta ── */
.a2-audio__meta { flex: 1; min-width: 0; }

.a2-audio__title {
  font-size: 0.9375rem; font-weight: 600;
  color: var(--a2ui-text);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.a2-audio__artist {
  font-size: 0.8125rem; color: var(--a2ui-text-secondary); margin-top: 2px;
}

/* ── Volume ── */
.a2-audio__vol-wrap { position: relative; flex-shrink: 0; }

.a2-audio__vol-popup {
  position: absolute;
  bottom: calc(100% + 10px); right: 0;
  background: var(--a2ui-card-bg);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid var(--a2ui-card-border);
  border-radius: 10px; padding: 10px 14px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.14);
  z-index: 20;
}
.a2-audio__vol-slider {
  width: 90px; accent-color: var(--a2ui-primary); cursor: pointer;
}

/* ── Seek bar ── */
.a2-audio__progress {
  position: relative; height: 4px; border-radius: 2px;
  background: var(--a2ui-border); cursor: pointer; overflow: visible;
}
.a2-audio__progress:hover .a2-audio__progress-thumb {
  transform: translate(-50%, -50%) scale(1.5);
}
.a2-audio__progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #7c3aed, #4f46e5);
  border-radius: 2px; pointer-events: none;
}
.a2-audio__progress-thumb {
  position: absolute; top: 50%;
  width: 13px; height: 13px; border-radius: 50%;
  background: white; border: 2px solid #7c3aed;
  transform: translate(-50%, -50%);
  box-shadow: 0 1px 4px rgba(0,0,0,0.18);
  transition: transform 0.15s ease;
  pointer-events: none;
}

/* ── Time labels ── */
.a2-audio__times {
  display: flex; justify-content: space-between;
  font-size: 0.75rem; font-variant-numeric: tabular-nums;
  color: var(--a2ui-text-secondary); margin-top: -4px;
}

/* ── Controls ── */
.a2-audio__controls {
  display: flex; align-items: center; justify-content: center; gap: 16px;
}

.a2-audio__play-btn {
  width: 52px; height: 52px; border-radius: 50%;
  background: linear-gradient(135deg, #7c3aed, #4f46e5);
  border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 16px rgba(124, 58, 237, 0.42);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.a2-audio__play-btn:hover  { transform: scale(1.07); box-shadow: 0 6px 22px rgba(124, 58, 237, 0.52); }
.a2-audio__play-btn:active { transform: scale(0.95); }

.a2-audio__icon-btn {
  background: none; border: none; cursor: pointer;
  color: var(--a2ui-text-secondary); padding: 6px; border-radius: 8px;
  display: flex; align-items: center;
  transition: color 0.15s, background 0.15s;
}
.a2-audio__icon-btn:hover { color: var(--a2ui-text); background: var(--a2ui-bg-hover); }

/* ── Spinner ── */
.a2-audio__spinner {
  width: 22px; height: 22px;
  border: 2.5px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Volume popup transition ── */
.vol-pop-enter-active, .vol-pop-leave-active { transition: opacity 0.15s, transform 0.15s; }
.vol-pop-enter-from, .vol-pop-leave-to { opacity: 0; transform: translateY(6px); }
</style>
