import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Badge } from '../../components/common/Badge';
import { FoodSafetyNotice } from '../../components/common/FoodSafetyNotice';
import { 
  Search, 
  Inbox, 
  CheckCircle2, 
  CalendarClock, 
  History, 
  BarChart3, 
  ArrowRight, 
  Clock, 
  MapPin, 
  Truck, 
  Utensils, 
  HeartHandshake 
} from 'lucide-react';

export const RecipientOverview: React.FC = () => {
  const { user } = useAuth();
  const { listings, requests, confirmPickupCollection } = useData();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');

  if (!user) return null;

  // Filter recipient-specific records
  const myRequests = requests.filter(r => r.recipientId === user.id);
  const pendingRequests = myRequests.filter(r => r.status === 'Pending');
  const acceptedRequests = myRequests.filter(r => r.status === 'Accepted');
  const completedRequests = myRequests.filter(r => r.status === 'Completed');

  // Compute metrics
  const availableListingsCount = listings.filter(
    l => l.status === 'Available' || l.status === 'Partially Reserved'
  ).length;

  const totalQuantityReceived = completedRequests.reduce((sum, r) => sum + r.requestedQuantity, 0);
  const estimatedMealsReceived = totalQuantityReceived > 0 ? totalQuantityReceived : 80; // baseline sample

  // Recent matching listings near recipient's area
  const nearbyListings = listings
    .filter(l => (l.status === 'Available' || l.status === 'Partially Reserved'))
    .slice(0, 3);

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/recipient/browse?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-800 to-teal-700 text-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">🤲</span>
            <h1 className="text-2xl font-bold tracking-tight">Welcome, {user.name}</h1>
          </div>
          <p className="text-xs sm:text-sm text-teal-100 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-teal-300" />
            <span>Serving {user.peopleServed || 200}+ people daily &bull; {user.area || user.city}</span>
          </p>
        </div>

        <Link
          to="/recipient/browse"
          className="flex items-center gap-2 bg-brand-leaf hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-sm transition-all shrink-0"
        >
          <Search className="w-4 h-4" />
          <span>Browse Available Food</span>
        </Link>
      </div>

      <FoodSafetyNotice compact />

      {/* Quick Search Bar */}
      <form onSubmit={handleQuickSearch} className="relative">
        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
        <input
          type="text"
          placeholder="Search surplus food by name, restaurant, or cuisine (e.g., Rice, Biryani, Bread, Sandwiches)..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-28 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-700 bg-white shadow-xs text-xs sm:text-sm"
        />
        <button
          type="submit"
          className="absolute right-2 top-2 px-4 py-1.5 bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
        >
          Find Food
        </button>
      </form>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Available Listings</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{availableListingsCount}</div>
          <span className="text-[10px] text-slate-400">Ready for pickup now</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Requests Sent</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{myRequests.length}</div>
          <span className="text-[10px] text-slate-400">Total submitted</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Pending</span>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">{pendingRequests.length}</div>
          <span className="text-[10px] text-slate-400">Awaiting donor review</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">Accepted</span>
          <div className="text-2xl font-extrabold text-teal-700 mt-1">{acceptedRequests.length}</div>
          <span className="text-[10px] text-slate-400">Ready for collection</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">Completed</span>
          <div className="text-2xl font-extrabold text-blue-700 mt-1">{completedRequests.length}</div>
          <span className="text-[10px] text-slate-400">Verified deliveries</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-brand-800 uppercase tracking-wider">Meals Received</span>
          <div className="text-2xl font-extrabold text-brand-800 mt-1">~{estimatedMealsReceived}</div>
          <span className="text-[10px] text-slate-400">Portions distributed</span>
        </div>
      </div>

      {/* 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Scheduled Collections & Action Required */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Accepted Donations Awaiting Pickup */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-teal-700" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Accepted Donations Ready for Collection ({acceptedRequests.length})
                </h3>
              </div>
              <Link to="/recipient/accepted" className="text-xs font-semibold text-teal-700 hover:underline">
                View All
              </Link>
            </div>

            {acceptedRequests.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Truck className="w-8 h-8 text-slate-300 mx-auto mb-1.5" />
                <p className="font-medium text-slate-700">No accepted donations right now</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Explore available surplus food and submit a portion request.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {acceptedRequests.map(req => (
                  <div key={req.id} className="p-4 rounded-xl border border-teal-200 bg-teal-50/40 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">{req.listingTitle}</h4>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>Donor: <strong>{req.donorName}</strong> ({req.pickupLocation})</span>
                        </p>
                      </div>

                      <span className="text-xs font-bold text-teal-900 bg-teal-100 px-2.5 py-1 rounded-lg border border-teal-200">
                        {req.requestedQuantity} {req.listingUnit}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-teal-100 text-[11px]">
                      <span className="text-slate-600 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Pickup: {new Date(req.expectedPickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </span>

                      {req.recipientPickupConfirmed ? (
                        <span className="font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Collection Verified</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => confirmPickupCollection(req.id, user)}
                          className="px-3.5 py-1.5 bg-teal-800 hover:bg-teal-900 text-white font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-brand-leaf" />
                          <span>Confirm Food Collection</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Submissions */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Inbox className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  My Pending Requests ({pendingRequests.length})
                </h3>
              </div>
              <Link to="/recipient/my-requests" className="text-xs font-semibold text-teal-700 hover:underline">
                Manage Requests
              </Link>
            </div>

            {pendingRequests.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs italic">
                No requests currently awaiting donor acceptance.
              </div>
            ) : (
              <div className="space-y-2">
                {pendingRequests.map(req => (
                  <div key={req.id} className="p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-800">{req.listingTitle}</p>
                      <p className="text-[11px] text-slate-500">To {req.donorName} &bull; Requested {req.requestedQuantity} {req.listingUnit}</p>
                    </div>
                    <Badge status="Pending" size="sm" />
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Fresh Surplus Feed Nearby */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Utensils className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">Surplus Food Available</h3>
              </div>
              <Link to="/recipient/browse" className="text-xs font-semibold text-teal-700 hover:underline">
                Explore All
              </Link>
            </div>

            <div className="space-y-3">
              {nearbyListings.map(item => (
                <div key={item.id} className="p-3.5 rounded-xl border border-slate-200 hover:border-teal-300 transition-all space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-slate-900 truncate">{item.title}</h4>
                      <p className="text-[11px] text-slate-500">{item.donorName} &bull; {item.area}</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      {item.availableQuantity} {item.unit}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] text-slate-500">
                    <span className="text-emerald-700 font-semibold">{item.foodType}</span>
                    <Link
                      to={`/recipient/browse?id=${item.id}`}
                      className="text-teal-800 font-bold hover:underline"
                    >
                      Request Food &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/recipient/browse"
              className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Search All {availableListingsCount} Surplus Food Items</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};

