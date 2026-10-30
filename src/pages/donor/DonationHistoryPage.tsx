import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { DonationRequest } from '../../types';
import { Badge } from '../../components/common/Badge';
import { TimelineView } from '../../components/common/TimelineView';
import { 
  History, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Eye, 
  Calendar, 
  X as XIcon, 
  Filter,
  FileSpreadsheet
} from 'lucide-react';

export const DonationHistoryPage: React.FC = () => {
  const { user } = useAuth();
  const { requests, statusHistory } = useData();

  const [selectedRequest, setSelectedRequest] = useState<DonationRequest | null>(null);
  const [filterType, setFilterType] = useState<'All' | 'Completed' | 'Rejected' | 'Cancelled'>('All');

  if (!user) return null;

  // Donor requests that have reached a terminal or milestone status
  const historyRequests = requests.filter(r => {
    if (r.donorId !== user.id) return false;
    if (filterType === 'All') return true;
    return r.status === filterType;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Donation History & Audit Logs</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Historical records of completed, rejected, and cancelled surplus redistribution requests.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs">
        {(['All', 'Completed', 'Rejected', 'Cancelled'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilterType(f)}
            className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all ${
              filterType === f
                ? 'bg-brand-800 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {historyRequests.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-3">
          <History className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No historical records found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {filterType === 'All'
              ? 'Past completed or closed donation records will be permanently archived here.'
              : `No records match status "${filterType}".`}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold text-[10px]">
                <tr>
                  <th className="px-4 py-3.5">Recipient Org</th>
                  <th className="px-4 py-3.5">Food Listing</th>
                  <th className="px-4 py-3.5">Quantity</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Updated Date</th>
                  <th className="px-4 py-3.5 text-right">Audit Trail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {historyRequests.map(req => (
                  <tr key={req.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-slate-900">
                      {req.recipientName}
                      <span className="block text-[10px] text-slate-400 font-normal">{req.recipientArea}</span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-700 font-medium">
                      {req.listingTitle}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-slate-800">
                      {req.requestedQuantity} {req.listingUnit}
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge status={req.status} size="sm" />
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 text-[11px]">
                      {new Date(req.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => setSelectedRequest(req)}
                        className="inline-flex items-center gap-1 text-brand-800 hover:text-brand-900 font-bold hover:underline p-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inspect Audit Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">Donation Audit History</h3>
                <p className="text-xs text-slate-500">ID: {selectedRequest.id}</p>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
              <p><strong>Recipient:</strong> {selectedRequest.recipientName}</p>
              <p><strong>Food:</strong> {selectedRequest.listingTitle}</p>
              <p><strong>Quantity:</strong> {selectedRequest.requestedQuantity} {selectedRequest.listingUnit}</p>
              <p><strong>Status:</strong> {selectedRequest.status}</p>
            </div>

            <TimelineView
              items={statusHistory.filter(h => h.entityId === selectedRequest.id)}
              emptyMessage="No historical timeline recorded for this request."
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
