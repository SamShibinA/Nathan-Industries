import React from 'react';
import { AboutHero } from '../components/about/AboutHero.jsx';
import { HistoryAndValues } from '../components/about/HistoryAndValues.jsx';
import { ManufacturingFacility } from '../components/about/ManufacturingFacility.jsx';
import { CertificationsSection } from '../components/about/CertificationsSection.jsx';
import { TimelineSection } from '../components/about/TimelineSection.jsx';
import { LeadershipSection } from '../components/about/LeadershipSection.jsx';
import { FactoryGallerySection } from '../components/about/FactoryGallerySection.jsx';
import { BrochureCtaSection } from '../components/about/BrochureCtaSection.jsx';

export const AboutPage = () => {
  return (
    <div className="bg-white min-h-screen text-slate-800">
      <AboutHero />
      <HistoryAndValues />
      <ManufacturingFacility />
      <CertificationsSection />
      <TimelineSection />
      <LeadershipSection />
      <FactoryGallerySection />
      <BrochureCtaSection />
    </div>
  );
};

export default AboutPage;
