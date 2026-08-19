import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HiArrowRight, 
  HiCheckCircle, 
  HiShieldCheck, 
  HiWrenchScrewdriver,
  HiCubeTransparent,
  HiBuildingOffice2,
  HiCpuChip
} from 'react-icons/hi2';

import { Container } from '../common/Container.jsx';
import { Card } from '../common/Card.jsx';
import { Button } from '../common/Button.jsx';
import { Badge } from '../common/Badge.jsx';

export const AboutPreviewSection = () => {
  const highlights = [
    {
      title: 'In-House Induction Foundry',
      desc: 'Formulating high-purity manganese alloy (Mn18Cr2) jaw plates and concaves for up to 40% longer wear life in hard granite.',
      icon: HiWrenchScrewdriver,
    },
    {
      title: 'IS 383 Sand Classification',
      desc: 'Patented dry air-classified VSI M-Sand and P-Sand circuits eliminating water consumption and ensuring silt control below 3%.',
      icon: HiCubeTransparent,
    },
    {
      title: 'Class-1 Railway Bridge EPC',
      desc: 'End-to-end design, steel girder fabrication, and tandem crane launching for major national Railway Overbridge corridors.',
      icon: HiBuildingOffice2,
    },
    {
      title: 'SCADA Smart Automation',
      desc: 'Centralized MCC telemetry panels, auto-choke feed regulation, and thermal vibration monitoring for zero unexpected downtime.',
      icon: HiCpuChip,
    },
  ];

  return (
    <section className="py-16 bg-white border-b border-slate-200 relative overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Narrative */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 flex flex-col gap-4"
          >
            <div>
              <Badge variant="red" size="md" className="mb-2">
                Heavy Engineering Legacy
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Engineering High-Durability Crushing Circuits & Infrastructure Marvels
              </h2>
            </div>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Founded in 1990, <strong>NathanIndustries</strong> has evolved into a premier heavy machinery manufacturer and civil infrastructure contractor. We integrate dedicated induction foundries, heavy CNC boring bays, and specialized bridge erection squads to deliver unmatched industrial durability.
            </p>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Whether building a high-throughput 600 TPH hard rock crushing complex or erecting a 720-meter 4-lane railway overbridge, our zero-compromise metallurgy guarantees maximum return on investment.
            </p>

            <div className="pt-2 flex items-center gap-4">
              <Link to="/about">
                <Button variant="primary" size="md" icon={HiArrowRight} iconPosition="right" className="font-bold text-xs uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white">
                  Discover Our Heritage & Foundry
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right 4-Pillars Grid */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {highlights.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                >
                  <Card className="h-full p-5 bg-slate-50 border-slate-200 hover:border-red-400 hover:bg-white hover:shadow-md flex flex-col justify-between group transition-all">
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all shadow-sm">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors mb-1.5">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-200 text-[11px] text-red-600 font-semibold flex items-center gap-1">
                      <HiCheckCircle className="w-3.5 h-3.5" />
                      <span>Certified Capability</span>
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

export default AboutPreviewSection;
