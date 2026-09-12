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
  HiBars3,
  HiXMark,
  HiBuildingOffice2,
} from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext.jsx';

export const CustomerLayout = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { title: 'Dashboard Overview', to: '/dashboard', icon: HiChartBarSquare },
    { title: 'My Quotes (RFQ)', to: '/dashboard/quotes', icon: HiDocumentText },
    { title: 'My Contact Requests', to: '/dashboard/inquiries', icon: HiEnvelope },
    { title: 'Downloads & Specs', to: '/dashboard/downloads', icon: HiArrowDownTray },
    { title: 'My Profile', to: '/dashboard/profile', icon: HiUser },
    { title: 'Change Password', to: '/dashboard/change-password', icon: HiLockClosed },
  ];

  const currentItem = navItems.find((i) => i.to === location.pathname) || navItems[0];

  return (
    <div className="py-6 sm:py-8 bg-slate-50/70 min-h-[calc(100vh-280px)] text-slate-800">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
          {/* Integrated Portal Sidebar Navigation - Pinned Left */}
          <aside className="w-full lg:w-64 xl:w-72 bg-white border border-slate-200 rounded-2xl shadow-sm p-4 flex-shrink-0 lg:sticky lg:top-24">
            {/* User Brief Card */}
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl mb-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white font-bold text-base flex items-center justify-center shadow-sm flex-shrink-0">
                {user?.name?.charAt(0) || 'C'}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-slate-900 truncate">
                  {user?.name || 'Valued Customer'}
                </span>
                <span className="text-[10px] text-slate-500 font-medium truncate">
                  {user?.companyName || user?.email}
                </span>
              </div>
            </div>

            {/* Mobile Header Bar & Toggle Button */}
            <div className="lg:hidden flex items-center justify-between pb-3 pt-1 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <span className="text-slate-400">Current Section:</span>
                <span className="text-red-600">{currentItem.title}</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 hover:text-red-600 text-xs font-bold flex items-center gap-1"
                aria-label="Toggle Portal Menu"
              >
                {mobileMenuOpen ? <HiXMark className="w-4 h-4" /> : <HiBars3 className="w-4 h-4" />}
                <span>Menu</span>
              </button>
            </div>

            {/* Nav links (Always visible on desktop, collapsible on mobile) */}
            <nav className={`${mobileMenuOpen ? 'flex' : 'hidden'} lg:flex flex-col gap-1 mt-3 lg:mt-0`}>
              {navItems.map((item, idx) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to;

                return (
                  <Link
                    key={idx}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
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

              {/* Admin Portal Shortcut if Admin */}
              {user?.role === 'admin' && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-700 hover:text-red-600 text-xs font-bold transition-colors"
                  >
                    <HiBuildingOffice2 className="w-4 h-4 text-red-600" />
                    <span>Switch to Admin CMS →</span>
                  </Link>
                </div>
              )}

              {/* Sign Out Button */}
              <div className="mt-3 pt-3 border-t border-slate-100">
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-3 py-2 w-full rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                >
                  <HiArrowLeftOnRectangle className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </nav>
          </aside>

          {/* Main Portal View Content Area */}
          <div className="flex-1 min-w-0 w-full">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerLayout;
