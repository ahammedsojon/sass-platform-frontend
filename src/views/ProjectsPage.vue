<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Projects</h2>

      <button
        v-if="canManage"
        @click="openCreate"
        class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
      >
        + New Project
      </button>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-2xl shadow overflow-hidden">
      <table class="w-full text-left">
        <thead class="bg-gray-50 text-gray-600 text-sm">
        <tr>
          <th class="p-4">Name</th>
          <th class="p-4">Description</th>
          <th v-if="canManage" class="p-4 text-right">Actions</th>
        </tr>
        </thead>

        <tbody>
        <tr
          v-for="project in projects"
          :key="project.id"
          class="border-t hover:bg-gray-50"
        >
          <td class="p-4">{{ project.name }}</td>
          <td class="p-4">{{ project.description }}</td>

          <td v-if="canManage" class="p-4 text-right space-x-2">
            <button
              @click="openEdit(project)"
              class="text-blue-600 hover:underline"
            >
              Edit
            </button>

            <button
              @click="deleteProject(project.id)"
              class="text-red-600 hover:underline"
            >
              Delete
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <BaseModal v-model="showModal">
      <h3 class="text-xl font-bold mb-4">
        {{ isEditing ? 'Edit Project' : 'Create Project' }}
      </h3>

      <form @submit.prevent="submitProject" class="space-y-4">
        <input
          v-model="form.name"
          type="text"
          placeholder="Project Name"
          class="w-full border rounded-lg px-4 py-2"
          required
        />

        <textarea
          v-model="form.description"
          placeholder="Description"
          class="w-full border rounded-lg px-4 py-2"
        />

        <div class="flex justify-end gap-3">
          <button
            type="button"
            @click="showModal = false"
            class="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            type="submit"
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg"
          >
            {{ isEditing ? 'Update' : 'Create' }}
          </button>
        </div>
      </form>
    </BaseModal>
    <BaseConfirmModal
      v-model="showDeleteModal"
      title="Confirm Delete"
      message="Are you sure you want to delete this project?"
      @confirmed="performDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useToast } from "vue-toastification";
const toast = useToast();
import api from '../api/axios'
import type { IProject } from '@/types'
import BaseModal from '../components/BaseModal.vue'
import { useAuthStore } from '../stores/auth'
import BaseConfirmModal from '@/components/BaseConfirmModal.vue'

const auth = useAuthStore()

const projects = ref<IProject[]>([])
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)


const showDeleteModal = ref(false)
const deletingId = ref<number | null>(null)

const form = reactive({
  name: '',
  description: ''
})

const canManage = computed(() => {
  return auth.user?.roles.some(role =>
    ['Admin', 'Manager'].includes(role.name)
  )
})

const fetchProjects = async () => {
  const res = await api.get('/projects')
  projects.value = res.data
}

const openCreate = () => {
  isEditing.value = false
  form.name = ''
  form.description = ''
  showModal.value = true
}

const openEdit = (project: IProject) => {
  isEditing.value = true
  editingId.value = project.id
  form.name = project.name
  form.description = project.description || ''
  showModal.value = true
}

const submitProject = async () => {
  if (isEditing.value && editingId.value) {
    await api.put(`/projects/${editingId.value}`, form);
    toast.success("Project updated successfully");
  } else {
    await api.post('/projects', form);
    toast.success("Project created successfully");
  }

  showModal.value = false
  await fetchProjects()
}
const deleteProject = (id: number) => {
  deletingId.value = id
  showDeleteModal.value = true
}

const performDelete = async () => {
  if (deletingId.value === null) return;
  try {
    await api.delete(`/projects/${deletingId.value}`)
    toast.success("Project deleted successfully")
    fetchProjects()
  } catch (error: any) {
    toast.error("Failed to delete project")
  } finally {
    deletingId.value = null
  }
}


onMounted(fetchProjects)
</script>
