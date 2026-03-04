<template>
  <aside class="w-64 bg-gray-900 text-gray-200 flex flex-col">
    <div class="p-6 text-2xl font-bold border-b border-gray-800">
      TaskFlow
    </div>

    <nav class="flex-1 p-4 space-y-2">
      <RouterLink
        to="/admin/dashboard"
        class="block px-4 py-2 rounded-lg hover:bg-gray-800 transition"
        active-class="bg-gray-800 text-white"
      >
        Dashboard
      </RouterLink>

      <RouterLink
        to="/admin/projects"
        class="block px-4 py-2 rounded-lg hover:bg-gray-800 transition"
        active-class="bg-gray-800 text-white"
      >
        Projects
      </RouterLink>

      <RouterLink
        to="/admin/tasks"
        class="block px-4 py-2 rounded-lg hover:bg-gray-800 transition"
        active-class="bg-gray-800 text-white"
      >
        Tasks
      </RouterLink>

      <RouterLink
        to="/admin/activities"
        class="block px-4 py-2 rounded-lg hover:bg-gray-800 transition"
        active-class="bg-gray-800 text-white"
      >
        Activity Logs
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
