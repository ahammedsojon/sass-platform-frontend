<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
  >
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
      <button
        @click="$emit('update:modelValue', false)"
        class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        ✕
      </button>

      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
}>()

defineEmits(['update:modelValue'])
</script>
