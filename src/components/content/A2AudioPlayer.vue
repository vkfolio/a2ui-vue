<script setup lang="ts">
import { computed, inject } from 'vue'
import type { ComponentDefinition } from '../../types'

const props = defineProps<{
  definition: ComponentDefinition
  surfaceId: string
}>()

const dataModel = inject('a2ui-data-model') as any

const resolve = (val: any) => {
  if (!val) return ''
  if (typeof val === 'string') return val
  if (typeof val === 'number') return String(val)
  if (val.literalString !== undefined) return String(val.literalString)
  if (val.path) return dataModel?.getPath(props.surfaceId, val.path) ?? ''
  return String(val)
}

const resolvedUrl = computed(() => resolve(props.definition.url))

const description = computed(() => {
  return props.definition.description ? resolve(props.definition.description) : ''
})
</script>

<template>
  <div class="flex flex-col gap-1">
    <p v-if="description" class="text-sm" style="color: var(--a2ui-text-secondary)">{{ description }}</p>
    <audio :src="resolvedUrl" controls class="w-full" />
  </div>
</template>
