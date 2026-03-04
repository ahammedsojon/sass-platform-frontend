import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import LoginPage from '@/views/LoginPage.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import ProjectsPage from '@/views/ProjectsPage.vue'
import TasksPage from '@/views/TasksPage.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import DashboardPage from '@/views/DashboardPage.vue'
import ActivitiesPage from '@/views/ActivitiesPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/auth/',
    component: AuthLayout,
    children: [
      { path: 'login', component: LoginPage }
    ]
  },

  {
    path: '/admin/',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', component: DashboardPage },
      { path: 'dashboard', component: DashboardPage, meta: {title: 'Dashboard'} },
      { path: 'projects', component: ProjectsPage, meta: {title: 'Projects'} },
      { path: 'tasks', component: TasksPage, meta: {title: 'Tasks'} },
      { path: 'activities', component: ActivitiesPage, meta: {title: 'Activity Logs'} }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    return '/auth/login';
  } else if(to.path === '/' && !token) {
    return '/auth/login';
  } else if(to.path === '/' && token) {
    return '/admin/dashboard';
  } else if(to.path === '/auth/login' && token) {
    return '/admin/dashboard';
  } else {
    return;
  }
})

export default router
