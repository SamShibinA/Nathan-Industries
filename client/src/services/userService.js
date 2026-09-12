import { api } from './api.js';

export const userService = {
  // Admin: get all users with optional search & role filters
  getUsers: async (params = {}) => {
    const res = await api.get('/users', { params });
    return res?.data || res;
  },

  // Admin: get single user by ID
  getUserById: async (id) => {
    const res = await api.get(`/users/${id}`);
    return res?.data || res;
  },

  // Admin: update a user's role (customer <-> admin)
  updateUserRole: async (id, role) => {
    const res = await api.put(`/users/${id}/role`, { role });
    return res?.data || res;
  },

  // Admin: toggle active status (activate / deactivate)
  updateUserStatus: async (id, isActive) => {
    const res = await api.put(`/users/${id}/status`, { isActive });
    return res?.data || res;
  },

  // Admin: permanently delete a user
  deleteUser: async (id) => {
    const res = await api.delete(`/users/${id}`);
    return res?.data || res;
  },
};

export default userService;
