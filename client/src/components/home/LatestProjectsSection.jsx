import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HiArrowRight, 
  HiMapPin, 
  HiBuildingOffice2, 
  HiCheckCircle 
} from 'react-icons/hi2';

import { Container } from '../common/Container.jsx';
import { Card } from '../common/Card.jsx';
import { Button } from '../common/Button.jsx';
import { Badge } from '../common/Badge.jsx';

export const LatestProjectsSection = () => {
  const projects = [
    {
      id: 'rob-salem',
      type: 'Railway Overbridge',
      title: '4-Lane Railway Overbridge (ROB) EPC Erection',
      client: 'State Highways & Southern Railways JV',
      location: 'Salem Bypass, Tamil Nadu',
      capacity: '720m 4-Lane Span',
      duration: '14 Months',
      status: 'Completed',
      description: 'Turnkey fabrication and tandem crane launching of 48 prestressed concrete box girders over active railway tracks.',
    },
    {
      id: 'crusher-hosur',
      type: 'Crusher Plant EPC',
      title: '600 TPH Mega Turnkey Granite Crushing Complex',
      client: 'Apex Minerals & Infrastructure Ltd',
      location: 'Hosur Quarry Hub, Tamil Nadu',
      capacity: '600 TPH Granite',
      duration: '6 Months',
      status: 'Completed',
      description: 'Three-stage automated crushing circuit with primary 1200x900 jaw, twin hydraulic cones, and triple deck screens.',
    },
    {
      id: 'msand-namakkal',
      type: 'M-Sand Facility',
      title: '250 TPH Dry Air Classifier M-Sand & P-Sand Plant',
      client: 'Kongu Green Aggregates Ltd',
      location: 'Namakkal Aggregate Cluster',
      capacity: '250 TPH Zone-II Sand',
      duration: '4 Months',
      status: 'Completed',
      description: 'Zero-water dry air classification producing high-strength concrete sand adhering strictly to IS 383 standards.',
    },
  ];

  return (
    <section className="py-16 bg-white border-b border-slate-200 relative overflow-hidden">
      <Container>
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10">
          <div>
            <Badge variant="red" size="md" className="mb-2">
              National Infrastructure Portfolio
            </Badge>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Landmark Bridge Erection & Turnkey Quarry Undertakings
            </h2>
          </div>

          <Link to="/projects">
            <Button variant="outline" size="sm" icon={HiArrowRight} iconPosition="right" className="font-bold text-xs uppercase tracking-wider text-slate-800 bg-white border-slate-300 hover:border-red-400 hover:text-red-600 shadow-sm">
              View All Case Studies
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((proj, idx) => (
            <motion.div
              key={proj.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <Card className="h-full p-4 sm:p-6 bg-slate-50 border-slate-200 hover:bg-white hover:border-red-400 hover:shadow-md flex flex-col justify-between group transition-all">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="red" size="sm">
                      {proj.type}
                    </Badge>
                    <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                      {proj.status}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-red-600 transition-colors mb-2 leading-snug">
                    {proj.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-red-600 font-semibold mb-2">
                    <HiBuildingOffice2 className="w-4 h-4 flex-shrink-0" />
                    <span className="font-semibold">{proj.client}</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {proj.description}
                  </p>

                  <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-white border border-slate-200 text-xs mb-4">
                    <div>
                      <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 block">Location</span>
                      <span className="font-semibold text-slate-700 text-[11px] sm:text-xs">{proj.location}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 block">Scale</span>
                      <span className="font-mono font-bold text-red-600 text-[11px] sm:text-xs">{proj.capacity}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                  <Link
                    to="/projects"
                    className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                  >
                    <span>Read Technical Review</span>
                    <HiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-red-600" />
                  </Link>

                  <span className="text-xs text-slate-500 font-mono">
                    Time: {proj.duration}
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default LatestProjectsSection;
