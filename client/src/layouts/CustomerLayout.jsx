import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  HiChartBarSquare,
  HiDocumentText,
  HiEnvelope,
  HiArrowDownTray,
  HiUser,
  HiLockClosed,
  HiArrowLeftOnRectangle,
  HiChevronRight,
  HiBars3,
  HiXMark,
  HiBuildingOffice2,
} from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext.jsx';

export const CustomerLayout = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { title: 'Dashboard Overview', to: '/dashboard', icon: HiChartBarSquare },
    { title: 'My Quotes (RFQ)', to: '/dashboard/quotes', icon: HiDocumentText },
    { title: 'My Contact Requests', to: '/dashboard/inquiries', icon: HiEnvelope },
    { title: 'Downloads & Specs', to: '/dashboard/downloads', icon: HiArrowDownTray },
    { title: 'My Profile', to: '/dashboard/profile', icon: HiUser },
    { title: 'Change Password', to: '/dashboard/change-password', icon: HiLockClosed },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row">
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-black text-base shadow-sm">
            N
          </div>
          <span className="font-extrabold text-sm text-slate-900 tracking-tight">
            Customer Portal
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-red-600"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <HiXMark className="w-5 h-5" /> : <HiBars3 className="w-5 h-5" />}
        </button>
      </div>

      {/* Customer Sidebar (Desktop + Mobile Drawer) */}
      <aside
        className={`${
          mobileOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-white border-r border-slate-200 flex flex-col justify-between flex-shrink-0 shadow-sm z-20`}
      >
        <div>
          {/* Logo / Header */}
          <div className="p-5 border-b border-slate-200 hidden md:flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-red-600/30 border border-red-700">
              N
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1 font-black tracking-tight text-base leading-none">
                <span className="text-slate-900">NATHAN</span>
                <span className="text-red-600">CLIENT</span>
              </div>
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-semibold mt-1">
                Enterprise Client Desk
              </span>
            </div>
          </div>

          {/* User Brief Info */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center text-sm border border-red-200">
              {user?.name?.charAt(0) || 'C'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-slate-900 truncate">
                {user?.name || 'Valued Customer'}
              </span>
              <span className="text-[10px] text-slate-500 truncate">
                {user?.companyName || user?.email || 'Quarry Enterprise'}
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 flex flex-col gap-1">
            {navItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;

              return (
                <Link
                  key={idx}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
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

        {/* User Footer / Sign Out */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] uppercase font-bold text-slate-400">Signed in as</span>
            <span className="text-xs font-bold text-slate-900 truncate">{user?.email}</span>
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Sign Out"
          >
            <HiArrowLeftOnRectangle className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-sm hidden md:flex">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link to="/" className="hover:text-red-600 transition-colors">
              Website
            </Link>
            <HiChevronRight className="w-3 h-3" />
            <span className="text-red-600 font-semibold">Client Dashboard</span>
          </div>

          <div className="flex items-center gap-4">
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="text-xs font-bold text-slate-600 hover:text-red-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
              >
                Go to Admin CMS Portal →
              </Link>
            )}
            <Link
              to="/"
              className="text-xs font-semibold text-slate-700 hover:text-red-600 transition-colors"
            >
              ← Back to Main Site
            </Link>
          </div>
        </header>

        <main className="p-4 sm:p-6 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CustomerLayout;
