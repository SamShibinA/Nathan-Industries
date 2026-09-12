import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  HiLockClosed, 
  HiEnvelope, 
  HiArrowRight, 
  HiEye,
  HiEyeSlash
} from 'react-icons/hi2';

import { Card } from '../components/common/Card.jsx';
import { Button } from '../components/common/Button.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userData = await login({ email, password });
      showSuccess(`Welcome back, ${userData?.name || 'Administrator'}!`);
      if (userData?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      showError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const autofillAdmin = () => {
    setEmail('admin@gmail.com');
    setPassword('admin@123');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="p-4 sm:p-6 md:p-8 bg-white border-slate-200 shadow-xl">
        <div className="text-center mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            Sign In to Your Account
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Access machinery catalogs, project tenders, and admin CMS.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Registered Email *
            </label>
            <div className="relative">
              <HiEnvelope className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@nathanindustries.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-500 transition-colors text-xs"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Password *
              </label>
              <Link
                to="/forgot-password"
                className="text-[11px] font-semibold text-red-600 hover:underline"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <HiLockClosed className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-500 transition-colors text-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-700"
              >
                {showPassword ? <HiEyeSlash className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={loading}
            icon={HiArrowRight}
            iconPosition="right"
            className="w-full font-bold text-xs uppercase tracking-wider mt-2 bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20"
          >
            Authenticate & Sign In
          </Button>

          {/* Quick Demo Autofill */}
          <div className="pt-3 border-t border-slate-200 text-center">
            <button
              type="button"
              onClick={autofillAdmin}
              className="text-xs text-slate-600 hover:text-red-600 font-semibold transition-colors"
            >
              ⚡ Autofill Superadmin Credentials
            </button>
          </div>
        </form>
      </Card>

      <div className="text-center mt-4 text-xs text-slate-600">
        New quarry client?{' '}
        <Link to="/register" className="font-bold text-red-600 hover:underline">
          Create Corporate Account
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
