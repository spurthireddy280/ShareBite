import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { DonationRequest, RequestStatus } from '../../types';
import { Badge } from '../../components/common/Badge';
import { TimelineView } from '../../components/common/TimelineView';
import { Inbox, Search, Eye, X, CheckCircle2, Clock } from 'lucide-react';

export const AdminRequestsPage: React.FC = () => {
  const { requests, statusHistory } = useData();

  const [filterStatus, setFilterStatus] = useState<RequestStatus | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReq, setSelectedReq] = useState<DonationRequest | null>(null);

  const filteredRequests = requests.filter(r => {
    const matchesStatus = filterStatus === 'All' || r.status === filterStatus;
    const matchesSearch = searchQuery === '' ||
      r.listingTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.recipientName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System-Wide Donation Requests</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time tracking of food requests, reservation locks, and two-sided verification milestones.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {(['All', 'Pending', 'Accepted', 'Rejected', 'Cancelled', 'Completed'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilterStatus(tab)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                filterStatus === tab
                  ? 'bg-purple-800 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by food, donor, or recipient..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-700 bg-white"
          />
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold text-[10px]">
              <tr>
                <th className="px-4 py-3.5">Food Listing</th>
                <th className="px-4 py-3.5">Donor</th>
                <th className="px-4 py-3.5">Recipient Org</th>
                <th className="px-4 py-3.5">Requested Qty</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Two-Sided Handover</th>
                <th className="px-4 py-3.5 text-right">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.map(req => (
                <tr key={req.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3.5 font-bold text-slate-900">
                    {req.listingTitle}
                    <span className="block text-[10px] text-slate-400 font-normal">{req.id}</span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-700 font-medium">
                    {req.donorName}
                  </td>
                  <td className="px-4 py-3.5 text-slate-700 font-medium">
                    {req.recipientName}
                    <span className="block text-[10px] text-slate-400 font-normal">{req.recipientArea}</span>
                  </td>
                  <td className="px-4 py-3.5 font-bold text-slate-900">
                    {req.requestedQuantity} {req.listingUnit}
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge status={req.status} size="sm" />
                  </td>
                  <td className="px-4 py-3.5 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${req.donorPickupConfirmed ? 'bg-emerald-500' : 'bg-slate-300'}`} title="Donor handover" />
                      <span className="text-slate-600">Donor</span>
                      <span className="text-slate-300">&bull;</span>
                      <span className={`w-2 h-2 rounded-full ${req.recipientPickupConfirmed ? 'bg-emerald-500' : 'bg-slate-300'}`} title="Recipient collection" />
                      <span className="text-slate-600">Recipient</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => setSelectedReq(req)}
                      className="text-purple-700 hover:text-purple-900 font-bold hover:underline"
                    >
                      Audit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Modal */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Request Lifecycle Log</h3>
              <button onClick={() => setSelectedReq(null)} className="text-slate-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
              <p><strong>Food:</strong> {selectedReq.listingTitle}</p>
              <p><strong>Donor:</strong> {selectedReq.donorName}</p>
              <p><strong>Recipient:</strong> {selectedReq.recipientName}</p>
              <p><strong>Quantity:</strong> {selectedReq.requestedQuantity} {selectedReq.listingUnit}</p>
              <p><strong>Status:</strong> {selectedReq.status}</p>
              <p><strong>Pickup Time:</strong> {new Date(selectedReq.expectedPickupTime).toLocaleString()}</p>
              {selectedReq.message && <p><strong>Message:</strong> "{selectedReq.message}"</p>}
            </div>

            <TimelineView
              items={statusHistory.filter(h => h.entityId === selectedReq.id)}
              emptyMessage="No updates logged for this request."
            />

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedReq(null)}
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
