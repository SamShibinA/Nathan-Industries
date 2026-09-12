import { api } from './api.js';

export const productService = {
  // Public Catalog Queries
  getProducts: async (params = {}) => {
    const res = await api.get('/products', { params });
    return res;
  },

  getProductBySlugOrId: async (slugOrId) => {
    const res = await api.get(`/products/${slugOrId}`);
    return res?.data || res;
  },

  // Admin Management Endpoints
  createProduct: async (formData) => {
    const res = await api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  updateProduct: async (id, formData) => {
    const res = await api.put(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  deleteProduct: async (id) => {
    const res = await api.delete(`/products/${id}`);
    return res;
  },
};

export default productService;
