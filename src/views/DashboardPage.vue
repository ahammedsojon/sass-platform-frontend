<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">Dashboard Overview</h2>

    <div class="grid grid-cols-4 gap-6">
      <StatCard title="Total Tasks" :value="stats.total_tasks" />
      <StatCard title="Pending" :value="stats.pending_tasks" />
      <StatCard title="In Progress" :value="stats.in_progress_tasks" />
      <StatCard title="Completed" :value="stats.completed_tasks" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import StatCard from '../components/StatCard.vue'
import api from '../api/axios'
import type { IDashboardStats } from '@/types'

const stats = reactive<IDashboardStats>({
  total_projects: 0,
  total_tasks: 0,
  pending_tasks: 0,
  in_progress_tasks: 0,
  completed_tasks: 0
})

const fetchStats = async () => {
  const res = await api.get('/dashboard/stats')
  Object.assign(stats, res.data)
}

onMounted(() => {
  fetchStats()
})
</script>
