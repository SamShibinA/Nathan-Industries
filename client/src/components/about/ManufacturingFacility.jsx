import React, { useState } from 'react';
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
import { Modal } from '../common/Modal.jsx';

export const ManufacturingFacility = () => {
  const [selectedDivision, setSelectedDivision] = useState(null);

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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mb-10">
          {facilityStats.map((st, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.08 }}
            >
              <Card className="p-3 sm:p-5 bg-white border-slate-200 text-center shadow-sm rounded-xl sm:rounded-2xl">
                <span className="text-lg sm:text-2xl lg:text-3xl font-black text-red-600 tracking-tight font-mono block truncate">
                  {st.val}
                </span>
                <h4 className="text-[10px] sm:text-xs font-bold text-slate-900 mt-1 uppercase tracking-wider truncate">
                  {st.label}
                </h4>
                <p className="text-[9px] sm:text-[11px] text-slate-500 mt-0.5 truncate">
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
                <Card 
                  onClick={() => setSelectedDivision(div)}
                  className="h-full p-4 sm:p-6 bg-white border-slate-200 hover:border-red-500 hover:shadow-lg flex flex-col justify-between group cursor-pointer transition-all duration-200"
                >
                  <div>
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mb-3 group-hover:scale-105 group-hover:bg-red-600 group-hover:text-white transition-all shadow-sm">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-red-600 transition-colors mb-2">
                      {div.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {div.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] sm:text-[11px] font-mono font-bold">
                    <span className="text-red-600">⚡ {div.specs}</span>
                    <span className="text-slate-400 group-hover:text-red-600 transition-colors">Inspect →</span>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Division Detail Modal */}
        <Modal
          isOpen={!!selectedDivision}
          onClose={() => setSelectedDivision(null)}
          title={selectedDivision?.title}
          subtitle="Specialized Heavy Manufacturing Division"
        >
          {selectedDivision && (
            <div className="flex flex-col gap-4 text-xs text-slate-700">
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700">
                {React.createElement(selectedDivision.icon, { className: "w-6 h-6 flex-shrink-0 text-red-600" })}
                <span className="font-mono font-bold text-xs">{selectedDivision.specs}</span>
              </div>
              <p className="leading-relaxed text-slate-600">
                {selectedDivision.desc}
              </p>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500">
                ISO 9001:2015 certified heavy engineering division equipped with digital DROs, ultrasonic NDT calibration, and overhead tandem cranes.
              </div>
            </div>
          )}
        </Modal>
      </Container>
    </section>
  );
};

export default ManufacturingFacility;
