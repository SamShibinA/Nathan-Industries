import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiXMark } from 'react-icons/hi2';
import { cn } from '../../utils/cn.js';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-xl',
  className = '',
}) => {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Subtle Neutral Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-700/40 backdrop-blur-sm"
          />

          {/* Modal Card (Solid White, No gradient, No black) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'relative w-full bg-white border border-slate-200 text-slate-800 rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl z-10 my-6 sm:my-8 overflow-hidden',
              maxWidth,
              className
            )}
          >
            {/* Solid Red Top Rim */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-red-600" />

            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-4 sm:mb-6">
              <div>
                {title && <h3 className="text-lg sm:text-xl font-bold text-slate-900">{title}</h3>}
                {subtitle && <p className="text-xs text-slate-600 mt-0.5 sm:mt-1">{subtitle}</p>}
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Close dialog"
              >
                <HiXMark className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
