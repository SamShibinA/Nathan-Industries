import { api } from './api.js';

export const authService = {
  getProfile: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },

  updateProfile: async (data) => {
    const res = await api.put('/auth/profile', data);
    return res.data;
  },

  changePassword: async (data) => {
    const res = await api.put('/auth/change-password', data);
    return res;
  },
};

export default authService;
