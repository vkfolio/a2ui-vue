<script setup lang="ts">
import { computed, inject, ref, onBeforeUnmount } from 'vue'
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

const resolvedUrl  = computed(() => resolve((props.definition as any).url  ?? (props.definition as any).src))
const poster       = computed(() => resolve((props.definition as any).poster ?? (props.definition as any).thumbnail))
const title        = computed(() => resolve((props.definition as any).title  ?? (props.definition as any).description))

// ── State ──────────────────────────────────────────────────────────────────
const videoEl      = ref<HTMLVideoElement | null>(null)
const isPlaying    = ref(false)
const isLoading    = ref(true)
const hasError     = ref(false)
const isMuted      = ref(false)
const isFullscreen = ref(false)
const showVolume   = ref(false)
const showControls = ref(true)
const currentTime  = ref(0)
const duration     = ref(0)
const buffered     = ref(0)
const volume       = ref(1)

let hideTimer: ReturnType<typeof setTimeout> | null = null

// ── Computed ───────────────────────────────────────────────────────────────
const progressPct  = computed(() => duration.value ? (currentTime.value / duration.value) * 100 : 0)
const bufferedPct  = computed(() => duration.value ? (buffered.value  / duration.value) * 100 : 0)

const volumeIcon = computed(() => {
  if (isMuted.value || volume.value === 0) return 'volume_off'
  if (volume.value < 0.4) return 'volume_down'
  return 'volume_up'
})

// ── Helpers ────────────────────────────────────────────────────────────────
const fmt = (s: number): string => {
  if (!s || isNaN(s)) return '0:00'
  const h   = Math.floor(s / 3600)
  const m   = Math.floor((s % 3600) / 60)
  const sec = Math.floor(s % 60).toString().padStart(2, '0')
  return h > 0 ? `${h}:${m.toString().padStart(2, '0')}:${sec}` : `${m}:${sec}`
}

// ── Actions ────────────────────────────────────────────────────────────────
const togglePlay = () => {
  const el = videoEl.value
  if (!el) return
  isPlaying.value ? el.pause() : el.play()
}

const toggleMute = () => {
  const el = videoEl.value
  if (!el) return
  el.muted = !el.muted
  isMuted.value = el.muted
}

const seek = (e: MouseEvent) => {
  const el  = videoEl.value
  const bar = e.currentTarget as HTMLElement
  if (!el || !bar || !el.duration) return
  const rect  = bar.getBoundingClientRect()
  const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
  el.currentTime = ratio * el.duration
}

const setVolume = (e: Event) => {
  const el = videoEl.value
  if (!el) return
  const v  = Number((e.target as HTMLInputElement).value) / 100
  el.volume   = v
  volume.value = v
  isMuted.value = v === 0
  if (v > 0) el.muted = false
}

const toggleFullscreen = () => {
  const wrap = videoEl.value?.parentElement
  if (!wrap) return
  if (!document.fullscreenElement) {
    wrap.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

// ── Auto-hide controls ─────────────────────────────────────────────────────
const resetHideTimer = () => {
  if (hideTimer) clearTimeout(hideTimer)
  showControls.value = true
  if (isPlaying.value) {
    hideTimer = setTimeout(() => { showControls.value = false }, 3000)
  }
}

const onMouseEnter = () => { showControls.value = true; if (hideTimer) clearTimeout(hideTimer) }
const onMouseLeave = () => { if (isPlaying.value) showControls.value = false }
const onMouseMove  = resetHideTimer

onBeforeUnmount(() => { if (hideTimer) clearTimeout(hideTimer) })

// ── Video events ───────────────────────────────────────────────────────────
const onTimeUpdate = () => {
  const el = videoEl.value
  if (!el) return
  currentTime.value = el.currentTime
  if (el.buffered.length > 0) buffered.value = el.buffered.end(el.buffered.length - 1)
}
const onLoadedMetadata = () => { duration.value = videoEl.value?.duration ?? 0; isLoading.value = false }
const onCanPlay  = () => { isLoading.value = false }
const onWaiting  = () => { isLoading.value = true }
const onPlaying  = () => { isLoading.value = false }
const onEnded    = () => { isPlaying.value = false }
const onPlay     = () => { isPlaying.value = true;  resetHideTimer() }
const onPause    = () => { isPlaying.value = false; showControls.value = true }
const onError    = () => { hasError.value  = true;  isLoading.value = false }
const onVolumeChange = () => {
  const el = videoEl.value
  if (el) { isMuted.value = el.muted; volume.value = el.volume }
}
</script>

<template>
  <div class="a2-video-outer">
    <div v-if="title" class="a2-video-title">{{ title }}</div>

    <div
      class="a2-video-wrap"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
      @mousemove="onMouseMove"
    >
      <!-- Native video (hidden controls) -->
      <video
        ref="videoEl"
        :src="resolvedUrl"
        :poster="poster"
        preload="metadata"
        playsinline
        class="a2-video-el"
        @timeupdate="onTimeUpdate"
        @loadedmetadata="onLoadedMetadata"
        @canplay="onCanPlay"
        @waiting="onWaiting"
        @playing="onPlaying"
        @ended="onEnded"
        @play="onPlay"
        @pause="onPause"
        @error="onError"
        @volumechange="onVolumeChange"
        @click="togglePlay"
      />

      <!-- Spinner -->
      <div v-if="isLoading && resolvedUrl && !hasError" class="a2-video-center">
        <svg class="a2-video-spinner" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="3"/>
          <circle cx="20" cy="20" r="16" fill="none" stroke="white" stroke-width="3"
                  stroke-linecap="round" stroke-dasharray="60 40"/>
        </svg>
      </div>

      <!-- Error -->
      <div v-if="hasError" class="a2-video-center a2-video-error-bg">
        <span class="material-icons" style="font-size: 40px; color: rgba(255,255,255,0.55)">videocam_off</span>
        <span class="a2-video-error-label">Failed to load video</span>
      </div>

      <!-- No URL placeholder -->
      <div v-if="!resolvedUrl" class="a2-video-center a2-video-error-bg">
        <span class="material-icons" style="font-size: 40px; color: rgba(255,255,255,0.35)">movie</span>
      </div>

      <!-- Big play button (shown when paused) -->
      <Transition name="play-fade">
        <button
          v-if="!isPlaying && !isLoading && !hasError && resolvedUrl"
          class="a2-video-big-play"
          @click="togglePlay"
        >
          <span class="material-icons" style="font-size: 38px; color: white">play_arrow</span>
        </button>
      </Transition>

      <!-- Controls bar -->
      <Transition name="controls-fade">
        <div
          v-if="resolvedUrl && !hasError && (showControls || !isPlaying)"
          class="a2-video-controls"
          @click.stop
        >
          <!-- Seek bar -->
          <div class="a2-video-seek" @click="seek">
            <div class="a2-video-seek-bg" />
            <div class="a2-video-seek-buf" :style="{ width: `${bufferedPct}%` }" />
            <div class="a2-video-seek-fill" :style="{ width: `${progressPct}%` }" />
            <div class="a2-video-seek-thumb" :style="{ left: `${progressPct}%` }" />
          </div>

          <!-- Bottom row -->
          <div class="a2-video-bar">
            <!-- Left -->
            <div class="a2-video-bar-side">
              <button class="a2-video-btn" @click="togglePlay">
                <span class="material-icons" style="font-size: 22px">{{ isPlaying ? 'pause' : 'play_arrow' }}</span>
              </button>
              <span class="a2-video-time">{{ fmt(currentTime) }} / {{ fmt(duration) }}</span>
            </div>

            <!-- Right -->
            <div class="a2-video-bar-side">
              <!-- Volume -->
              <div class="a2-video-vol-wrap" @mouseenter="showVolume = true" @mouseleave="showVolume = false">
                <button class="a2-video-btn" @click="toggleMute">
                  <span class="material-icons" style="font-size: 20px">{{ volumeIcon }}</span>
                </button>
                <Transition name="vol-slide">
                  <input
                    v-if="showVolume"
                    type="range" min="0" max="100"
                    :value="isMuted ? 0 : Math.round(volume * 100)"
                    class="a2-video-vol-slider"
                    @input="setVolume"
                  />
                </Transition>
              </div>
              <!-- Fullscreen -->
              <button class="a2-video-btn" @click="toggleFullscreen">
                <span class="material-icons" style="font-size: 20px">
                  {{ isFullscreen ? 'fullscreen_exit' : 'fullscreen' }}
                </span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.a2-video-outer { display: flex; flex-direction: column; gap: 8px; }

.a2-video-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--a2ui-text);
}

.a2-video-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 14px;
  overflow: hidden;
  background: #0a0a12;
  cursor: pointer;
  user-select: none;
}

.a2-video-el {
  width: 100%; height: 100%;
  object-fit: contain;
  display: block;
}

/* ── Overlays ── */
.a2-video-center {
  position: absolute; inset: 0;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 8px;
}
.a2-video-error-bg { background: rgba(0,0,0,0.55); }
.a2-video-error-label { color: rgba(255,255,255,0.55); font-size: 0.8rem; }

/* ── Spinner ── */
.a2-video-spinner {
  width: 44px; height: 44px;
  animation: spin 0.9s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Big play button ── */
.a2-video-big-play {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 68px; height: 68px;
  border-radius: 50%;
  background: rgba(255,255,255,0.16);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 2px solid rgba(255,255,255,0.35);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: transform 0.15s ease, background 0.15s ease;
}
.a2-video-big-play:hover  { background: rgba(255,255,255,0.26); transform: translate(-50%, -50%) scale(1.08); }
.a2-video-big-play:active { transform: translate(-50%, -50%) scale(0.95); }

/* ── Controls bar ── */
.a2-video-controls {
  position: absolute; bottom: 0; left: 0; right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.78) 0%, transparent 100%);
  padding: 36px 14px 12px;
  display: flex; flex-direction: column; gap: 6px;
}

/* ── Seek bar ── */
.a2-video-seek {
  position: relative;
  height: 4px; cursor: pointer; overflow: visible;
}
.a2-video-seek:hover .a2-video-seek-thumb { transform: translate(-50%, -50%) scale(1.5); }

.a2-video-seek-bg {
  position: absolute; inset: 0; height: 4px;
  background: rgba(255,255,255,0.2); border-radius: 2px;
}
.a2-video-seek-buf {
  position: absolute; height: 4px; top: 0;
  background: rgba(255,255,255,0.35); border-radius: 2px;
  transition: width 0.3s;
}
.a2-video-seek-fill {
  position: absolute; height: 4px; top: 0;
  background: linear-gradient(90deg, #7c3aed, #4f46e5);
  border-radius: 2px; transition: width 0.1s linear;
}
.a2-video-seek-thumb {
  position: absolute; top: 2px;
  width: 13px; height: 13px; border-radius: 50%;
  background: white; transform: translate(-50%, -50%);
  transition: left 0.1s linear, transform 0.15s ease;
  box-shadow: 0 1px 5px rgba(0,0,0,0.4);
}

/* ── Bottom bar ── */
.a2-video-bar { display: flex; align-items: center; justify-content: space-between; }
.a2-video-bar-side { display: flex; align-items: center; gap: 4px; }

.a2-video-btn {
  background: none; border: none; cursor: pointer;
  color: white; padding: 4px; border-radius: 6px;
  display: flex; align-items: center;
  transition: background 0.15s;
}
.a2-video-btn:hover { background: rgba(255,255,255,0.12); }

.a2-video-time {
  font-size: 0.75rem; color: rgba(255,255,255,0.85);
  font-variant-numeric: tabular-nums; margin-left: 4px;
}

/* ── Volume ── */
.a2-video-vol-wrap { display: flex; align-items: center; gap: 4px; }
.a2-video-vol-slider { width: 72px; accent-color: white; cursor: pointer; }

/* ── Transitions ── */
.play-fade-enter-active, .play-fade-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.play-fade-enter-from, .play-fade-leave-to { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }

.controls-fade-enter-active, .controls-fade-leave-active { transition: opacity 0.25s ease; }
.controls-fade-enter-from, .controls-fade-leave-to { opacity: 0; }

.vol-slide-enter-active, .vol-slide-leave-active { transition: opacity 0.15s, max-width 0.2s; overflow: hidden; }
.vol-slide-enter-from, .vol-slide-leave-to { opacity: 0; max-width: 0; }
</style>
