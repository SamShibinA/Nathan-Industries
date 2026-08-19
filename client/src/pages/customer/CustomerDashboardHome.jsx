import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/common/Card.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Spinner } from '../../components/common/Spinner.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { quoteService } from '../../services/quoteService.js';
import { inquiryService } from '../../services/inquiryService.js';
import {
  HiDocumentText,
  HiEnvelope,
  HiClock,
  HiCheckCircle,
  HiXCircle,
  HiArrowRight,
  HiBuildingOffice2,
  HiArrowDownTray,
  HiPlus,
} from 'react-icons/hi2';

export const CustomerDashboardHome = () => {
  const { user } = useAuth();
  const [quotes, setQuotes] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [quotesData, inquiriesData] = await Promise.all([
          quoteService.getMyQuotes(),
          inquiryService.getMyInquiries(),
        ]);
        setQuotes(quotesData.quotes || []);
        setInquiries(inquiriesData.inquiries || []);
      } catch (err) {
        console.error('Failed to load customer dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Compute status counts
  const pendingQuotes = quotes.filter((q) => q.status === 'pending').length;
  const contactedQuotes = quotes.filter((q) => q.status === 'reviewing' || q.status === 'quoted').length;
  const closedQuotes = quotes.filter((q) => q.status === 'closed').length;

  const pendingInquiries = inquiries.filter((i) => i.status === 'new').length;
  const contactedInquiries = inquiries.filter((i) => i.status === 'responded').length;
  const closedInquiries = inquiries.filter((i) => i.status === 'closed').length;

  return (
    <div className="flex flex-col gap-6 text-slate-800">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-red-600 to-red-500" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-300 font-bold text-xs mb-2 border border-red-500/30">
              <HiBuildingOffice2 className="w-3.5 h-3.5" />
              <span>Enterprise Client Desk</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Welcome back, {user?.name || 'Valued Client'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Track your equipment RFQs, technical inquiries, quotation statuses, and access official plant flowsheets.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <Link to="/contact?type=quote">
              <Button
                variant="primary"
                size="md"
                icon={HiPlus}
                className="font-bold text-xs uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white border-0 shadow-md shadow-red-600/30"
              >
                New RFQ Quote
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Quotes */}
        <Card className="p-5 bg-white border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0 border border-red-100">
            <HiDocumentText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Total RFQ Quotes</div>
            <div className="text-2xl font-black text-slate-900">{loading ? '...' : quotes.length}</div>
            <span className="text-[11px] text-slate-500">{pendingQuotes} pending review</span>
          </div>
        </Card>

        {/* Total Inquiries */}
        <Card className="p-5 bg-white border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 border border-blue-100">
            <HiEnvelope className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Contact Requests</div>
            <div className="text-2xl font-black text-slate-900">{loading ? '...' : inquiries.length}</div>
            <span className="text-[11px] text-slate-500">{pendingInquiries} new</span>
          </div>
        </Card>

        {/* Contacted / In Review */}
        <Card className="p-5 bg-white border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 border border-amber-100">
            <HiClock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Contacted / In Progress</div>
            <div className="text-2xl font-black text-slate-900">
              {loading ? '...' : contactedQuotes + contactedInquiries}
            </div>
            <span className="text-[11px] text-amber-600 font-semibold">Engineers assigned</span>
          </div>
        </Card>

        {/* Closed / Completed */}
        <Card className="p-5 bg-white border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 border border-emerald-100">
            <HiCheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Resolved / Closed</div>
            <div className="text-2xl font-black text-slate-900">
              {loading ? '...' : closedQuotes + closedInquiries}
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold">Fully completed</span>
          </div>
        </Card>
      </div>

      {/* Two Column Layout: Recent Quotes & Recent Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Quotes Card */}
        <Card className="p-6 bg-white border-slate-200 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <HiDocumentText className="w-4 h-4 text-red-600" />
              Recent Equipment Quotes
            </h3>
            <Link to="/dashboard/quotes" className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1">
              View All <HiArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-6"><Spinner size="md" /></div>
          ) : quotes.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-500">
              No quotes submitted yet. <Link to="/contact?type=quote" className="text-red-600 font-bold hover:underline">Submit your first RFQ</Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {quotes.slice(0, 3).map((q) => (
                <div key={q._id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-mono font-bold text-red-600 text-[10px] block">{q.quoteNumber}</span>
                    <span className="font-bold text-slate-900 block">{q.product}</span>
                    <span className="text-[11px] text-slate-500">Qty: {q.quantity} • {q.location}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize border ${
                    q.status === 'pending'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : q.status === 'closed'
                      ? 'bg-slate-100 text-slate-600 border-slate-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {q.status === 'pending' ? 'Pending' : q.status === 'closed' ? 'Closed' : 'Contacted'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Inquiries Card */}
        <Card className="p-6 bg-white border-slate-200 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <HiEnvelope className="w-4 h-4 text-red-600" />
              Recent Contact Requests
            </h3>
            <Link to="/dashboard/inquiries" className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1">
              View All <HiArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-6"><Spinner size="md" /></div>
          ) : inquiries.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-500">
              No contact requests submitted yet. <Link to="/contact" className="text-red-600 font-bold hover:underline">Send an inquiry</Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {inquiries.slice(0, 3).map((inq) => (
                <div key={inq._id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-mono font-bold text-red-600 text-[10px] block">{inq.inquiryNumber}</span>
                    <span className="font-bold text-slate-900 block capitalize">{inq.interest?.replace('-', ' ')}</span>
                    <span className="text-[11px] text-slate-500 truncate max-w-xs block">"{inq.message}"</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize border ${
                    inq.status === 'new'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : inq.status === 'closed'
                      ? 'bg-slate-100 text-slate-600 border-slate-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {inq.status === 'new' ? 'Pending' : inq.status === 'closed' ? 'Closed' : 'Contacted'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Quick Actions Footer */}
      <Card className="p-5 bg-red-50/50 border-red-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold">
            <HiArrowDownTray className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Need Technical Brochures or Flowsheets?</h4>
            <p className="text-[11px] text-slate-500">Download official 2026 product specifications and engineering CAD guidelines.</p>
          </div>
        </div>
        <Link to="/dashboard/downloads">
          <Button variant="outline" size="sm" className="bg-white border-red-300 text-red-700 hover:bg-red-50 text-xs font-bold">
            Access Downloads
          </Button>
        </Link>
      </Card>
    </div>
  );
};

export default CustomerDashboardHome;
