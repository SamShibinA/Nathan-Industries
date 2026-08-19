import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal.jsx';
import { Button } from '../common/Button.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { HiPaperAirplane } from 'react-icons/hi2';

export const QuoteModal = ({ isOpen, onClose, product }) => {
  const { user } = useAuth();
  const { showSuccess } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    targetCapacity: '',
    feedMaterial: 'Granite',
    notes: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        company: user.companyName || '',
      }));
    }
  }, [user, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      showSuccess(`Quotation request for ${product?.name || 'Equipment'} has been logged!`);
      onClose();
    }, 600);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Heavy Equipment Quotation & CAD Drawing"
      subtitle={product ? `Product: ${product.name} (${product.modelNumber || 'Custom'})` : 'Speak with our Chief Plant Engineer'}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Row 1: Name & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Your Full Name *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Senthil Kumar"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Work Email *
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="name@quarry.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* Row 2: Phone & Company */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Phone / WhatsApp *
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Company / Quarry Name
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="e.g. Kongu Blue Metals"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* Row 3: Target TPH & Feed Rock */}
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
              placeholder="e.g. 350 TPH or 500 TPH"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Feed Material Type
            </label>
            <select
              name="feedMaterial"
              value={formData.feedMaterial}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-red-500"
            >
              <option value="Granite">Hard Granite (Abrasive)</option>
              <option value="Basalt">Dense Basalt / Trap Rock</option>
              <option value="Quartzite">Quartzite / River Gravel</option>
              <option value="Limestone">Limestone / Dolomite</option>
              <option value="IronOre">Iron Ore / Minerals</option>
            </select>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Site Location & Specific Deliverable Requirements
          </label>
          <textarea
            rows={3}
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Mention civil foundation readiness, electrical supply (kVA), or desired output fractions..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Submit */}
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
