import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { DonationRequest, RequestStatus } from '../../types';
import { Badge } from '../../components/common/Badge';
import { TimelineView } from '../../components/common/TimelineView';
import { 
  Inbox, 
  Check, 
  X as XIcon, 
  Eye, 
  Clock, 
  Phone, 
  Building2, 
  MapPin, 
  AlertCircle,
  CheckCircle2,
  Filter
} from 'lucide-react';

const STATUS_FILTERS: (RequestStatus | 'All')[] = ['All', 'Pending', 'Accepted', 'Rejected', 'Cancelled', 'Completed'];

export const IncomingRequestsPage: React.FC = () => {
  const { user } = useAuth();
  const { requests, listings, statusHistory, acceptRequest, rejectRequest } = useData();

  const [activeFilter, setActiveFilter] = useState<RequestStatus | 'All'>('All');
  const [selectedRequest, setSelectedRequest] = useState<DonationRequest | null>(null);
  const [rejectingRequest, setRejectingRequest] = useState<DonationRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('Capacity limit reached or logistics mismatch');

  if (!user) return null;

  const myRequests = requests.filter(r => r.donorId === user.id);

  const filteredRequests = myRequests.filter(r => {
    if (activeFilter === 'All') return true;
    return r.status === activeFilter;
  });

  const handleAccept = (req: DonationRequest) => {
    try {
      acceptRequest(req.id, user);
    } catch {
      // toast shown in context
    }
  };

  const handleConfirmReject = () => {
    if (!rejectingRequest) return;
    rejectRequest(rejectingRequest.id, user, rejectReason);
    setRejectingRequest(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Incoming Food Requests</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review and accept portion requests from verified shelters and food banks.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {STATUS_FILTERS.map(filter => {
          const count = filter === 'All'
            ? myRequests.length
            : myRequests.filter(r => r.status === filter).length;
          const isActive = activeFilter === filter;
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-brand-800 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{filter}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-3">
          <Inbox className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No requests found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {activeFilter === 'All'
              ? 'No recipient organizations have submitted requests yet.'
              : `No requests with status "${activeFilter}".`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map(req => {
            const listing = listings.find(l => l.id === req.listingId);
            const isPending = req.status === 'Pending';
            const availableInListing = listing?.availableQuantity ?? 0;
            const hasSufficientQty = availableInListing >= req.requestedQuantity;

            return (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-slate-900">{req.recipientName}</h3>
                      <Badge status={req.status} size="sm" />
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{req.recipientArea}</span>
                      <span>&bull;</span>
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{req.recipientPhone}</span>
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold bg-amber-50 text-amber-900 border border-amber-300 px-3 py-1 rounded-xl">
                      {req.requestedQuantity} {req.listingUnit}
                    </span>
                    {isPending && (
                      <p className="text-[10px] text-slate-500 mt-1">
                        Currently available in listing: <strong>{availableInListing} {req.listingUnit}</strong>
                      </p>
                    )}
                  </div>
                </div>

                {/* Request Details Bar */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Food Listing</span>
                    <p className="font-semibold text-slate-800 line-clamp-1">{req.listingTitle}</p>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Expected Pickup Time</span>
                    <p className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{new Date(req.expectedPickupTime).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Requested On</span>
                    <p className="font-semibold text-slate-800">
                      {new Date(req.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })} at {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                {req.message && (
                  <div className="text-xs text-slate-700 bg-slate-50/50 p-3 rounded-xl border border-slate-200/60 italic">
                    <span className="font-semibold not-italic text-slate-900">Message: </span>
                    "{req.message}"
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedRequest(req)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-brand-800 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Full Audit Timeline</span>
                  </button>

                  {isPending && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setRejectingRequest(req)}
                        className="px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors"
                      >
                        Decline Request
                      </button>

                      <button
                        onClick={() => handleAccept(req)}
                        disabled={!hasSufficientQty}
                        className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-xl shadow-xs transition-all ${
                          hasSufficientQty
                            ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                        title={!hasSufficientQty ? 'Insufficient available food to fulfill this request' : ''}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept & Reserve Food</span>
                      </button>
                    </div>
                  )}

                  {req.status === 'Accepted' && (
                    <div className="flex items-center gap-2 text-xs text-emerald-800 font-semibold bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Accepted & Food Reserved &bull; See Pickup Schedule</span>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Reject Modal */}
      {rejectingRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-base text-slate-900">
              Decline Request from {rejectingRequest.recipientName}?
            </h3>
            <p className="text-xs text-slate-600">
              Please specify a brief note for the recipient organization:
            </p>

            <textarea
              rows={3}
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-700 resize-none bg-white"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRejectingRequest(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-5 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs"
              >
                Decline Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Request Audit Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">Request Lifecycle & Timeline</h3>
                <p className="text-xs text-slate-500">ID: {selectedRequest.id}</p>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <TimelineView
              items={statusHistory.filter(h => h.entityId === selectedRequest.id)}
              emptyMessage="No lifecycle updates recorded yet."
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

