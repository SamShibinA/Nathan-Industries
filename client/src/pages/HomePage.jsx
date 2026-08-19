import React from 'react';
import { HeroSection } from '../components/home/HeroSection.jsx';
import { StatsSection } from '../components/home/StatsSection.jsx';
import { AboutPreviewSection } from '../components/home/AboutPreviewSection.jsx';
import { FeaturedProductsSection } from '../components/home/FeaturedProductsSection.jsx';
import { LatestProjectsSection } from '../components/home/LatestProjectsSection.jsx';
import { IndustriesServedSection } from '../components/home/IndustriesServedSection.jsx';
import { TestimonialsSection } from '../components/home/TestimonialsSection.jsx';
import { GoogleMapsSection } from '../components/home/GoogleMapsSection.jsx';
import { CtaSection } from '../components/home/CtaSection.jsx';
import { NewsletterSection } from '../components/home/NewsletterSection.jsx';
import { WhatsAppButton } from '../components/common/WhatsAppButton.jsx';

export const HomePage = () => {
  return (
    <div className="flex flex-col gap-0 relative">
      {/* 1. Industrial Hero Section */}
      <HeroSection />

      {/* 2. Company Key Metrics & Stats */}
      <StatsSection />

      {/* 3. Engineering Heritage & About Preview */}
      <AboutPreviewSection />

      {/* 4. Featured Heavy Equipment & Specifications */}
      <FeaturedProductsSection />

      {/* 5. Signature Infrastructure & Turnkey Projects */}
      <LatestProjectsSection />

      {/* 6. Industries & Market Sectors Served */}
      <IndustriesServedSection />

      {/* 7. Client Testimonials & Endorsements */}
      <TestimonialsSection />

      {/* 8. Plant Headquarters & Google Maps Preview */}
      <GoogleMapsSection />

      {/* 9. High-Conversion RFQ Call to Action */}
      <CtaSection />

      {/* 10. Technical Engineering Newsletter */}
      <NewsletterSection />

      {/* 11. Floating WhatsApp Quick-Chat Trigger */}
      <WhatsAppButton />
    </div>
  );
};

export default HomePage;
