import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar.jsx';
import { Footer } from './Footer.jsx';

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-darkBg text-slate-100 selection:bg-orange-500 selection:text-white">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
