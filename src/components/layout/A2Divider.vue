<script setup lang="ts">
import { computed } from 'vue'
import type { ComponentDefinition } from '../../types'

const props = defineProps<{
  definition: ComponentDefinition
  surfaceId: string
}>()

const axis = computed(() => {
  return (props.definition.axis as string) ?? 'horizontal'
})
</script>

<template>
  <hr
    v-if="axis === 'horizontal'"
    class="border-t my-2"
    style="border-color: var(--a2ui-divider)"
  />
  <div
    v-else
    class="border-l self-stretch mx-2"
    style="border-color: var(--a2ui-divider)"
  ></div>
</template>
