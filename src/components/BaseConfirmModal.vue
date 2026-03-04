<template>
  <div v-if="modelValue" class="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative">
      <h3 class="text-lg font-bold mb-4">{{ title }}</h3>
      <p class="mb-6">{{ message }}</p>
      <div class="flex justify-end gap-3">
        <button @click="$emit('update:modelValue', false)" class="px-4 py-2 border rounded-lg">Cancel</button>
        <button @click="confirm" class="px-4 py-2 bg-red-600 text-white rounded-lg">Delete</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ modelValue: boolean, title: string, message: string }>()
const emit = defineEmits(['update:modelValue', 'confirmed'])

const confirm = () => {
  emit('confirmed')
  emit('update:modelValue', false)
}
</script>
