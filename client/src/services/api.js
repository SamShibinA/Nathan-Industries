import axios from 'axios';

let rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// Remove any trailing slash
rawUrl = rawUrl.trim().replace(/\/+$/, '');
// Ensure it points to /api endpoint
if (!rawUrl.endsWith('/api')) {
  rawUrl = `${rawUrl}/api`;
}

export const api = axios.create({
  baseURL: rawUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
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
