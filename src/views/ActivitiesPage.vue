<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Activity Logs</h1>

    <div class="bg-white rounded-2xl shadow p-6">
      <div
        v-for="activity in activities"
        :key="activity.id"
        class="flex gap-4 border-b py-4 last:border-none"
      >
        <!-- Avatar -->
        <div class="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
          {{ activity.user?.name?.[0] }}
        </div>

        <!-- Content -->
        <div class="flex-1">
          <p class="font-medium">
            {{ activity.user?.name }}
            <span class="text-gray-500 text-sm">
              {{ activity.action }}
              {{ activity.model_type }}
            </span>
          </p>

          <p class="text-gray-600 text-sm">
            {{ activity.description }}
          </p>

          <p class="text-xs text-gray-400 mt-1">
            {{ timeAgo(activity.created_at) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/api/axios.ts'
import type { IActivity } from '@/types'



const activities = ref<IActivity[]>([])

const fetchActivities = async () => {
  const res = await api.get('/activities')
  activities.value = res.data
}

onMounted(fetchActivities)

const timeAgo = (date: string) => {
  const diff = (new Date().getTime() - new Date(date).getTime()) / 1000
  if (diff < 60) return `${Math.floor(diff)} seconds ago`
  if (diff < 3600) return `${Math.floor(diff/60)} minutes ago`
  if (diff < 86400) return `${Math.floor(diff/3600)} hours ago`
  return `${Math.floor(diff/86400)} days ago`
}
</script>
