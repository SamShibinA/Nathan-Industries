import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn.js';

export const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      icon: Icon,
      type = 'text',
      className = '',
      id,
      name,
      required = false,
      ...props
    },
    ref
  ) => {
    const inputId = id || name || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-bold uppercase tracking-wider text-slate-300"
          >
            {label} {required && <span className="text-orange-500">*</span>}
          </label>
        )}

        <div className="relative rounded-xl">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Icon className="h-5 w-5" />
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            name={name}
            type={type}
            required={required}
            className={cn(
              'w-full rounded-xl bg-navy-950/80 border border-borderDark px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed',
              Icon ? 'pl-11' : 'pl-4',
              error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500' : '',
              className
            )}
            {...props}
          />
        </div>

        {error && <p className="text-xs text-rose-400 font-medium mt-0.5">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-slate-400 mt-0.5">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
