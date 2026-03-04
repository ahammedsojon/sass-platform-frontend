<template>
  <div class="bg-white p-8 rounded-2xl shadow-xl">
    <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">
      Welcome Back
    </h2>

    <form @submit.prevent="handleLogin" class="space-y-5">
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">
          Email
        </label>
        <input
          v-model="email"
          type="email"
          required
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          placeholder="Enter your email"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">
          Password
        </label>
        <input
          v-model="password"
          type="password"
          required
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          placeholder="Enter your password"
        />
      </div>

      <button
        type="submit"
        class="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
        :disabled="loading"
      >
        {{ loading ? 'Signing in...' : 'Sign In' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const loading = ref(false)
const auth = useAuthStore()
const router = useRouter()

const handleLogin = async () => {
  loading.value = true;
  try {
    await auth.login(email.value, password.value)
    await router.push('/admin/dashboard')
  } catch (error: any) {
    console.log(error.message);
  } finally {
    loading.value = false;
  }
}
</script>
