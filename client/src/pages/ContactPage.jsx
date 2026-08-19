import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Container } from '../components/common/Container.jsx';
import { SectionHeading } from '../components/common/SectionHeading.jsx';
import { Card } from '../components/common/Card.jsx';
import { Button } from '../components/common/Button.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { inquiryService } from '../services/inquiryService.js';
import { quoteService } from '../services/quoteService.js';
import { APP_CONFIG } from '../utils/constants.js';
import {
  HiPhone,
  HiEnvelope,
  HiMapPin,
  HiClock,
  HiBuildingOffice2,
  HiWrenchScrewdriver,
  HiPaperAirplane,
  HiDocumentText,
  HiLockClosed,
  HiArrowRight,
  HiGlobeAlt,
} from 'react-icons/hi2';

const INTEREST_OPTIONS = [
  { value: 'general', label: 'General Inquiries / Tenders' },
  { value: 'stone-crushers', label: 'Complete Stone Crusher Plant (100-600 TPH)' },
  { value: 'jaw-crushers', label: 'Primary Jaw Crusher Units' },
  { value: 'cone-crushers', label: 'Hydraulic Cone Crushers' },
  { value: 'sand-plants', label: 'M-Sand & P-Sand Production Systems' },
  { value: 'conveyors', label: 'Heavy Conveyor & Stacker Belts' },
  { value: 'spare-parts', label: 'OEM Crusher Spares & Liners' },
  { value: 'rob-project', label: 'Railway Overbridge (ROB) Construction' },
  { value: 'crusher-install', label: 'Turnkey Plant Installation & Civil Works' },
];

const PRODUCT_OPTIONS = [
  'Stone Crusher Plant (100-600 TPH)',
  'Primary Jaw Crusher',
  'Hydraulic Cone Crusher',
  'VSI Sand Making Machine',
  'M-Sand / P-Sand Plant',
  'Conveyor System',
  'Vibrating Screen / Feeder',
  'Crusher Spare Parts & Liners',
  'Complete EPC Turnkey Project',
  'Railway Overbridge (ROB)',
  'Other (specify in requirement)',
];

const inputClasses = 'w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-500 transition-colors text-xs';
const labelClasses = 'block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1';

// Login required prompt
const LoginPrompt = () => (
  <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
    <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
      <HiLockClosed className="w-7 h-7 text-red-500" />
    </div>
    <div>
      <h3 className="text-lg font-bold text-slate-900 mb-1">Sign In Required</h3>
      <p className="text-xs text-slate-500 max-w-sm">
        Please sign in to your NathanIndustries account to submit inquiries and quote requests. This helps us serve you faster.
      </p>
    </div>
    <div className="flex items-center gap-3">
      <Link to="/login">
        <Button
          variant="primary"
          size="md"
          icon={HiArrowRight}
          iconPosition="right"
          className="font-bold text-xs uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20"
        >
          Sign In
        </Button>
      </Link>
      <Link to="/register" className="text-xs font-bold text-red-600 hover:underline">
        Create Account
      </Link>
    </div>
  </div>
);

export const ContactPage = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('type') === 'quote' ? 'quote' : 'contact';
  const { showSuccess, showError } = useToast();
  const { user, isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [contactLoading, setContactLoading] = useState(false);
  const [quoteLoading, setQuoteLoading] = useState(false);

  // Contact form
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    interest: 'general',
    message: '',
  });

  // Quote form
  const [quoteForm, setQuoteForm] = useState({
    product: PRODUCT_OPTIONS[0],
    quantity: '',
    requirement: '',
    location: '',
    budget: '',
    timeline: '',
  });

  // Pre-fill from user data
  React.useEffect(() => {
    if (user) {
      setContactForm((prev) => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
        company: prev.company || user.companyName || '',
      }));
    }
  }, [user]);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactLoading(true);
    try {
      await inquiryService.createInquiry(contactForm);
      showSuccess('Your inquiry has been submitted successfully! Our engineering team will respond shortly.');
      setContactForm({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        company: user?.companyName || '',
        interest: 'general',
        message: '',
      });
    } catch (err) {
      showError(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setContactLoading(false);
    }
  };

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    setQuoteLoading(true);
    try {
      await quoteService.createQuote(quoteForm);
      showSuccess('Quote request submitted successfully! Our sales team will review and respond with a quotation.');
      setQuoteForm({
        product: PRODUCT_OPTIONS[0],
        quantity: '',
        requirement: '',
        location: '',
        budget: '',
        timeline: '',
      });
    } catch (err) {
      showError(err.message || 'Failed to submit quote request. Please try again.');
    } finally {
      setQuoteLoading(false);
    }
  };

  return (
    <div className="py-12 bg-slate-50/70 min-h-screen text-slate-700">
      <Container>
        <SectionHeading
          badge="Direct Engineering Desk"
          title="Contact NathanIndustries"
          subtitle="Speak with our plant design consultants for equipment sizing, crushing capacity estimation, or project execution tenders."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Left Column: Company Information ── */}
          <div className="flex flex-col gap-5">
            {/* Office Address */}
            <Card className="p-5 bg-white border-slate-200 shadow-sm">
              <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <HiBuildingOffice2 className="w-4 h-4 text-red-600" />
                Corporate Office
              </h4>
              <div className="flex items-start gap-3 text-xs text-slate-600">
                <HiMapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span>NathanIndustries Pvt. Ltd., 5th Floor, Business Tower, Avinashi Road, Coimbatore, Tamil Nadu 641014</span>
              </div>
            </Card>

            {/* Factory Address */}
            <Card className="p-5 bg-white border-slate-200 shadow-sm">
              <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <HiWrenchScrewdriver className="w-4 h-4 text-red-600" />
                Manufacturing Plant
              </h4>
              <div className="flex items-start gap-3 text-xs text-slate-600">
                <HiMapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span>{APP_CONFIG.ADDRESS}</span>
              </div>
            </Card>

            {/* Phone, Email, Hours */}
            <Card className="p-5 bg-white border-slate-200 shadow-sm flex flex-col gap-3">
              <div className="flex items-center gap-3 text-xs text-slate-700">
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                  <HiPhone className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Phone / WhatsApp</div>
                  <a href={`tel:${APP_CONFIG.PHONE}`} className="font-bold text-slate-900 hover:text-red-600 transition-colors">
                    {APP_CONFIG.PHONE}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-700">
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                  <HiEnvelope className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Email</div>
                  <a href={`mailto:${APP_CONFIG.EMAIL}`} className="font-bold text-slate-900 hover:text-red-600 transition-colors">
                    {APP_CONFIG.EMAIL}
                  </a>
                  <div className="text-slate-500">{APP_CONFIG.SALES_EMAIL}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-700">
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                  <HiClock className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Working Hours</div>
                  <span className="font-bold text-slate-900">{APP_CONFIG.WORKING_HOURS}</span>
                  <div className="text-slate-500">Sunday: Closed</div>
                </div>
              </div>
            </Card>

            {/* Google Maps */}
            <Card className="p-0 bg-white border-slate-200 shadow-sm overflow-hidden rounded-2xl">
              <iframe
                title="NathanIndustries Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.302!2d76.9558!3d11.0168!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDAxJzAwLjUiTiA3NsKwNTcnMjAuOSJF!5e0!3m2!1sen!2sin!4v1629000000000!5m2!1sen!2sin"
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              />
            </Card>

            {/* Social Links */}
            <Card className="p-5 bg-white border-slate-200 shadow-sm">
              <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <HiGlobeAlt className="w-4 h-4 text-red-600" />
                Connect With Us
              </h4>
              <div className="flex items-center gap-3">
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold hover:bg-emerald-100 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp
                </a>
                <a
                  href="https://linkedin.com/company/nathanindustries"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold hover:bg-blue-100 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  LinkedIn
                </a>
                <a
                  href="https://youtube.com/@nathanindustries"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold hover:bg-red-100 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  YouTube
                </a>
              </div>
            </Card>

            {/* Emergency Card */}
            <Card className="p-5 bg-red-50 border-red-200">
              <div className="text-xs font-bold uppercase tracking-wider text-red-700 mb-1">
                24/7 Field Breakdown Support
              </div>
              <div className="text-sm font-bold text-slate-900 mb-2">
                Emergency Crusher Spares & Service
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our mobile field engineer squads provide 24-hour turnaround for critical jaw plates, cone mantles, and conveyor belt repairs.
              </p>
            </Card>
          </div>

          {/* ── Right Column: Tabbed Forms ── */}
          <Card className="lg:col-span-2 p-0 bg-white border-slate-200 shadow-sm overflow-hidden">
            {/* Tab Switcher */}
            <div className="flex border-b border-slate-200">
              <button
                onClick={() => setActiveTab('contact')}
                className={`flex-1 px-6 py-4 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${
                  activeTab === 'contact'
                    ? 'text-red-600 border-b-2 border-red-600 bg-red-50/50'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                <HiEnvelope className="w-4 h-4" />
                Contact Inquiry
              </button>
              <button
                onClick={() => setActiveTab('quote')}
                className={`flex-1 px-6 py-4 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${
                  activeTab === 'quote'
                    ? 'text-red-600 border-b-2 border-red-600 bg-red-50/50'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                <HiDocumentText className="w-4 h-4" />
                Request Quotation
              </button>
            </div>

            <div className="p-6">
              {!isAuthenticated ? (
                <LoginPrompt />
              ) : activeTab === 'contact' ? (
                /* ── Contact Inquiry Form ── */
                <form onSubmit={handleContactSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClasses}>Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="e.g. Rajesh Kumar"
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className={labelClasses}>Work Email *</label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="name@company.com"
                        className={inputClasses}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClasses}>Phone / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className={labelClasses}>Company / Quarry Name</label>
                      <input
                        type="text"
                        value={contactForm.company}
                        onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                        placeholder="e.g. Apex Granites & Aggregates"
                        className={inputClasses}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClasses}>Machinery / Project Requirement</label>
                    <select
                      value={contactForm.interest}
                      onChange={(e) => setContactForm({ ...contactForm, interest: e.target.value })}
                      className={inputClasses}
                    >
                      {INTEREST_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelClasses}>Message / Project Details *</label>
                    <textarea
                      rows={4}
                      required
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Mention target output (TPH), rock type (Granite, Basalt, etc.), and site location..."
                      className={inputClasses}
                    />
                  </div>

                  <div>
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      icon={HiPaperAirplane}
                      isLoading={contactLoading}
                      className="font-bold text-xs uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20"
                    >
                      Submit Inquiry to Engineering Team
                    </Button>
                  </div>
                </form>
              ) : (
                /* ── Quote Request Form ── */
                <form onSubmit={handleQuoteSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClasses}>Product / Equipment *</label>
                      <select
                        required
                        value={quoteForm.product}
                        onChange={(e) => setQuoteForm({ ...quoteForm, product: e.target.value })}
                        className={inputClasses}
                      >
                        {PRODUCT_OPTIONS.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelClasses}>Quantity *</label>
                      <input
                        type="text"
                        required
                        value={quoteForm.quantity}
                        onChange={(e) => setQuoteForm({ ...quoteForm, quantity: e.target.value })}
                        placeholder="e.g. 2 Units or 1 Complete Plant"
                        className={inputClasses}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClasses}>Detailed Requirement *</label>
                    <textarea
                      rows={4}
                      required
                      value={quoteForm.requirement}
                      onChange={(e) => setQuoteForm({ ...quoteForm, requirement: e.target.value })}
                      placeholder="Describe your project: target capacity (TPH), feed material, output sizes needed, site conditions..."
                      className={inputClasses}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClasses}>Delivery / Site Location *</label>
                      <input
                        type="text"
                        required
                        value={quoteForm.location}
                        onChange={(e) => setQuoteForm({ ...quoteForm, location: e.target.value })}
                        placeholder="e.g. Salem, Tamil Nadu"
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className={labelClasses}>Budget Range</label>
                      <input
                        type="text"
                        value={quoteForm.budget}
                        onChange={(e) => setQuoteForm({ ...quoteForm, budget: e.target.value })}
                        placeholder="e.g. ₹50L - ₹1.5Cr or Flexible"
                        className={inputClasses}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClasses}>Expected Timeline</label>
                    <input
                      type="text"
                      value={quoteForm.timeline}
                      onChange={(e) => setQuoteForm({ ...quoteForm, timeline: e.target.value })}
                      placeholder="e.g. Within 3 months, ASAP, Q1 2027"
                      className={inputClasses}
                    />
                  </div>

                  <div>
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      icon={HiDocumentText}
                      isLoading={quoteLoading}
                      className="font-bold text-xs uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20"
                    >
                      Submit Quote Request
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default ContactPage;
