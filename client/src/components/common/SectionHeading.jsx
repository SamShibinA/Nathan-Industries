import React from 'react';
import { Badge } from './Badge.jsx';

export const SectionHeading = ({
  badge,
  title,
  subtitle,
  centered = false,
  className = '',
}) => {
  return (
    <div className={`mb-8 sm:mb-10 ${centered ? 'text-center mx-auto' : ''} ${className}`}>
      {badge && (
        <div className={`mb-2.5 sm:mb-3 ${centered ? 'flex justify-center' : ''}`}>
          <Badge variant="red" size="md">
            {badge}
          </Badge>
        </div>
      )}

      {/* Balanced, clean title typography for Light Theme */}
      <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight mb-2 sm:mb-2.5">
        {title}
      </h2>

      {subtitle && (
        <p className={`text-xs sm:text-sm text-slate-600 leading-relaxed ${centered ? 'max-w-2xl mx-auto' : 'max-w-2xl'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
