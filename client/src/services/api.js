import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach Auth Token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nathan_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Unified Error Handling
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred. Please try again.';

    // If 401 Unauthorized, dispatch auth expiration event
    if (error.response?.status === 401) {
      window.dispatchEvent(new Event('auth:unauthorized'));
    }

    return Promise.reject({
      message,
      statusCode: error.response?.status || 500,
      data: error.response?.data,
    });
  }
);

export default api;
