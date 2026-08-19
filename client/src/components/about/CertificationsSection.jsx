import React from 'react';
import { motion } from 'framer-motion';
import { 
  HiShieldCheck, 
  HiCheckBadge, 
  HiDocumentCheck, 
  HiGlobeAlt, 
  HiBuildingLibrary
} from 'react-icons/hi2';

import { Container } from '../common/Container.jsx';
import { SectionHeading } from '../common/SectionHeading.jsx';
import { Card } from '../common/Card.jsx';
import { Badge } from '../common/Badge.jsx';

export const CertificationsSection = () => {
  const certifications = [
    {
      code: 'ISO 9001:2015',
      title: 'Quality Management System',
      authority: 'TÜV / International Standard Organization',
      desc: 'Certified manufacturing process, traceability of raw materials, calibrated machining tolerances, and stringent quality control.',
      icon: HiShieldCheck,
      badge: 'Certified',
    },
    {
      code: 'IS 383:2016',
      title: 'Concrete Sand Aggregate Standard',
      authority: 'Bureau of Indian Standards (BIS)',
      desc: 'Verified VSI manufactured sand and plastering sand particle distribution passing Zone-II standard sieve requirements.',
      icon: HiDocumentCheck,
      badge: 'Compliant',
    },
    {
      code: 'CE Directive',
      title: 'Machinery Safety Directive 2006/42/EC',
      authority: 'European Conformity Standard',
      desc: 'Ensures full compliance with European mechanical, electrical, and operational health & safety regulations.',
      icon: HiGlobeAlt,
      badge: 'International',
    },
    {
      code: 'Class-1 EPC',
      title: 'Government Infrastructure Contractor',
      authority: 'National Highways & Railway Infrastructure',
      desc: 'Approved Class-1 contractor credentials for major Railway Overbridge (ROB) structural fabrication and civil bridge construction.',
      icon: HiBuildingLibrary,
      badge: 'Govt Approved',
    },
  ];

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <Container>
        <SectionHeading
          badge="Industry Accreditations"
          title="Certified to the Highest Engineering Standards"
          subtitle="Our products, foundry alloys, and infrastructure projects adhere to rigorous national and international quality benchmarks."
          centered
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {certifications.map((cert, idx) => {
            const Icon = cert.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
              >
                <Card className="h-full p-6 bg-white border-slate-200 hover:border-red-400 hover:shadow-md flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center group-hover:scale-105 group-hover:bg-red-600 group-hover:text-white transition-all shadow-sm">
                        <Icon className="w-5 h-5" />
                      </div>
                      <Badge variant="red" size="sm">{cert.badge}</Badge>
                    </div>

                    <span className="text-xs font-mono font-bold text-red-600 block mb-1">
                      {cert.code}
                    </span>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-red-600 transition-colors mb-1">
                      {cert.title}
                    </h3>

                    <span className="text-[11px] text-slate-500 font-semibold block mb-3">
                      Issued by: {cert.authority}
                    </span>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {cert.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                    <HiCheckBadge className="w-4 h-4" />
                    <span>Audited & Active</span>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default CertificationsSection;
