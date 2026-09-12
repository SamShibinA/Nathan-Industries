import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HiPhone, 
  HiEnvelope, 
  HiMapPin, 
  HiArrowRight, 
  HiShieldCheck, 
  HiDocumentText 
} from 'react-icons/hi2';

import { Container } from '../common/Container.jsx';
import { Button } from '../common/Button.jsx';
import { APP_CONFIG, MACHINERY_CATEGORIES, PROJECT_TYPES } from '../../utils/constants.js';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-300 text-xs">
      {/* Top Pre-Footer Callout Banner (Solid, No Gradient) */}
      <div className="border-b border-slate-800 bg-slate-900/90 py-8">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-950 border border-red-500/30 text-red-400 font-bold text-[11px] mb-2">
                <HiShieldCheck className="w-3.5 h-3.5" />
                <span>Heavy Infrastructure & Foundry Works</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Planning a New Quarry or Crushing Circuit Expansion?
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                Consult with our senior machinery design engineers for plant flowsheet drawings and guaranteed TPH throughput.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link to="/contact?type=quote">
                <Button variant="primary" size="md" icon={HiDocumentText} className="font-bold text-xs uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white">
                  Request Official RFQ
                </Button>
              </Link>

              <a href={`tel:${APP_CONFIG.PHONE}`}>
                <Button variant="outline" size="md" icon={HiPhone} className="font-semibold text-xs text-slate-200 hover:text-white bg-slate-800 border-slate-700 hover:border-red-500">
                  Call {APP_CONFIG.PHONE}
                </Button>
              </a>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Footer Links */}
      <div className="py-12">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Col 1: Brand & Narrative */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-red-600/30 border border-red-700">
                  N
                </div>
                <div>
                  <div className="font-black text-white text-lg tracking-tight">
                    NATHAN <span className="text-red-500">INDUSTRIES</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">Heavy Engineering Works</div>
                </div>
              </Link>

              <p className="text-slate-400 leading-relaxed text-xs max-w-sm">
                Manufacturers of high-capacity stone crusher machines, primary jaw crushers, hydraulic cone crushers, M-Sand VSI plants, overland conveyor corridors, and certified Railway Overbridge contractors.
              </p>

              <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-400">
                <HiShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{APP_CONFIG.ISO_CERT} Certified Quality Management</span>
              </div>
            </div>

            {/* Col 2: Machinery Catalog */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-white border-l-2 border-red-500 pl-2">
                Machinery Products
              </h4>
              <ul className="flex flex-col gap-2">
                {MACHINERY_CATEGORIES.map((item) => (
                  <li key={item.id}>
                    <Link
                      to={`/products?category=${item.id}`}
                      className="hover:text-red-400 transition-colors text-slate-400 flex items-center gap-1.5"
                    >
                      <HiArrowRight className="w-3 h-3 text-red-500/70" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Infrastructure Projects */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-white border-l-2 border-red-500 pl-2">
                Infrastructure
              </h4>
              <ul className="flex flex-col gap-2">
                {PROJECT_TYPES.map((item) => (
                  <li key={item.id}>
                    <Link
                      to={`/projects?type=${item.id}`}
                      className="hover:text-red-400 transition-colors text-slate-400 flex items-center gap-1.5"
                    >
                      <HiArrowRight className="w-3 h-3 text-red-500/70" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4: Plant Headquarters & Contact */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-white border-l-2 border-red-500 pl-2">
                Plant Headquarters
              </h4>
              <div className="flex flex-col gap-3 text-slate-400">
                <div className="flex items-start gap-2">
                  <HiMapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{APP_CONFIG.ADDRESS}</span>
                </div>

                <div className="flex items-center gap-2">
                  <HiPhone className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <a href={`tel:${APP_CONFIG.PHONE}`} className="hover:text-red-400 font-bold text-slate-300">
                    {APP_CONFIG.PHONE}
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <HiEnvelope className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <a href={`mailto:${APP_CONFIG.EMAIL}`} className="hover:text-red-400 text-slate-300">
                    {APP_CONFIG.EMAIL}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-slate-800 py-4 bg-slate-950/60">
        <Container>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
            <div>
              © {currentYear} <strong>NathanIndustries Heavy Engineering Works</strong>. All rights reserved.
            </div>

            <div className="flex items-center gap-4">
              <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
              <Link to="/products" className="hover:text-white transition-colors">Equipment Catalog</Link>
              <Link to="/projects" className="hover:text-white transition-colors">Infrastructure</Link>
              <Link to="/gallery" className="hover:text-white transition-colors">Visual Archive</Link>
              <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
