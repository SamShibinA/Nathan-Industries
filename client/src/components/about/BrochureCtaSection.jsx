import React from 'react';
import { 
  HiArrowDownTray, 
  HiDocumentText, 
  HiShieldCheck, 
  HiCheckCircle 
} from 'react-icons/hi2';

import { Container } from '../common/Container.jsx';
import { Button } from '../common/Button.jsx';
import { Card } from '../common/Card.jsx';
import { Badge } from '../common/Badge.jsx';
import { useToast } from '../../context/ToastContext.jsx';

export const BrochureCtaSection = () => {
  const { showSuccess } = useToast();

  const handleDownload = () => {
    showSuccess('Downloading NathanIndustries Complete Technical Catalog & EPC Portfolio (PDF)...');
  };

  const inclusions = [
    'Complete 100 - 800 TPH Crushing Circuit Flowsheets & Dimension Drawings',
    'Technical Parameters for Jaw, Hydraulic Cone & VSI Sand Makers',
    'IS 383 Zone-II Sand Grading Test Reports & Sieve Analysis Charts',
    'Railway Overbridge (ROB) Structural Fabrication & Launching Methodologies',
    'Foundry Metallurgy Specifications (Mn18Cr2, Mn22, High-Chrome)',
  ];

  return (
    <section className="py-16 bg-white">
      <Container>
        <Card className="p-8 sm:p-12 bg-slate-50 border-slate-200 relative overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Content */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              <div>
                <Badge variant="red" size="md" icon={HiShieldCheck}>
                  Official Engineering Document
                </Badge>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Download the Complete NathanIndustries Corporate & Technical Catalog
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                Get immediate access to comprehensive engineering drawings, machine dimensions, electrical power requirements, and case study profiles in a high-resolution 48-page PDF document.
              </p>

              {/* Inclusions checklist */}
              <div className="flex flex-col gap-2 pt-2">
                {inclusions.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                    <HiCheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Action Box */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-white border border-slate-200 text-center shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mb-4">
                <HiDocumentText className="w-7 h-7" />
              </div>

              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                Technical Profile 2026 Edition
              </span>
              <span className="text-[11px] text-slate-500 mb-5">
                Format: PDF • Size: 18.4 MB • High Res
              </span>

              <Button
                variant="primary"
                size="lg"
                onClick={handleDownload}
                icon={HiArrowDownTray}
                className="w-full font-bold text-xs uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20"
              >
                Download PDF Brochure
              </Button>
            </div>
          </div>
        </Card>
      </Container>
    </section>
  );
};

export default BrochureCtaSection;
