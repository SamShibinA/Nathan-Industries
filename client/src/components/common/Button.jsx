import React from 'react';
import { Spinner } from './Spinner.jsx';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  onClick,
  type = 'button',
  icon: Icon,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  // Size Variants
  const sizeClasses = {
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-xs',
    lg: 'px-6 py-3 text-xs',
    xl: 'px-8 py-3.5 text-sm',
  };

  // Color & Style Variants - Light Theme with Crimson Red
  const variantClasses = {
    primary:
      'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-md shadow-red-600/20 border border-red-600',
    secondary:
      'bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 border border-slate-300',
    outline:
      'bg-white hover:bg-red-50 text-slate-800 hover:text-red-600 border border-slate-300 hover:border-red-300 shadow-sm',
    ghost:
      'bg-transparent hover:bg-slate-100 text-slate-700 hover:text-slate-900',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 border border-rose-600',
  };

  const baseClasses =
    'inline-flex items-center justify-center font-bold uppercase tracking-wider rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none';

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <Spinner size="sm" color="text-current" />
          <span>Processing...</span>
        </span>
      ) : (
        <span className="flex items-center gap-2">
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 flex-shrink-0" />}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 flex-shrink-0" />}
        </span>
      )}
    </button>
  );
};

export default Button;
