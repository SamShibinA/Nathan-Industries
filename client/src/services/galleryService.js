import { api } from './api.js';

export const galleryService = {
  getGalleryItems: async (params = {}) => {
    const res = await api.get('/gallery', { params });
    return res;
  },

  createGalleryItem: async (formData) => {
    const res = await api.post('/gallery', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  updateGalleryItem: async (id, formData) => {
    const res = await api.put(`/gallery/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  deleteGalleryItem: async (id) => {
    const res = await api.delete(`/gallery/${id}`);
    return res;
  },
};

export default galleryService;
