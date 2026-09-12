import React, { useState } from 'react';
import { Card } from '../../components/common/Card.jsx';
import { Button } from '../../components/common/Button.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { authService } from '../../services/authService.js';
import {
  HiLockClosed,
  HiEye,
  HiEyeSlash,
  HiShieldCheck,
} from 'react-icons/hi2';

export const CustomerChangePasswordPage = () => {
  const { showSuccess, showError } = useToast();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      showError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      showError('New password and confirm password do not match.');
      return;
    }

    setLoading(true);
    try {
      await authService.changePassword({
        currentPassword,
        newPassword,
      });
      showSuccess('Your password has been changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      showError(err.message || 'Failed to change password. Please verify your current password.');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    'w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-500 transition-colors text-xs font-medium';
  const labelClasses = 'block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1';

  return (
    <div className="flex flex-col gap-6 text-slate-800 max-w-xl">
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Change Account Password
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Ensure your account stays secure by using a strong, unique password.
        </p>
      </div>

      <Card className="p-4 sm:p-6 bg-white border-slate-200 shadow-sm flex flex-col gap-5 sm:gap-6">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-xs font-medium">
          <HiShieldCheck className="w-5 h-5 flex-shrink-0 text-red-600" />
          <span>Password must contain at least 6 characters. Avoid using simple or easily guessable passwords.</span>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Current Password */}
          <div>
            <label className={labelClasses}>Current Password *</label>
            <div className="relative">
              <HiLockClosed className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type={showCurrent ? 'text' : 'password'}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                className={inputClasses}
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-700"
              >
                {showCurrent ? <HiEyeSlash className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className={labelClasses}>New Password *</label>
            <div className="relative">
              <HiLockClosed className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type={showNew ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className={inputClasses}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-700"
              >
                {showNew ? <HiEyeSlash className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className={labelClasses}>Confirm New Password *</label>
            <div className="relative">
              <HiLockClosed className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type={showConfirm ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className={inputClasses}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-700"
              >
                {showConfirm ? <HiEyeSlash className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={loading}
              className="w-full font-bold text-xs uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20"
            >
              Update Password
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CustomerChangePasswordPage;
