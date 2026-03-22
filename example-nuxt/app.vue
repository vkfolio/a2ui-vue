<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { injectThemeStyles } from 'a2ui-vue'

const isDark = useState('dark', () => false)
provide('isDark', isDark)

// Inject theme CSS vars on mount and whenever dark mode changes
if (import.meta.client) {
  watch(isDark, (dark) => {
    injectThemeStyles({}, dark)
  }, { immediate: true })
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
