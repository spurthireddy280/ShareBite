import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { DonationRequest } from '../../types';
import { Badge } from '../../components/common/Badge';
import { TimelineView } from '../../components/common/TimelineView';
import { History, Eye, X, CheckCircle2, Clock, MapPin, Building2 } from 'lucide-react';

export const RecipientHistoryPage: React.FC = () => {
  const { user } = useAuth();
  const { requests, statusHistory } = useData();

  const [selectedRequest, setSelectedRequest] = useState<DonationRequest | null>(null);

  if (!user) return null;

  // Recipient completed collections
  const completedCollections = requests.filter(
    r => r.recipientId === user.id && r.status === 'Completed'
  );

  const totalPortionsReceived = completedCollections.reduce((sum, r) => sum + r.requestedQuantity, 0);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Collection & Distribution History</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Permanent records of surplus food collected and served to community shelter occupants.
          </p>
        </div>
      </div>

      {/* Impact Stat Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center font-bold text-2xl border border-teal-200">
            🍲
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">{totalPortionsReceived}</div>
            <p className="text-xs text-slate-500">Total Food Portions Received</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-2xl border border-emerald-200">
            🤲
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">{completedCollections.length}</div>
            <p className="text-xs text-slate-500">Completed Food Rescue Operations</p>
          </div>
        </div>
      </div>

      {completedCollections.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-3">
          <History className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No completed collections yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Once you collect accepted donations and confirm handover, completed history records will be archived here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold text-[10px]">
              <tr>
                <th className="px-4 py-3.5">Food Listing</th>
                <th className="px-4 py-3.5">Donor Organization</th>
                <th className="px-4 py-3.5">Portions Received</th>
                <th className="px-4 py-3.5">Pickup Location</th>
                <th className="px-4 py-3.5">Completed Date</th>
                <th className="px-4 py-3.5 text-right">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {completedCollections.map(req => (
                <tr key={req.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3.5 font-bold text-slate-900">
                    {req.listingTitle}
                  </td>
                  <td className="px-4 py-3.5 text-slate-700 font-medium">
                    {req.donorName}
                  </td>
                  <td className="px-4 py-3.5 font-bold text-emerald-800">
                    {req.requestedQuantity} {req.listingUnit}
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">
                    {req.pickupLocation}
                  </td>
                  <td className="px-4 py-3.5 text-slate-500 text-[11px]">
                    {new Date(req.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => setSelectedRequest(req)}
                      className="inline-flex items-center gap-1 text-teal-800 hover:text-teal-900 font-bold hover:underline p-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Timeline</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Inspect Timeline Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">Donation Lifecycle Log</h3>
                <p className="text-xs text-slate-500">ID: {selectedRequest.id}</p>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <TimelineView
              items={statusHistory.filter(h => h.entityId === selectedRequest.id)}
              emptyMessage="No updates recorded for this collection."
            />

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedRequest(null)}
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
