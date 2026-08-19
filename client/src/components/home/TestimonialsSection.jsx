import React from 'react';
import { motion } from 'framer-motion';
import { HiStar, HiBuildingOffice2, HiShieldCheck } from 'react-icons/hi2';
import { Container } from '../common/Container.jsx';
import { SectionHeading } from '../common/SectionHeading.jsx';
import { Card } from '../common/Card.jsx';
import { Badge } from '../common/Badge.jsx';

export const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Senthil Kumar',
      role: 'Managing Director',
      company: 'Kongu Blue Metals & Quarries, Namakkal',
      content:
        'We commissioned a 400 TPH 3-stage granite crushing plant from NathanIndustries in 2021. The jaw frame rigidity and hydraulic cone response under continuous chokefeed have exceeded our production benchmarks with zero unplanned downtime.',
      rating: 5,
      plantType: '400 TPH 3-Stage Plant',
    },
    {
      name: 'Er. Rajesh Varma',
      role: 'Chief Project Engineer',
      company: 'National Expressways Infra JV',
      content:
        'Their engineering team executed the 720m 4-Lane Railway Overbridge girder launching with absolute precision. Completing the heavy tandem crane erection within restricted railway traffic blocks was truly commendable.',
      rating: 5,
      plantType: '4-Lane ROB Bridge EPC',
    },
    {
      name: 'K. R. Murugan',
      role: 'Plant Head',
      company: 'Apex Aggregates & M-Sand, Coimbatore',
      content:
        'The VSI dry air classifier system delivered by NathanIndustries produces perfectly graded IS 383 Zone-II concrete sand without consuming a single liter of water. Our silt content consistently measures below 2.5%.',
      rating: 5,
      plantType: '250 TPH VSI M-Sand Circuit',
    },
  ];

  return (
    <section className="py-16 bg-white border-b border-slate-200 relative overflow-hidden">
      <Container>
        <SectionHeading
          badge="Client Endorsements"
          title="What Quarry Owners & Bridge Authorities Say"
          subtitle="Real testimonials from quarry operators, highway contractors, and state engineering directors trusting NathanIndustries machinery."
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <Card className="h-full p-6 bg-slate-50 border-slate-200 hover:bg-white hover:border-red-400 hover:shadow-md flex flex-col justify-between group transition-all">
                <div>
                  {/* Rating Stars */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(t.rating)].map((_, i) => (
                        <HiStar key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <Badge variant="red" size="sm">
                      {t.plantType}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed italic mb-6">
                    "{t.content}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600 text-white font-bold flex items-center justify-center text-sm shadow-md shadow-red-600/20">
                    {t.name[0]}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{t.name}</h4>
                    <span className="text-[11px] text-slate-500 block">{t.role}</span>
                    <span className="text-[10px] text-red-600 font-semibold">{t.company}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default TestimonialsSection;
