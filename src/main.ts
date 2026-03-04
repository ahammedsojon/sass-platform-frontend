import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";
import './style.css'

import App from './App.vue'
import router from './router'
import { useAuthStore } from '@/stores/auth.ts'

const app = createApp(App)

app.use(createPinia())
app.use(router)


app.use(Toast, {
  position: POSITION.TOP_RIGHT,
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true
});

const auth = useAuthStore();
auth.fetchUser();

app.mount('#app')
