import api from './api';
import type { AuthResponse, UserProfile } from '../types/auth.types';

export const authService = {
  register: async (data: { email: string; password: string; firstName: string; lastName: string }) => {
    const res = await api.post<{ success: boolean; data: AuthResponse }>('/auth/register', data);
    return res.data.data;
  },

  login: async (data: { email: string; password: string }) => {
    const res = await api.post<{ success: boolean; data: AuthResponse }>('/auth/login', data);
    return res.data.data;
  },

  me: async (): Promise<UserProfile> => {
    const res = await api.get<{ success: boolean; data: UserProfile }>('/auth/me');
    return res.data.data;
  },
};
