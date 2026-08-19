import React, { useState } from 'react';
import { HiPaperAirplane, HiEnvelope, HiShieldCheck } from 'react-icons/hi2';
import { Container } from '../common/Container.jsx';
import { Button } from '../common/Button.jsx';
import { useToast } from '../../context/ToastContext.jsx';

export const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showError('Please provide a valid corporate email address.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showSuccess('Subscribed! You will receive quarterly engineering whitepapers.');
      setEmail('');
    }, 600);
  };

  return (
    <section className="py-14 bg-slate-50/80 border-b border-slate-200 relative overflow-hidden">
      <Container>
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-red-100 border border-red-200 text-red-700 font-bold text-xs mb-3">
            <HiShieldCheck className="w-3.5 h-3.5" />
            <span>Heavy Engineering Technical Bulletin</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
            Quarterly Quarry & Crushing Technology Dispatch
          </h3>

          <p className="text-xs text-slate-600 max-w-lg mx-auto mb-6 leading-relaxed">
            Subscribe to receive technical whitepapers on manganese alloy wear optimization, IS 383 sand grading calibration, and bridge girder launching methodology.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2.5 max-w-md mx-auto">
            <div className="relative w-full">
              <HiEnvelope className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter corporate email address..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-500 transition-colors text-xs shadow-sm"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={loading}
              icon={HiPaperAirplane}
              className="w-full sm:w-auto font-bold text-xs uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white flex-shrink-0 shadow-md shadow-red-600/20"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </Container>
    </section>
  );
};

export default NewsletterSection;
