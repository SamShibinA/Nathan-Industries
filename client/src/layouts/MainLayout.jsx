import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/navigation/Navbar.jsx';
import { Footer } from '../components/navigation/Footer.jsx';
import { Breadcrumb } from '../components/common/Breadcrumb.jsx';

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 selection:bg-red-600 selection:text-white">
      {/* Top Header */}
      <Navbar />

      {/* Dynamic Breadcrumbs for Subpages */}
      <Breadcrumb />

      {/* Page Content Outlet */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      {/* Production Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
