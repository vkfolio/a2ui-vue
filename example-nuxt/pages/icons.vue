<template>
  <div class="p-8 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2" style="color: var(--a2ui-text)">Icons</h1>
      <p class="text-sm mb-4" style="color: var(--a2ui-muted)">
        A2UI uses Material Icons. Showing <strong>{{ filteredIcons.length }}</strong> of <strong>{{ uniqueIconNames.length }}</strong> icons. Click to copy name.
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
    <div class="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 xl:grid-cols-11 2xl:grid-cols-13 gap-2">
      <div
        v-for="icon in filteredIcons"
        :key="icon"
        @click="copyIcon(icon)"
        class="icon-card flex flex-col items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all duration-150 overflow-hidden"
        style="background: var(--a2ui-card-bg); border-color: var(--a2ui-card-border)"
        :class="copiedIcon === icon ? 'ring-2' : ''"
        :style="copiedIcon === icon ? 'outline: 2px solid var(--a2ui-primary); outline-offset: -2px' : ''"
      >
        <span
          class="material-icons text-[26px] transition-colors duration-150 flex-shrink-0"
          :style="{ color: copiedIcon === icon ? 'var(--a2ui-primary)' : 'var(--a2ui-text)' }"
        >{{ toMaterialName(icon) }}</span>
        <span
          class="text-[9px] text-center leading-tight font-mono w-full"
          style="color: var(--a2ui-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: block;"
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
  // Navigation & Actions
  'accountCircle', 'add', 'addCircle', 'arrowBack', 'arrowForward',
  'arrowUpward', 'arrowDownward', 'chevronLeft', 'chevronRight',
  'expandMore', 'expandLess', 'keyboardArrowUp', 'keyboardArrowDown',
  'check', 'checkCircle', 'close', 'cancel', 'block',
  'done', 'doneAll', 'remove', 'removeCircle', 'clear',
  'undo', 'redo', 'refresh', 'sync', 'loop',
  'openInNew', 'launch', 'fullscreen', 'fullscreenExit',
  'zoomIn', 'zoomOut', 'swapHoriz', 'swapVert', 'dragHandle',
  'menu', 'menuOpen', 'moreVert', 'moreHoriz', 'tune',
  'filterList', 'sort', 'search', 'findInPage',

  // Content & Editing
  'edit', 'editNote', 'create', 'delete', 'deleteOutline',
  'contentCopy', 'contentCut', 'contentPaste', 'link', 'linkOff',
  'attach', 'attachFile', 'attachMoney', 'upload', 'download',
  'save', 'bookmark', 'bookmarkBorder', 'label', 'tag',
  'title', 'notes', 'article', 'description', 'assignment',
  'list', 'checklist', 'toc', 'subject', 'code',

  // Communication
  'mail', 'email', 'send', 'inbox', 'drafts',
  'chat', 'chatBubble', 'forum', 'message', 'sms',
  'call', 'phone', 'phoneEnabled', 'contactPhone', 'contacts',
  'mic', 'micOff', 'videocam', 'videocamOff', 'notifications',
  'notificationsOff', 'notificationsActive', 'campaign', 'share', 'rss',

  // Media & Audio
  'play', 'pause', 'stop', 'rewind', 'fastForward',
  'skipNext', 'skipPrevious', 'replay', 'shuffle', 'repeat',
  'playCircle', 'pauseCircle', 'stopCircle', 'queueMusic', 'playlist',
  'audiotrack', 'musicNote', 'headphones', 'speaker', 'radio',
  'movie', 'videocam', 'photo', 'image', 'collections',
  'camera', 'cameraAlt', 'photoCamera', 'panorama', 'slideshow',
  'volumeUp', 'volumeDown', 'volumeMute', 'volumeOff',

  // People & Social
  'person', 'personAdd', 'personRemove', 'personOff', 'group',
  'groups', 'face', 'badge', 'manageAccounts', 'adminPanelSettings',
  'accountBalance', 'accountBox', 'supervisor', 'engineering', 'support',
  'favorite', 'favoriteOff', 'thumbUp', 'thumbDown', 'mood',
  'moodBad', 'sentiment', 'star', 'starHalf', 'starOff',

  // Files & Storage
  'folder', 'folderOpen', 'folderShared', 'createNewFolder', 'drive',
  'cloud', 'cloudUpload', 'cloudDownload', 'cloudDone', 'cloudOff',
  'backup', 'restore', 'saveAlt', 'print', 'printDisabled',

  // Commerce & Finance
  'shoppingCart', 'shoppingBag', 'store', 'storefront', 'sell',
  'payment', 'creditCard', 'wallet', 'savings', 'monetization',
  'receipt', 'receiptLong', 'priceCheck', 'discount', 'percent',
  'euro', 'currencyBitcoin', 'paid', 'localOffer', 'gift',

  // Location & Maps
  'locationOn', 'locationOff', 'myLocation', 'nearMe', 'map',
  'place', 'explore', 'navigation', 'directions', 'route',
  'home', 'apartment', 'business', 'restaurant', 'hotel',
  'flight', 'train', 'directions', 'car', 'bike',

  // Status & Alerts
  'error', 'errorOutline', 'warning', 'warningAmber', 'info',
  'help', 'helpOutline', 'reportProblem', 'report', 'flag',
  'lock', 'lockOpen', 'security', 'vpnKey', 'fingerprint',
  'visibility', 'visibilityOff', 'privacy', 'verified', 'newReleases',
  'radioButtonChecked', 'radioButtonUnchecked', 'toggleOn', 'toggleOff', 'circle',

  // Device & Tech
  'smartphone', 'tablet', 'laptop', 'desktopWindows', 'tv',
  'wifi', 'wifiOff', 'bluetooth', 'bluetoothDisabled', 'nfc',
  'battery', 'batteryChargingFull', 'usb', 'sd', 'memory',
  'keyboard', 'mouse', 'headset', 'monitor', 'router',

  // Time & Calendar
  'event', 'calendarToday', 'calendarMonth', 'dateRange', 'schedule',
  'accessTime', 'timelapse', 'timer', 'alarmOn', 'hourglass',
  'history', 'update', 'pending', 'autorenew', 'syncAlt',

  // Design & Creative
  'colorLens', 'palette', 'brush', 'format', 'tune',
  'crop', 'rotate', 'flip', 'transform', 'straighten',
  'layers', 'style', 'design', 'grid', 'viewQuilt',
  'lightMode', 'darkMode', 'brightness', 'contrast', 'filter',

  // Science & Work
  'science', 'biotech', 'psychology', 'analytics', 'insights',
  'dashboard', 'dataUsage', 'timeline', 'trendingUp', 'trendingDown',
  'trendingFlat', 'barChart', 'pieChart', 'donutLarge', 'assessment',
  'build', 'construction', 'hardware', 'handyman', 'engineering',
  'language', 'translate', 'public', 'travel', 'luggage',
]
const search = ref('')
const copiedIcon = ref('')
const showCopied = ref(false)

// Deduplicate and sort
const uniqueIconNames = [...new Set(iconNames)].sort((a, b) => a.localeCompare(b))

const filteredIcons = computed(() => {
  if (!search.value) return uniqueIconNames
  const q = search.value.toLowerCase()
  return uniqueIconNames.filter((n: string) => n.toLowerCase().includes(q))
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
.icon-card {
  position: relative;
}
.icon-card:hover {
  border-color: var(--a2ui-primary) !important;
  transform: translateY(-2px);
  z-index: 1;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.15);
}
</style>
