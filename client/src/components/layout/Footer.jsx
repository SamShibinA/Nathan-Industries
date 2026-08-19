import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HiPhone, 
  HiEnvelope, 
  HiMapPin, 
  HiArrowRight,
  HiShieldCheck,
  HiCheckBadge,
  HiClock
} from 'react-icons/hi2';
import { Container } from '../common/Container.jsx';

export const Footer = () => {
  return (
    <footer className="bg-navy-950 text-slate-400 border-t border-borderDark/80 pt-16 pb-8 relative overflow-hidden">
      {/* Background Accent Mesh */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-navy-600/10 rounded-full blur-3xl pointer-events-none" />

      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-borderDark/60">
          {/* Column 1: Company Profile */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                <span className="font-extrabold text-xl text-white">N</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-white leading-none">
                  NATHAN<span className="text-orange-500">INDUSTRIES</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1">
                  Heavy Machinery & Infrastructure
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm mt-2">
              Premier industrial equipment engineering and turnkey infrastructure corporation. Manufacturing high-capacity stone crushers, jaw & cone plants, M-Sand systems, and constructing railway overbridges with German-precision standards.
            </p>

            <div className="flex flex-wrap gap-3 mt-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surfaceDark border border-borderDark text-xs font-semibold text-slate-200">
                <HiShieldCheck className="w-4 h-4 text-orange-500" />
                <span>ISO 9001:2015</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surfaceDark border border-borderDark text-xs font-semibold text-slate-200">
                <HiCheckBadge className="w-4 h-4 text-emerald-400" />
                <span>OEM Verified Spares</span>
              </div>
            </div>
          </div>

          {/* Column 2: Machinery Products */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-1">
              Machinery & Plants
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <Link to="/products?category=stone-crushers" className="hover:text-orange-400 transition-colors flex items-center gap-1.5">
                  <HiArrowRight className="w-3 h-3 text-orange-500/60" /> Stone Crusher Units
                </Link>
              </li>
              <li>
                <Link to="/products?category=jaw-crushers" className="hover:text-orange-400 transition-colors flex items-center gap-1.5">
                  <HiArrowRight className="w-3 h-3 text-orange-500/60" /> Jaw Crushers
                </Link>
              </li>
              <li>
                <Link to="/products?category=cone-crushers" className="hover:text-orange-400 transition-colors flex items-center gap-1.5">
                  <HiArrowRight className="w-3 h-3 text-orange-500/60" /> Cone Crushers
                </Link>
              </li>
              <li>
                <Link to="/products?category=sand-plants" className="hover:text-orange-400 transition-colors flex items-center gap-1.5">
                  <HiArrowRight className="w-3 h-3 text-orange-500/60" /> M-Sand & P-Sand Plants
                </Link>
              </li>
              <li>
                <Link to="/products?category=conveyors" className="hover:text-orange-400 transition-colors flex items-center gap-1.5">
                  <HiArrowRight className="w-3 h-3 text-orange-500/60" /> Heavy Conveyor Systems
                </Link>
              </li>
              <li>
                <Link to="/products?category=spare-parts" className="hover:text-orange-400 transition-colors flex items-center gap-1.5">
                  <HiArrowRight className="w-3 h-3 text-orange-500/60" /> Crusher Spare Parts
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Engineering Services */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-1">
              Engineering & Projects
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <Link to="/projects?category=rob" className="hover:text-orange-400 transition-colors flex items-center gap-1.5">
                  <HiArrowRight className="w-3 h-3 text-orange-500/60" /> Railway Overbridges
                </Link>
              </li>
              <li>
                <Link to="/projects?category=crusher-plants" className="hover:text-orange-400 transition-colors flex items-center gap-1.5">
                  <HiArrowRight className="w-3 h-3 text-orange-500/60" /> Turnkey Crusher Plants
                </Link>
              </li>
              <li>
                <Link to="/projects?category=infra" className="hover:text-orange-400 transition-colors flex items-center gap-1.5">
                  <HiArrowRight className="w-3 h-3 text-orange-500/60" /> Industrial Infrastructure
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-orange-400 transition-colors flex items-center gap-1.5">
                  <HiArrowRight className="w-3 h-3 text-orange-500/60" /> Engineering Capability
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-orange-400 transition-colors flex items-center gap-1.5">
                  <HiArrowRight className="w-3 h-3 text-orange-500/60" /> Media & Video Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Locations */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-1">
              Headquarters & Plant
            </h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li className="flex items-start gap-2.5">
                <HiMapPin className="w-4 h-4 text-orange-500 flex-shrink-0 mt-1" />
                <span>Heavy Engineering Zone, Phase IV, Industrial Estate, Tamil Nadu, India</span>
              </li>
              <li className="flex items-center gap-2.5">
                <HiPhone className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <a href="tel:+919876543210" className="hover:text-white transition-colors">+91 98765 43210</a>
              </li>
              <li className="flex items-center gap-2.5">
                <HiEnvelope className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <a href="mailto:info@nathanindustries.com" className="hover:text-white transition-colors">info@nathanindustries.com</a>
              </li>
              <li className="flex items-center gap-2.5 text-xs text-slate-400">
                <HiClock className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>Mon - Sat: 8:30 AM - 7:00 PM IST</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} NathanIndustries Ltd. All rights reserved. Precision Heavy Machinery & Infrastructure.
          </div>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-slate-200 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-200 transition-colors">Terms of Equipment Warranty</Link>
            <Link to="/login" className="text-slate-400 hover:text-orange-400 transition-colors">Staff Portal</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
