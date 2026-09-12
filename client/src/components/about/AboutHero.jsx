import React from 'react';
import { motion } from 'framer-motion';
import { HiShieldCheck, HiTrophy, HiBuildingOffice2, HiCubeTransparent } from 'react-icons/hi2';
import { Container } from '../common/Container.jsx';
import { Badge } from '../common/Badge.jsx';
import { APP_CONFIG } from '../../utils/constants.js';

export const AboutHero = () => {
  return (
    <section className="py-14 bg-white border-b border-slate-200">
      <Container>
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <Badge variant="red" size="lg" icon={HiShieldCheck} className="mb-4">
            Heavy Engineering & Foundry Heritage
          </Badge>

          {/* Solid Title Typography */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-3 sm:mb-4">
            Precision Heavy Engineering & <br />
            <span className="text-red-600">National Infrastructure Construction</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed mb-6 sm:mb-8">
            Since 1990, <strong>NathanIndustries</strong> has designed, forged, and commissioned over 1,200 heavy crushing complexes, VSI manufactured sand circuits, and landmark railway overbridge networks across the nation.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 w-full max-w-3xl">
            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 font-mono">{APP_CONFIG.EXPERIENCE_YEARS}</span>
              <span className="text-[10px] sm:text-xs text-slate-500 block mt-0.5">Foundry Mastery</span>
            </div>
            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-lg sm:text-xl md:text-2xl font-black text-red-600 font-mono">{APP_CONFIG.PLANTS_DELIVERED}</span>
              <span className="text-[10px] sm:text-xs text-slate-500 block mt-0.5">Crusher Plants</span>
            </div>
            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 font-mono">{APP_CONFIG.MAX_CAPACITY}</span>
              <span className="text-[10px] sm:text-xs text-slate-500 block mt-0.5">Max Throughput</span>
            </div>
            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-lg sm:text-xl md:text-2xl font-black text-red-600 font-mono">{APP_CONFIG.ROB_BRIDGES}</span>
              <span className="text-[10px] sm:text-xs text-slate-500 block mt-0.5">Railway Bridges</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default AboutHero;
