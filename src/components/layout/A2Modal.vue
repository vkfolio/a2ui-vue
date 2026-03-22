<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ComponentDefinition } from '../../types'
import A2Renderer from '../A2Renderer.vue'

const props = defineProps<{
  definition: ComponentDefinition
  surfaceId: string
}>()

const isOpen = ref(false)

const weightStyle = computed(() => {
  const w = props.definition.weight
  return w != null ? { flex: `${w} ${w} 0%` } : undefined
})
</script>

<template>
  <div :style="weightStyle">
    <div @click="isOpen = true">
      <A2Renderer :component-id="definition.trigger as string" :surface-id="surfaceId" />
    </div>
    <Teleport to="body">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center"
        style="background: var(--a2ui-overlay)"
      >
        <div
          class="relative rounded-xl p-6 max-w-lg w-full mx-4 shadow-xl"
          style="background: var(--a2ui-bg-surface)"
        >
          <button
            @click="isOpen = false"
            class="absolute top-3 right-3 opacity-60 hover:opacity-100"
            style="color: var(--a2ui-text)"
          >
            ✕
          </button>
          <A2Renderer :component-id="definition.content as string" :surface-id="surfaceId" />
        </div>
      </div>
    </Teleport>
  </div>
</template>
