import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Card = ({
  children,
  className = '',
  hoverEffect = true,
  glow = false,
  onClick,
  ...props
}) => {
  const baseClasses =
    'rounded-2xl bg-white border border-slate-200 p-6 text-slate-800 shadow-sm transition-all duration-200 relative overflow-hidden';
  
  const hoverClasses = hoverEffect
    ? 'hover:border-red-400 hover:shadow-md hover:-translate-y-0.5'
    : '';

  const glowClasses = glow
    ? 'border-red-500/50 shadow-md shadow-red-500/10'
    : '';

  return (
    <motion.div
      className={twMerge(clsx(baseClasses, hoverClasses, glowClasses, className))}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
