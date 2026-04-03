<template>
  <div class="relative flex h-screen overflow-hidden p-2" style="background: var(--a2ui-bg); color: var(--a2ui-text)">
    <!-- Decorative blur blobs -->
    <div class="blob blob-orange" :style="{ opacity: isDark ? 0.08 : 1 }"></div>
    <div class="blob blob-lavender-1" :style="{ opacity: isDark ? 0.1 : 1 }"></div>
    <div class="blob blob-lavender-2" :style="{ opacity: isDark ? 0.1 : 1 }"></div>
    <div class="blob blob-light" :style="{ opacity: isDark ? 0.06 : 1 }"></div>
    <div class="blob blob-yellow" :style="{ opacity: isDark ? 0.06 : 1 }"></div>

    <AppSidebar />
    <main class="flex-1 overflow-y-auto relative z-10">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const isDark = useState('dark')
</script>

<style scoped>
.blob {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  transition: opacity 0.5s ease;
}

.blob-orange {
  width: 446px;
  height: 446px;
  right: 5%;
  top: 10px;
  background: rgba(255, 172, 77, 0.2);
  filter: blur(103px);
}

.blob-lavender-1 {
  width: 609px;
  height: 609px;
  right: -5%;
  bottom: -10%;
  background: rgb(201, 201, 218);
  filter: blur(103px);
}

.blob-lavender-2 {
  width: 609px;
  height: 609px;
  left: 40%;
  top: -30%;
  background: rgb(201, 201, 218);
  filter: blur(103px);
}

.blob-light {
  width: 609px;
  height: 609px;
  left: 30%;
  bottom: -15%;
  background: rgb(243, 243, 252);
  filter: blur(103px);
}

.blob-yellow {
  width: 446px;
  height: 446px;
  left: 5%;
  top: 60%;
  background: rgba(255, 243, 136, 0.3);
  filter: blur(103px);
}
</style>
