import { api } from './api.js';

export const projectService = {
  // Public Catalog Queries
  getProjects: async (params = {}) => {
    const res = await api.get('/projects', { params });
    return res;
  },

  getProjectBySlugOrId: async (slugOrId) => {
    const res = await api.get(`/projects/${slugOrId}`);
    return res.data;
  },

  // Admin Management Endpoints
  createProject: async (formData) => {
    const res = await api.post('/projects', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  updateProject: async (id, formData) => {
    const res = await api.put(`/projects/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  deleteProject: async (id) => {
    const res = await api.delete(`/projects/${id}`);
    return res;
  },
};

export default projectService;
