import React from 'react';
import { motion } from 'framer-motion';
import { 
  HiFlag, 
  HiSparkles, 
  HiWrenchScrewdriver, 
  HiBuildingOffice2, 
  HiTrophy, 
  HiBolt,
  HiCpuChip
} from 'react-icons/hi2';

import { Container } from '../common/Container.jsx';
import { SectionHeading } from '../common/SectionHeading.jsx';
import { Card } from '../common/Card.jsx';
import { Badge } from '../common/Badge.jsx';

export const TimelineSection = () => {
  const milestones = [
    {
      year: '1990',
      title: 'Company Foundation',
      desc: 'Established in Tamil Nadu as a precision heavy machinery engineering and fabrication shop servicing local granite quarries.',
      icon: HiFlag,
      tag: 'Inception',
    },
    {
      year: '1998',
      title: 'Dedicated Induction Foundry',
      desc: 'Commissioned dual medium-frequency induction furnaces to manufacture in-house high-manganese (Mn18Cr2) jaw plates and liners.',
      icon: HiSparkles,
      tag: 'Metallurgy',
    },
    {
      year: '2005',
      title: 'Flagship Crushing Plants',
      desc: 'Designed and launched the NI-CP series integrated 200-500 TPH stone crushing plants with primary jaw and secondary cone circuits.',
      icon: HiWrenchScrewdriver,
      tag: 'Equipment',
    },
    {
      year: '2012',
      title: 'M-Sand & P-Sand Revolution',
      desc: 'Patented dry air classifier VSI plant engineering, producing IS 383 Zone-II compliant manufactured sand without water wastage.',
      icon: HiBolt,
      tag: 'Innovation',
    },
    {
      year: '2018',
      title: 'Railway Overbridge (ROB) EPC Division',
      desc: 'Expanded into large-scale civil infrastructure, winning first national Railway Overbridge EPC contract for PSC girder fabrication and launching.',
      icon: HiBuildingOffice2,
      tag: 'Infrastructure',
    },
    {
      year: '2024',
      title: '1,200th Plant & SCADA Telemetry',
      desc: 'Celebrated 1,200+ operating crusher installations worldwide and introduced intelligent SCADA telemetry with automated predictive maintenance.',
      icon: HiCpuChip,
      tag: 'Milestone',
    },
    {
      year: 'Present',
      title: 'Next-Gen Sustainable Heavy Tech',
      desc: 'Engineering high-tonnage 800 TPH hybrid mobile crushing circuits and expanding turnkey bridge undertakings across national freight corridors.',
      icon: HiTrophy,
      tag: 'Future',
    },
  ];

  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <Container>
        <SectionHeading
          badge="Chronological Journey"
          title="Milestones of Engineering Growth"
          subtitle="From a specialized machine shop to an international heavy equipment and infrastructure engineering enterprise."
          centered
        />

        {/* Timeline Track */}
        <div className="relative max-w-4xl mx-auto mt-10">
          {/* Vertical Central Line */}
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-slate-300 -translate-x-1/2 hidden sm:block" />

          <div className="flex flex-col gap-8">
            {milestones.map((item, idx) => {
              const Icon = item.icon;
              const isEven = idx % 2 === 0;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.06 }}
                  className={`flex flex-col sm:flex-row items-center gap-6 ${
                    isEven ? 'sm:flex-row-reverse' : ''
                  }`}
                >
                  {/* Content Card */}
                  <div className="w-full sm:w-1/2">
                    <Card className="p-6 bg-white border-slate-200 hover:border-red-400 hover:shadow-md group">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xl font-black text-red-600 tracking-tight font-mono">
                          {item.year}
                        </span>
                        <Badge variant="red" size="sm">{item.tag}</Badge>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 group-hover:text-red-600 transition-colors mb-2">
                        {item.title}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.desc}
                      </p>
                    </Card>
                  </div>

                  {/* Central Node Icon */}
                  <div className="relative z-10 w-9 h-9 rounded-full bg-white border-2 border-red-600 text-red-600 flex items-center justify-center flex-shrink-0 shadow-md hidden sm:flex">
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Empty Spacer */}
                  <div className="hidden sm:block sm:w-1/2" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default TimelineSection;
