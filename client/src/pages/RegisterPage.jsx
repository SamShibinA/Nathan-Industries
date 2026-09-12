import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  HiUser, 
  HiBuildingOffice2, 
  HiPhone, 
  HiEnvelope, 
  HiMapPin, 
  HiIdentification, 
  HiLockClosed, 
  HiArrowRight,
  HiEye,
  HiEyeSlash,
  HiShieldCheck
} from 'react-icons/hi2';

import { Card } from '../components/common/Card.jsx';
import { Button } from '../components/common/Button.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    phone: '',
    email: '',
    city: '',
    state: 'Tamil Nadu',
    gstNumber: '',
    interestedProduct: 'stone-crushers',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(formData);
      showSuccess('Corporate account registered successfully!');
      navigate('/');
    } catch (err) {
      showError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <Card className="p-4 sm:p-8 md:p-10 bg-white border-slate-200 shadow-xl">
        {/* Header */}
        <div className="text-center mb-8 pb-6 border-b border-slate-200">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 font-bold text-xs mb-3">
            <HiShieldCheck className="w-4 h-4 text-red-600" />
            <span>Official Client Portal</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Client Corporate Registration
          </h2>
          <p className="text-xs text-slate-600 max-w-lg mx-auto mt-1.5 leading-relaxed">
            Create an enterprise account to access technical machinery datasheets, request plant CAD layouts, and track quotation proposals.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Section 1: Contact & Company Profile */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block mb-3 pb-1 border-b border-slate-100">
              1. Enterprise & Contact Identity
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Authorized Contact Name <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <HiUser className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Senthil Kumar"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:border-red-500 transition-colors shadow-sm"
                  />
                </div>
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Quarry / Company Name <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <HiBuildingOffice2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="text"
                    name="companyName"
                    required
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="e.g. Kongu Blue Metals Ltd"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:border-red-500 transition-colors shadow-sm"
                  />
                </div>
              </div>

              {/* Corporate Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Work Email Address <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <HiEnvelope className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@quarry.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:border-red-500 transition-colors shadow-sm"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Phone / WhatsApp Number <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <HiPhone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:border-red-500 transition-colors shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Location & Tax Details */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block mb-3 pb-1 border-b border-slate-100">
              2. Plant Location & Registration
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* City */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  City / District <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <HiMapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Salem"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:border-red-500 transition-colors shadow-sm"
                  />
                </div>
              </div>

              {/* State */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  State / Region <span className="text-red-600">*</span>
                </label>
                <select
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-red-500 transition-colors shadow-sm"
                >
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Other">Other Region</option>
                </select>
              </div>

              {/* GST */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  GST Number <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <HiIdentification className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="text"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleChange}
                    placeholder="33AAAAA0000A1Z5"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:border-red-500 transition-colors font-mono shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Machinery Interest & Security */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block mb-3 pb-1 border-b border-slate-100">
              3. Machinery Interest & Security
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Primary Machinery Interest */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Primary Equipment Interest
                </label>
                <select
                  name="interestedProduct"
                  value={formData.interestedProduct}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-red-500 transition-colors shadow-sm"
                >
                  <option value="stone-crushers">Complete Stone Crusher Plants (100-600 TPH)</option>
                  <option value="jaw-crushers">Primary Jaw Crushers (Single Toggle)</option>
                  <option value="cone-crushers">Hydraulic Multi-Cylinder Cone Crushers</option>
                  <option value="sand-plants">IS 383 Dry M-Sand & P-Sand Plants</option>
                  <option value="conveyors">Overland Conveyor Galleries</option>
                  <option value="spare-parts">OEM Crusher Castings & Wear Liners</option>
                  <option value="railway-overbridge">Railway Overbridge (ROB) Works</option>
                </select>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Portal Password <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <HiLockClosed className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 6 characters"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:border-red-500 transition-colors shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-700"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <HiEyeSlash className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Action Button */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              icon={HiArrowRight}
              iconPosition="right"
              className="w-full font-bold text-xs uppercase tracking-wider py-3 bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20"
            >
              Create Enterprise Account
            </Button>
          </div>
        </form>
      </Card>

      {/* Switch to Login Link */}
      <div className="text-center mt-6 text-xs text-slate-600">
        Already registered with NathanIndustries?{' '}
        <Link to="/login" className="font-bold text-red-600 hover:underline">
          Sign In to Portal
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
