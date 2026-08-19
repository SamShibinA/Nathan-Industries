import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HiPhoto, 
  HiMagnifyingGlassPlus 
} from 'react-icons/hi2';

import { Container } from '../common/Container.jsx';
import { SectionHeading } from '../common/SectionHeading.jsx';
import { Card } from '../common/Card.jsx';
import { Badge } from '../common/Badge.jsx';
import { Modal } from '../common/Modal.jsx';

export const FactoryGallerySection = () => {
  const [selectedItem, setSelectedItem] = useState(null);

  const galleryItems = [
    {
      id: 1,
      category: 'Machine Shop',
      title: 'Heavy CNC Horizontal Boring Center',
      desc: 'Precision machining of cast-steel crusher mainframes to micron tolerances.',
      tag: 'CNC Tooling',
      specs: '6-Meter Bed • Digital DRO',
    },
    {
      id: 2,
      category: 'Foundry',
      title: 'Induction Melting & Alloy Pouring Bay',
      desc: 'Liquid manganese steel (Mn18Cr2) tapped at 1,550°C into precision sand molds.',
      tag: 'Induction Foundry',
      specs: '5-Ton Furnace • Spectro Tested',
    },
    {
      id: 3,
      category: 'Assembly Floor',
      title: '500 TPH Crushing Plant Modular Assembly',
      desc: 'Pre-erection alignment of primary jaw and secondary cone units prior to dispatch.',
      tag: 'Plant Assembly',
      specs: '50 MT EOT Crane Bay',
    },
    {
      id: 4,
      category: 'Fabrication',
      title: 'Automated Submerged Arc Welding Gantry',
      desc: 'Robotic high-deposition welding on heavy structural bridge box girders.',
      tag: 'Automated SAW',
      specs: '100% Ultrasonic Flaw Tested',
    },
    {
      id: 5,
      category: 'Field Projects',
      title: 'Railway Overbridge PSC Girder Launching',
      desc: 'Tandem hydraulic crane erection of 48 prestressed concrete girders across active rail corridors.',
      tag: 'Bridge Infrastructure',
      specs: '720m Total Span Project',
    },
    {
      id: 6,
      category: 'Quality Control',
      title: 'Optical Metallurgical Spectroscopy Lab',
      desc: 'Chemical assay and charpy impact testing verifying hardness and alloy integrity.',
      tag: 'QA Testing',
      specs: 'ISO 17025 Compliant Lab',
    },
  ];

  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <Container>
        <SectionHeading
          badge="Shop Floor Visuals"
          title="Factory & On-Site Construction Gallery"
          subtitle="A glimpse into our advanced foundry, CNC machining bays, testing laboratories, and live project executions."
          centered
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35 }}
            >
              <Card
                className="p-4 bg-white border-slate-200 group cursor-pointer hover:border-red-400 hover:shadow-md flex flex-col justify-between h-full"
                onClick={() => setSelectedItem(item)}
              >
                {/* Visual Area */}
                <div>
                  <div className="aspect-video w-full rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center p-4 relative overflow-hidden group-hover:border-red-400 transition-colors">
                    <div className="w-11 h-11 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mb-2 group-hover:scale-105 group-hover:bg-red-600 group-hover:text-white transition-all shadow-sm">
                      <HiPhoto className="w-5 h-5" />
                    </div>
                    
                    <span className="text-xs font-mono font-bold text-slate-800 group-hover:text-red-600 text-center">
                      {item.title}
                    </span>

                    {/* Hover Zoom Overlay */}
                    <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold">
                      <HiMagnifyingGlassPlus className="w-4 h-4 text-red-400" />
                      <span>View Division Details</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <Badge variant="red" size="sm">{item.tag}</Badge>
                    <span className="text-[11px] font-mono text-slate-500">{item.category}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-red-600 transition-colors mt-2 mb-1">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-red-600 font-mono font-bold">
                  <span>⚙ {item.specs}</span>
                  <span className="text-slate-500 group-hover:text-red-600 transition-colors">Inspect →</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Lightbox Detail Modal */}
        <Modal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          title={selectedItem?.title}
          subtitle={`Facility Division: ${selectedItem?.category}`}
        >
          {selectedItem && (
            <div className="flex flex-col gap-4">
              <div className="aspect-video w-full rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center p-6 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center shadow-sm">
                    <HiPhoto className="w-7 h-7" />
                  </div>
                  <div className="text-sm font-bold text-slate-900">{selectedItem.title}</div>
                  <Badge variant="red" size="md">{selectedItem.tag}</Badge>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                {selectedItem.desc}
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Category</span>
                  <span className="font-bold text-slate-900">{selectedItem.category}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Specification</span>
                  <span className="font-bold text-red-600">{selectedItem.specs}</span>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </Container>
    </section>
  );
};

export default FactoryGallerySection;
