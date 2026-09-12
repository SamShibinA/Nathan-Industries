import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/common/Card.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Spinner } from '../../components/common/Spinner.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { inquiryService } from '../../services/inquiryService.js';
import {
  HiEnvelope,
  HiMagnifyingGlass,
  HiPlus,
  HiEye,
  HiXMark,
} from 'react-icons/hi2';

export const CustomerInquiriesPage = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const { showError } = useToast();

  useEffect(() => {
    const fetchInquiries = async () => {
      setLoading(true);
      try {
        const res = await inquiryService.getMyInquiries();
        setInquiries(res.inquiries || []);
      } catch (err) {
        showError(err.message || 'Failed to load your inquiries.');
      } finally {
        setLoading(false);
      }
    };
    fetchInquiries();
  }, [showError]);

  // Helper for user-facing status
  const getDisplayStatus = (status) => {
    switch (status) {
      case 'new':
        return { label: 'Pending', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'responded':
        return { label: 'Contacted', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'closed':
        return { label: 'Closed', bg: 'bg-slate-100 text-slate-600 border-slate-200' };
      default:
        return { label: status, bg: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    const displayStatus = getDisplayStatus(inq.status).label.toLowerCase();
    const matchesSearch =
      inq.message.toLowerCase().includes(search.toLowerCase()) ||
      inq.inquiryNumber?.toLowerCase().includes(search.toLowerCase()) ||
      inq.interest?.toLowerCase().includes(search.toLowerCase());
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
            My Contact Requests & Inquiries
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review your direct engineering tickets, tender questions, and customer support history.
          </p>
        </div>

        <Link to="/contact" className="w-full sm:w-auto">
          <Button
            variant="primary"
            size="md"
            icon={HiPlus}
            className="w-full sm:w-auto font-bold text-xs uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20"
          >
            Submit New Inquiry
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
            placeholder="Search by topic, message, ID..."
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

      {/* Inquiries List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : filteredInquiries.length === 0 ? (
        <Card className="p-8 sm:p-12 text-center bg-white border-slate-200 shadow-sm">
          <HiEnvelope className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No Contact Requests Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            You haven't submitted any engineering contact requests matching these filters.
          </p>
          <div className="mt-4">
            <Link to="/contact">
              <Button size="sm" variant="primary" className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold">
                Submit Contact Inquiry
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredInquiries.map((inq) => {
            const statusObj = getDisplayStatus(inq.status);

            return (
              <Card key={inq._id} className="p-4 sm:p-6 bg-white border-slate-200 shadow-sm flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-xs font-mono font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-lg border border-red-200">
                      {inq.inquiryNumber || inq._id.substring(0, 8)}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 capitalize">
                      Requirement: {inq.interest?.replace('-', ' ')}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize border ${statusObj.bg}`}>
                      {statusObj.label}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 flex-1 leading-relaxed">
                    "{inq.message}"
                  </p>

                  <Button
                    variant="outline"
                    size="sm"
                    icon={HiEye}
                    onClick={() => setSelectedInquiry(inq)}
                    className="w-full sm:w-auto bg-white border-slate-300 hover:border-red-400 text-slate-700 hover:text-red-600 text-xs font-bold self-start sm:self-center flex-shrink-0"
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-6 shadow-xl border border-slate-200 flex flex-col gap-4 relative">
            <button
              onClick={() => setSelectedInquiry(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <HiXMark className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                {selectedInquiry.inquiryNumber}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getDisplayStatus(selectedInquiry.status).bg}`}>
                {getDisplayStatus(selectedInquiry.status).label}
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 capitalize">
              Topic: {selectedInquiry.interest?.replace('-', ' ')}
            </h3>

            <div className="flex flex-col gap-1.5 text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div><strong>Name:</strong> {selectedInquiry.name}</div>
              <div><strong>Email:</strong> {selectedInquiry.email}</div>
              <div><strong>Phone:</strong> {selectedInquiry.phone}</div>
              {selectedInquiry.company && <div><strong>Company:</strong> {selectedInquiry.company}</div>}
              <div><strong>Submitted On:</strong> {new Date(selectedInquiry.createdAt).toLocaleString()}</div>
            </div>

            <div className="text-xs text-slate-700">
              <strong className="block mb-1">Inquiry Message:</strong>
              <p className="bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed text-slate-600">
                {selectedInquiry.message}
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <Button size="sm" variant="ghost" onClick={() => setSelectedInquiry(null)}>
                Close Window
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerInquiriesPage;
