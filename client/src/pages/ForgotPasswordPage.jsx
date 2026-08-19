import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiEnvelope, HiKey, HiArrowLeft, HiPaperAirplane } from 'react-icons/hi2';

import { Card } from '../components/common/Card.jsx';
import { Button } from '../components/common/Button.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      // Toast handled by context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto py-6">
      <Card className="p-8 sm:p-10 border-slate-200 bg-white shadow-xl relative">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto mb-3 shadow-sm">
            <HiKey className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Reset Portal Password
          </h2>
          <p className="text-xs text-slate-500 mt-1.5">
            Enter your corporate email address. We will generate and dispatch a secure password reset link.
          </p>
        </div>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center flex flex-col items-center gap-3">
            <span className="text-2xl">✉️</span>
            <h3 className="text-sm font-bold text-emerald-800">Password Reset Dispatched</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              If an account with <strong className="text-slate-900">{email}</strong> exists, instructions to choose a new password have been generated.
            </p>
            <Link to="/login" className="mt-3">
              <Button variant="outline" size="sm" icon={HiArrowLeft} className="bg-white border-slate-300 hover:border-red-400 hover:text-red-600">
                Return to Login
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Registered Email Address <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <HiEnvelope className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-500 transition-colors text-sm"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              icon={HiPaperAirplane}
              className="w-full font-bold text-xs uppercase tracking-wider mt-2 bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20"
            >
              Dispatch Reset Link
            </Button>
          </form>
        )}

        <div className="mt-6 pt-6 border-t border-slate-200 text-center">
          <Link
            to="/login"
            className="text-xs font-bold text-slate-600 hover:text-red-600 flex items-center justify-center gap-1.5 transition-colors"
          >
            <HiArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
