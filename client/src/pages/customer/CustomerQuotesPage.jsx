import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/common/Card.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Spinner } from '../../components/common/Spinner.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { quoteService } from '../../services/quoteService.js';
import {
  HiDocumentText,
  HiMagnifyingGlass,
  HiPlus,
  HiEye,
  HiXMark,
  HiBuildingOffice2,
} from 'react-icons/hi2';

export const CustomerQuotesPage = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedQuote, setSelectedQuote] = useState(null);

  const { showError } = useToast();

  useEffect(() => {
    const fetchQuotes = async () => {
      setLoading(true);
      try {
        const res = await quoteService.getMyQuotes();
        setQuotes(res.quotes || []);
      } catch (err) {
        showError(err.message || 'Failed to load your quote requests.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuotes();
  }, [showError]);

  // Helper function for user-facing status string
  const getDisplayStatus = (status) => {
    switch (status) {
      case 'pending':
        return { label: 'Pending', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'reviewing':
      case 'quoted':
        return { label: 'Contacted', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'closed':
        return { label: 'Closed', bg: 'bg-slate-100 text-slate-600 border-slate-200' };
      default:
        return { label: status, bg: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  const filteredQuotes = quotes.filter((q) => {
    const displayStatus = getDisplayStatus(q.status).label.toLowerCase();
    const matchesSearch =
      q.product.toLowerCase().includes(search.toLowerCase()) ||
      q.quoteNumber?.toLowerCase().includes(search.toLowerCase()) ||
      q.location.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || displayStatus === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-6 text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            My RFQ Quote Requests
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track quotation progress, plant design estimates, and official engineering bids.
          </p>
        </div>

        <Link to="/contact?type=quote" className="w-full sm:w-auto">
          <Button
            variant="primary"
            size="md"
            icon={HiPlus}
            className="w-full sm:w-auto font-bold text-xs uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20"
          >
            Request New Quote
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 bg-white border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <HiMagnifyingGlass className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by equipment, RFQ number..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-red-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-600 font-semibold">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-xs focus:outline-none focus:border-red-500 font-semibold w-full sm:w-auto"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="contacted">Contacted</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </Card>

      {/* Quotes List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : filteredQuotes.length === 0 ? (
        <Card className="p-8 sm:p-12 text-center bg-white border-slate-200 shadow-sm">
          <HiDocumentText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No Quote Requests Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            You haven't submitted any equipment quotation requests matching these filters.
          </p>
          <div className="mt-4">
            <Link to="/contact?type=quote">
              <Button size="sm" variant="primary" className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold">
                Submit RFQ Request
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredQuotes.map((q) => {
            const statusObj = getDisplayStatus(q.status);

            return (
              <Card key={q._id} className="p-4 sm:p-6 bg-white border-slate-200 shadow-sm flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-xs font-mono font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-lg border border-red-200">
                      {q.quoteNumber || q._id.substring(0, 8)}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">{q.product}</h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize border ${statusObj.bg}`}>
                      {statusObj.label}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(q.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Quantity & Location</span>
                    <span className="font-bold text-slate-900 block">Qty: {q.quantity}</span>
                    <span className="text-slate-500">{q.location}</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Budget & Timeline</span>
                    <span className="block font-medium text-slate-800">{q.budget ? `Budget: ${q.budget}` : 'Budget: Flexible'}</span>
                    <span className="text-slate-500">{q.timeline ? `Timeline: ${q.timeline}` : 'Timeline: Standard'}</span>
                  </div>

                  <div className="flex sm:justify-end items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={HiEye}
                      onClick={() => setSelectedQuote(q)}
                      className="w-full sm:w-auto bg-white border-slate-300 hover:border-red-400 text-slate-700 hover:text-red-600 text-xs font-bold"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Quote Detail Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-6 shadow-xl border border-slate-200 flex flex-col gap-4 relative">
            <button
              onClick={() => setSelectedQuote(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <HiXMark className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                {selectedQuote.quoteNumber}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getDisplayStatus(selectedQuote.status).bg}`}>
                {getDisplayStatus(selectedQuote.status).label}
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900">{selectedQuote.product}</h3>

            <div className="flex flex-col gap-2 text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div><strong>Quantity:</strong> {selectedQuote.quantity}</div>
              <div><strong>Delivery / Site Location:</strong> {selectedQuote.location}</div>
              {selectedQuote.budget && <div><strong>Budget Range:</strong> {selectedQuote.budget}</div>}
              {selectedQuote.timeline && <div><strong>Expected Timeline:</strong> {selectedQuote.timeline}</div>}
              <div><strong>Submitted On:</strong> {new Date(selectedQuote.createdAt).toLocaleString()}</div>
            </div>

            <div className="text-xs text-slate-700">
              <strong className="block mb-1">Detailed Requirement:</strong>
              <p className="bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed text-slate-600">
                {selectedQuote.requirement}
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <Button size="sm" variant="ghost" onClick={() => setSelectedQuote(null)}>
                Close Window
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerQuotesPage;
