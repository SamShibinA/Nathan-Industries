import React from 'react';
import { HiPhone, HiEnvelope, HiMapPin, HiShieldCheck } from 'react-icons/hi2';
import { Container } from '../common/Container.jsx';
import { APP_CONFIG } from '../../utils/constants.js';

export const TopBar = () => {
  return (
    <div className="bg-slate-100/90 border-b border-slate-200 text-xs text-slate-700 py-2 hidden md:block">
      <Container>
        <div className="flex items-center justify-between">
          {/* Left: Certification & Heritage */}
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-100 border border-red-200 text-red-700 font-bold text-[11px]">
              <HiShieldCheck className="w-3.5 h-3.5 text-red-600" />
              <span>{APP_CONFIG.ISO_CERT} Certified Heavy Engineering</span>
            </div>
            <span className="text-slate-600 text-[11px] font-medium">
              35+ Years Foundry & Turnkey EPC Mastery
            </span>
          </div>

          {/* Right: Hotline & Email */}
          <div className="flex items-center gap-5 text-slate-700 text-[11px]">
            <a
              href={`tel:${APP_CONFIG.PHONE}`}
              className="flex items-center gap-1.5 hover:text-red-600 font-bold transition-colors"
            >
              <HiPhone className="w-3.5 h-3.5 text-red-600" />
              <span>Hotline: {APP_CONFIG.PHONE}</span>
            </a>

            <a
              href={`mailto:${APP_CONFIG.EMAIL}`}
              className="flex items-center gap-1.5 hover:text-red-600 font-medium transition-colors"
            >
              <HiEnvelope className="w-3.5 h-3.5 text-slate-500" />
              <span>{APP_CONFIG.EMAIL}</span>
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default TopBar;
