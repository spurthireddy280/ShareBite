import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { FoodListing, FoodCategory, FoodType } from '../../types';
import { Badge } from '../../components/common/Badge';
import { FoodSafetyNotice } from '../../components/common/FoodSafetyNotice';
import { ReportModal } from '../../components/common/ReportModal';
import { 
  Search, 
  Filter, 
  Clock, 
  MapPin, 
  Building2, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  X, 
  Check, 
  Calendar, 
  ArrowUpDown,
  Utensils,
  Info
} from 'lucide-react';

const CATEGORIES: ('All' | FoodCategory)[] = [
  'All',
  'Cooked Meals',
  'Bakery & Bread',
  'Fruits & Vegetables',
  'Packaged Food',
  'Dairy & Beverages',
  'Desserts & Sweets',
];

const FOOD_TYPES: ('All' | FoodType)[] = [
  'All',
  'Vegetarian',
  'Vegan',
  'Non-vegetarian',
];

const AREAS = ['All', 'Indiranagar', 'Koramangala', 'MG Road', 'Whitefield', 'Jayanagar'];

export const BrowseFoodPage: React.FC = () => {
  const { user } = useAuth();
  const { listings, createRequest } = useData();
  const [searchParams] = useSearchParams();

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState<'All' | FoodCategory>('All');
  const [selectedFoodType, setSelectedFoodType] = useState<'All' | FoodType>('All');
  const [selectedArea, setSelectedArea] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'pickupDeadline' | 'quantity'>('newest');

  // Request Modal State
  const [requestingListing, setRequestingListing] = useState<FoodListing | null>(null);
  const [requestedQty, setRequestedQty] = useState<number>(5);
  const [expectedPickupTime, setExpectedPickupTime] = useState('');
  const [requestMessage, setRequestMessage] = useState('');
  const [requestError, setRequestError] = useState('');
  const [submittingRequest, setSubmittingRequest] = useState(false);

  // Report Modal State
  const [reportListing, setReportListing] = useState<FoodListing | null>(null);

  // If URL has ?id=xxx, open that listing modal automatically
  useEffect(() => {
    const listingId = searchParams.get('id');
    if (listingId) {
      const match = listings.find(l => l.id === listingId);
      if (match) openRequestModal(match);
    }
  }, [searchParams, listings]);

  // Filter listings
  const filteredListings = listings.filter(l => {
    // Only show listings that have food available or partially reserved
    if (l.status === 'Completed' || l.status === 'Removed' || l.status === 'Expired') {
      return false;
    }

    const matchesCategory = selectedCategory === 'All' || l.category === selectedCategory;
    const matchesFoodType = selectedFoodType === 'All' || l.foodType === selectedFoodType;
    const matchesArea = selectedArea === 'All' || l.area.toLowerCase().includes(selectedArea.toLowerCase());

    const matchesSearch = searchQuery === '' ||
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.area.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesFoodType && matchesArea && matchesSearch;
  });

  // Sort listings
  filteredListings.sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === 'pickupDeadline') {
      return new Date(a.pickupEnd).getTime() - new Date(b.pickupEnd).getTime();
    }
    if (sortBy === 'quantity') {
      return b.availableQuantity - a.availableQuantity;
    }
    return 0;
  });

  const openRequestModal = (listing: FoodListing) => {
    setRequestingListing(listing);
    // Default to minimum between 10 or all available
    setRequestedQty(Math.min(listing.availableQuantity, 10));
    setExpectedPickupTime(listing.pickupStart ? new Date(listing.pickupStart).toISOString().slice(0, 16) : '');
    setRequestMessage('We are an accredited community shelter and can distribute these meals today.');
    setRequestError('');
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestingListing || !user) return;
    setRequestError('');

    if (requestedQty <= 0) {
      setRequestError('Quantity must be greater than zero.');
      return;
    }

    if (requestedQty > requestingListing.availableQuantity) {
      setRequestError(`Quantity cannot exceed available amount (${requestingListing.availableQuantity} ${requestingListing.unit}).`);
      return;
    }

    setSubmittingRequest(true);
    try {
      createRequest(
        requestingListing.id,
        requestedQty,
        new Date(expectedPickupTime || requestingListing.pickupStart).toISOString(),
        requestMessage.trim(),
        user
      );
      setRequestingListing(null);
    } catch (err: any) {
      setRequestError(err.message || 'Could not submit request');
    } finally {
      setSubmittingRequest(false);
    }
  };

  // Check matching score
  const isSmartMatch = (listing: FoodListing) => {
    if (!user) return false;
    const areaMatch = user.area && listing.area.toLowerCase().includes(user.area.toLowerCase());
    return areaMatch;
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Browse Available Surplus Food</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Discover edible surplus food listed by restaurants, bakeries, hotels, and community kitchens.
          </p>
        </div>
      </div>

      <FoodSafetyNotice compact />

      {/* Search & Filter Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        
        {/* Search Row */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by food name, donor restaurant, or description..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-700 bg-white"
            />
          </div>

          {/* Area Filter */}
          <div className="w-full md:w-48">
            <select
              value={selectedArea}
              onChange={e => setSelectedArea(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-700 bg-white"
            >
              <option value="All">All Localities</option>
              {AREAS.filter(a => a !== 'All').map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="w-full md:w-52">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-700 bg-white"
            >
              <option value="newest">Sort: Recently Listed</option>
              <option value="pickupDeadline">Sort: Pickup Deadline (Soonest)</option>
              <option value="quantity">Sort: Available Quantity (High to Low)</option>
            </select>
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider shrink-0 mr-1">Category:</span>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-teal-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dietary Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider shrink-0 mr-1">Dietary:</span>
          {FOOD_TYPES.map(type => (
            <button
              key={type}
              onClick={() => setSelectedFoodType(type)}
              className={`px-3 py-1 rounded-xl font-semibold whitespace-nowrap transition-all ${
                selectedFoodType === type
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

      </div>

      {/* Listings Grid */}
      {filteredListings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-3">
          <Utensils className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No matching surplus food listings found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search criteria, category filters, or service locality.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedFoodType('All');
              setSelectedArea('All');
            }}
            className="text-xs font-bold text-teal-800 underline hover:text-teal-900"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredListings.map(listing => {
            const hasMatch = isSmartMatch(listing);

            return (
              <div
                key={listing.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Card Image Header */}
                  <div className="relative h-44 bg-slate-100 overflow-hidden">
                    {listing.imageUrl ? (
                      <img
                        src={listing.imageUrl}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl bg-teal-50 text-teal-800">
                        🍲
                      </div>
                    )}
                    
                    <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                      <Badge status={listing.status} size="sm" />
                      <Badge status={listing.foodType} size="sm" />
                    </div>

                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded-md">
                      {listing.category}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-3">
                    {/* Smart Match Banner */}
                    {hasMatch && (
                      <div className="p-1.5 px-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-900 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Matches your service area ({user?.area})</span>
                      </div>
                    )}

                    <div>
                      <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{listing.title}</h3>
                      <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-semibold text-slate-800 truncate">{listing.donorName}</span>
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {listing.description}
                    </p>

                    {/* Quantity Available Card */}
                    <div className="flex items-center justify-between p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-200/80">
                      <div>
                        <span className="text-[10px] text-emerald-700 uppercase font-bold">Available Now</span>
                        <div className="text-base font-extrabold text-emerald-900">
                          {listing.availableQuantity} <span className="text-xs font-semibold">{listing.unit}</span>
                        </div>
                      </div>
                      <div className="text-right text-[11px] text-slate-500">
                        Total batch: {listing.totalQuantity} {listing.unit}
                      </div>
                    </div>

                    {/* Meta Specifications */}
                    <div className="space-y-1 text-[11px] text-slate-600">
                      <p className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{listing.area}, {listing.city}</span>
                      </p>
                      <p className="flex items-center gap-1.5 truncate">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Pickup: {new Date(listing.pickupStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} to {new Date(listing.pickupEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </p>
                      <p className="flex items-center gap-1.5 truncate">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{listing.useByType}: {new Date(listing.useByDateTime).toLocaleDateString([], { month: 'short', day: 'numeric' })} at {new Date(listing.useByDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </p>
                    </div>

                    {/* Allergens Badge */}
                    <div className="pt-1 flex items-center gap-1 text-[11px] text-slate-500 overflow-hidden">
                      <span className="font-semibold text-slate-700">Allergens:</span>
                      <span className="truncate">{listing.allergens.join(', ')}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Request CTA */}
                <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setReportListing(listing)}
                    title="Report suspicious or inaccurate listing"
                    className="p-1.5 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-slate-200/50 transition-colors"
                  >
                    <AlertTriangle className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => openRequestModal(listing)}
                    disabled={listing.availableQuantity <= 0}
                    className="flex-1 py-2 bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    <Utensils className="w-3.5 h-3.5 text-brand-leaf" />
                    <span>Request Food ({listing.availableQuantity} {listing.unit})</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Request Food Modal */}
      {requestingListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Request Surplus Food</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  From {requestingListing.donorName}
                </p>
              </div>
              <button
                onClick={() => setRequestingListing(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Listing Summary */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <p className="font-bold text-slate-900">{requestingListing.title}</p>
              <p className="text-slate-600">
                <strong>Available to allocate:</strong> {requestingListing.availableQuantity} {requestingListing.unit}
              </p>
              <p className="text-slate-600">
                <strong>Pickup window:</strong> {new Date(requestingListing.pickupStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(requestingListing.pickupEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-slate-600">
                <strong>Address:</strong> {requestingListing.pickupAddress}, {requestingListing.area}
              </p>
            </div>

            {requestError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                {requestError}
              </div>
            )}

            <form onSubmit={handleSubmitRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Requested Quantity ({requestingListing.unit}) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  max={requestingListing.availableQuantity}
                  required
                  value={requestedQty}
                  onChange={e => setRequestedQty(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-700 bg-white"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Max available: {requestingListing.availableQuantity} {requestingListing.unit}. Please request only what your shelter can distribute safely.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Expected Arrival / Pickup Time <span className="text-rose-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  required
                  value={expectedPickupTime}
                  onChange={e => setExpectedPickupTime(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-700 bg-white"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Must be within donor's window: {new Date(requestingListing.pickupStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} to {new Date(requestingListing.pickupEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Message / Distribution Purpose to Donor
                </label>
                <textarea
                  rows={3}
                  value={requestMessage}
                  onChange={e => setRequestMessage(e.target.value)}
                  placeholder="e.g., We will pick up with thermal containers to serve 30 children in our shelter..."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-700 resize-none bg-white"
                />
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-[11px] text-amber-950 leading-relaxed">
                Submitting this request alerts {requestingListing.donorName}. Once accepted, the food will be locked and reserved exclusively for your pickup.
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRequestingListing(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingRequest || requestedQty <= 0 || requestedQty > requestingListing.availableQuantity}
                  className="px-5 py-2.5 text-xs font-bold bg-teal-800 hover:bg-teal-900 text-white rounded-xl shadow-xs transition-colors disabled:opacity-50"
                >
                  {submittingRequest ? 'Submitting...' : 'Send Donation Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {reportListing && (
        <ReportModal
          isOpen={Boolean(reportListing)}
          onClose={() => setReportListing(null)}
          listingId={reportListing.id}
          listingTitle={reportListing.title}
          reportedUserId={reportListing.donorId}
          reportedUserName={reportListing.donorName}
        />
      )}

    </div>
  );
};
