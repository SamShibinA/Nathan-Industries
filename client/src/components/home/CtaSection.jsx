import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HiDocumentText, 
  HiPhone, 
  HiShieldCheck 
} from 'react-icons/hi2';

import { Container } from '../common/Container.jsx';
import { Button } from '../common/Button.jsx';
import { APP_CONFIG } from '../../utils/constants.js';

export const CtaSection = () => {
  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <Container>
        {/* Elegant CTA Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-lg flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left relative overflow-hidden">
          {/* Subtle decorative accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-red-600 to-red-500" />

          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 font-bold text-xs mb-3 border border-red-100">
              <HiShieldCheck className="w-4 h-4" />
              <span>Heavy Industry Quotation Desk</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mb-3">
              Accelerate Your Crushing Plant or Railway Bridge Project
            </h2>

            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Connect directly with our Chief Plant Design Engineers for quarry capacity analysis, customized flowsheet CAD drawings, and fixed-timeline turnkey EPC execution bids.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto flex-shrink-0">
            <Link to="/contact?type=quote" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                icon={HiDocumentText}
                className="w-full font-bold text-xs uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20 border-0"
              >
                Request Plant RFQ
              </Button>
            </Link>

            <a href={`tel:${APP_CONFIG.PHONE}`} className="w-full sm:w-auto">
              <button
                type="button"
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 shadow-sm flex items-center justify-center gap-2 transition-colors"
              >
                <HiPhone className="w-4 h-4 text-red-600" />
                <span>Call: {APP_CONFIG.PHONE}</span>
              </button>
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CtaSection;
