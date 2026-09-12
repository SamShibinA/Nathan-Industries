import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa6';
import { HiXMark, HiChatBubbleLeftEllipsis } from 'react-icons/hi2';
import { APP_CONFIG } from '../../utils/constants.js';

export const WhatsAppButton = () => {
  const [showTooltip, setShowTooltip] = useState(true);
  const phoneNumber = '919876543210';
  const defaultMessage = encodeURIComponent(
    'Hello NathanIndustries Team, I would like to inquire about your Stone Crushers / Infrastructure Engineering services.'
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 flex items-center gap-3">
      {/* Floating Action Button */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-2xl shadow-emerald-500/40 border-2 border-white/20 transition-colors group cursor-pointer"
        aria-label="Chat on WhatsApp"
      >
        {/* Pulsing Ripple Effect */}
        <span className="absolute -inset-1 rounded-full bg-emerald-500/40 animate-ping opacity-75 pointer-events-none" />

        <FaWhatsapp className="w-6 h-6 sm:w-7 sm:h-7 relative z-10" />
      </motion.a>

      {/* Dismissable Floating Quick Chat Bubble */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: -10, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -10, scale: 0.9 }}
            className="hidden sm:flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-emerald-500/30 text-white shadow-xl shadow-black/50 text-xs"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <div className="flex flex-col">
              <span className="font-bold text-white flex items-center gap-1">
                <HiChatBubbleLeftEllipsis className="w-3.5 h-3.5 text-emerald-400" />
                Live Engineering Desk
              </span>
              <span className="text-[11px] text-slate-300">Chat with plant sizing experts</span>
            </div>
            <button
              onClick={() => setShowTooltip(false)}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 ml-1"
              aria-label="Dismiss message"
            >
              <HiXMark className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WhatsAppButton;
