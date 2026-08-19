/**
 * Formatting utilities for machinery specifications, capacities, currency, and dates
 */

export const formatCurrency = (amount, currency = 'INR') => {
  if (amount === undefined || amount === null) return 'N/A';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatTPH = (tph) => {
  if (!tph) return 'Custom Capacity';
  return `${tph} TPH (Tons/Hour)`;
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const truncateText = (text, maxLength = 120) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
