<template>
  <button
    @click="toggle"
    class="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 border-0 cursor-pointer"
    style="background: var(--a2ui-input-bg); color: var(--a2ui-muted)"
  >
    <span class="material-icons text-[18px]">{{ isDark ? 'light_mode' : 'dark_mode' }}</span>
    {{ isDark ? 'Light Mode' : 'Dark Mode' }}
  </button>
</template>

<script setup lang="ts">
const isDark = useState('dark')

function toggle() {
  isDark.value = !isDark.value
}
</script>
