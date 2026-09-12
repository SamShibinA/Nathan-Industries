import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { HiLockClosed, HiEye, HiEyeSlash, HiCheckCircle } from 'react-icons/hi2';

import { Card } from '../components/common/Card.jsx';
import { Button } from '../components/common/Button.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export const ResetPasswordPage = () => {
  const { resetToken } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { resetPassword } = useAuth();
  const { showError } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showError('Passwords do not match. Please verify your entries.');
      return;
    }

    if (password.length < 6) {
      showError('Password must be at least 6 characters in length.');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(resetToken, password);
      navigate('/', { replace: true });
    } catch (err) {
      // Handled by context toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto py-6">
      <Card className="p-4 sm:p-8 md:p-10 border-slate-200 bg-white shadow-xl relative">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto mb-3 shadow-sm">
            <HiLockClosed className="w-7 h-7" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Set New Password
          </h2>
          <p className="text-xs text-slate-500 mt-1.5">
            Enter and confirm your new secure portal password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              New Password <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full pr-10 pl-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-500 transition-colors text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-700"
                aria-label="Toggle password"
              >
                {showPassword ? <HiEyeSlash className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Confirm New Password <span className="text-red-600">*</span>
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-500 transition-colors text-sm"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={loading}
            icon={HiCheckCircle}
            className="w-full font-bold text-xs uppercase tracking-wider mt-2 bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20"
          >
            Update Password & Sign In
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-200 text-center">
          <Link to="/login" className="text-xs font-bold text-slate-600 hover:text-red-600">
            Cancel and Return to Login
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
