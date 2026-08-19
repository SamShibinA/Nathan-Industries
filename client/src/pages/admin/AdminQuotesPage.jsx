import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../../components/common/Card.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Spinner } from '../../components/common/Spinner.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { quoteService } from '../../services/quoteService.js';
import {
  HiMagnifyingGlass,
  HiTrash,
  HiChatBubbleLeftRight,
} from 'react-icons/hi2';

export const AdminQuotesPage = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingNotesId, setEditingNotesId] = useState(null);
  const [notesInput, setNotesInput] = useState('');

  const { showSuccess, showError } = useToast();

  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await quoteService.getQuotes({
        status: statusFilter,
        search,
      });
      setQuotes(res.quotes || []);
    } catch (err) {
      showError(err.message || 'Failed to load quote requests.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search, showError]);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await quoteService.updateQuote(id, { status: newStatus });
      showSuccess(`Quote status updated to '${newStatus}'.`);
      fetchQuotes();
    } catch (err) {
      showError(err.message || 'Failed to update status.');
    }
  };

  const handleSaveNotes = async (id) => {
    try {
      await quoteService.updateQuote(id, { adminNotes: notesInput });
      showSuccess('Admin notes saved successfully.');
      setEditingNotesId(null);
      fetchQuotes();
    } catch (err) {
      showError(err.message || 'Failed to save notes.');
    }
  };

  const handleDelete = async (id, quoteNumber) => {
    if (!window.confirm(`Are you sure you want to delete quote request ${quoteNumber || id}?`)) return;
    try {
      await quoteService.deleteQuote(id);
      showSuccess('Quote request deleted.');
      fetchQuotes();
    } catch (err) {
      showError(err.message || 'Failed to delete quote request.');
    }
  };

  return (
    <div className="flex flex-col gap-6 text-slate-800">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Client RFQ Quotation Pipeline
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review incoming requests for quotation, plant capacity requirements, and customer contact details.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 bg-white border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-xs">
          <HiMagnifyingGlass className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product, RFQ number, location..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-red-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-600 font-semibold">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-xs focus:outline-none focus:border-red-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="reviewing">Under Review</option>
            <option value="quoted">Quotation Dispatched</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </Card>

      {/* Quotations List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : quotes.length === 0 ? (
        <Card className="p-8 text-center bg-white border-slate-200">
          <p className="text-xs text-slate-500">No quotation requests found matching your filters.</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {quotes.map((q) => (
            <Card key={q._id} className="p-6 bg-white border-slate-200 shadow-sm flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-xs font-mono font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-lg border border-red-200">
                    {q.quoteNumber || q._id.substring(0, 8)}
                  </span>
                  <h3 className="text-base font-bold text-slate-900">{q.product}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">
                    {new Date(q.createdAt).toLocaleDateString()}
                  </span>
                  <select
                    value={q.status}
                    onChange={(e) => handleStatusChange(q._id, e.target.value)}
                    className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold capitalize focus:outline-none focus:border-red-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewing">Under Review</option>
                    <option value="quoted">Quoted</option>
                    <option value="closed">Closed</option>
                  </select>

                  <button
                    onClick={() => handleDelete(q._id, q.quoteNumber)}
                    className="p-1.5 rounded-lg bg-slate-100 border border-slate-300 text-rose-600 hover:bg-rose-50 hover:border-rose-400 transition-colors"
                    title="Delete Quote Request"
                  >
                    <HiTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Client & Enterprise</span>
                  <span className="font-bold text-slate-900 block">{q.user?.name || 'N/A'}</span>
                  {q.user?.companyName && (
                    <span className="text-red-600 font-semibold">{q.user.companyName}</span>
                  )}
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Contact Parameters</span>
                  <span className="block font-mono text-slate-800">{q.user?.phone || 'N/A'}</span>
                  <span className="text-slate-500">{q.user?.email || 'N/A'}</span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Quantity & Location</span>
                  <span className="block font-bold text-slate-900">Qty: {q.quantity}</span>
                  <span className="text-slate-500">Location: {q.location}</span>
                  {q.budget && <span className="block text-slate-500">Budget: {q.budget}</span>}
                  {q.timeline && <span className="block text-slate-500">Timeline: {q.timeline}</span>}
                </div>
              </div>

              {q.requirement && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                  <strong>Requirement Details:</strong> {q.requirement}
                </div>
              )}

              {/* Admin Notes */}
              <div className="flex items-center justify-end text-[11px] pt-1">
                {editingNotesId === q._id ? (
                  <div className="flex items-center gap-2 w-full">
                    <input
                      type="text"
                      value={notesInput}
                      onChange={(e) => setNotesInput(e.target.value)}
                      placeholder="Add internal admin notes..."
                      className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-red-500"
                    />
                    <Button size="sm" onClick={() => handleSaveNotes(q._id)}>Save</Button>
                    <Button variant="ghost" size="sm" onClick={() => setEditingNotesId(null)}>Cancel</Button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setEditingNotesId(q._id);
                      setNotesInput(q.adminNotes || '');
                    }}
                    className="text-slate-500 hover:text-red-600 text-xs flex items-center gap-1 font-medium"
                  >
                    <HiChatBubbleLeftRight className="w-3.5 h-3.5" />
                    {q.adminNotes ? `Notes: "${q.adminNotes}"` : '+ Add Admin Note'}
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminQuotesPage;
