import React from 'react';
import { motion } from 'framer-motion';
import { HiTrophy, HiBuildingLibrary, HiBolt, HiCheckBadge } from 'react-icons/hi2';
import { Container } from '../common/Container.jsx';
import { Card } from '../common/Card.jsx';
import { APP_CONFIG } from '../../utils/constants.js';

export const StatsSection = () => {
  const stats = [
    {
      label: 'Industrial Mastery',
      value: APP_CONFIG.EXPERIENCE_YEARS,
      description: 'Decades of Foundry Metallurgy & Machine Design',
      icon: HiTrophy,
    },
    {
      label: 'Plants Delivered',
      value: APP_CONFIG.PLANTS_DELIVERED,
      description: 'Operating Crushing Plants & Sand Circuits Worldwide',
      icon: HiCheckBadge,
    },
    {
      label: 'Maximum Throughput',
      value: APP_CONFIG.MAX_CAPACITY,
      description: 'Single-Train 3-Stage Crushing Plant Output',
      icon: HiBolt,
    },
    {
      label: 'Railway Overbridges',
      value: APP_CONFIG.ROB_BRIDGES,
      description: 'State Highway & National Freight Corridor Bridges',
      icon: HiBuildingLibrary,
    },
  ];

  return (
    <section className="py-12 bg-slate-50 border-b border-slate-200">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.06 }}
              >
                <Card className="h-full p-4 sm:p-6 bg-white border-slate-200 hover:border-red-400 hover:shadow-md flex flex-col justify-between group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center group-hover:scale-105 group-hover:bg-red-600 group-hover:text-white transition-all shadow-sm">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
                      Metric 0{idx + 1}
                    </span>
                  </div>

                  <div>
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-red-600 tracking-tight font-mono">
                      {stat.value}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors mt-1 mb-1">
                      {stat.label}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                      {stat.description}
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

export default StatsSection;
