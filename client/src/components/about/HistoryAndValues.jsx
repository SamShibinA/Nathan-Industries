import React from 'react';
import { motion } from 'framer-motion';
import { 
  HiFlag, 
  HiEye, 
  HiShieldCheck, 
  HiWrenchScrewdriver, 
  HiBolt, 
  HiHandRaised
} from 'react-icons/hi2';

import { Container } from '../common/Container.jsx';
import { SectionHeading } from '../common/SectionHeading.jsx';
import { Card } from '../common/Card.jsx';
import { Badge } from '../common/Badge.jsx';

export const HistoryAndValues = () => {
  const coreValues = [
    {
      title: 'Metallurgical & Engineering Integrity',
      desc: 'We never compromise on alloy composition. Every jaw plate, shaft, and structural steel girder is tested using ultrasonic spectroscopy.',
      icon: HiShieldCheck,
    },
    {
      title: 'Safety-First & Zero-Defect Protocol',
      desc: 'Rigorous finite element analysis (FEA), stress-relieved weldments, and heavy safety interlocks engineered into every machine and bridge assembly.',
      icon: HiHandRaised,
    },
    {
      title: 'Turnkey Client Accountability',
      desc: 'From initial topographical layout and foundation civil drawings to on-site commissioning and 24/7 breakdown squads, we stand by our clients.',
      icon: HiWrenchScrewdriver,
    },
    {
      title: 'Energy & Environmental Innovation',
      desc: 'Pioneering dry air-classified M-Sand plants that eliminate water consumption and produce 100% IS 383 Zone-II compliant sand.',
      icon: HiBolt,
    },
  ];

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <Container>
        {/* 1. History Narrative & Mission/Vision Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
          {/* History Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 flex flex-col gap-4"
          >
            <div>
              <Badge variant="red" size="md" className="mb-2">Our Genesis</Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Three Decades of Heavy Engineering Legacy
              </h2>
            </div>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Established in 1990 by a team of visionary mechanical and civil structural engineers, <strong>NathanIndustries</strong> began as a specialized machine shop fabricating heavy transmission gears and high-tensile wear castings for the quarry sector.
            </p>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Recognizing the acute demand for high-durability crushing machinery suited for extremely hard abrasive Indian granites and basalts, we established our own induction foundry and heavy CNC tooling bays. By 2005, NathanIndustries launched its flagship integrated 200-500 TPH stone crushing plants.
            </p>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Today, with over 1,200 plants delivered and an expanding infrastructure engineering division constructing vital railway overbridges, we are trusted across private quarry conglomerates, public sector undertakings, and national infrastructure corridors.
            </p>
          </motion.div>

          {/* Mission & Vision Column */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Mission Card */}
            <Card className="p-6 bg-slate-50 border-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center shadow-sm">
                  <HiFlag className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-red-600 block">Our Purpose</span>
                  <h3 className="text-base font-bold text-slate-900">Our Mission</h3>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                To engineer the world’s most robust, energy-efficient stone crushing machinery and execute turnkey infrastructure projects that maximize client profitability, minimize ecological footprints, and accelerate national connectivity.
              </p>
            </Card>

            {/* Vision Card */}
            <Card className="p-6 bg-slate-50 border-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-center shadow-sm">
                  <HiEye className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Long-Term Horizon</span>
                  <h3 className="text-base font-bold text-slate-900">Our Vision</h3>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                To be the global benchmark for intelligent automated crushing ecosystems, sustainable manufactured sand solutions, and heavy civil engineering marvels.
              </p>
            </Card>
          </div>
        </div>

        {/* 2. Core Values Grid */}
        <div>
          <SectionHeading
            badge="Institutional Philosophy"
            title="Core Values That Drive Every Weld, Casting & Bridge"
            subtitle="Our operational and ethical standards guide every engineer across our foundry, assembly floors, and construction sites."
            centered
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((val, idx) => {
              const Icon = val.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: idx * 0.08 }}
                >
                  <Card className="h-full p-6 bg-white border-slate-200 hover:border-red-400 hover:shadow-md flex flex-col justify-between group">
                    <div>
                      <div className="w-11 h-11 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mb-3 group-hover:scale-105 group-hover:bg-red-600 group-hover:text-white transition-all shadow-sm">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors mb-2">
                        {val.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {val.desc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Value #{idx + 1}</span>
                      <span className="text-red-600 font-bold">Uncompromising</span>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HistoryAndValues;
