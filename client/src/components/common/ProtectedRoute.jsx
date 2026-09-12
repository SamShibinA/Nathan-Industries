import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Spinner } from './Spinner.jsx';

/**
 * Protected Route Guard
 * @param {Array<string>} allowedRoles - Optional array of authorized roles (e.g. ['admin', 'customer'])
 */
export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading, isLoggingOut } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-12">
        <Spinner size="lg" />
        <p className="text-xs text-slate-400 mt-3 font-mono">Authenticating secure session...</p>
      </div>
    );
  }

  // When signing out, redirect directly to public home page
  if (isLoggingOut) {
    return <Navigate to="/" replace />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // If not authorized for this specific role, redirect appropriately
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
