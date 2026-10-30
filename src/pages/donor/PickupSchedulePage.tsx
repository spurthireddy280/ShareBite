import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { DonationRequest } from '../../types';
import { Badge } from '../../components/common/Badge';
import { 
  CalendarClock, 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Phone, 
  Building2, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export const PickupSchedulePage: React.FC = () => {
  const { user } = useAuth();
  const { requests, listings, confirmPickupHandover } = useData();

  if (!user) return null;

  // Donor's accepted & active pickups
  const scheduledRequests = requests.filter(
    r => r.donorId === user.id && (r.status === 'Accepted' || r.status === 'Completed')
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Pickup Coordination Schedule</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track confirmed pickups and record verified physical food handover to recipient representatives.
          </p>
        </div>
      </div>

      {/* Two-Sided Handover Explainer Notice */}
      <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-2xl flex items-start gap-3 text-xs text-emerald-950">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-emerald-900">
            Two-Sided Verification Protocol:
          </p>
          <p className="text-emerald-800 leading-relaxed">
            1. Donor clicks "Confirm Food Handover" when recipient arrives and receives thermal containers.<br />
            2. Recipient organization inspects food condition and clicks "Confirm Food Collection".<br />
            3. The donation is officially completed, inventory is reconciled, and sustainability metrics update.
          </p>
        </div>
      </div>

      {scheduledRequests.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-3">
          <CalendarClock className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No pickups scheduled</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Once you accept incoming requests from recipient organizations, pickup appointments will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {scheduledRequests.map(req => {
            const isCompleted = req.status === 'Completed';
            const donorConfirmed = req.donorPickupConfirmed;
            const recipientConfirmed = req.recipientPickupConfirmed;

            return (
              <div
                key={req.id}
                className={`bg-white rounded-2xl border p-5 shadow-xs transition-all space-y-4 ${
                  isCompleted ? 'border-slate-200 opacity-90' : 'border-emerald-300 ring-1 ring-emerald-500/10'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🚚</span>
                      <h3 className="font-bold text-base text-slate-900">{req.recipientName}</h3>
                      <Badge status={req.status} size="sm" />
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{req.recipientPhone}</span>
                      <span>&bull;</span>
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{req.recipientArea}</span>
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-bold bg-emerald-50 text-emerald-900 border border-emerald-300 px-3 py-1 rounded-xl inline-block">
                      {req.requestedQuantity} {req.listingUnit}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">Reserved Allocation</p>
                  </div>
                </div>

                {/* Pickup details */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Food Title</span>
                    <p className="font-semibold text-slate-800 line-clamp-1">{req.listingTitle}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Scheduled Arrival</span>
                    <p className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-brand-700" />
                      <span>{new Date(req.expectedPickupTime).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Pickup Location</span>
                    <p className="font-semibold text-slate-800 line-clamp-1">{req.pickupLocation}</p>
                  </div>
                </div>

                {/* Two-Sided Status Bar */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-6 w-full sm:w-auto">
                    {/* Donor Confirmation Status */}
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        donorConfirmed ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {donorConfirmed ? '✓' : '1'}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">Donor Handover</p>
                        <p className="text-[11px] text-slate-500">
                          {donorConfirmed ? `Confirmed (${new Date(req.donorConfirmedAt || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})` : 'Pending handover'}
                        </p>
                      </div>
                    </div>

                    {/* Recipient Confirmation Status */}
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        recipientConfirmed ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {recipientConfirmed ? '✓' : '2'}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">Recipient Receipt</p>
                        <p className="text-[11px] text-slate-500">
                          {recipientConfirmed ? `Confirmed (${new Date(req.recipientConfirmedAt || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})` : 'Awaiting collection'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Donor Confirmation Action Button */}
                  <div>
                    {isCompleted ? (
                      <span className="px-3.5 py-1.5 bg-blue-50 text-blue-800 font-bold text-xs rounded-xl border border-blue-200 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        <span>Completed & Verified</span>
                      </span>
                    ) : donorConfirmed ? (
                      <span className="px-3.5 py-1.5 bg-emerald-50 text-emerald-800 font-semibold text-xs rounded-xl border border-emerald-200 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Handover Confirmed &bull; Waiting for Recipient</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => confirmPickupHandover(req.id, user)}
                        className="px-5 py-2 bg-brand-800 hover:bg-brand-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4 text-brand-300" />
                        <span>Confirm Food Handover</span>
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

