<template>
  <aside class="sidebar relative z-10">
    <!-- Logo -->
    <NuxtLink to="/" class="flex items-center gap-2.5 px-5 py-5 no-underline">
      <div
        class="w-7 h-7 rounded-md flex items-center justify-center text-white text-xs font-bold"
        style="background: linear-gradient(135deg, #7c3aed, #4f46e5)"
      >
        A2
      </div>
      <span class="sidebar-brand">A2UI</span>
      <span class="text-sm font-light" style="color: var(--a2ui-muted)">VUE</span>
    </NuxtLink>

    <!-- Navigation -->
    <nav class="flex-1 px-3 py-1 flex flex-col gap-0.5">
      <NuxtLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium no-underline transition-all duration-150"
        :class="isActive(item.path) ? 'active-link' : 'inactive-link'"
      >
        <span class="material-icons text-[18px]">{{ item.icon }}</span>
        {{ item.label }}
      </NuxtLink>

      <div class="mt-4 flex flex-col gap-0.5">
        <NuxtLink
          v-for="item in toolItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium no-underline transition-all duration-150"
          :class="isActive(item.path) ? 'active-link' : 'inactive-link'"
        >
          <span class="material-icons text-[18px]">{{ item.icon }}</span>
          {{ item.label }}
        </NuxtLink>
      </div>
    </nav>

    <!-- Bottom section -->
    <div class="px-5 pb-4 pt-2">
      <ThemeToggle />
      <div class="mt-3">
        <p class="text-[10px] uppercase tracking-wider font-medium" style="color: var(--a2ui-muted)">
          v0.10 · Vue 3
        </p>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
const route = useRoute()

const navItems = [
  { path: '/', label: 'Home', icon: 'home' },
  { path: '/gallery', label: 'Gallery', icon: 'grid_view' },
  { path: '/designer', label: 'Designer', icon: 'design_services' },
]

const toolItems = [
  { path: '/components', label: 'Components', icon: 'widgets' },
  { path: '/icons', label: 'Icons', icon: 'emoji_emotions' },
]

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 220px;
  flex-shrink: 0;
  background: var(--a2ui-sidebar-bg);
  border: 2px solid var(--a2ui-sidebar-border);
  border-radius: 10px;
  transition: background 0.3s, border-color 0.3s;
}
.sidebar-brand {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  background: linear-gradient(to right, #7c3aed, #4f46e5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.active-link {
  background: rgba(124, 58, 237, 0.1);
  color: #7c3aed;
}
.inactive-link {
  color: var(--a2ui-muted);
}
.inactive-link:hover {
  background: rgba(0, 0, 0, 0.04);
  color: var(--a2ui-text);
}
</style>
