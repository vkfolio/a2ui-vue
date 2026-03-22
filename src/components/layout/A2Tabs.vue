<script setup lang="ts">
import { ref, computed, inject, nextTick, watch } from 'vue'
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
const tabRefs = ref<HTMLElement[]>([])
const indicatorStyle = ref({ left: '0px', width: '0px' })

const tabs = computed(() => (props.definition.tabs as any[]) ?? [])

const weightStyle = computed(() => {
  const w = props.definition.weight
  return w != null ? { flex: `${w} ${w} 0%` } : undefined
})

const updateIndicator = async (idx: number) => {
  await nextTick()
  const el = tabRefs.value[idx]
  if (el) {
    indicatorStyle.value = {
      left: `${el.offsetLeft}px`,
      width: `${el.offsetWidth}px`,
    }
  }
}

watch(activeTab, (idx) => updateIndicator(idx))

const setTab = (idx: number) => {
  activeTab.value = idx
}

// Initialize indicator after mount
import { onMounted } from 'vue'
onMounted(() => updateIndicator(0))
</script>

<template>
  <div :style="weightStyle">
    <!-- Tab bar -->
    <div class="a2-tabs__bar">
      <button
        v-for="(tab, i) in tabs"
        :key="i"
        :ref="(el) => { if (el) tabRefs[i] = el as HTMLElement }"
        @click="setTab(i)"
        class="a2-tabs__tab"
        :class="{ 'a2-tabs__tab--active': activeTab === i }"
      >
        {{ resolveText(tab.title) }}
      </button>
      <!-- Sliding indicator -->
      <div class="a2-tabs__indicator" :style="indicatorStyle" />
    </div>
    <!-- Content -->
    <div class="a2-tabs__content">
      <A2Renderer
        v-if="tabs.length > 0"
        :component-id="tabs[activeTab].child"
        :surface-id="surfaceId"
      />
    </div>
  </div>
</template>

<style scoped>
.a2-tabs__bar {
  position: relative;
  display: flex;
  border-bottom: 1px solid var(--a2ui-divider);
  gap: 0;
}
.a2-tabs__tab {
  padding: 10px 16px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--a2ui-text-secondary);
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.15s ease;
  white-space: nowrap;
  outline: none;
}
.a2-tabs__tab:hover {
  color: var(--a2ui-text);
}
.a2-tabs__tab--active {
  color: var(--a2ui-primary);
  font-weight: 600;
}
.a2-tabs__indicator {
  position: absolute;
  bottom: -1px;
  height: 2px;
  background: var(--a2ui-primary);
  border-radius: 1px 1px 0 0;
  transition: left 0.2s cubic-bezier(0.4, 0, 0.2, 1), width 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.a2-tabs__content {
  padding-top: 1rem;
}
</style>
