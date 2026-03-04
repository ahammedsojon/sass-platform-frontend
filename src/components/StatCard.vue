<template>
  <div class="bg-white p-6 rounded-2xl shadow hover:shadow-md transition">
    <p class="text-sm text-gray-500">{{ title }}</p>
    <p class="text-3xl font-bold mt-2 text-gray-800">{{ value }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  value: number
}>()
</script>
