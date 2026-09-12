import React, { useState } from 'react';
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
  HiBars3,
  HiXMark,
  HiShieldCheck
} from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext.jsx';

export const AdminLayout = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  // Menu starts in open state on phone screens until explicitly toggled closed
  const [mobileMenuOpen, setMobileMenuOpen] = useState(true);

  const navItems = [
    { title: 'Dashboard Overview', to: '/admin', icon: HiChartBarSquare },
    { title: 'Machinery Catalog', to: '/admin/products', icon: HiWrenchScrewdriver },
    { title: 'Infra Projects', to: '/admin/projects', icon: HiBuildingOffice2 },
    { title: 'Quotation Leads (RFQ)', to: '/admin/quotes', icon: HiDocumentText },
    { title: 'Contact Requests', to: '/admin/inquiries', icon: HiInboxStack },
    { title: 'Media & Gallery', to: '/admin/gallery', icon: HiPhoto },
    { title: 'User Management', to: '/admin/users', icon: HiUsers },
  ];

  const currentItem = navItems.find((i) => i.to === location.pathname) || navItems[0];

  return (
    <div className="py-6 sm:py-8 bg-slate-50/70 min-h-[calc(100vh-280px)] text-slate-800">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
          {/* Integrated Admin Sidebar Navigation - Pinned Left */}
          <aside className="w-full lg:w-64 xl:w-72 bg-white border border-slate-200 rounded-2xl shadow-sm p-4 flex-shrink-0 lg:sticky lg:top-24">
            {/* Admin Header Badge */}
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl mb-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white font-bold text-base flex items-center justify-center shadow-sm flex-shrink-0">
                <HiShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-slate-900 truncate">
                  {user?.name || 'Administrator'}
                </span>
                <span className="text-[10px] font-mono text-red-600 font-bold uppercase truncate">
                  Executive Admin Desk
                </span>
              </div>
            </div>

            {/* Mobile Header Bar & Toggle Button */}
            <div className="lg:hidden flex items-center justify-between pb-3 pt-1 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <span className="text-slate-400">CMS Section:</span>
                <span className="text-red-600">{currentItem.title}</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 hover:text-red-600 text-xs font-bold flex items-center gap-1"
                aria-label="Toggle Admin CMS Menu"
              >
                {mobileMenuOpen ? <HiXMark className="w-4 h-4" /> : <HiBars3 className="w-4 h-4" />}
                <span>Menu</span>
              </button>
            </div>

            {/* Nav links (Always visible on desktop, open on mobile until closed) */}
            <nav className={`${mobileMenuOpen ? 'flex' : 'hidden'} lg:flex flex-col gap-1 mt-3 lg:mt-0`}>
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

              {/* Client Portal Preview Link */}
              <div className="mt-3 pt-3 border-t border-slate-100">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-700 hover:text-red-600 text-xs font-bold transition-colors"
                >
                  <HiDocumentText className="w-4 h-4 text-slate-500" />
                  <span>Preview Client Portal →</span>
                </Link>
              </div>

              {/* Sign Out Button - Hidden on phone screens */}
              <div className="hidden lg:block mt-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={logout}
                  className="flex items-center gap-2 px-3 py-2 w-full rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                >
                  <HiArrowLeftOnRectangle className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </nav>
          </aside>

          {/* Main CMS View Content Area */}
          <div className="flex-1 min-w-0 w-full">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
