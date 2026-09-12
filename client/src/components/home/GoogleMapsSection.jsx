import React from 'react';
import { HiMapPin, HiPhone, HiEnvelope, HiClock, HiArrowTopRightOnSquare } from 'react-icons/hi2';
import { Container } from '../common/Container.jsx';
import { Card } from '../common/Card.jsx';
import { Button } from '../common/Button.jsx';
import { Badge } from '../common/Badge.jsx';
import { APP_CONFIG } from '../../utils/constants.js';

export const GoogleMapsSection = () => {
  return (
    <section className="py-16 bg-slate-50/80 border-b border-slate-200 relative overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Facility Location Details */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <div>
              <Badge variant="red" size="md" className="mb-2">
                Factory & Works Complex
              </Badge>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Visit Our 15-Acre Heavy Manufacturing Complex
            </h2>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              We welcome quarry owners, engineering consultants, and bridge authorities to inspect our heavy induction foundry, CNC vertical boring machines, and pre-assembly testing bays.
            </p>

            <div className="flex flex-col gap-3 text-xs text-slate-700">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                <HiMapPin className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Works Address</span>
                  <span className="text-slate-600">{APP_CONFIG.ADDRESS}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <HiPhone className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Plant Desk</span>
                    <span className="text-slate-600">{APP_CONFIG.PHONE}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <HiClock className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Working Hours</span>
                    <span className="text-slate-600">{APP_CONFIG.WORKING_HOURS}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://maps.google.com/?q=Coimbatore+Industrial+Estate"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="primary" size="md" icon={HiArrowTopRightOnSquare} iconPosition="right" className="font-bold text-xs uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white">
                  Open in Google Maps
                </Button>
              </a>
            </div>
          </div>

          {/* Interactive Map Visual */}
          <div className="lg:col-span-7">
            <Card className="p-2 bg-white border-slate-200 overflow-hidden shadow-md relative">
              <div className="aspect-[16/10] w-full rounded-xl bg-slate-100 overflow-hidden relative flex items-center justify-center border border-slate-200">
                <iframe
                  title="NathanIndustries Heavy Manufacturing Complex"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125322.44173167191!2d76.88483285820311!3d11.014126299999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba859af2f971cb5%3A0x2fc1c81e183ed282!2sCoimbatore%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />

                {/* Map Floating Pin Overlay */}
                <div className="absolute top-4 left-4 p-3 rounded-xl bg-white/95 border border-slate-200 shadow-lg max-w-xs pointer-events-none hidden sm:block">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-600 animate-ping" />
                    <span className="text-xs font-bold text-slate-900">Heavy Works Complex</span>
                  </div>
                  <span className="text-[11px] text-slate-600 block mt-1 font-mono">
                    Phase IV Industrial Estate, Coimbatore
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default GoogleMapsSection;
