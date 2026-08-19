import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HiBars3, 
  HiDocumentText, 
  HiUser, 
  HiArrowRightOnRectangle 
} from 'react-icons/hi2';

import { Container } from '../common/Container.jsx';
import { Button } from '../common/Button.jsx';
import { MobileDrawer } from './MobileDrawer.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { NAV_LINKS, APP_CONFIG } from '../../utils/constants.js';

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

          {/* Desktop Direct Navigation Links (No dropdowns, clean direct links like Projects) */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.path;

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all relative ${
                    isActive
                      ? 'text-red-600 font-extrabold bg-red-50'
                      : 'text-slate-700 hover:text-red-600 hover:bg-slate-100/80'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-red-600 rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: Request RFQ & Authentication */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2.5">
                <Link
                  to={user?.role === 'admin' ? '/admin' : '/dashboard'}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-800 hover:text-red-600 hover:border-red-300 transition-colors"
                >
                  <HiUser className="w-3.5 h-3.5 text-red-600" />
                  <span className="font-bold">{user?.name?.split(' ')[0]}</span>
                </Link>

                <button
                  onClick={logout}
                  className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 hover:text-rose-600 transition-colors"
                  title="Sign Out"
                >
                  <HiArrowRightOnRectangle className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-red-600 px-3 py-2 transition-colors"
              >
                Sign In
              </Link>
            )}

            {/* Request Quotation Primary Action in Red */}
            <Link to="/contact?type=quote">
              <Button
                variant="primary"
                size="sm"
                icon={HiDocumentText}
                className="font-bold text-xs uppercase tracking-wider shadow-md shadow-red-600/20 bg-red-600 hover:bg-red-700 text-white border-0"
              >
                Request Quotation
              </Button>
            </Link>
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
