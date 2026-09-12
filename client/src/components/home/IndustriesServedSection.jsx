import React from 'react';
import { motion } from 'framer-motion';
import { 
  HiBuildingLibrary, 
  HiGlobeAmericas, 
  HiTruck, 
  HiBuildingOffice2, 
  HiCubeTransparent, 
  HiWrenchScrewdriver 
} from 'react-icons/hi2';

import { Container } from '../common/Container.jsx';
import { SectionHeading } from '../common/SectionHeading.jsx';
import { Card } from '../common/Card.jsx';
import { Badge } from '../common/Badge.jsx';

export const IndustriesServedSection = () => {
  const industries = [
    {
      title: 'Quarry & Aggregates',
      desc: 'High-tonnage primary reduction and cubical shaping circuits for granite, basalt, quartzite, and river gravel.',
      icon: HiCubeTransparent,
    },
    {
      title: 'Railway Infrastructure',
      desc: 'Certified Track Ballast crushing plants and Class-1 EPC Railway Overbridge (ROB) structural engineering.',
      icon: HiBuildingLibrary,
    },
    {
      title: 'Highways & Expressways',
      desc: 'GSB, WMM, and asphalt aggregate manufacturing setups delivering uniform flakiness and elongation indices.',
      icon: HiTruck,
    },
    {
      title: 'Ready-Mix Concrete (RMC)',
      desc: 'IS 383 Zone-II concrete sand manufacturing circuits with dry air classification for optimal water-cement ratio.',
      icon: HiBuildingOffice2,
    },
    {
      title: 'Mining & Mineral Processing',
      desc: 'Heavy-duty primary jaw breakers and secondary cone reduction stations for iron ore, bauxite, and limestone.',
      icon: HiGlobeAmericas,
    },
    {
      title: 'Foundry Castings & Spares',
      desc: 'Manganese alloy jaw plates, cone mantles, and blow bars manufactured in our dedicated induction casting facility.',
      icon: HiWrenchScrewdriver,
    },
  ];

  return (
    <section className="py-16 bg-slate-50/80 border-b border-slate-200 relative overflow-hidden">
      <Container>
        <SectionHeading
          badge="Sectors Powered"
          title="Heavy Industries Powered by Nathan Machinery"
          subtitle="Providing custom crushing plants, certified railway bridges, and metallurgical wear castings across national infrastructure sectors."
          centered
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((ind, idx) => {
            const Icon = ind.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
              >
                <Card className="h-full p-4 sm:p-6 bg-white border-slate-200 hover:border-red-400 hover:shadow-md flex flex-col justify-between group">
                  <div>
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all shadow-sm">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-red-600 transition-colors mb-2">
                      {ind.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {ind.desc}
                    </p>
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

export default IndustriesServedSection;
