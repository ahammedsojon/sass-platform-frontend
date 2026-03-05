<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Tasks</h2>

      <button
        v-if="canManage"
        @click="openCreate"
        class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
      >
        + New Task
      </button>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-2xl shadow overflow-hidden">
      <!-- Table -->
      <div class="bg-white rounded-2xl shadow overflow-hidden">
        <div class="flex justify-between items-center p-4 bg-gray-50">
          <!-- Filters -->
          <div class="flex gap-3">
            <input
              v-model="search"
              @input="fetchTasks()"
              placeholder="Search tasks..."
              class="border rounded-lg px-4 py-2 w-64"
            />

            <select v-model="filterProject" class="border rounded-lg px-3 py-2">
              <option value="">All Projects</option>
              <option v-for="p in projects" :key="p.id" :value="p.id">{{ p.name }}</option>
            </select>

            <select v-model="filterStatus" class="border rounded-lg px-3 py-2">
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <table class="w-full text-left">
          <thead class="bg-gray-50 text-gray-600 text-sm">
            <tr>
              <th class="p-4">Title</th>
              <th class="p-4">Project</th>
              <th class="p-4">Assigned To</th>
              <th class="p-4">Status</th>
              <th v-if="canManage" class="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="task in tasks" :key="task.id" class="border-t hover:bg-gray-50">
              <td class="p-4">{{ task.title }}</td>
              <td class="p-4">{{ task.project?.name }}</td>
              <td class="p-4 flex items-center gap-2">
                <div
                  class="w-6 h-6 rounded-full bg-indigo-200 text-indigo-800 flex items-center justify-center text-xs font-bold"
                >
                  {{ task.assignee?.name?.[0] }}
                </div>
                {{ task.assignee?.name }}
              </td>
              <td class="p-4">
                <span
                  class="px-3 py-1 rounded-full text-xs font-medium"
                  :class="statusClass(task.status)"
                >
                  {{ task.status }}
                </span>
              </td>

              <td v-if="canManage" class="p-4 text-right space-x-2">
                <button @click="openEdit(task)" class="text-blue-600 hover:underline">Edit</button>
                <button @click="deleteTask(task.id)" class="text-red-600 hover:underline">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="flex justify-center items-center gap-2 mt-6">
      <button
        :disabled="pagination.current_page === 1"
        @click="fetchTasks(pagination.current_page - 1)"
        class="px-4 py-2 border rounded-lg"
      >
        Previous
      </button>

      <span class="text-sm text-gray-600">
        Page {{ pagination.current_page }} of {{ pagination.last_page }}
      </span>

      <button
        :disabled="pagination.current_page === pagination.last_page"
        @click="fetchTasks(pagination.current_page + 1)"
        class="px-4 py-2 border rounded-lg"
      >
        Next
      </button>
    </div>

    <!-- Modal -->
    <BaseModal v-model="showModal">
      <h3 class="text-xl font-bold mb-4">
        {{ isEditing ? 'Edit Task' : 'Create Task' }}
      </h3>

      <form @submit.prevent="submitTask" class="space-y-4">
        <input
          v-model="form.title"
          type="text"
          placeholder="Task Title"
          class="w-full border rounded-lg px-4 py-2"
          required
        />

        <textarea
          v-model="form.description"
          placeholder="Description"
          class="w-full border rounded-lg px-4 py-2"
        />

        <select v-model="form.project_id" class="w-full border rounded-lg px-4 py-2" required>
          <option disabled value="">Select Project</option>
          <option v-for="project in projects" :key="project.id" :value="project.id">
            {{ project.name }}
          </option>
        </select>

        <select v-model="form.assigned_to" class="w-full border rounded-lg px-4 py-2" required>
          <option disabled value="">Assign To</option>
          <option v-for="user in users" :key="user.id" :value="user.id">
            {{ user.name }}
          </option>
        </select>

        <select v-model="form.status" class="w-full border rounded-lg px-4 py-2">
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <div
          class="border-2 border-dashed border-gray-300 rounded-lg h-[100px]"
          @dragover.prevent
          @drop.prevent="handleDrop"
        >
          <label class=" flex items-center justify-center w-full h-full">Drag & Drop files here
            or click to upload

            <input
              type="file"
              multiple
              @change="handleFile"
              class="hidden"
              ref="fileInput"
            />
          </label>
        </div>
        <div v-if="selectedFiles.length" class="mt-3 space-y-2">
          <div
            v-for="(file, index) in selectedFiles"
            :key="index"
            class="flex justify-between items-center bg-gray-50 p-2 rounded-lg text-sm"
          >
            <span>{{ file.name }}</span>

            <button
              type="button"
              @click="removeFile(index)"
              class="text-red-500 text-xs"
            >
              Remove
            </button>
          </div>
        </div>

        <div v-if="isEditing && taskAttachments?.length" class="mt-4">
          <h4 class="text-sm font-semibold mb-2">Uploaded Files</h4>

          <div
            v-for="file in taskAttachments"
            :key="file.id"
            class="flex justify-between items-center bg-gray-50 p-3 rounded-lg mb-2"
          >
            <a
              :href="`http://saas-platform.test/storage/${file.file_path}`"
              target="_blank"
              class="text-indigo-600 text-sm hover:underline"
            >
              {{ file.file_name }}
            </a>

            <button
              @click="deleteAttachment(file.id)"
              class="text-red-500 text-xs"
              type="button"
            >
              Delete
            </button>
          </div>
        </div>

        <div class="flex justify-end gap-3">
          <button type="button" @click="showModal = false" class="px-4 py-2 border rounded-lg">
            Cancel
          </button>

          <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-lg">
            {{ isEditing ? 'Update' : 'Create' }}
          </button>
        </div>
      </form>
    </BaseModal>
    <BaseConfirmModal
      v-model="showDeleteModal"
      title="Confirm Delete"
      message="Are you sure you want to delete this task?"
      @confirmed="performDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useToast } from 'vue-toastification'

const toast = useToast()
import api from '../api/axios'
import BaseModal from '../components/BaseModal.vue'
import type { ITask, IProject, IUser } from '@/types'
import { useAuthStore } from '../stores/auth'
import BaseConfirmModal from '@/components/BaseConfirmModal.vue'

const auth = useAuthStore()

const search = ref('')

const tasks = ref<ITask[]>([])
const projects = ref<IProject[]>([])
const users = ref<IUser[]>([])

const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)

const showDeleteModal = ref(false)
const deletingId = ref<number | null>(null)

const filterProject = ref<string | number>('')
const filterStatus = ref<string>('')
const selectedFiles = ref<File[]>([])
const taskAttachments = ref<any[]>([])
const previews = ref([])

const pagination = reactive({
  current_page: 1,
  last_page: 1,
  total: 0,
})

const form = reactive({
  title: '',
  description: '',
  project_id: '' as number | '',
  assigned_to: '' as number | '',
  status: 'pending',
})

const canManage = computed(() => {
  return auth.user?.roles.some((role) => ['Admin', 'Manager'].includes(role.name))
})

const handleFile = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files) return

  const newFile = input.files[0];

  // Append instead of replace
  if(newFile){
    selectedFiles.value.push(newFile);
  }

  // Clear input so same file can be re-selected
  input.value = ''
}
const handleDrop = (event: DragEvent) => {
  event.preventDefault()

  if (!event.dataTransfer) return
  const files = Array.from(event.dataTransfer.files)

  files.forEach(file => {
    selectedFiles.value.push(file)
  })
}
const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1)
}

const fetchTasks = async (page = 1) => {
  const res = await api.get('/tasks', {
    params: {
      page,
      search: search.value,
      status: filterStatus.value,
      project_id: filterProject.value,
    },
  })

  tasks.value = res.data.data
  pagination.current_page = res.data.current_page
  pagination.last_page = res.data.last_page
  pagination.total = res.data.total
}

const fetchUsers = async () => {
  const res = await api.get('/users?role=User')
  users.value = res.data
}

const fetchProjects = async () => {
  const res = await api.get('/projects')
  projects.value = res.data.data
}

const openCreate = () => {
  isEditing.value = false
  form.title = ''
  form.description = ''
  form.project_id = ''
  form.assigned_to = ''
  form.status = 'pending'
  showModal.value = true
}

const openEdit = (task: ITask) => {
  isEditing.value = true
  editingId.value = task.id
  form.title = task.title
  form.description = task.description || ''
  form.project_id = task.project_id
  form.assigned_to = task.assigned_to
  form.status = task.status
  taskAttachments.value = task.attachments || []
  showModal.value = true
}

const submitTask = async () => {
  let taskId: number | null = null

  if (isEditing.value && editingId.value) {
    await api.put(`/tasks/${editingId.value}`, form)
    taskId = editingId.value
    toast.success('Task updated successfully')
  } else {
    const response = await api.post('/tasks', form)
    taskId = response.data.data.id   // make sure API returns id
    toast.success('Task created successfully')
  }

  // Only upload if files exist
  if (selectedFiles.value.length && taskId) {
    const formData = new FormData()
    selectedFiles.value.forEach(file => formData.append('files[]', file))

    api.post(`/tasks/${taskId}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(() => {
      toast.success('Files uploaded successfully')
      fetchTasks() // Refresh to show new attachments
    }).catch(() => {
      toast.error('Failed to upload files')
    })
  }

  showModal.value = false
  selectedFiles.value = [];
  await fetchTasks()
}

const deleteTask = (id: number) => {
  deletingId.value = id
  showDeleteModal.value = true
}

const performDelete = async () => {
  if (deletingId.value === null) return
  try {
    await api.delete(`/tasks/${deletingId.value}`)
    toast.success('Task deleted successfully')
    fetchTasks()
  } catch (error: any) {
    toast.error('Failed to delete task')
  } finally {
    deletingId.value = null
  }
}


const deleteAttachment = async (id: number) => {
  try {
    await api.delete(`/attachments/${id}`)

    // Remove from global attachments
    taskAttachments.value = taskAttachments.value.filter(
      attachment => attachment.id !== id
    )

    // Remove from specific task
    if (editingId.value !== null) {
      console.log(tasks.value)
    }
    fetchTasks();
    toast.success('Attachment deleted successfully')
  } catch (error: any) {
    toast.error('Failed to delete attachment', error)
  }
}

const statusClass = (status: string) => {
  return {
    'bg-yellow-100 text-yellow-700': status === 'pending',
    'bg-blue-100 text-blue-700': status === 'in_progress',
    'bg-green-100 text-green-700': status === 'completed',
  }
}

onMounted(() => {
  fetchTasks()
  fetchProjects()
  fetchUsers()
})
</script>
