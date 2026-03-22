<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ComponentDefinition } from '../../types'
import A2Renderer from '../A2Renderer.vue'

const props = defineProps<{
  definition: ComponentDefinition
  surfaceId: string
}>()

const isOpen = ref(false)
const isVisible = ref(false)

const open = () => {
  isOpen.value = true
  requestAnimationFrame(() => {
    isVisible.value = true
  })
}

const close = () => {
  isVisible.value = false
  setTimeout(() => { isOpen.value = false }, 180)
}

const weightStyle = computed(() => {
  const w = props.definition.weight
  return w != null ? { flex: `${w} ${w} 0%` } : undefined
})

const onBackdropClick = (e: MouseEvent) => {
  if (e.target === e.currentTarget) close()
}
</script>

<template>
  <div :style="weightStyle">
    <!-- Trigger -->
    <div @click="open" style="cursor: pointer; display: inline-flex;">
      <A2Renderer :component-id="definition.trigger as string" :surface-id="surfaceId" />
    </div>

    <!-- Modal teleported to body -->
    <Teleport to="body">
      <div
        v-if="isOpen"
        class="a2-modal-backdrop"
        :class="{ 'a2-modal-backdrop--visible': isVisible }"
        @click="onBackdropClick"
      >
        <div
          class="a2-modal-dialog"
          :class="{ 'a2-modal-dialog--visible': isVisible }"
        >
          <!-- Close button -->
          <button class="a2-modal-close" @click="close" aria-label="Close">
            <span class="material-icons" style="font-size: 20px">close</span>
          </button>
          <!-- Content -->
          <A2Renderer :component-id="definition.content as string" :surface-id="surfaceId" />
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.a2-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0);
  backdrop-filter: blur(0px);
  transition: background 0.2s ease, backdrop-filter 0.2s ease;
}
.a2-modal-backdrop--visible {
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(6px);
}
.a2-modal-dialog {
  position: relative;
  width: 100%;
  max-width: 520px;
  background: var(--a2ui-card-bg);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  border: 1px solid var(--a2ui-card-border);
  border-radius: 20px;
  padding: 1.75rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  transform: translateY(16px) scale(0.96);
  opacity: 0;
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease;
  max-height: 90vh;
  overflow-y: auto;
}
.a2-modal-dialog--visible {
  transform: translateY(0) scale(1);
  opacity: 1;
}
.a2-modal-close {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.06);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--a2ui-text-secondary);
  transition: background 0.15s ease, color 0.15s ease;
}
.a2-modal-close:hover {
  background: rgba(0, 0, 0, 0.12);
  color: var(--a2ui-text);
}
</style>
