import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  HiChartBarSquare, 
  HiWrenchScrewdriver, 
  HiBuildingOffice2, 
  HiInboxStack, 
  HiDocumentText, 
  HiPhoto, 
  HiUsers, 
  HiArrowLeftOnRectangle,
  HiChevronRight
} from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext.jsx';

export const AdminLayout = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { title: 'Dashboard Overview', to: '/admin', icon: HiChartBarSquare },
    { title: 'Machinery Catalog', to: '/admin/products', icon: HiWrenchScrewdriver },
    { title: 'Infra Projects', to: '/admin/projects', icon: HiBuildingOffice2 },
    { title: 'Quotation Leads (RFQ)', to: '/admin/quotes', icon: HiDocumentText },
    { title: 'Contact Requests', to: '/admin/inquiries', icon: HiInboxStack },
    { title: 'Media & Gallery', to: '/admin/gallery', icon: HiPhoto },
    { title: 'User Management', to: '/admin/users', icon: HiUsers },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between hidden md:flex shadow-sm">
        <div>
          {/* Admin Header */}
          <div className="p-5 border-b border-slate-200 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-red-600/30 border border-red-700">
              N
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1 font-black tracking-tight text-base leading-none">
                <span className="text-slate-900">NATHAN</span>
                <span className="text-red-600">INDUSTRIES</span>
              </div>
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-semibold mt-1">
                Heavy Engineering Works
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 flex flex-col gap-1">
            {navItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={idx}
                  to={item.to}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                      : 'text-slate-700 hover:text-red-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Footer / Logout */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-900">{user?.name || 'Administrator'}</span>
            <span className="text-[10px] text-slate-500">{user?.email || 'admin@nathanindustries.com'}</span>
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Logout"
          >
            <HiArrowLeftOnRectangle className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Admin Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link to="/" className="hover:text-red-600">Website</Link>
            <HiChevronRight className="w-3 h-3" />
            <span className="text-red-600 font-semibold">Admin CMS</span>
          </div>

          <Link
            to="/"
            className="text-xs font-semibold text-slate-700 hover:text-red-600 transition-colors"
          >
            ← View Public Site
          </Link>
        </header>

        <main className="p-6 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
