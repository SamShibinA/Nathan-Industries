import React, { useState } from 'react';
import { Card } from '../../components/common/Card.jsx';
import { Badge } from '../../components/common/Badge.jsx';
import { Button } from '../../components/common/Button.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { HiUsers, HiShieldCheck, HiMagnifyingGlass, HiEnvelope, HiPhone } from 'react-icons/hi2';

export const AdminUsersPage = () => {
  const [users, setUsers] = useState([
    {
      id: 'USR-001',
      name: 'Super Admin',
      email: 'admin@nathanindustries.com',
      role: 'admin',
      company: 'NathanIndustries HQ',
      phone: '+91 98765 43210',
      city: 'Coimbatore',
      state: 'Tamil Nadu',
      createdAt: '2026-01-01',
    },
    {
      id: 'USR-002',
      name: 'Senthil Kumar',
      email: 'senthil@kongubluemetals.com',
      role: 'customer',
      company: 'Kongu Blue Metals Ltd',
      phone: '+91 98765 43210',
      city: 'Namakkal',
      state: 'Tamil Nadu',
      createdAt: '2026-08-15',
    },
    {
      id: 'USR-003',
      name: 'Er. Rajesh Varma',
      email: 'rajesh.varma@infraprojects.in',
      role: 'customer',
      company: 'National Expressways Infra JV',
      phone: '+91 98450 11223',
      city: 'Salem',
      state: 'Tamil Nadu',
      createdAt: '2026-08-16',
    },
  ]);

  const [search, setSearch] = useState('');
  const { showSuccess } = useToast();

  const handleRoleToggle = (userId) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newRole = u.role === 'admin' ? 'customer' : 'admin';
          showSuccess(`Updated role for ${u.name} to ${newRole}`);
          return { ...u, role: newRole };
        }
        return u;
      })
    );
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 text-slate-800">
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Client & Executive User Registry
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage quarry client accounts, corporate profiles, and administrative permissions.
        </p>
      </div>

      <Card className="p-4 bg-white border-slate-200 flex items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <HiMagnifyingGlass className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, company, email..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-red-500"
          />
        </div>
      </Card>

      <Card className="p-0 bg-white border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">User & Enterprise</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Phone</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4 text-right">Permissions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 block">{u.name}</span>
                    <span className="text-[11px] text-red-600 font-semibold">{u.company}</span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-700">
                    {u.email}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-700">
                    {u.phone}
                  </td>

                  <td className="py-3.5 px-4 text-slate-600">
                    {u.city}, {u.state}
                  </td>

                  <td className="py-3.5 px-4">
                    <Badge variant={u.role === 'admin' ? 'red' : 'navy'} size="sm">
                      {u.role}
                    </Badge>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRoleToggle(u.id)}
                      className="text-[10px] uppercase font-bold text-slate-700 bg-white border-slate-300 hover:border-red-400 hover:text-red-600"
                    >
                      Toggle {u.role === 'admin' ? 'Customer' : 'Admin'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminUsersPage;
