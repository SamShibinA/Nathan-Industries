import { api } from './api.js';

export const quoteService = {
  // Authenticated users can submit & view their own quote requests
  createQuote: async (data) => {
    const res = await api.post('/quotes', data);
    return res.data;
  },

  getMyQuotes: async () => {
    const res = await api.get('/quotes/my');
    return res.data;
  },

  // Admin: list all quotes
  getQuotes: async (params = {}) => {
    const res = await api.get('/quotes', { params });
    return res.data;
  },

  // Admin: update quote status/notes
  updateQuote: async (id, data) => {
    const res = await api.put(`/quotes/${id}`, data);
    return res.data;
  },

  // Admin: delete quote
  deleteQuote: async (id) => {
    const res = await api.delete(`/quotes/${id}`);
    return res;
  },
};

export default quoteService;
