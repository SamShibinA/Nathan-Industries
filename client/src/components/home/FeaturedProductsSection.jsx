import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiArrowRight, 
  HiDocumentText, 
  HiWrenchScrewdriver, 
  HiSparkles,
  HiBolt
} from 'react-icons/hi2';

import { Container } from '../common/Container.jsx';
import { Card } from '../common/Card.jsx';
import { Button } from '../common/Button.jsx';
import { Badge } from '../common/Badge.jsx';

export const FeaturedProductsSection = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Equipment' },
    { id: 'stone-crushers', name: 'Stone Crushers' },
    { id: 'sand-plants', name: 'M-Sand Plants' },
    { id: 'conveyors', name: 'Conveyors' },
    { id: 'spares', name: 'Crusher Spares' },
  ];

  const defaultProducts = [
    {
      id: 'NI-CP-500',
      slug: 'integrated-three-stage-stone-crusher-complex-ni-cp-600',
      category: 'stone-crushers',
      name: 'Integrated 3-Stage Crushing Plant (NI-CP-500)',
      capacity: '200 - 500 TPH',
      feedSize: 'Max 850 mm',
      power: '380 - 620 kW',
      output: '0-5mm, 10mm, 20mm, 40mm',
      description: 'Turnkey crushing and screening complex with automated primary jaw, multi-cylinder cone, and VSI shaping circuits.',
      tag: 'Turnkey Plant',
    },
    {
      id: 'NI-JC-1209',
      slug: 'heavy-duty-primary-jaw-crusher-ni-jc-1209',
      category: 'stone-crushers',
      name: 'Heavy Duty Primary Jaw Crusher (NI-JC-1209)',
      capacity: '180 - 480 TPH',
      feedSize: 'Max 1020 mm (40")',
      power: '132 - 160 kW',
      output: '100 - 250 mm CSS',
      description: 'Single-piece cast steel base frame with deep symmetrical crushing cavity engineered for hard granite fragmentation.',
      tag: 'Primary Crushing',
    },
    {
      id: 'NI-CC-400',
      slug: 'hydraulic-multi-cylinder-cone-crusheri-ni-cc-400',
      category: 'stone-crushers',
      name: 'Hydraulic Multi-Cylinder Cone Crusher (NI-CC-400)',
      capacity: '150 - 380 TPH',
      feedSize: 'Max 250 mm',
      power: '220 - 315 kW',
      output: '10mm, 20mm Cubical',
      description: 'High-speed secondary shaping cone with automatic hydraulic tramp release and continuous load sensing.',
      tag: 'Secondary Shaping',
    },
    {
      id: 'NI-VSI-950',
      slug: 'vsi-manufactured-sand-m-sand-plant-ni-vsi-950',
      category: 'sand-plants',
      name: 'VSI M-Sand & P-Sand Plant (NI-VSI-950)',
      capacity: '100 - 250 TPH',
      feedSize: 'Max 45 mm',
      power: '2x132 kW Dual Drive',
      output: 'IS 383 Zone-II Sand',
      description: 'Rock-on-rock vertical shaft impactor combined with dry centrifugal air classifier for zero-water sand production.',
      tag: 'M-Sand Tech',
    },
    {
      id: 'NI-CV-1200',
      slug: 'heavy-industrial-overland-conveyor-system-ni-cv-1200',
      category: 'conveyors',
      name: 'Heavy Industrial Overland Conveyor (NI-CV-1200)',
      capacity: 'Up to 1,200 TPH',
      feedSize: 'Bulk Aggregates',
      power: '45 - 110 kW Drive',
      output: 'Overland Transfer',
      description: 'Galvanized triangular lattice truss conveyor galleries with flame-retardant belting and emergency pull-cords.',
      tag: 'Bulk Handling',
    },
    {
      id: 'NI-MN-18',
      slug: 'high-manganese-oem-crusher-spares-liners-mn18cr2',
      category: 'spares',
      name: 'High Manganese OEM Crusher Wear Liners (Mn18Cr2)',
      capacity: 'Universal Fit',
      feedSize: 'Hard Granite',
      power: 'N/A',
      output: '40% Longer Wear',
      description: 'Precision induction foundry castings work-hardening from 220 HB to 550 HB with 100% ultrasonic defect testing.',
      tag: 'Foundry Castings',
    },
  ];

  const products = defaultProducts;

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter((p) => p.category === activeCategory);

  return (
    <section className="py-16 bg-slate-50/80 border-b border-slate-200 relative overflow-hidden">
      <Container>
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10">
          <div>
            <Badge variant="red" size="md" className="mb-2">
              Machinery Lineup
            </Badge>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Featured Heavy Crushing & Sand Manufacturing Equipment
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white border border-slate-200 overflow-x-auto max-w-full shadow-sm">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex-shrink-0 ${
                  activeCategory === cat.id
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Card 
                  onClick={() => navigate(`/products/${p.slug || p._id || p.id}`)}
                  className="h-full p-4 sm:p-6 bg-white border-slate-200 hover:border-red-500 hover:shadow-lg flex flex-col justify-between group relative overflow-hidden transition-all duration-200 cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="red" size="sm">
                        {p.tag}
                      </Badge>
                      <span className="text-[11px] sm:text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {p.id}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-red-600 transition-colors mb-2 leading-snug">
                      {p.name}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {p.description}
                    </p>

                    {/* Specs Table */}
                    <div className="grid grid-cols-2 gap-2 p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs mb-4">
                      <div>
                        <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 block">Capacity</span>
                        <span className="font-bold text-slate-800 text-[11px] sm:text-xs">{p.capacity}</span>
                      </div>
                      <div>
                        <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 block">Power</span>
                        <span className="font-bold text-slate-800 text-[11px] sm:text-xs">{p.power}</span>
                      </div>
                      <div>
                        <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 block">Feed Size</span>
                        <span className="font-bold text-slate-800 text-[11px] sm:text-xs">{p.feedSize}</span>
                      </div>
                      <div>
                        <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 block">Output</span>
                        <span className="font-bold text-red-600 text-[11px] sm:text-xs">{p.output}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 group-hover:text-red-600 flex items-center gap-1 transition-colors">
                      <span>Full Specs</span>
                      <HiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-red-600" />
                    </span>

                    <div onClick={(e) => e.stopPropagation()}>
                      <Link to="/contact?type=quote">
                        <Button variant="primary" size="sm" icon={HiDocumentText} className="text-xs font-bold bg-red-600 hover:bg-red-700 text-white">
                          Get RFQ
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Bottom Catalog Action */}
        <div className="mt-10 text-center">
          <Link to="/products">
            <Button variant="outline" size="md" icon={HiArrowRight} iconPosition="right" className="font-bold text-xs uppercase tracking-wider text-slate-800 bg-white border-slate-300 hover:border-red-400 hover:text-red-600 shadow-sm">
              Browse Complete 50 - 800 TPH Equipment Catalog
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
};

export default FeaturedProductsSection;
