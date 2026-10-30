import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { DonationRequest, RequestStatus } from '../../types';
import { Badge } from '../../components/common/Badge';
import { TimelineView } from '../../components/common/TimelineView';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { 
  Inbox, 
  Clock, 
  MapPin, 
  Phone, 
  Building2, 
  Eye, 
  X, 
  Ban, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

const STATUS_FILTERS: (RequestStatus | 'All')[] = ['All', 'Pending', 'Accepted', 'Rejected', 'Cancelled', 'Completed'];

export const MyRequestsPage: React.FC = () => {
  const { user } = useAuth();
  const { requests, statusHistory, cancelRequest } = useData();

  const [activeFilter, setActiveFilter] = useState<RequestStatus | 'All'>('All');
  const [selectedRequest, setSelectedRequest] = useState<DonationRequest | null>(null);
  const [requestToCancel, setRequestToCancel] = useState<DonationRequest | null>(null);

  if (!user) return null;

  const myRequests = requests.filter(r => r.recipientId === user.id);

  const filteredRequests = myRequests.filter(r => {
    if (activeFilter === 'All') return true;
    return r.status === activeFilter;
  });

  const handleConfirmCancel = () => {
    if (!requestToCancel) return;
    try {
      cancelRequest(requestToCancel.id, user, 'Cancelled by recipient organization');
      setRequestToCancel(null);
    } catch {
      // toast shown in context
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Food Requests</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track status of food requests sent to restaurants, hotels, and bakeries.
          </p>
        </div>

        <Link
          to="/recipient/browse"
          className="flex items-center gap-2 bg-teal-800 hover:bg-teal-900 text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-all"
        >
          <span>Find More Surplus Food</span>
        </Link>
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
                  ? 'bg-teal-800 text-white shadow-xs'
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
              ? "You haven't requested any food yet. Browse available listings to get started."
              : `No requests with status "${activeFilter}".`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map(req => {
            const isCancellable = (req.status === 'Pending' || req.status === 'Accepted') &&
              !req.donorPickupConfirmed && !req.recipientPickupConfirmed;

            return (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-slate-900">{req.listingTitle}</h3>
                      <Badge status={req.status} size="sm" />
                    </div>
                    <p className="text-xs text-slate-600 flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Donor: <strong>{req.donorName}</strong></span>
                      <span>&bull;</span>
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{req.pickupLocation}</span>
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-bold bg-teal-50 text-teal-900 border border-teal-300 px-3 py-1 rounded-xl inline-block">
                      {req.requestedQuantity} {req.listingUnit}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Submitted on {new Date(req.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>

                {/* Pickup details */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>Scheduled Arrival: <strong>{new Date(req.expectedPickupTime).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</strong></span>
                  </div>

                  {req.status === 'Accepted' && (
                    <Link
                      to="/recipient/accepted"
                      className="text-xs font-bold text-teal-800 hover:underline flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                      <span>Ready for pickup &bull; Open Confirmation</span>
                    </Link>
                  )}
                </div>

                {req.message && (
                  <p className="text-xs text-slate-600 italic bg-slate-50/50 p-2.5 rounded-lg border border-slate-200/50">
                    "{req.message}"
                  </p>
                )}

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <button
                    onClick={() => setSelectedRequest(req)}
                    className="flex items-center gap-1 font-semibold text-slate-600 hover:text-teal-800"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Status History</span>
                  </button>

                  {isCancellable && (
                    <button
                      onClick={() => setRequestToCancel(req)}
                      className="px-3 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors flex items-center gap-1"
                    >
                      <Ban className="w-3 h-3" />
                      <span>Cancel Request</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(requestToCancel)}
        title="Cancel Food Request?"
        message={`Are you sure you want to cancel your request for ${requestToCancel?.requestedQuantity} ${requestToCancel?.listingUnit} of "${requestToCancel?.listingTitle}"? ${
          requestToCancel?.status === 'Accepted'
            ? 'The reserved food quantity will be released back to the donor immediately.'
            : ''
        }`}
        confirmLabel="Cancel Request"
        confirmVariant="danger"
        onConfirm={handleConfirmCancel}
        onCancel={() => setRequestToCancel(null)}
      />

      {/* View Request Audit Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">Request Audit Trail</h3>
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
              emptyMessage="No updates recorded yet."
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
