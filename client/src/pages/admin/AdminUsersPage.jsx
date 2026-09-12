import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../../components/common/Card.jsx';
import { Badge } from '../../components/common/Badge.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Modal } from '../../components/common/Modal.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { userService } from '../../services/userService.js';
import {
  HiUsers,
  HiShieldCheck,
  HiMagnifyingGlass,
  HiEnvelope,
  HiPhone,
  HiArrowPath,
  HiTrash,
  HiCheckCircle,
  HiNoSymbol,
  HiUserPlus
} from 'react-icons/hi2';

export const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [userToDelete, setUserToDelete] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const { showSuccess, showError } = useToast();
  const { user: currentUser } = useAuth();

  // Fetch all registered users from backend API
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (roleFilter !== 'all') params.role = roleFilter;

      const res = await userService.getUsers(params);
      const fetchedUsers =
        res?.users ||
        res?.data?.users ||
        (Array.isArray(res?.data) ? res.data : []) ||
        (Array.isArray(res) ? res : []);
      setUsers(fetchedUsers);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError(err?.message || 'Failed to fetch user accounts from database');
      showError(err?.message || 'Error fetching user directory');
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, showError]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  // Toggle user role between 'customer' and 'admin'
  const handleRoleToggle = async (targetUser) => {
    const newRole = targetUser.role === 'admin' ? 'customer' : 'admin';
    if (targetUser._id === currentUser?._id && newRole !== 'admin') {
      showError('You cannot demote your own administrator account');
      return;
    }

    setActionLoadingId(targetUser._id);
    try {
      await userService.updateUserRole(targetUser._id, newRole);
      setUsers((prev) =>
        prev.map((u) => (u._id === targetUser._id ? { ...u, role: newRole } : u))
      );
      showSuccess(`Role for ${targetUser.name} updated to ${newRole}`);
    } catch (err) {
      console.error('Failed to update role:', err);
      showError(err?.message || 'Failed to update user role');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Toggle active/inactive status
  const handleStatusToggle = async (targetUser) => {
    const newStatus = !targetUser.isActive;
    if (targetUser._id === currentUser?._id && !newStatus) {
      showError('You cannot deactivate your own administrator account');
      return;
    }

    setActionLoadingId(targetUser._id);
    try {
      await userService.updateUserStatus(targetUser._id, newStatus);
      setUsers((prev) =>
        prev.map((u) => (u._id === targetUser._id ? { ...u, isActive: newStatus } : u))
      );
      showSuccess(`Account for ${targetUser.name} has been ${newStatus ? 'activated' : 'deactivated'}`);
    } catch (err) {
      console.error('Failed to update status:', err);
      showError(err?.message || 'Failed to update account status');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete user permanently
  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    if (userToDelete._id === currentUser?._id) {
      showError('You cannot delete your own administrator account');
      setUserToDelete(null);
      return;
    }

    setActionLoadingId(userToDelete._id);
    try {
      await userService.deleteUser(userToDelete._id);
      setUsers((prev) => prev.filter((u) => u._id !== userToDelete._id));
      showSuccess(`User ${userToDelete.name} has been permanently deleted`);
      setUserToDelete(null);
    } catch (err) {
      console.error('Failed to delete user:', err);
      showError(err?.message || 'Failed to delete user account');
    } finally {
      setActionLoadingId(null);
    }
  };

  const totalUsersCount = users.length;
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const customerCount = users.filter((u) => u.role === 'customer').length;
  const activeCount = users.filter((u) => u.isActive !== false).length;

  return (
    <div className="flex flex-col gap-6 text-slate-800">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <HiUsers className="w-7 h-7 text-red-600 flex-shrink-0" />
            <span>User Management & Access Registry</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time registered customer accounts, enterprise profiles, and administrator privileges in MongoDB.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchUsers}
          disabled={loading}
          icon={HiArrowPath}
          className={`self-start sm:self-auto text-xs font-bold ${loading ? 'animate-spin' : ''}`}
        >
          Refresh Directory
        </Button>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <Card className="p-4 bg-white border-slate-200 flex items-center gap-3.5 shadow-sm">
          <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700">
            <HiUsers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Users</div>
            <div className="text-xl font-extrabold text-slate-900">{totalUsersCount}</div>
          </div>
        </Card>

        <Card className="p-4 bg-white border-slate-200 flex items-center gap-3.5 shadow-sm">
          <div className="p-2.5 rounded-xl bg-red-50 text-red-600">
            <HiShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Admins</div>
            <div className="text-xl font-extrabold text-red-600">{adminCount}</div>
          </div>
        </Card>

        <Card className="p-4 bg-white border-slate-200 flex items-center gap-3.5 shadow-sm">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
            <HiUserPlus className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Customers</div>
            <div className="text-xl font-extrabold text-slate-900">{customerCount}</div>
          </div>
        </Card>

        <Card className="p-4 bg-white border-slate-200 flex items-center gap-3.5 shadow-sm">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
            <HiCheckCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Accounts</div>
            <div className="text-xl font-extrabold text-emerald-700">{activeCount}</div>
          </div>
        </Card>
      </div>

      {/* Filter & Search Bar */}
      <Card className="p-4 bg-white border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-sm">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <HiMagnifyingGlass className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, company, email, phone, location..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-red-500 transition-colors"
          />
        </div>

        {/* Role Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'All Users' },
            { id: 'customer', label: 'Clients / Customers' },
            { id: 'admin', label: 'Administrators' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setRoleFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                roleFilter === tab.id
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Users Table / States */}
      <Card className="p-0 bg-white border-slate-200 overflow-hidden shadow-sm">
        {loading && users.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
            <span>Fetching user accounts from database...</span>
          </div>
        ) : error && users.length === 0 ? (
          <div className="py-16 text-center text-rose-600 text-xs flex flex-col items-center gap-3">
            <HiNoSymbol className="w-8 h-8" />
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={fetchUsers}>
              Retry
            </Button>
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs flex flex-col items-center gap-2">
            <HiUsers className="w-8 h-8 text-slate-300" />
            <span className="font-bold text-slate-700">No registered users matched your query</span>
            <span className="text-[11px] text-slate-400">Try clearing your search or switching the role filter.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">User & Enterprise</th>
                  <th className="py-3.5 px-4">Contact Details</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Registered</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => {
                  const isCurrent = u._id === currentUser?._id;
                  const isBusy = actionLoadingId === u._id;

                  return (
                    <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                      {/* Name & Company */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
                            {u.name?.charAt(0) || 'U'}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-slate-900 truncate flex items-center gap-1.5">
                              {u.name}
                              {isCurrent && (
                                <span className="text-[9px] font-mono font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">
                                  You
                                </span>
                              )}
                            </span>
                            <span className="text-[11px] text-slate-500 font-semibold truncate">
                              {u.companyName || 'Quarry Operator'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="py-3.5 px-4 text-slate-700">
                        <div className="flex flex-col gap-0.5">
                          <span className="flex items-center gap-1.5 font-medium">
                            <HiEnvelope className="w-3.5 h-3.5 text-slate-400" />
                            <span>{u.email}</span>
                          </span>
                          {u.phone && (
                            <span className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
                              <HiPhone className="w-3.5 h-3.5 text-slate-400" />
                              <span>{u.phone}</span>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4 text-slate-600">
                        {u.city || u.state ? (
                          <span>
                            {u.city}
                            {u.city && u.state ? ', ' : ''}
                            {u.state}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">—</span>
                        )}
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase border ${
                            u.role === 'admin'
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            u.isActive !== false
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {u.isActive !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      {/* Created At Date */}
                      <td className="py-3.5 px-4 text-[11px] text-slate-500 whitespace-nowrap font-mono">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Toggle Role */}
                          <button
                            type="button"
                            onClick={() => handleRoleToggle(u)}
                            disabled={isCurrent || isBusy}
                            title={`Switch role to ${u.role === 'admin' ? 'Customer' : 'Admin'}`}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                              isCurrent
                                ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200'
                            }`}
                          >
                            {u.role === 'admin' ? 'Make Client' : 'Make Admin'}
                          </button>

                          {/* Toggle Active / Inactive */}
                          <button
                            type="button"
                            onClick={() => handleStatusToggle(u)}
                            disabled={isCurrent || isBusy}
                            title={u.isActive !== false ? 'Deactivate user' : 'Activate user'}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              isCurrent
                                ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200'
                                : u.isActive !== false
                                ? 'bg-slate-50 border-slate-200 text-slate-500 hover:text-amber-600 hover:border-amber-300'
                                : 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100'
                            }`}
                          >
                            {u.isActive !== false ? (
                              <HiNoSymbol className="w-3.5 h-3.5" />
                            ) : (
                              <HiCheckCircle className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {/* Delete User */}
                          <button
                            type="button"
                            onClick={() => setUserToDelete(u)}
                            disabled={isCurrent || isBusy}
                            title="Permanently delete user"
                            className={`p-1.5 rounded-lg border transition-colors ${
                              isCurrent
                                ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200'
                                : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50'
                            }`}
                          >
                            <HiTrash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Confirmation Modal for Deleting User */}
      <Modal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        title="Confirm User Deletion"
        subtitle="Permanent Administrator Action"
      >
        {userToDelete && (
          <div className="flex flex-col gap-4 text-xs text-slate-700">
            <p>
              Are you sure you want to permanently delete the account for{' '}
              <strong className="text-slate-900">{userToDelete.name}</strong> ({userToDelete.email})?
            </p>
            <p className="text-slate-500">
              This action cannot be undone. All RFQs, inquiries, and credentials associated with this user will be orphaned or deleted.
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setUserToDelete(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={confirmDeleteUser}
                className="bg-rose-600 hover:bg-rose-700 text-white border-0"
              >
                Permanently Delete User
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminUsersPage;
