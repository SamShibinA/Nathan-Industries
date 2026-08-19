import React from 'react';
import { motion } from 'framer-motion';
import { 
  HiWrenchScrewdriver, 
  HiBuildingOffice2, 
  HiSparkles, 
  HiBeaker, 
  HiCpuChip, 
  HiShieldCheck 
} from 'react-icons/hi2';

import { Container } from '../common/Container.jsx';
import { SectionHeading } from '../common/SectionHeading.jsx';
import { Card } from '../common/Card.jsx';
import { Badge } from '../common/Badge.jsx';

export const ManufacturingFacility = () => {
  const facilityStats = [
    { label: 'Plant Land Area', val: '15 Acres', sub: 'Dedicated Industrial Zone' },
    { label: 'Covered Workshop', val: '120,000 Sq.Ft', sub: 'Climate-controlled bays' },
    { label: 'Crane Handling', val: '50 MT Capacity', sub: 'Heavy tandem EOT cranes' },
    { label: 'Skilled Workforce', val: '300+ Engineers', sub: 'Metallurgists & Fabricators' },
  ];

  const divisions = [
    {
      title: 'Induction Melting & Heavy Foundry',
      desc: 'Dual 5-ton medium-frequency induction melting furnaces producing high-purity Mn18Cr2, Mn22, and high-chrome alloy wear castings.',
      specs: '1,200 MT Monthly Casting Capacity',
      icon: HiSparkles,
    },
    {
      title: 'Heavy CNC Horizontal Boring & Milling',
      desc: 'Precision CNC machining centers with digital readouts ensuring micron-level bearing housing tolerances for high-speed eccentric crusher shafts.',
      specs: 'Up to 6-Meter Bed Capacity',
      icon: HiWrenchScrewdriver,
    },
    {
      title: 'Automated Submerged Arc Welding (SAW)',
      desc: 'Robotic welding gantries and computer-controlled gas cutting tables for flawless structural bridge girders and crusher base frames.',
      specs: '100% Full Penetration Ultrasonic Tested',
      icon: HiBuildingOffice2,
    },
    {
      title: 'Metallurgical & Ultrasonic NDT Lab',
      desc: 'In-house optical emission spectrometers, Brinell/Rockwell hardness testers, charpy impact testing, and non-destructive ultrasonic flaws detection.',
      specs: 'ISO 17025 Certified Calibration',
      icon: HiBeaker,
    },
    {
      title: 'Dynamic Balancing & Testing Bay',
      desc: 'Every VSI rotor, pulley, and eccentric shaft undergoes dynamic balancing at full operational RPM to guarantee vibration-free quarry performance.',
      specs: 'Zero-Vibration Certification',
      icon: HiShieldCheck,
    },
    {
      title: 'Electrical SCADA & MCC Panel Bay',
      desc: 'Custom assembly of intelligent motor control centers, soft starters, automated feeder synchronization logic, and remote IoT diagnostic systems.',
      specs: 'Schneider & Siemens Component Tier',
      icon: HiCpuChip,
    },
  ];

  return (
    <section id="facility" className="py-16 bg-slate-50 border-b border-slate-200">
      <Container>
        <SectionHeading
          badge="Infrastructure Powerhouse"
          title="Inside Our 15-Acre Heavy Manufacturing Facility"
          subtitle="Combining advanced metallurgy, massive CNC machine tools, and certified testing labs under one roof."
        />

        {/* Facility Key Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {facilityStats.map((st, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.08 }}
            >
              <Card className="p-5 bg-white border-slate-200 text-center shadow-sm">
                <span className="text-2xl sm:text-3xl font-black text-red-600 tracking-tight font-mono">
                  {st.val}
                </span>
                <h4 className="text-xs font-bold text-slate-900 mt-1 uppercase tracking-wider">
                  {st.label}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {st.sub}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* 6 Specialized Divisions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {divisions.map((div, idx) => {
            const Icon = div.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.06 }}
              >
                <Card className="h-full p-6 bg-white border-slate-200 hover:border-red-400 hover:shadow-md flex flex-col justify-between group">
                  <div>
                    <div className="w-11 h-11 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mb-3 group-hover:scale-105 group-hover:bg-red-600 group-hover:text-white transition-all shadow-sm">
                      <Icon className="w-6 h-6" />
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-red-600 transition-colors mb-2">
                      {div.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {div.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200">
                    <span className="text-[11px] font-mono font-bold text-red-600 block">
                      ⚡ {div.specs}
                    </span>
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

export default ManufacturingFacility;
