<template>
  <div class="p-8 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2" style="color: var(--a2ui-text)">Icons</h1>
      <p class="text-sm mb-4" style="color: var(--a2ui-muted)">
        A2UI uses Material Icons. Showing <strong>{{ iconNames.length }}</strong> icons from the spec.
      </p>

      <!-- Search -->
      <div class="flex items-center gap-4">
        <div
          class="flex items-center gap-2 px-4 py-2.5 rounded-lg border flex-1 max-w-sm"
          style="background: var(--a2ui-input-bg); border-color: var(--a2ui-input-border)"
        >
          <span class="material-icons text-[18px]" style="color: var(--a2ui-muted)">search</span>
          <input
            v-model="search"
            type="text"
            placeholder="Search icons..."
            class="flex-1 border-0 outline-none bg-transparent text-sm"
            style="color: var(--a2ui-text)"
          />
        </div>
        <a
          href="https://fonts.google.com/icons"
          target="_blank"
          rel="noopener"
          class="flex items-center gap-1.5 text-sm no-underline font-medium"
          style="color: var(--a2ui-primary)"
        >
          Browse all icons
          <span class="material-icons text-[14px]">open_in_new</span>
        </a>
      </div>
    </div>

    <!-- Icon grid -->
    <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
      <div
        v-for="icon in filteredIcons"
        :key="icon"
        @click="copyIcon(icon)"
        class="flex flex-col items-center gap-2 p-4 rounded-xl border cursor-pointer transition-all duration-150 group"
        style="background: var(--a2ui-card-bg); border-color: var(--a2ui-card-border)"
        :class="copiedIcon === icon ? 'ring-2' : ''"
        :style="copiedIcon === icon ? { '--tw-ring-color': 'var(--a2ui-primary)' } : {}"
      >
        <span
          class="material-icons text-[28px] transition-colors duration-150"
          :style="{ color: copiedIcon === icon ? 'var(--a2ui-primary)' : 'var(--a2ui-text)' }"
        >{{ toMaterialName(icon) }}</span>
        <span
          class="text-[10px] text-center leading-tight font-mono truncate w-full"
          style="color: var(--a2ui-muted)"
        >{{ icon }}</span>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="filteredIcons.length === 0" class="text-center py-16">
      <span class="material-icons text-[48px] mb-4" style="color: var(--a2ui-muted)">search_off</span>
      <p class="text-sm" style="color: var(--a2ui-muted)">No icons match "{{ search }}"</p>
    </div>

    <!-- Copied toast -->
    <Transition name="fade">
      <div
        v-if="showCopied"
        class="fixed bottom-6 right-6 px-4 py-2.5 rounded-lg text-sm font-medium text-white shadow-lg"
        style="background: var(--a2ui-primary)"
      >
        Copied "{{ copiedIcon }}"
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const iconNames = [
  'accountCircle', 'add', 'arrowBack', 'arrowForward', 'attachFile',
  'calendarToday', 'call', 'camera', 'check', 'close',
  'delete', 'download', 'edit', 'event', 'error',
  'fastForward', 'favorite', 'favoriteOff', 'folder', 'help',
  'home', 'info', 'locationOn', 'lock', 'lockOpen',
  'mail', 'menu', 'moreVert', 'moreHoriz', 'notificationsOff',
  'notifications', 'pause', 'payment', 'person', 'phone',
  'photo', 'play', 'print', 'refresh', 'rewind',
  'search', 'send', 'settings', 'share', 'shoppingCart',
  'skipNext', 'skipPrevious', 'star', 'starHalf', 'starOff',
  'stop', 'upload', 'visibility', 'visibilityOff', 'volumeDown',
  'volumeMute', 'volumeOff', 'volumeUp', 'warning',
]
const search = ref('')
const copiedIcon = ref('')
const showCopied = ref(false)

const filteredIcons = computed(() => {
  if (!search.value) return iconNames
  const q = search.value.toLowerCase()
  return iconNames.filter((n: string) => n.toLowerCase().includes(q))
})

function toMaterialName(camelCase: string): string {
  return camelCase.replace(/([A-Z])/g, '_$1').toLowerCase()
}

function copyIcon(name: string) {
  navigator.clipboard.writeText(name)
  copiedIcon.value = name
  showCopied.value = true
  setTimeout(() => {
    showCopied.value = false
    copiedIcon.value = ''
  }, 1500)
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.group:hover {
  border-color: var(--a2ui-primary) !important;
  transform: translateY(-1px);
}
</style>
