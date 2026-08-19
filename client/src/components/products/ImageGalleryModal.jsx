import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiXMark, HiChevronLeft, HiChevronRight, HiMagnifyingGlassPlus } from 'react-icons/hi2';

export const ImageGalleryModal = ({ isOpen, onClose, images = [], initialIndex = 0, title }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  if (!isOpen || images.length === 0) return null;

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/95 backdrop-blur-md"
        />

        {/* Modal Window */}
        <div className="relative z-10 w-full max-w-5xl flex flex-col items-center">
          {/* Header Controls */}
          <div className="w-full flex items-center justify-between text-white mb-3 px-2">
            <div>
              <h3 className="text-sm sm:text-base font-bold truncate max-w-md">{title || 'Machinery View'}</h3>
              <span className="text-xs text-slate-400 font-mono">
                Image {currentIndex + 1} of {images.length}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-surfaceDark/80 border border-borderDark text-slate-300 hover:text-white transition-colors"
              aria-label="Close image zoom"
            >
              <HiXMark className="w-6 h-6" />
            </button>
          </div>

          {/* Main Zoom Image Container */}
          <div className="relative w-full aspect-video sm:aspect-[16/10] max-h-[75vh] bg-navy-950 rounded-2xl border border-borderDark flex items-center justify-center overflow-hidden shadow-2xl">
            <motion.img
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              src={images[currentIndex]}
              alt={`Machinery view ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />

            {/* Left Prev Arrow */}
            {images.length > 1 && (
              <button
                onClick={handlePrev}
                className="absolute left-4 p-3 rounded-full bg-black/60 hover:bg-orange-500 text-white border border-white/20 transition-all shadow-xl"
                aria-label="Previous image"
              >
                <HiChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Right Next Arrow */}
            {images.length > 1 && (
              <button
                onClick={handleNext}
                className="absolute right-4 p-3 rounded-full bg-black/60 hover:bg-orange-500 text-white border border-white/20 transition-all shadow-xl"
                aria-label="Next image"
              >
                <HiChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex items-center gap-2 mt-4 overflow-x-auto max-w-full py-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-16 h-12 rounded-lg border-2 overflow-hidden flex-shrink-0 transition-all ${
                    currentIndex === idx
                      ? 'border-orange-500 scale-105 shadow-md shadow-orange-500/30'
                      : 'border-borderDark opacity-60 hover:opacity-100'
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
