import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Modal } from '../common/Modal.jsx';
import { Button } from '../common/Button.jsx';
import { Badge } from '../common/Badge.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { quoteService } from '../../services/quoteService.js';
import {
  HiPaperAirplane,
  HiLockClosed,
  HiArrowRight,
  HiUserPlus,
  HiShieldCheck,
  HiWrenchScrewdriver,
  HiMapPin,
  HiClock,
  HiCheckCircle,
} from 'react-icons/hi2';

export const QuoteModal = ({ isOpen, onClose, product }) => {
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    location: '',
    quantity: '1 Unit',
    targetCapacity: '',
    feedMaterial: 'Granite',
    timeline: '1-3 Months',
    notes: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({
        ...prev,
        targetCapacity: product?.capacity || prev.targetCapacity || '',
      }));
    }
  }, [isOpen, product]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignInRedirect = () => {
    onClose();
    navigate('/login', { state: { from: location } });
  };

  const handleRegisterRedirect = () => {
    onClose();
    navigate('/register', { state: { from: location } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.location.trim()) {
      showError('Please provide your quarry or plant site location.');
      return;
    }

    setLoading(true);

    try {
      const parts = [];
      if (formData.targetCapacity) parts.push(`Target Capacity: ${formData.targetCapacity}`);
      if (formData.feedMaterial) parts.push(`Feed Rock: ${formData.feedMaterial}`);
      if (formData.notes) parts.push(`Site Details: ${formData.notes}`);

      const payload = {
        product: product
          ? `${product.name} (${product.modelNumber || 'Heavy Equipment'})`
          : 'Heavy Crushing Machinery',
        quantity: formData.quantity || '1 Unit',
        location: formData.location.trim(),
        requirement: parts.length > 0 ? parts.join(' | ') : 'Technical quotation and CAD plant drawing requested.',
        timeline: formData.timeline || '1-3 Months',
        targetCapacity: formData.targetCapacity,
        feedMaterial: formData.feedMaterial,
        notes: formData.notes,
      };

      const res = await quoteService.createQuote(payload);
      const quoteNum = res?.data?.quote?.quoteNumber || '';
      showSuccess(`Quotation request ${quoteNum ? `${quoteNum} ` : ''}submitted successfully! Our sales team will review and respond.`);
      onClose();
    } catch (err) {
      showError(err?.message || 'Failed to submit quote request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // If user is NOT signed in, show the Sign In Required view
  if (!isAuthenticated) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Sign In Required"
        subtitle={product ? `Quotation for ${product.name}` : 'Technical Equipment Quotation'}
        maxWidth="max-w-lg"
      >
        <div className="flex flex-col gap-5 py-2">
          {/* Equipment Preview Banner */}
          {product && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              {product.coverImage ? (
                <img
                  src={product.coverImage}
                  alt={product.name}
                  className="w-14 h-12 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
                  <HiWrenchScrewdriver className="w-6 h-6" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="red" size="sm">
                    {product.category || 'Machinery'}
                  </Badge>
                  {product.modelNumber && (
                    <span className="text-[10px] font-mono font-bold text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      {product.modelNumber}
                    </span>
                  )}
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate mt-1">
                  {product.name}
                </h4>
              </div>
            </div>
          )}

          {/* Auth Gate Notification Card */}
          <div className="p-4 rounded-xl bg-red-50/60 border border-red-200 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <HiLockClosed className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                Account Required for Quotations & Technical CAD Drawings
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Please sign in to your Nathan Industries account to submit RFQ requests. Your quotation and custom engineering layouts will be tied directly to your verified customer dashboard.
              </p>
            </div>
          </div>

          {/* Account Benefits */}
          <div className="space-y-2 text-xs text-slate-600 px-1">
            <div className="flex items-center gap-2">
              <HiCheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Official IS-standard engineering pricing and GST bids</span>
            </div>
            <div className="flex items-center gap-2">
              <HiCheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Track RFQ status and review CAD blueprints in your dashboard</span>
            </div>
            <div className="flex items-center gap-2">
              <HiCheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Direct consultation with Nathan Industries plant engineers</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-slate-200">
            <Button
              variant="primary"
              size="md"
              icon={HiArrowRight}
              iconPosition="right"
              onClick={handleSignInRedirect}
              className="w-full sm:flex-1 font-bold text-xs uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20"
            >
              Sign In to Request Quote
            </Button>
            <Button
              variant="outline"
              size="md"
              icon={HiUserPlus}
              onClick={handleRegisterRedirect}
              className="w-full sm:w-auto font-bold text-xs uppercase tracking-wider bg-white border-slate-300 hover:border-red-400 hover:text-red-600 text-slate-700 shadow-sm"
            >
              Create Account
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  // If user IS authenticated, show the active Quotation Request Form
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Heavy Equipment Quotation & CAD Drawing"
      subtitle={product ? `Product: ${product.name} (${product.modelNumber || 'Custom'})` : 'Speak with our Chief Plant Engineer'}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Logged in User Bar */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Requesting As</span>
            <span className="font-bold text-slate-900">{user?.name || 'Authorized Customer'}</span>
            <span className="text-slate-500 ml-1.5">({user?.email})</span>
          </div>
          {user?.companyName && (
            <span className="text-slate-600 font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-slate-200 self-start sm:self-center">
              {user.companyName}
            </span>
          )}
        </div>

        {/* Row 1: Site Location & Required Quantity */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Quarry / Plant Site Location *
            </label>
            <div className="relative">
              <HiMapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Salem Quarry Site, Tamil Nadu"
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Quantity / Units *
            </label>
            <input
              type="text"
              name="quantity"
              required
              value={formData.quantity}
              onChange={handleChange}
              placeholder="e.g. 1 Unit"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* Row 2: Target Capacity & Rock Material */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Target Output (TPH)
            </label>
            <input
              type="text"
              name="targetCapacity"
              value={formData.targetCapacity}
              onChange={handleChange}
              placeholder="e.g. 200 - 350 TPH"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Feed Rock Material
            </label>
            <select
              name="feedMaterial"
              value={formData.feedMaterial}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-red-500"
            >
              <option value="Granite">Hard Granite (Abrasive)</option>
              <option value="Basalt">Dense Basalt / Trap Rock</option>
              <option value="Quartzite">Quartzite / River Gravel</option>
              <option value="Limestone">Limestone / Dolomite</option>
              <option value="IronOre">Iron Ore / Metallurgical Slag</option>
            </select>
          </div>
        </div>

        {/* Row 3: Commissioning Timeline */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Expected Commissioning Timeline
          </label>
          <div className="relative">
            <HiClock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <select
              name="timeline"
              value={formData.timeline}
              onChange={handleChange}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-red-500"
            >
              <option value="Immediate (15-30 Days)">Immediate (15-30 Days)</option>
              <option value="1-3 Months">1-3 Months</option>
              <option value="3-6 Months">3-6 Months</option>
              <option value="Project Tender / Planning Stage">Project Tender / Planning Stage</option>
            </select>
          </div>
        </div>

        {/* Notes / Site Requirements */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Scope of Supply, Electrical Rating & Technical Notes
          </label>
          <textarea
            rows={3}
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Specify required aggregate fractions (e.g. 0-5mm, 10mm, 20mm), power kVA supply, or civil foundation readiness..."
            className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={loading}
            icon={HiPaperAirplane}
            className="font-bold text-xs uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20"
          >
            Submit RFQ to Engineering Desk
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default QuoteModal;
