import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Badge } from '../../components/common/Badge';
import { FoodSafetyNotice } from '../../components/common/FoodSafetyNotice';
import { 
  PlusCircle, 
  ListFilter, 
  Inbox, 
  CalendarClock, 
  History, 
  BarChart3, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Truck,
  Sparkles,
  MapPin,
  Utensils
} from 'lucide-react';

export const DonorOverview: React.FC = () => {
  const { user } = useAuth();
  const { listings, requests, statusHistory, acceptRequest, rejectRequest, confirmPickupHandover } = useData();
  const navigate = useNavigate();

  if (!user) return null;

  // Filter donor-specific records
  const myListings = listings.filter(l => l.donorId === user.id);
  const myRequests = requests.filter(r => r.donorId === user.id);

  // Compute dynamic stats
  const totalListings = myListings.length;
  const availableQuantity = myListings.reduce((sum, l) => sum + l.availableQuantity, 0);
  const pendingRequests = myRequests.filter(r => r.status === 'Pending');
  const acceptedRequests = myRequests.filter(r => r.status === 'Accepted');
  const completedRequests = myRequests.filter(r => r.status === 'Completed');
  const totalCollectedQuantity = myListings.reduce((sum, l) => sum + l.collectedQuantity, 0);
  const estimatedMeals = totalCollectedQuantity > 0 ? totalCollectedQuantity : 45; // baseline sample meals

  // Filter status history for donor's listings
  const myListingIds = new Set(myListings.map(l => l.id));
  const recentActivity = statusHistory
    .filter(h => myListingIds.has(h.entityId) || myRequests.some(r => r.id === h.entityId))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-800 to-brand-700 text-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍲</span>
            <h1 className="text-2xl font-bold tracking-tight">Welcome, {user.name}</h1>
          </div>
          <p className="text-xs sm:text-sm text-brand-100 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-brand-300" />
            <span>{user.address || user.area} &bull; Food Donor Dashboard</span>
          </p>
        </div>

        <Link
          to="/donor/create-listing"
          className="flex items-center gap-2 bg-brand-leaf hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-sm transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Publish Surplus Food</span>
        </Link>
      </div>

      {/* Safety Notice */}
      <FoodSafetyNotice compact />

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Listings</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{totalListings}</div>
          <span className="text-[10px] text-slate-400">Published surplus</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Available Qty</span>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1">{availableQuantity}</div>
          <span className="text-[10px] text-slate-400">Ready for pickup</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Pending Requests</span>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">{pendingRequests.length}</div>
          <span className="text-[10px] text-slate-400">Awaiting your approval</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">Accepted Requests</span>
          <div className="text-2xl font-extrabold text-teal-700 mt-1">{acceptedRequests.length}</div>
          <span className="text-[10px] text-slate-400">Reserved for pickup</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">Completed</span>
          <div className="text-2xl font-extrabold text-blue-700 mt-1">{completedRequests.length}</div>
          <span className="text-[10px] text-slate-400">Confirmed deliveries</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-brand-800 uppercase tracking-wider">Meals Rescued</span>
          <div className="text-2xl font-extrabold text-brand-800 mt-1">~{estimatedMeals}</div>
          <span className="text-[10px] text-slate-400">Est. meal equivalents</span>
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Pending Incoming Requests & Active Listings */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Incoming Pending Requests Widget */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Inbox className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">Incoming Requests ({pendingRequests.length})</h3>
              </div>
              <Link to="/donor/requests" className="text-xs font-semibold text-brand-700 hover:underline">
                View all requests
              </Link>
            </div>

            {pendingRequests.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-60" />
                <p className="font-medium text-slate-700">No pending requests right now</p>
                <p className="text-[11px] text-slate-400 mt-0.5">When recipient organizations request food from your listings, they will show up here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingRequests.slice(0, 3).map(req => (
                  <div key={req.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">{req.recipientName}</h4>
                        <p className="text-[11px] text-slate-500">
                          For: <strong className="text-slate-700">{req.listingTitle}</strong>
                        </p>
                      </div>
                      <span className="font-bold text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-200">
                        {req.requestedQuantity} {req.listingUnit}
                      </span>
                    </div>

                    {req.message && (
                      <p className="text-xs text-slate-600 italic bg-white p-2 rounded-lg border border-slate-200/80">
                        "{req.message}"
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>Pickup: {new Date(req.expectedPickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => rejectRequest(req.id, user)}
                          className="px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-lg border border-rose-200 transition-colors"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => acceptRequest(req.id, user)}
                          className="px-3 py-1 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg shadow-xs transition-colors"
                        >
                          Accept & Reserve
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Listings Summary */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ListFilter className="w-5 h-5 text-brand-700" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">My Recent Food Listings</h3>
              </div>
              <Link to="/donor/my-listings" className="text-xs font-semibold text-brand-700 hover:underline">
                Manage all ({myListings.length})
              </Link>
            </div>

            {myListings.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Utensils className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
                <p className="font-medium text-slate-700">No active food listings yet</p>
                <Link to="/donor/create-listing" className="inline-block mt-2 text-brand-800 font-bold underline">
                  Publish your first surplus food item
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {myListings.slice(0, 4).map(item => (
                  <div key={item.id} className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs text-slate-900 truncate">{item.title}</h4>
                        <Badge status={item.status} size="sm" />
                      </div>
                      <p className="text-[11px] text-slate-500 flex items-center gap-2">
                        <span>{item.category}</span>
                        <span>&bull;</span>
                        <span>{item.foodType}</span>
                        <span>&bull;</span>
                        <span>Pickup: {new Date(item.pickupEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold text-slate-900">
                        {item.availableQuantity} / {item.totalQuantity} <span className="font-normal text-slate-500">{item.unit} avail</span>
                      </div>
                      {item.reservedQuantity > 0 && (
                        <div className="text-[10px] text-amber-600 font-medium">
                          {item.reservedQuantity} reserved
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Today's Pickup Schedule & Activity Log */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Pickup Schedule Widget */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-teal-700" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">Upcoming Pickups ({acceptedRequests.length})</h3>
              </div>
              <Link to="/donor/pickup-schedule" className="text-xs font-semibold text-brand-700 hover:underline">
                View Schedule
              </Link>
            </div>

            {acceptedRequests.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Truck className="w-7 h-7 text-slate-400 mx-auto mb-1.5 opacity-50" />
                <p className="font-medium text-slate-700">No scheduled pickups pending</p>
                <p className="text-[10px] text-slate-400">Accepted requests will appear here for handover confirmation.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {acceptedRequests.map(req => (
                  <div key={req.id} className="p-3.5 rounded-xl border border-teal-200 bg-teal-50/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-slate-900">{req.recipientName}</h4>
                      <span className="text-[11px] font-semibold text-teal-900 bg-teal-100 px-2 py-0.5 rounded">
                        {req.requestedQuantity} {req.listingUnit}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600">
                      Listing: <strong className="text-slate-800">{req.listingTitle}</strong>
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>Pickup at {new Date(req.expectedPickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </span>

                      {req.donorPickupConfirmed ? (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Handover Confirmed
                        </span>
                      ) : (
                        <button
                          onClick={() => confirmPickupHandover(req.id, user)}
                          className="px-2.5 py-1 text-xs font-bold bg-brand-800 hover:bg-brand-900 text-white rounded-lg transition-colors"
                        >
                          Confirm Handover
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity Audit */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-slate-600" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">Recent Activity Trail</h3>
              </div>
              <Link to="/donor/history" className="text-xs font-semibold text-brand-700 hover:underline">
                Full History
              </Link>
            </div>

            {recentActivity.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs italic">
                No recent actions recorded.
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivity.map(act => (
                  <div key={act.id} className="text-xs border-l-2 border-brand-leaf pl-3 py-0.5 space-y-0.5">
                    <p className="text-slate-800 leading-snug">{act.description}</p>
                    <span className="text-[10px] text-slate-400">
                      {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &bull; by {act.actorName}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

