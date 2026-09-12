import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-center items-center py-6 sm:py-10 px-3 sm:px-4">
      {/* Top Brand Header */}
      <div className="mb-4 sm:mb-6 text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 sm:gap-3 group">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-red-600 flex items-center justify-center shadow-md shadow-red-600/30 group-hover:bg-red-700 transition-colors font-black text-xl sm:text-2xl text-white">
            N
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-none">
              NATHAN <span className="text-red-600">INDUSTRIES</span>
            </span>
            <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-slate-500 mt-1 font-mono">
              Heavy Engineering Works
            </span>
          </div>
        </Link>
      </div>

      {/* Main Content Container (Spacious max-w-2xl) */}
      <div className="w-full max-w-2xl">
        <Outlet />
      </div>

      {/* Footer Note */}
      <div className="mt-8 text-xs text-slate-500 text-center">
        © {new Date().getFullYear()} NathanIndustries. ISO 9001:2015 Heavy Machinery & Infrastructure.
      </div>
    </div>
  );
};

export default AuthLayout;
