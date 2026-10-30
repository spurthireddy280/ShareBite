import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Badge } from '../../components/common/Badge';
import { FoodSafetyNotice } from '../../components/common/FoodSafetyNotice';
import { 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Phone, 
  Building2, 
  Truck, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';

export const AcceptedDonationsPage: React.FC = () => {
  const { user } = useAuth();
  const { requests, confirmPickupCollection } = useData();

  if (!user) return null;

  // Recipient's accepted donations
  const acceptedRequests = requests.filter(
    r => r.recipientId === user.id && (r.status === 'Accepted' || r.status === 'Completed')
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Accepted Donations & Collection</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Confirmed surplus food allocations ready for scheduled pickup and inspection.
          </p>
        </div>
      </div>

      <FoodSafetyNotice compact />

      {acceptedRequests.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-3">
          <Truck className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No accepted donations right now</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When donors accept your requests, they will appear here with pickup directions and verification controls.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {acceptedRequests.map(req => {
            const isCompleted = req.status === 'Completed';
            const donorConfirmed = req.donorPickupConfirmed;
            const recipientConfirmed = req.recipientPickupConfirmed;

            return (
              <div
                key={req.id}
                className={`bg-white rounded-2xl border p-5 shadow-xs space-y-4 transition-all ${
                  isCompleted ? 'border-slate-200 opacity-90' : 'border-teal-300 ring-1 ring-teal-500/10'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🍲</span>
                      <h3 className="font-bold text-base text-slate-900">{req.listingTitle}</h3>
                      <Badge status={req.status} size="sm" />
                    </div>
                    <p className="text-xs text-slate-600 flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Donor: <strong>{req.donorName}</strong></span>
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-bold bg-teal-50 text-teal-900 border border-teal-300 px-3 py-1 rounded-xl inline-block">
                      {req.requestedQuantity} {req.listingUnit}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">Reserved Portion</p>
                  </div>
                </div>

                {/* Pickup details */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Pickup Location</span>
                    <p className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                      <span>{req.pickupLocation}</span>
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Scheduled Arrival</span>
                    <p className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-brand-700 shrink-0" />
                      <span>{new Date(req.expectedPickupTime).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </p>
                  </div>
                </div>

                {/* Two-Sided Handover Verification Controls */}
                <div className="bg-teal-50/50 p-4 rounded-xl border border-teal-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-6 w-full sm:w-auto">
                    {/* Step 1: Donor Handover */}
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        donorConfirmed ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {donorConfirmed ? '✓' : '1'}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">Donor Handover</p>
                        <p className="text-[11px] text-slate-500">
                          {donorConfirmed ? `Verified (${new Date(req.donorConfirmedAt || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})` : 'Awaiting kitchen handover'}
                        </p>
                      </div>
                    </div>

                    {/* Step 2: Recipient Collection */}
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        recipientConfirmed ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {recipientConfirmed ? '✓' : '2'}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">Recipient Collection</p>
                        <p className="text-[11px] text-slate-500">
                          {recipientConfirmed ? `Verified (${new Date(req.recipientConfirmedAt || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})` : 'Awaiting your verification'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Recipient Action Button */}
                  <div>
                    {isCompleted ? (
                      <span className="px-4 py-2 bg-blue-50 text-blue-900 font-bold rounded-xl border border-blue-200 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        <span>Completed & Verified</span>
                      </span>
                    ) : recipientConfirmed ? (
                      <span className="px-3.5 py-1.5 bg-emerald-50 text-emerald-800 font-semibold rounded-xl border border-emerald-200 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>You confirmed collection &bull; Waiting for Donor</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => confirmPickupCollection(req.id, user)}
                        className="px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4 text-brand-leaf" />
                        <span>Confirm Food Collection</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
