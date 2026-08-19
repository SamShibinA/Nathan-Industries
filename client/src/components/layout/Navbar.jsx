import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiPhone, 
  HiEnvelope, 
  HiShieldCheck, 
  HiBars3, 
  HiXMark, 
  HiChevronDown,
  HiDocumentText,
  HiSun,
  HiMoon
} from 'react-icons/hi2';
import { Button } from '../common/Button.jsx';
import { Container } from '../common/Container.jsx';
import { useTheme } from '../../hooks/useTheme.js';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [machineryDropdownOpen, setMachineryDropdownOpen] = useState(false);
  const { isDark, toggleMode } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMachineryDropdownOpen(false);
  }, [location.pathname]);

  const machineryItems = [
    { title: 'Stone Crusher Machines', desc: 'Heavy duty crushing plants & assemblies', to: '/products?category=stone-crushers' },
    { title: 'Jaw Crushers', desc: 'Primary & secondary high-reduction crushers', to: '/products?category=jaw-crushers' },
    { title: 'Cone Crushers', desc: 'Precision hydraulic & compound cone crushers', to: '/products?category=cone-crushers' },
    { title: 'M-Sand & P-Sand Plants', desc: 'High grade manufactured sand production', to: '/products?category=sand-plants' },
    { title: 'Conveyor Systems', desc: 'Heavy industrial material handling belts', to: '/products?category=conveyors' },
    { title: 'Crusher Spare Parts', desc: 'OEM jaw plates, mantles, rollers & screens', to: '/products?category=spare-parts' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* 1. Industrial Top Bar */}
      <div className="bg-navy-950 border-b border-borderDark/60 text-xs py-2 text-slate-300 hidden md:block">
        <Container className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-orange-400 font-semibold">
              <HiShieldCheck className="w-4 h-4 text-orange-500" />
              <span>ISO 9001:2015 Certified Heavy Engineering</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="h-1 w-1 rounded-full bg-slate-600"></span>
              <span>Railway Overbridges & Turnkey Industrial Plants</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <a href="tel:+919876543210" className="flex items-center gap-1.5 hover:text-orange-400 transition-colors">
              <HiPhone className="w-3.5 h-3.5 text-orange-500" />
              <span>+91 98765 43210</span>
            </a>
            <a href="mailto:info@nathanindustries.com" className="flex items-center gap-1.5 hover:text-orange-400 transition-colors">
              <HiEnvelope className="w-3.5 h-3.5 text-orange-500" />
              <span>info@nathanindustries.com</span>
            </a>
          </div>
        </Container>
      </div>

      {/* 2. Main Navigation Bar */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-navy-900/95 backdrop-blur-md shadow-2xl shadow-black/50 border-b border-borderDark py-3'
            : 'bg-navy-900/85 backdrop-blur-sm border-b border-borderDark/50 py-4'
        }`}
      >
        <Container className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-xl text-white tracking-tighter">N</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-orange-400 transition-colors leading-none">
                NATHAN<span className="text-orange-500">INDUSTRIES</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1">
                Heavy Machinery & Infra
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/' ? 'text-orange-400 font-semibold bg-white/5' : 'text-slate-200 hover:text-white hover:bg-white/5'
              }`}
            >
              Home
            </Link>

            {/* Machinery Dropdown Menu */}
            <div
              className="relative"
              onMouseEnter={() => setMachineryDropdownOpen(true)}
              onMouseLeave={() => setMachineryDropdownOpen(false)}
            >
              <button
                className={`flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname.startsWith('/products') ? 'text-orange-400 font-semibold bg-white/5' : 'text-slate-200 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>Machinery & Spares</span>
                <HiChevronDown className={`w-4 h-4 transition-transform duration-200 ${machineryDropdownOpen ? 'rotate-180 text-orange-400' : ''}`} />
              </button>

              {/* Mega Dropdown Panel */}
              <AnimatePresence>
                {machineryDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 w-80 p-3 mt-1 bg-surfaceDark/95 backdrop-blur-xl border border-borderDark rounded-2xl shadow-2xl shadow-black/80 z-50"
                  >
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5 border-b border-borderDark/60 mb-2">
                      Industrial Equipment
                    </div>
                    <div className="flex flex-col gap-1">
                      {machineryItems.map((item, idx) => (
                        <Link
                          key={idx}
                          to={item.to}
                          className="p-2.5 rounded-xl hover:bg-white/5 transition-all group/item"
                        >
                          <div className="text-sm font-bold text-slate-100 group-hover/item:text-orange-400 transition-colors">
                            {item.title}
                          </div>
                          <div className="text-xs text-slate-400 line-clamp-1">
                            {item.desc}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/projects"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname.startsWith('/projects') ? 'text-orange-400 font-semibold bg-white/5' : 'text-slate-200 hover:text-white hover:bg-white/5'
              }`}
            >
              Infrastructure Projects
            </Link>

            <Link
              to="/gallery"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/gallery' ? 'text-orange-400 font-semibold bg-white/5' : 'text-slate-200 hover:text-white hover:bg-white/5'
              }`}
            >
              Gallery
            </Link>

            <Link
              to="/about"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/about' ? 'text-orange-400 font-semibold bg-white/5' : 'text-slate-200 hover:text-white hover:bg-white/5'
              }`}
            >
              About Us
            </Link>

            <Link
              to="/contact"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/contact' ? 'text-orange-400 font-semibold bg-white/5' : 'text-slate-200 hover:text-white hover:bg-white/5'
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Header Action Buttons & Theme Toggler */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleMode}
              className="p-2 rounded-xl bg-surfaceDark border border-borderDark text-slate-300 hover:text-orange-400 hover:border-orange-500/40 transition-all shadow-sm"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme mode"
            >
              {isDark ? <HiSun className="w-4 h-4 text-amber-400" /> : <HiMoon className="w-4 h-4 text-sky-400" />}
            </button>

            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-xs font-semibold">
                Portal Login
              </Button>
            </Link>
            <Link to="/contact?type=quote">
              <Button
                variant="primary"
                size="sm"
                icon={HiDocumentText}
                className="font-bold text-xs uppercase tracking-wider"
              >
                Request Quote
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={toggleMode}
              className="p-2 rounded-lg bg-surfaceDark border border-borderDark text-slate-200"
              aria-label="Toggle theme"
            >
              {isDark ? <HiSun className="w-5 h-5 text-amber-400" /> : <HiMoon className="w-5 h-5 text-sky-400" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-surfaceDark border border-borderDark text-slate-200 hover:text-white focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <HiXMark className="w-6 h-6" /> : <HiBars3 className="w-6 h-6" />}
            </button>
          </div>
        </Container>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-navy-950 border-b border-borderDark px-4 py-6 overflow-hidden"
          >
            <div className="flex flex-col gap-3">
              <Link to="/" className="px-3 py-2 rounded-lg text-slate-200 font-medium hover:bg-white/5">
                Home
              </Link>
              <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-orange-400 border-b border-borderDark/40">
                Machinery & Products
              </div>
              <div className="grid grid-cols-1 gap-1 pl-3">
                {machineryItems.map((item, idx) => (
                  <Link
                    key={idx}
                    to={item.to}
                    className="py-1.5 text-sm text-slate-300 hover:text-orange-400"
                  >
                    • {item.title}
                  </Link>
                ))}
              </div>
              <Link to="/projects" className="px-3 py-2 rounded-lg text-slate-200 font-medium hover:bg-white/5">
                Infrastructure Projects
              </Link>
              <Link to="/gallery" className="px-3 py-2 rounded-lg text-slate-200 font-medium hover:bg-white/5">
                Gallery & Facilities
              </Link>
              <Link to="/about" className="px-3 py-2 rounded-lg text-slate-200 font-medium hover:bg-white/5">
                About NathanIndustries
              </Link>
              <Link to="/contact" className="px-3 py-2 rounded-lg text-slate-200 font-medium hover:bg-white/5">
                Contact & Plant Locations
              </Link>
              <div className="pt-4 flex flex-col gap-2.5">
                <Link to="/contact?type=quote" className="w-full">
                  <Button variant="primary" size="md" className="w-full">
                    Request Machinery Quote
                  </Button>
                </Link>
                <Link to="/login" className="w-full">
                  <Button variant="outline" size="md" className="w-full">
                    Customer / Admin Portal
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
