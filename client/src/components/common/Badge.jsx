import React from 'react';

export const Badge = ({
  children,
  variant = 'red',
  size = 'md',
  icon: Icon,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-xs',
    lg: 'px-3.5 py-1.5 text-xs',
  };

  const variantClasses = {
    red: 'bg-red-50 text-red-700 border border-red-200',
    orange: 'bg-red-50 text-red-700 border border-red-200',
    navy: 'bg-slate-100 text-slate-700 border border-slate-200',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    info: 'bg-sky-50 text-sky-700 border border-sky-200',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-lg ${sizeClasses[size]} ${variantClasses[variant] || variantClasses.red} ${className}`}
    >
      {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" />}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
