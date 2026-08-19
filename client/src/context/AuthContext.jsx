import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api.js';
import { useToast } from './ToastContext.jsx';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('nathan_auth_token') || null);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useToast();

  // Load user profile on startup if token exists
  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('nathan_auth_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res?.data?.user) {
            setUser(res.data.user);
            localStorage.setItem('nathan_user_data', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Session expired or invalid:', err);
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();

    // Listen for global 401 unauthorized events from Axios
    const handleUnauthorized = () => {
      logout();
      showError('Session expired. Please log in again.');
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  /**
   * Login user with credentials
   */
  const login = useCallback(async ({ email, password }) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { user: userData, token: authToken } = res.data;

      setUser(userData);
      setToken(authToken);
      localStorage.setItem('nathan_auth_token', authToken);
      localStorage.setItem('nathan_user_data', JSON.stringify(userData));

      showSuccess(`Welcome back, ${userData.name}! Logged in as ${userData.role.toUpperCase()}.`);
      return userData;
    } catch (err) {
      showError(err.message || 'Login failed. Please verify your credentials.');
      throw err;
    }
  }, [showSuccess, showError]);

  /**
   * Register new customer / client account
   */
  const register = useCallback(async (formData) => {
    try {
      const res = await api.post('/auth/register', formData);
      const { user: userData, token: authToken } = res.data;

      setUser(userData);
      setToken(authToken);
      localStorage.setItem('nathan_auth_token', authToken);
      localStorage.setItem('nathan_user_data', JSON.stringify(userData));

      showSuccess('Registration successful! Welcome to NathanIndustries.');
      return userData;
    } catch (err) {
      showError(err.message || 'Registration failed. Please check form details.');
      throw err;
    }
  }, [showSuccess, showError]);

  /**
   * Request password reset token via email
   */
  const forgotPassword = useCallback(async (email) => {
    try {
      const res = await api.post('/auth/forgot-password', { email });
      showSuccess(res.message || 'Password reset link has been dispatched to your email.');
      return res.data;
    } catch (err) {
      showError(err.message || 'Failed to process password reset request.');
      throw err;
    }
  }, [showSuccess, showError]);

  /**
   * Reset password using token
   */
  const resetPassword = useCallback(async (resetToken, password) => {
    try {
      const res = await api.post(`/auth/reset-password/${resetToken}`, { password });
      const { user: userData, token: authToken } = res.data;

      setUser(userData);
      setToken(authToken);
      localStorage.setItem('nathan_auth_token', authToken);
      localStorage.setItem('nathan_user_data', JSON.stringify(userData));

      showSuccess('Password reset successfully. You are now logged in.');
      return userData;
    } catch (err) {
      showError(err.message || 'Failed to reset password.');
      throw err;
    }
  }, [showSuccess, showError]);

  /**
   * Logout user
   */
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('nathan_auth_token');
    localStorage.removeItem('nathan_user_data');
  }, []);

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'admin';
  const isCustomer = user?.role === 'customer';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        isCustomer,
        login,
        register,
        forgotPassword,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
