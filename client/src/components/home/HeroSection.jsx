import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HiDocumentText, 
  HiArrowRight, 
  HiShieldCheck 
} from 'react-icons/hi2';

import { Container } from '../common/Container.jsx';
import { Button } from '../common/Button.jsx';
import { Badge } from '../common/Badge.jsx';
import { APP_CONFIG } from '../../utils/constants.js';

export const HeroSection = () => {
  const machineryPills = [
    { name: 'Jaw Crushers', spec: '180 - 480 TPH' },
    { name: 'Cone Crushers', spec: 'Multi-Cylinder' },
    { name: 'VSI M-Sand Plants', spec: 'IS 383 Zone-II' },
    { name: 'Railway Overbridges', spec: 'Class-1 EPC' },
  ];

  return (
    <section className="relative min-h-[75vh] flex items-center justify-center bg-white pt-12 pb-16 border-b border-slate-200">
      <Container className="relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Top Certification Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-5 flex flex-wrap items-center justify-center gap-2"
          >
            <Badge variant="red" size="lg" icon={HiShieldCheck}>
              {APP_CONFIG.ISO_CERT} Certified Heavy Engineering Works
            </Badge>
            <span className="text-[11px] font-mono text-slate-700 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200 font-semibold">
              35+ Years Foundry & Turnkey EPC Mastery
            </span>
          </motion.div>

          {/* Solid Bold Hero Title */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-[1.15] mb-5"
          >
            Heavy Crushing Machinery & <br />
            <span className="text-red-600">Turnkey Infrastructure Construction</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mb-8"
          >
            Engineering high-tonnage <strong>Jaw Crushers</strong>, <strong>Hydraulic Cone Crushers</strong>, <strong>IS 383 M-Sand Plants</strong>, and executing national <strong>Railway Overbridges (ROBs)</strong> with guaranteed performance and zero-defect metallurgy.
          </motion.p>

          {/* Dual Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto mb-10"
          >
            <Link to="/contact?type=quote" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                icon={HiDocumentText}
                className="w-full sm:w-auto font-bold text-xs uppercase tracking-wider shadow-md shadow-red-600/20 bg-red-600 hover:bg-red-700 text-white"
              >
                Request Plant Quotation
              </Button>
            </Link>

            <Link to="/products" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                icon={HiArrowRight}
                iconPosition="right"
                className="w-full sm:w-auto font-semibold text-xs text-slate-800 bg-white border-slate-300 hover:border-red-500 hover:text-red-600 hover:bg-red-50/50 shadow-sm"
              >
                Explore Machinery Catalog
              </Button>
            </Link>
          </motion.div>

          {/* Quick Machinery Spec Pills Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-3xl"
          >
            {machineryPills.map((pill, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center shadow-sm hover:border-red-400 transition-all"
              >
                <span className="text-xs font-bold text-slate-900">{pill.name}</span>
                <span className="text-[11px] font-mono text-red-600 mt-0.5 font-semibold">
                  {pill.spec}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default HeroSection;
