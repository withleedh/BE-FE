import api from './api';
import type { LoginRequest, LoginResponse } from '../types';

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    console.log('authService: login called with credentials');
    try {
      console.log('authService: making POST request to /auth/login');
      const response = await api.post<LoginResponse>('/auth/login', credentials);
      console.log('authService: response received:', response);
      return response.data;
    } catch (error) {
      console.error('authService: login error:', error);
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  register: async (data: { username: string; email: string; password: string }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
};