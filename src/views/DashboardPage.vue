<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">Dashboard Overview</h2>

    <div class="grid grid-cols-4 gap-6">
      <StatCard title="Total Tasks" :value="stats.total_tasks" />
      <StatCard title="Pending" :value="stats.pending_tasks" />
      <StatCard title="In Progress" :value="stats.in_progress_tasks" />
      <StatCard title="Completed" :value="stats.completed_tasks" />
    </div>
    <div class="bg-white rounded-2xl shadow p-6 mt-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-semibold">Recent Activity</h2>
        <router-link
          to="/admin/activities"
          class="text-sm text-indigo-600 hover:underline"
        >
          View All
        </router-link>
      </div>

      <!-- Timeline -->
      <div class="relative">
        <div
          v-for="(activity, index) in recentActivities"
          :key="activity.id"
          class="flex gap-4 pb-6 last:pb-0 group"
        >
          <!-- Vertical Line -->
          <div class="relative">
            <div class="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold shadow-sm">
              {{ activity.user?.name?.[0] }}
            </div>

            <!-- Line -->
            <div
              v-if="index !== recentActivities.length - 1"
              class="absolute left-5 top-10 w-px h-full bg-gray-200"
            ></div>
          </div>

          <!-- Content -->
          <div class="flex-1 bg-gray-50 rounded-xl p-4 transition group-hover:bg-gray-100">
            <div class="flex justify-between items-center mb-1">
              <p class="font-medium text-gray-800">
                {{ activity.user?.name }}
              </p>

              <span
                class="text-xs px-2 py-1 rounded-full"
                :class="actionClass(activity.action)"
              >
            {{ activity.action }}
          </span>
            </div>

            <p class="text-sm text-gray-600">
              {{ activity.description }}
            </p>

            <p class="text-xs text-gray-400 mt-2">
              {{ timeAgo(activity.created_at) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import StatCard from '../components/StatCard.vue'
import api from '../api/axios'
import type { IActivity, IDashboardStats } from '@/types'

const stats = reactive<IDashboardStats>({
  total_projects: 0,
  total_tasks: 0,
  pending_tasks: 0,
  in_progress_tasks: 0,
  completed_tasks: 0
})

const recentActivities = ref<IActivity[]>([])
const actionClass = (action: string) => {
  return {
    'bg-green-100 text-green-700': action === 'created',
    'bg-blue-100 text-blue-700': action === 'updated',
    'bg-red-100 text-red-700': action === 'deleted'
  }
}

const timeAgo = (date: string) => {
  const diff = (new Date().getTime() - new Date(date).getTime()) / 1000
  if (diff < 60) return `${Math.floor(diff)} seconds ago`
  if (diff < 3600) return `${Math.floor(diff/60)} minutes ago`
  if (diff < 86400) return `${Math.floor(diff/3600)} hours ago`
  return `${Math.floor(diff/86400)} days ago`
}

const fetchRecentActivities = async () => {
  const res = await api.get('/activities')
  recentActivities.value = res.data.slice(0, 10)
}

const fetchStats = async () => {
  const res = await api.get('/dashboard/stats')
  Object.assign(stats, res.data)
}



onMounted(() => {
  fetchStats()
  fetchRecentActivities()
})
</script>
