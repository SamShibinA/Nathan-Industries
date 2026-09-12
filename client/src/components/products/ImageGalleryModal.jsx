import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiXMark, 
  HiChevronLeft, 
  HiChevronRight, 
  HiMapPin, 
  HiTag,
  HiClock
} from 'react-icons/hi2';
import { Badge } from '../common/Badge.jsx';

export const ImageGalleryModal = ({ 
  isOpen, 
  onClose, 
  images = [], 
  initialIndex = 0, 
  title,
  items = [] 
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Sync index whenever modal opens or active selection changes
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  // Keyboard navigation (Escape to close, Left/Right arrows to step)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose && onClose();
      if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      }
      if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, images.length, onClose]);

  if (!isOpen || images.length === 0) return null;

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const currentItem = items[currentIndex] || null;
  const displayTitle = currentItem?.title || title || 'Visual Detail';
  const displayCaption = currentItem?.caption || currentItem?.description || '';
  const displayLocation = currentItem?.location || '';
  const displayCategory = currentItem?.category || '';
  const displayTags = currentItem?.tags || [];
  const displaySpecs = currentItem?.specs || '';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-md"
        />

        {/* Modal Window */}
        <div className="relative z-10 w-full max-w-5xl flex flex-col items-center max-h-[95vh]">
          {/* Header Controls */}
          <div className="w-full flex items-center justify-between text-white mb-2 px-1">
            <div className="flex items-center gap-2 max-w-[75%]">
              <h3 className="text-sm sm:text-base font-bold truncate">{displayTitle}</h3>
              {displayCategory && (
                <Badge variant="red" size="sm" className="capitalize flex-shrink-0">
                  {displayCategory}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-mono">
                {currentIndex + 1} / {images.length}
              </span>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-slate-200 hover:text-white transition-colors"
                aria-label="Close visual viewer"
              >
                <HiXMark className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Zoom Image Container */}
          <div className="relative w-full aspect-video sm:aspect-[16/10] max-h-[60vh] bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center overflow-hidden shadow-2xl">
            <motion.img
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              src={images[currentIndex]}
              alt={displayTitle}
              className="max-w-full max-h-full object-contain select-none"
            />

            {/* Left Prev Arrow */}
            {images.length > 1 && (
              <button
                onClick={handlePrev}
                className="absolute left-2 sm:left-4 p-2 sm:p-3 rounded-full bg-black/60 hover:bg-red-600 text-white border border-white/20 transition-all shadow-xl"
                aria-label="Previous image"
              >
                <HiChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}

            {/* Right Next Arrow */}
            {images.length > 1 && (
              <button
                onClick={handleNext}
                className="absolute right-2 sm:right-4 p-2 sm:p-3 rounded-full bg-black/60 hover:bg-red-600 text-white border border-white/20 transition-all shadow-xl"
                aria-label="Next image"
              >
                <HiChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}
          </div>

          {/* Item Detailed Information & Specifications Panel */}
          {(displayCaption || displayLocation || displaySpecs || (displayTags && displayTags.length > 0)) && (
            <div className="w-full mt-3 p-3.5 sm:p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 text-xs flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                {displayCaption && (
                  <p className="text-slate-200 leading-relaxed font-medium text-xs sm:text-sm">
                    {displayCaption}
                  </p>
                )}

                {displaySpecs && (
                  <span className="font-mono font-bold text-red-400 bg-red-950/60 px-2.5 py-1 rounded border border-red-800/60 self-start sm:self-auto flex-shrink-0">
                    ⚙ {displaySpecs}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                {displayLocation && (
                  <span className="flex items-center gap-1">
                    <HiMapPin className="w-3.5 h-3.5 text-red-500" />
                    <span>{displayLocation}</span>
                  </span>
                )}

                {displayTags.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <HiTag className="w-3.5 h-3.5 text-slate-500" />
                    {displayTags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex items-center gap-2 mt-3 overflow-x-auto max-w-full py-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-14 h-10 sm:w-16 sm:h-12 rounded-lg border-2 overflow-hidden flex-shrink-0 transition-all ${
                    currentIndex === idx
                      ? 'border-red-500 scale-105 shadow-md shadow-red-500/30'
                      : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </AnimatePresence>
  );
};

export default ImageGalleryModal;
