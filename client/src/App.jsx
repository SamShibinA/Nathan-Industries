import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ProtectedRoute } from './components/common/ProtectedRoute.jsx';

import MainLayout from './layouts/MainLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import AuthLayout from './layouts/AuthLayout.jsx';

import CustomerLayout from './layouts/CustomerLayout.jsx';
import CustomerDashboardHome from './pages/customer/CustomerDashboardHome.jsx';
import CustomerQuotesPage from './pages/customer/CustomerQuotesPage.jsx';
import CustomerInquiriesPage from './pages/customer/CustomerInquiriesPage.jsx';
import CustomerDownloadsPage from './pages/customer/CustomerDownloadsPage.jsx';
import CustomerProfilePage from './pages/customer/CustomerProfilePage.jsx';
import CustomerChangePasswordPage from './pages/customer/CustomerChangePasswordPage.jsx';

import HomePage from './pages/HomePage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import ProjectsPage from './pages/ProjectsPage.jsx';
import ProjectDetailPage from './pages/ProjectDetailPage.jsx';
import GalleryPage from './pages/GalleryPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx';
import AdminProductsPage from './pages/admin/AdminProductsPage.jsx';
import AdminProjectsPage from './pages/admin/AdminProjectsPage.jsx';
import AdminGalleryPage from './pages/admin/AdminGalleryPage.jsx';
import AdminQuotesPage from './pages/admin/AdminQuotesPage.jsx';
import AdminInquiriesPage from './pages/admin/AdminInquiriesPage.jsx';
import AdminUsersPage from './pages/admin/AdminUsersPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

export const App = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Website Routes */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="products/:slug" element={<ProductDetailPage />} />
                <Route path="projects" element={<ProjectsPage />} />
                <Route path="projects/:slug" element={<ProjectDetailPage />} />
                <Route path="gallery" element={<GalleryPage />} />
                <Route path="contact" element={<ContactPage />} />
              </Route>

              {/* Authentication Routes (Wrapped in AuthLayout) */}
              <Route element={<AuthLayout />}>
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="forgot-password" element={<ForgotPasswordPage />} />
                <Route path="reset-password/:resetToken" element={<ResetPasswordPage />} />
              </Route>

              {/* Protected Customer Dashboard Routes (Authenticated Users) */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <CustomerLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<CustomerDashboardHome />} />
                <Route path="quotes" element={<CustomerQuotesPage />} />
                <Route path="inquiries" element={<CustomerInquiriesPage />} />
                <Route path="downloads" element={<CustomerDownloadsPage />} />
                <Route path="profile" element={<CustomerProfilePage />} />
                <Route path="change-password" element={<CustomerChangePasswordPage />} />
              </Route>

              {/* Protected Admin CMS Portal Routes (Admin Role Only) */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboardPage />} />
                <Route path="products" element={<AdminProductsPage />} />
                <Route path="projects" element={<AdminProjectsPage />} />
                <Route path="gallery" element={<AdminGalleryPage />} />
                <Route path="quotes" element={<AdminQuotesPage />} />
                <Route path="inquiries" element={<AdminInquiriesPage />} />
                <Route path="users" element={<AdminUsersPage />} />
              </Route>

              {/* 404 Fallback */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
