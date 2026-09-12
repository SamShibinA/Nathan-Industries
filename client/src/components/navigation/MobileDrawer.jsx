import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiXMark, 
  HiPhone, 
  HiDocumentText, 
  HiArrowRightOnRectangle 
} from 'react-icons/hi2';

import { Button } from '../common/Button.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { NAV_LINKS, APP_CONFIG } from '../../utils/constants.js';

export const MobileDrawer = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  if (!isOpen) return null;

  const isPortalActive = user?.role === 'admin'
    ? location.pathname.startsWith('/admin')
    : location.pathname.startsWith('/dashboard');

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 lg:hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Slide-out Drawer */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white border-l border-slate-200 p-6 flex flex-col justify-between overflow-y-auto shadow-2xl z-10 text-slate-800"
        >
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-red-600/30">
                  N
                </div>
                <div>
                  <div className="font-black text-slate-900 text-base leading-none">
                    NATHAN <span className="text-red-600">INDUSTRIES</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">Heavy Engineering</div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900"
                aria-label="Close menu"
              >
                <HiXMark className="w-6 h-6" />
              </button>
            </div>

            {/* Direct Navigation Links */}
            <div className="flex flex-col gap-1.5">
              {NAV_LINKS.map((link) => {
                const isActive = link.path === '/' 
                  ? location.pathname === '/' 
                  : location.pathname.startsWith(link.path);

                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={onClose}
                    className={`p-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-between ${
                      isActive
                        ? 'bg-red-50 text-red-600 border border-red-200 font-extrabold'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-red-600'
                    }`}
                  >
                    <span>{link.name}</span>
                  </Link>
                );
              })}

              {/* Direct My Actions Link for Mobile */}
              {isAuthenticated && (
                <Link
                  to={user?.role === 'admin' ? '/admin' : '/dashboard'}
                  onClick={onClose}
                  className={`p-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-between ${
                    isPortalActive
                      ? 'bg-red-50 text-red-600 border border-red-200 font-extrabold'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-red-600'
                  }`}
                >
                  <span>My Actions</span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-700 border border-red-200">
                    {user?.role === 'admin' ? 'Admin' : 'Portal'}
                  </span>
                </Link>
              )}
            </div>

            {/* User Quick Info & Sign Out / Auth Actions */}
            {isAuthenticated ? (
              <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-red-600 text-white font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-slate-900 truncate">{user?.name}</span>
                    <span className="text-[10px] font-mono text-red-600 font-bold uppercase">
                      {user?.role === 'admin' ? 'Admin' : 'Client'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 font-semibold transition-colors"
                >
                  <HiArrowRightOnRectangle className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="mt-5 pt-4 border-t border-slate-200 flex items-center gap-2">
                <Link
                  to="/login"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-xs font-bold text-center hover:border-red-400 hover:text-red-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold text-center hover:bg-red-100 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="pt-6 border-t border-slate-200 flex flex-col gap-3 mt-6">
            <Link to="/contact?type=quote" onClick={onClose}>
              <Button
                variant="primary"
                size="md"
                icon={HiDocumentText}
                className="w-full font-bold text-xs uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white"
              >
                Request Plant Quotation
              </Button>
            </Link>

            <a
              href={`tel:${APP_CONFIG.PHONE}`}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 hover:border-red-400 hover:text-red-600"
            >
              <HiPhone className="w-4 h-4 text-red-600" />
              <span>Call Hotline: {APP_CONFIG.PHONE}</span>
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default MobileDrawer;
