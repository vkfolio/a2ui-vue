<script setup lang="ts">
import { computed } from 'vue'
import type { ComponentDefinition } from '../../types'
import A2Renderer from '../A2Renderer.vue'

const props = defineProps<{
  definition: ComponentDefinition
  surfaceId: string
}>()

const weightStyle = computed(() => {
  const w = props.definition.weight
  return w != null ? { flex: `${w} ${w} 0%` } : undefined
})
</script>

<template>
  <div class="a2-card" :style="weightStyle">
    <A2Renderer :component-id="definition.child as string" :surface-id="surfaceId" />
  </div>
</template>

<style scoped>
.a2-card {
  background: var(--a2ui-bg-surface);
  border: 1px solid var(--a2ui-card-border, rgba(255, 255, 255, 0.8));
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}
.a2-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
</style>
