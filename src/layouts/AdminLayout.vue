<template>
  <div class="flex h-screen bg-gray-100">
    <SidebarComponent />

    <div class="flex-1 flex flex-col">
      <NavbarComponent />

      <main class="flex-1 overflow-y-auto p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import SidebarComponent from '@/components/SidebarComponent.vue'
import NavbarComponent from '@/components/NavbarComponent.vue'
</script>
