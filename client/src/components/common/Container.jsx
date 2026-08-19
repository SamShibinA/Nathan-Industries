import React from 'react';
import { twMerge } from 'tailwind-merge';

export const Container = ({ children, className = '', fluid = false }) => {
  return (
    <div
      className={twMerge(
        `w-full mx-auto px-4 sm:px-6 lg:px-8 ${fluid ? 'max-w-full' : 'max-w-7xl'}`,
        className
      )}
    >
      {children}
    </div>
  );
};

export default Container;
