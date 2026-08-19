import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../../components/common/Card.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Spinner } from '../../components/common/Spinner.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { inquiryService } from '../../services/inquiryService.js';
import { HiCheckCircle, HiTrash, HiMagnifyingGlass, HiChatBubbleLeftRight } from 'react-icons/hi2';

export const AdminInquiriesPage = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingNotesId, setEditingNotesId] = useState(null);
  const [notesInput, setNotesInput] = useState('');

  const { showSuccess, showError } = useToast();

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await inquiryService.getInquiries({
        status: statusFilter,
        search,
      });
      setInquiries(res.inquiries || []);
    } catch (err) {
      showError(err.message || 'Failed to load inquiries.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search, showError]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await inquiryService.updateInquiry(id, { status: newStatus });
      showSuccess(`Inquiry status updated to '${newStatus}'.`);
      fetchInquiries();
    } catch (err) {
      showError(err.message || 'Failed to update status.');
    }
  };

  const handleSaveNotes = async (id) => {
    try {
      await inquiryService.updateInquiry(id, { adminNotes: notesInput });
      showSuccess('Admin notes saved successfully.');
      setEditingNotesId(null);
      fetchInquiries();
    } catch (err) {
      showError(err.message || 'Failed to save notes.');
    }
  };

  const handleDelete = async (id, inquiryNumber) => {
    if (!window.confirm(`Are you sure you want to delete inquiry ${inquiryNumber || id}?`)) return;
    try {
      await inquiryService.deleteInquiry(id);
      showSuccess(`Inquiry deleted.`);
      fetchInquiries();
    } catch (err) {
      showError(err.message || 'Failed to delete inquiry.');
    }
  };

  return (
    <div className="flex flex-col gap-6 text-slate-800">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Client Inquiries & Direct Messages
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review general engineering inquiries, tenders, and customer feedback submitted via public contact forms.
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
            placeholder="Search by name, email, company, ID..."
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
            <option value="new">New</option>
            <option value="responded">Responded</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </Card>

      {/* Inquiries List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : inquiries.length === 0 ? (
        <Card className="p-8 text-center bg-white border-slate-200">
          <p className="text-xs text-slate-500">No inquiries found matching your filters.</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {inquiries.map((inq) => (
            <Card key={inq._id} className="p-6 bg-white border-slate-200 shadow-sm flex flex-col gap-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-xs font-mono font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                    {inq.inquiryNumber || inq._id.substring(0, 8)}
                  </span>
                  <span className="text-xs font-bold text-slate-900">{inq.name}</span>
                  {inq.company && <span className="text-xs text-slate-500">({inq.company})</span>}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">
                    {new Date(inq.createdAt).toLocaleDateString()}
                  </span>
                  <select
                    value={inq.status}
                    onChange={(e) => handleStatusChange(inq._id, e.target.value)}
                    className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold capitalize focus:outline-none focus:border-red-500"
                  >
                    <option value="new">New</option>
                    <option value="responded">Responded</option>
                    <option value="closed">Closed</option>
                  </select>

                  <button
                    onClick={() => handleDelete(inq._id, inq.inquiryNumber)}
                    className="p-1.5 rounded-lg bg-slate-100 border border-slate-300 text-rose-600 hover:bg-rose-50 hover:border-rose-400 transition-colors"
                    title="Delete Inquiry"
                  >
                    <HiTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="text-xs text-red-600 font-semibold capitalize">
                  Requirement: {inq.interest?.replace('-', ' ')}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                  "{inq.message}"
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-500 pt-1">
                <div className="flex items-center gap-4">
                  <span><strong>Phone:</strong> {inq.phone}</span>
                  <span><strong>Email:</strong> {inq.email}</span>
                </div>

                {/* Admin Notes Toggle */}
                {editingNotesId === inq._id ? (
                  <div className="flex items-center gap-2 w-full mt-2">
                    <input
                      type="text"
                      value={notesInput}
                      onChange={(e) => setNotesInput(e.target.value)}
                      placeholder="Add internal admin notes..."
                      className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-red-500"
                    />
                    <Button size="sm" onClick={() => handleSaveNotes(inq._id)}>Save</Button>
                    <Button variant="ghost" size="sm" onClick={() => setEditingNotesId(null)}>Cancel</Button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setEditingNotesId(inq._id);
                      setNotesInput(inq.adminNotes || '');
                    }}
                    className="text-slate-500 hover:text-red-600 text-xs flex items-center gap-1 font-medium"
                  >
                    <HiChatBubbleLeftRight className="w-3.5 h-3.5" />
                    {inq.adminNotes ? `Notes: "${inq.adminNotes}"` : '+ Add Admin Note'}
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

export default AdminInquiriesPage;
