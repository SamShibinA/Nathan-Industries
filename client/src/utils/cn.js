import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names with tailwind-merge to avoid Tailwind class conflicts
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default cn;
