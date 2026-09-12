import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiHome, HiChevronRight } from 'react-icons/hi2';
import { Container } from './Container.jsx';

/**
 * Reusable Industrial Breadcrumb Component
 * Accepts explicit items or dynamically generates items from current path.
 * 
 * @param {Array<{label: string, to?: string}>} items - Optional custom breadcrumb trail
 * @param {string} title - Optional title to display next to or below breadcrumbs
 */
export const Breadcrumb = ({ items, title, className = '' }) => {
  const location = useLocation();

  // Friendly labels for routes
  const ROUTE_LABELS = {
    dashboard: 'Client Portal',
    admin: 'Admin CMS',
    quotes: 'Quotes & RFQs',
    inquiries: 'Contact Requests',
    downloads: 'Downloads & Specs',
    profile: 'Profile',
    'change-password': 'Change Password',
    products: 'Equipment Catalog',
    projects: 'Infra Projects',
    gallery: 'Media Archive',
    users: 'User Registry',
  };

  // If no explicit items passed, derive from current pathname
  const derivedItems = items || (() => {
    const pathnames = location.pathname.split('/').filter((x) => x);
    const trail = pathnames.map((value, index) => {
      const to = `/${pathnames.slice(0, index + 1).join('/')}`;
      const label = ROUTE_LABELS[value] || value
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      return { label, to };
    });
    return trail;
  })();

  if (location.pathname === '/' && !items) {
    return null;
  }

  const isPortal = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin');

  return (
    <div className={`py-3 border-b border-slate-200 bg-white ${className}`}>
      <Container fluid={isPortal} className={isPortal ? 'px-4 sm:px-6 lg:px-8 xl:px-10' : ''}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          {/* Breadcrumb Links */}
          <nav className="flex items-center space-x-2 text-xs font-medium text-slate-500" aria-label="Breadcrumb">
            <Link
              to="/"
              className="flex items-center gap-1 hover:text-red-600 transition-colors text-slate-600"
            >
              <HiHome className="w-3.5 h-3.5 text-red-600" />
              <span>Home</span>
            </Link>

            {derivedItems.map((item, index) => {
              const isLast = index === derivedItems.length - 1;
              return (
                <React.Fragment key={index}>
                  <HiChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  {isLast || !item.to ? (
                    <span className="text-red-600 font-bold tracking-wide truncate max-w-[200px] sm:max-w-xs">
                      {item.label}
                    </span>
                  ) : (
                    <Link
                      to={item.to}
                      className="hover:text-red-600 text-slate-600 transition-colors truncate max-w-[150px]"
                    >
                      {item.label}
                    </Link>
                  )}
                </React.Fragment>
              );
            })}
          </nav>

          {/* Quick Page Title readout if provided */}
          {title && (
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 hidden sm:block">
              {title}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default Breadcrumb;
