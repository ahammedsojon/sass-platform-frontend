<template>
  <header class="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
    <h1 class="text-lg font-semibold text-gray-700">
      {{ pageTitle }}
    </h1>

    <div class="flex items-center gap-4">
      <div class="text-sm text-gray-600 flex items-center gap-2">
        <div class="w-6 h-6 rounded-full bg-indigo-200 text-indigo-800 flex items-center justify-center text-xs font-bold">
          {{ auth.user?.name?.[0] }}
        </div>
        {{ auth.user?.name }}
      </div>

      <button
        @click="logout"
        class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {useAuthStore} from '@/stores/auth.ts'

const router = useRouter();
const route = useRoute()
const auth = useAuthStore()

const pageTitle = computed(() => {
  return (route.meta.title as string)?.toUpperCase() || 'DASHBOARD'
})

const logout = () => {
  auth.logout();
  router.push('/auth/login');
}
</script>
