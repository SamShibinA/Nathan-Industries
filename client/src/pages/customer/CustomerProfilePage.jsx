import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card.jsx';
import { Button } from '../../components/common/Button.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { authService } from '../../services/authService.js';
import {
  HiUser,
  HiBuildingOffice2,
  HiPhone,
  HiEnvelope,
  HiMapPin,
  HiCheckCircle,
  HiPencilSquare,
} from 'react-icons/hi2';

export const CustomerProfilePage = () => {
  const { user, setUser } = useAuth();
  const { showSuccess, showError } = useToast();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    phone: '',
    city: '',
    state: '',
    gst: '',
    interestedProduct: 'stone-crushers',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        companyName: user.companyName || '',
        phone: user.phone || '',
        city: user.city || '',
        state: user.state || '',
        gst: user.gst || '',
        interestedProduct: user.interestedProduct || 'stone-crushers',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.updateProfile(formData);
      setUser(res.data.user);
      localStorage.setItem('nathan_user_data', JSON.stringify(res.data.user));
      showSuccess('Profile updated successfully!');
    } catch (err) {
      showError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    'w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-500 transition-colors text-xs font-medium';
  const labelClasses = 'block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1';

  return (
    <div className="flex flex-col gap-6 text-slate-800 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          My Account & Profile Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your personal details, quarry enterprise information, and contact parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Brief Side Card */}
        <Card className="p-6 bg-white border-slate-200 shadow-sm flex flex-col gap-4 text-center items-center">
          <div className="w-20 h-20 rounded-full bg-red-100 text-red-700 font-black text-2xl flex items-center justify-center border-2 border-red-200 shadow-inner">
            {user?.name?.charAt(0) || 'C'}
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900">{user?.name}</h3>
            <p className="text-xs text-red-600 font-semibold">{user?.companyName || 'Corporate Client'}</p>
            <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
              Role: {user?.role || 'Customer'}
            </span>
          </div>

          <div className="w-full pt-4 border-t border-slate-200 flex flex-col gap-2 text-left text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <HiEnvelope className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span className="truncate">{user?.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <HiPhone className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>{user?.phone}</span>
            </div>
            {user?.city && (
              <div className="flex items-center gap-2">
                <HiMapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>{user.city}{user.state ? `, ${user.state}` : ''}</span>
              </div>
            )}
            {user?.gst && (
              <div className="flex items-center gap-2">
                <HiCheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>GST: {user.gst}</span>
              </div>
            )}
          </div>
        </Card>

        {/* Edit Profile Form */}
        <Card className="lg:col-span-2 p-6 bg-white border-slate-200 shadow-sm flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <HiPencilSquare className="w-5 h-5 text-red-600" />
              Edit Enterprise Details
            </h3>
            <span className="text-xs text-slate-400">* Required fields</span>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Sam Shibin"
                  className={inputClasses}
                />
              </div>

              <div>
                <label className={labelClasses}>Company / Quarry Name *</label>
                <input
                  type="text"
                  name="companyName"
                  required
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="e.g. NathanIndustries Executive"
                  className={inputClasses}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Contact Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className={inputClasses}
                />
              </div>

              <div>
                <label className={labelClasses}>GST Number</label>
                <input
                  type="text"
                  name="gst"
                  value={formData.gst}
                  onChange={handleChange}
                  placeholder="e.g. 33AAACN1234F1Z5"
                  className={`${inputClasses} font-mono uppercase`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Coimbatore"
                  className={inputClasses}
                />
              </div>

              <div>
                <label className={labelClasses}>State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="e.g. Tamil Nadu"
                  className={inputClasses}
                />
              </div>
            </div>

            <div>
              <label className={labelClasses}>Primary Equipment Interest</label>
              <select
                name="interestedProduct"
                value={formData.interestedProduct}
                onChange={handleChange}
                className={inputClasses}
              >
                <option value="stone-crushers">Stone Crusher Plants</option>
                <option value="jaw-crushers">Jaw Crushers</option>
                <option value="cone-crushers">Cone Crushers</option>
                <option value="sand-plants">M-Sand & P-Sand Plants</option>
                <option value="conveyors">Conveyor Systems</option>
                <option value="spare-parts">Spare Parts</option>
                <option value="rob-infrastructure">ROB Infrastructure</option>
                <option value="general">General Inquiries</option>
              </select>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={loading}
                className="font-bold text-xs uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20"
              >
                Save Profile Changes
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CustomerProfilePage;
