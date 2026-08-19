import { api } from './api.js';

export const inquiryService = {
  // Authenticated users can submit & view their own inquiries
  createInquiry: async (data) => {
    const res = await api.post('/inquiries', data);
    return res.data;
  },

  getMyInquiries: async () => {
    const res = await api.get('/inquiries/my');
    return res.data;
  },

  // Admin: list all inquiries
  getInquiries: async (params = {}) => {
    const res = await api.get('/inquiries', { params });
    return res.data;
  },

  // Admin: update inquiry status/notes
  updateInquiry: async (id, data) => {
    const res = await api.put(`/inquiries/${id}`, data);
    return res.data;
  },

  // Admin: delete inquiry
  deleteInquiry: async (id) => {
    const res = await api.delete(`/inquiries/${id}`);
    return res;
  },
};

export default inquiryService;
