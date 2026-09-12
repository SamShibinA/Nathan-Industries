import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiBars3, HiArrowRightOnRectangle } from 'react-icons/hi2';

import { Container } from '../common/Container.jsx';
import { MobileDrawer } from './MobileDrawer.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { NAV_LINKS } from '../../utils/constants.js';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  // Handle Navbar Shadow on Scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [location.pathname]);

  const navbarBgClass = isScrolled
    ? 'bg-white border-b border-slate-200 shadow-md'
    : 'bg-white/95 border-b border-slate-200/80';

  // Check if current route is within the customer or admin portal
  const isPortalActive = user?.role === 'admin'
    ? location.pathname.startsWith('/admin')
    : location.pathname.startsWith('/dashboard');

  return (
    <header className={`sticky top-0 z-40 w-full transition-all duration-200 ${navbarBgClass}`}>
      <Container>
        <div className="flex items-center justify-between h-20">
          {/* Company Brand Logo - Red and White */}
          <Link to="/" className="flex items-center gap-3 group">
            {/* Geometric Industrial Emblem */}
            <div className="w-11 h-11 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-red-600/30 group-hover:bg-red-700 transition-all border border-red-700">
              N
            </div>

            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5 font-black tracking-tight text-xl leading-none">
                <span className="text-slate-900">NATHAN</span>
                <span className="text-red-600">INDUSTRIES</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-semibold mt-1">
                Heavy Engineering Works
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {NAV_LINKS.map((link) => {
              const isActive = link.path === '/' 
                ? location.pathname === '/' 
                : location.pathname.startsWith(link.path);

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all relative flex items-center gap-1.5 ${
                    isActive
                      ? 'text-red-600 font-extrabold bg-red-50'
                      : 'text-slate-700 hover:text-red-600 hover:bg-slate-100/80'
                  }`}
                >
                  <span>{link.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-red-600 rounded-full"
                    />
                  )}
                </Link>
              );
            })}

            {/* Direct Link: My Actions (navigates to customer dashboard or admin CMS) */}
            {isAuthenticated && (
              <Link
                to={user?.role === 'admin' ? '/admin' : '/dashboard'}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all relative flex items-center gap-1.5 ${
                  isPortalActive
                    ? 'text-red-600 font-extrabold bg-red-50'
                    : 'text-slate-700 hover:text-red-600 hover:bg-slate-100/80'
                }`}
              >
                <span>My Actions</span>
                {isPortalActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-3 right-3 h-0.5 bg-red-600 rounded-full"
                  />
                )}
              </Link>
            )}
          </nav>

          {/* Right Actions: User Status & Sign In */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800">
                  <div className="w-5 h-5 rounded-full bg-red-600 text-white font-bold text-[10px] flex items-center justify-center">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="font-bold max-w-[110px] truncate">{user?.name}</span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-700">
                    {user?.role === 'admin' ? 'Admin' : 'Client'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors text-xs font-semibold"
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <HiArrowRightOnRectangle className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20 transition-all"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Hamburger Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-red-600"
              aria-label="Open mobile navigation drawer"
            >
              <HiBars3 className="w-6 h-6" />
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Navigation Drawer */}
      <MobileDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
      />
    </header>
  );
};

export default Navbar;
