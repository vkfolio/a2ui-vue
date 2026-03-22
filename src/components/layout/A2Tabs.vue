<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import type { ComponentDefinition } from '../../types'
import A2Renderer from '../A2Renderer.vue'

const props = defineProps<{
  definition: ComponentDefinition
  surfaceId: string
}>()

const dataModel = inject('a2ui-data-model') as any

const resolveText = (val: any) => {
  if (!val) return ''
  if (typeof val === 'string') return val
  if (val.literalString !== undefined) return String(val.literalString)
  if (val.path) return dataModel?.getPath(props.surfaceId, val.path) ?? ''
  return String(val)
}

const activeTab = ref(0)

const tabs = computed(() => {
  return (props.definition.tabs as any[]) ?? []
})

const weightStyle = computed(() => {
  const w = props.definition.weight
  return w != null ? { flex: `${w} ${w} 0%` } : undefined
})
</script>

<template>
  <div :style="weightStyle">
    <div class="flex border-b" style="border-color: var(--a2ui-border)">
      <button
        v-for="(tab, i) in tabs"
        :key="i"
        @click="activeTab = i"
        :class="activeTab === i ? 'border-b-2 font-semibold' : 'opacity-60'"
        class="px-4 py-2 text-sm"
        :style="activeTab === i
          ? `border-color: var(--a2ui-primary); color: var(--a2ui-primary)`
          : `color: var(--a2ui-text)`"
      >
        {{ resolveText(tab.title) }}
      </button>
    </div>
    <div class="pt-3">
      <A2Renderer
        v-if="tabs.length > 0"
        :component-id="tabs[activeTab].child"
        :surface-id="surfaceId"
      />
    </div>
  </div>
</template>
