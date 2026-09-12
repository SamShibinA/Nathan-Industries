import React from 'react';
import { motion } from 'framer-motion';
import { HiAcademicCap } from 'react-icons/hi2';

import { Container } from '../common/Container.jsx';
import { SectionHeading } from '../common/SectionHeading.jsx';
import { Card } from '../common/Card.jsx';

export const LeadershipSection = () => {
  const leaders = [
    {
      name: 'N. S. Nathan',
      role: 'Founder & Executive Chairman',
      exp: '40+ Years Heavy Engineering',
      qual: 'B.E. Mechanical Engineering',
      bio: 'Visionary behind NathanIndustries. Pioneered indigenous jaw crusher design and heavy manganese foundry technology in South India.',
      specialty: 'Foundry Technology & Industrial Strategy',
    },
    {
      name: 'Dr. Vikram Nathan',
      role: 'Managing Director & CTO',
      exp: '18+ Years Machine Design',
      qual: 'Ph.D. Mechanical Systems (IIT Madras)',
      bio: 'Spearheads high-capacity crushing circuits, VSI air-classifier patents, SCADA telemetry integration, and global technical partnerships.',
      specialty: 'Crushing Dynamics & Automation',
    },
    {
      name: 'Er. R. Soundararajan',
      role: 'Vice President — Infrastructure & ROBs',
      exp: '30+ Years Bridge Engineering',
      qual: 'M.E. Structural Engineering (NIT)',
      bio: 'Former senior bridge consultant who has overseen the successful construction and launching of 25+ national railway overbridges and elevated corridors.',
      specialty: 'PSC Girders & Bridge EPC Execution',
    },
    {
      name: 'Dr. Ananya Nathan',
      role: 'Head of Metallurgy & Quality Assurance',
      exp: '12+ Years Alloy Research',
      qual: 'Ph.D. Metallurgical Engineering',
      bio: 'Directs in-house chemical spectroscopy, non-destructive testing, and the formulation of ultra-durable Mn22 and high-chrome wear casting alloys.',
      specialty: 'Alloy Composition & Wear Resistance',
    },
  ];

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <Container>
        <SectionHeading
          badge="Executive Board"
          title="Guided by Veteran Heavy Engineering Leadership"
          subtitle="Our executive team combines decades of on-site quarry problem solving with advanced metallurgical research."
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {leaders.map((leader, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
            >
              <Card className="h-full p-4 sm:p-6 bg-white border-slate-200 hover:border-red-400 hover:shadow-md flex flex-col justify-between group">
                <div>
                  {/* Leader Avatar Badge (Solid Red) */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-red-600 text-white font-black text-lg sm:text-xl flex items-center justify-center mb-3 sm:mb-4 shadow-md shadow-red-600/20 group-hover:scale-105 transition-transform border border-red-700">
                    {leader.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                    {leader.name}
                  </h3>

                  <div className="text-xs font-bold text-red-600 mb-2">
                    {leader.role}
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-3">
                    <HiAcademicCap className="w-4 h-4 text-slate-600 flex-shrink-0" />
                    <span>{leader.qual}</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {leader.bio}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Expertise</span>
                  <span className="text-xs font-bold text-slate-800">{leader.specialty}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default LeadershipSection;
