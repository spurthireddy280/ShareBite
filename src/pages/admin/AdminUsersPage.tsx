import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { storageService } from '../../services/storageService';
import { User, UserRole } from '../../types';
import { Badge } from '../../components/common/Badge';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { 
  Users, 
  Search, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Eye, 
  X,
  UserX
} from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { showToast } = useData();

  const [users, setUsers] = useState<User[]>(() => storageService.getUsers());
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectUser, setInspectUser] = useState<User | null>(null);

  const filteredUsers = users.filter(u => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesSearch = searchQuery === '' ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const toggleVerification = (userToToggle: User) => {
    const updated = users.map(u => {
      if (u.id === userToToggle.id) {
        return { ...u, verified: !u.verified };
      }
      return u;
    });
    setUsers(updated);
    storageService.saveUsers(updated);

    storageService.addAdminLog({
      adminId: currentUser?.id || 'admin',
      adminName: currentUser?.name || 'Admin',
      action: userToToggle.verified ? 'Revoked Verification' : 'Verified Organization',
      targetType: 'user',
      targetId: userToToggle.id,
      details: `${userToToggle.verified ? 'Revoked' : 'Granted'} verification status for ${userToToggle.name}.`,
    });

    showToast('Verification Status Updated', `${userToToggle.name} verification status was updated.`, 'success');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">User & Organization Directory</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review registered food donors, charities, shelters, and platform administrators.
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search organizations by name or area..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-700 bg-white"
          />
        </div>

        <div className="flex items-center gap-2 text-xs w-full sm:w-auto">
          {(['all', 'donor', 'recipient', 'admin'] as const).map(role => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1.5 rounded-xl font-semibold capitalize transition-all ${
                roleFilter === role
                  ? 'bg-purple-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {role === 'all' ? 'All Roles' : `${role}s`}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold text-[10px]">
              <tr>
                <th className="px-4 py-3.5">Organization / User</th>
                <th className="px-4 py-3.5">Role</th>
                <th className="px-4 py-3.5">Type</th>
                <th className="px-4 py-3.5">Location</th>
                <th className="px-4 py-3.5">Verification</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="font-bold text-slate-900">{u.name}</div>
                    <div className="text-[11px] text-slate-400">{u.email} &bull; {u.contactPerson}</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="capitalize font-semibold text-slate-700 px-2 py-0.5 rounded-full bg-slate-100 text-[11px]">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600 font-medium">
                    {u.orgType}
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">
                    {u.area}, {u.city}
                  </td>
                  <td className="px-4 py-3.5">
                    {u.verified ? (
                      <span className="text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px] inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Verified
                      </span>
                    ) : (
                      <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        Pending Check
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-right space-x-2">
                    <button
                      onClick={() => setInspectUser(u)}
                      className="text-purple-700 hover:text-purple-900 font-bold hover:underline"
                    >
                      Inspect
                    </button>
                    {u.role !== 'admin' && (
                      <button
                        onClick={() => toggleVerification(u)}
                        className="text-xs text-slate-500 hover:text-slate-800 underline"
                      >
                        {u.verified ? 'Revoke' : 'Verify'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect User Modal */}
      {inspectUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Organization Profile</h3>
              <button onClick={() => setInspectUser(null)} className="text-slate-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-slate-700">
              <p><strong>Name:</strong> {inspectUser.name}</p>
              <p><strong>Role:</strong> {inspectUser.role}</p>
              <p><strong>Contact Representative:</strong> {inspectUser.contactPerson}</p>
              <p><strong>Email:</strong> {inspectUser.email}</p>
              <p><strong>Phone:</strong> {inspectUser.phone}</p>
              <p><strong>Type:</strong> {inspectUser.orgType}</p>
              <p><strong>Address:</strong> {inspectUser.address}, {inspectUser.area}, {inspectUser.city}</p>
              {inspectUser.peopleServed && (
                <p><strong>Occupants / People Served:</strong> {inspectUser.peopleServed} people daily</p>
              )}
              {inspectUser.description && (
                <p><strong>Mission Statement:</strong> {inspectUser.description}</p>
              )}
              <p><strong>Verification:</strong> {inspectUser.verified ? 'Verified Platform Participant' : 'Unverified / Demo'}</p>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setInspectUser(null)}
                className="px-4 py-2 text-xs font-semibold bg-slate-800 text-white rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
