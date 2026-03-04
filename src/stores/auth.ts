import {defineStore} from 'pinia';
import type {IUser} from '@/types';
import api from '@/api/axios.ts'

interface AuthState {
  user: IUser | null;
  token: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: localStorage.getItem('token'),
  }),

  actions: {
    async login(email: string, password: string) {
      const response = await api.post('/auth/login', { email, password });
      console.log(response)
      this.token = response.data.token;
      console.log(response.data.token, this.token)
      if(this.token){
        localStorage.setItem('token', this.token);
        await this.fetchUser();
      }
    },

    async fetchUser() {
      if (!this.token) return;
      try {
        const response = await api.get('/me');
        this.user = response.data;
      } catch (error) {
        console.error('Failed to fetch user:', error);
        this.logout();
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
    }
  }
})
