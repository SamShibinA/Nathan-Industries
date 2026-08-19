import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HiWrenchScrewdriver, 
  HiSparkles, 
  HiArrowRight, 
  HiShieldCheck,
  HiCubeTransparent,
  HiCog6Tooth
} from 'react-icons/hi2';

export const MegaMenu = ({ onClose }) => {
  const productSections = [
    {
      title: 'Crushing Machinery',
      icon: HiWrenchScrewdriver,
      links: [
        { name: 'Complete Stone Crusher Plants', slug: 'stone-crushers', sub: '100 - 800 TPH Turnkey Circuits' },
        { name: 'Primary Jaw Crushers', slug: 'jaw-crushers', sub: 'Single-Toggle Hard Rock Reducers' },
        { name: 'Hydraulic Cone Crushers', slug: 'cone-crushers', sub: 'Multi-Cylinder Shaping Cones' },
      ],
    },
    {
      title: 'Manufactured Sand & Bulk Belts',
      icon: HiCubeTransparent,
      links: [
        { name: 'VSI M-Sand Plants', slug: 'sand-plants', sub: 'IS 383 Zone-II Zero-Water Sand' },
        { name: 'Plastering Sand (P-Sand) Units', slug: 'sand-plants', sub: 'Dry Air Classifier De-dusting' },
        { name: 'Overland Conveyor Systems', slug: 'conveyors', sub: 'Heavy Lattice Truss Belt Galleries' },
      ],
    },
    {
      title: 'OEM Castings & Spares',
      icon: HiCog6Tooth,
      links: [
        { name: 'High Manganese (Mn18Cr2) Jaw Plates', slug: 'spare-parts', sub: 'Work-Hardening Alloy Castings' },
        { name: 'Cone Crusher Mantles & Concaves', slug: 'spare-parts', sub: 'Precision Machined Seating' },
        { name: 'VSI Rotor Tips & Polyurethane Screens', slug: 'spare-parts', sub: 'Tungsten Carbide Tipped' },
      ],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.15 }}
      className="w-full rounded-2xl bg-[#0A111E] border border-slate-800 shadow-2xl p-6 relative overflow-hidden"
      style={{ backgroundColor: '#0A111E', opacity: 1 }}
    >
      {/* Top Red Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Columns 1-3: Product Categories */}
        {productSections.map((sec, idx) => {
          const Icon = sec.icon;
          return (
            <div key={idx} className="flex flex-col gap-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                <div className="w-7 h-7 rounded-lg bg-red-950 border border-red-500/30 text-red-500 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-black uppercase tracking-wider text-white">
                  {sec.title}
                </h4>
              </div>

              <div className="flex flex-col gap-1.5">
                {sec.links.map((link, lIdx) => (
                  <Link
                    key={lIdx}
                    to={`/products?category=${link.slug}`}
                    onClick={onClose}
                    className="p-2 rounded-xl hover:bg-slate-900/90 transition-colors group flex flex-col"
                  >
                    <span className="text-xs font-bold text-slate-100 group-hover:text-red-400 transition-colors flex items-center justify-between">
                      <span>{link.name}</span>
                      <HiArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-red-500 -translate-x-1 group-hover:translate-x-0 transition-all" />
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5">
                      {link.sub}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}

        {/* Column 4: Turnkey Featured Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-red-950/80 via-slate-900 to-slate-950 border border-red-500/30 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-black uppercase tracking-wider mb-2">
              <HiSparkles className="w-3 h-3" /> Turnkey Solution
            </div>

            <h4 className="text-sm font-bold text-white mb-1.5 leading-snug">
              Custom 100 - 800 TPH Crushing Circuit Design
            </h4>

            <p className="text-[11px] text-slate-300 leading-relaxed mb-4">
              Flowsheets, civil layouts, and SCADA automation tailored for hard granite & basalt quarries.
            </p>
          </div>

          <Link
            to="/contact?type=quote"
            onClick={onClose}
            className="w-full py-2.5 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider text-center transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-red-600/30"
          >
            <span>Request Circuit RFQ</span>
            <HiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default MegaMenu;
