import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HiMagnifyingGlass, 
  HiPhoto, 
  HiMapPin, 
  HiMagnifyingGlassPlus, 
  HiXMark
} from 'react-icons/hi2';

import { Container } from '../components/common/Container.jsx';
import { SectionHeading } from '../components/common/SectionHeading.jsx';
import { Card } from '../components/common/Card.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { Spinner } from '../components/common/Spinner.jsx';
import { Button } from '../components/common/Button.jsx';
import { ImageGalleryModal } from '../components/products/ImageGalleryModal.jsx';
import { galleryService } from '../services/galleryService.js';
import { GALLERY_CATEGORIES } from '../utils/constants.js';

export const GalleryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentCategory = searchParams.get('category') || 'all';
  const currentSearch = searchParams.get('search') || '';

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeItemIndex, setActiveItemIndex] = useState(0);

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);
      try {
        const params = { limit: 50 };
        if (currentCategory !== 'all') params.category = currentCategory;
        if (currentSearch.trim()) params.search = currentSearch.trim();

        const res = await galleryService.getGalleryItems(params);
        setItems(res.data || []);
      } catch (err) {
        console.error('Failed to load gallery items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, [currentCategory, currentSearch]);

  const updateFilters = (newParams) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, val]) => {
      if (!val || val === 'all') {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });
    setSearchParams(params);
  };

  const categories = [
    { id: 'all', name: 'All Visuals' },
    ...GALLERY_CATEGORIES,
  ];

  const imageUrls = items.map((i) => i.imageUrl).filter(Boolean);

  const handleOpenLightbox = (idx) => {
    setActiveItemIndex(idx);
    setLightboxOpen(true);
  };

  return (
    <div className="py-12 bg-slate-50/70 min-h-screen">
      <Container>
        {/* Section Heading */}
        <SectionHeading
          badge="Visual Archive"
          title="Heavy Industry, Foundry & Infrastructure Gallery"
          subtitle="Explore high-resolution photographs of our CNC machine tools, induction casting furnaces, plant pre-assembly bays, and bridge crane launches."
        />

        {/* Filter and Search Bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 mb-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search */}
            <div className="relative w-full sm:max-w-md">
              <HiMagnifyingGlass className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                value={currentSearch}
                onChange={(e) => updateFilters({ search: e.target.value })}
                placeholder="Search gallery by keyword, machine, bridge..."
                className="w-full pl-11 pr-9 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-500 transition-colors text-xs"
              />
              {currentSearch && (
                <button
                  type="button"
                  onClick={() => updateFilters({ search: '' })}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-700"
                >
                  <HiXMark className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Clear Filter */}
            {(currentCategory !== 'all' || currentSearch) && (
              <button
                onClick={() => setSearchParams({})}
                className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1 self-end sm:self-auto"
              >
                <HiXMark className="w-3.5 h-3.5" />
                <span>Reset View</span>
              </button>
            )}
          </div>

          {/* Category Horizontal Filter Pills */}
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const isActive = currentCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => updateFilters({ category: cat.id })}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex-shrink-0 border ${
                    isActive
                      ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-600/20'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-400 hover:text-slate-900'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Gallery Masonry Layout */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <Spinner size="lg" />
            <p className="text-xs text-slate-500 font-mono">Loading high-resolution gallery assets...</p>
          </div>
        ) : items.length === 0 ? (
          <Card className="p-12 text-center bg-white border-dashed border-slate-300">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-4">
              <HiPhoto className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">No Visuals Found</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto mb-6">
              No gallery items matched your current filter criteria.
            </p>
            <Button variant="primary" onClick={() => setSearchParams({})} className="bg-red-600 hover:bg-red-700 text-white">
              Reset Filters
            </Button>
          </Card>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {items.map((item, idx) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: (idx % 6) * 0.05 }}
                className="break-inside-avoid"
              >
                <Card
                  onClick={() => handleOpenLightbox(idx)}
                  className="p-4 bg-white border-slate-200 hover:border-red-400 hover:shadow-md cursor-pointer group flex flex-col justify-between overflow-hidden shadow-sm"
                >
                  {/* Image Container with hover zoom */}
                  <div className="aspect-[4/3] w-full rounded-xl bg-slate-100 border border-slate-200 relative overflow-hidden flex items-center justify-center">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center p-4">
                        <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mb-2 shadow-sm">
                          <HiPhoto className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-slate-900">{item.title}</span>
                      </div>
                    )}

                    {/* Category Pin Badge */}
                    <div className="absolute top-2.5 left-2.5">
                      <Badge variant="red" size="sm">
                        {item.category}
                      </Badge>
                    </div>

                    {/* Fullscreen Zoom Hover Overlay */}
                    <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold">
                      <HiMagnifyingGlassPlus className="w-5 h-5 text-red-400" />
                      <span>Inspect High-Res</span>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="mt-4">
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors mb-1 leading-snug">
                      {item.title}
                    </h3>

                    {item.caption && (
                      <p className="text-xs text-slate-600 leading-relaxed mb-3">
                        {item.caption}
                      </p>
                    )}

                    {item.location && (
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                        <HiMapPin className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Fullscreen Lightbox Modal */}
        <ImageGalleryModal
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          images={imageUrls}
          initialIndex={activeItemIndex}
          title={items[activeItemIndex]?.title}
        />
      </Container>
    </div>
  );
};

export default GalleryPage;
