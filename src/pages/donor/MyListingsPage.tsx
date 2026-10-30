import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { FoodListing, ListingStatus } from '../../types';
import { Badge } from '../../components/common/Badge';
import { TimelineView } from '../../components/common/TimelineView';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  Clock, 
  MapPin, 
  ShieldAlert, 
  Trash2, 
  Edit3, 
  Eye, 
  AlertCircle,
  Inbox,
  X,
  CheckCircle2,
  Calendar
} from 'lucide-react';

const FILTER_TABS: (ListingStatus | 'All')[] = [
  'All',
  'Available',
  'Partially Reserved',
  'Fully Reserved',
  'Completed',
  'Expired',
  'Removed',
];

export const MyListingsPage: React.FC = () => {
  const { user } = useAuth();
  const { listings, requests, statusHistory, updateListing, removeListing } = useData();

  const [activeTab, setActiveTab] = useState<ListingStatus | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedListing, setSelectedListing] = useState<FoodListing | null>(null);
  const [editingListing, setEditingListing] = useState<FoodListing | null>(null);
  const [listingToRemove, setListingToRemove] = useState<FoodListing | null>(null);
  const [editQuantity, setEditQuantity] = useState<number>(0);
  const [editNotes, setEditNotes] = useState('');

  if (!user) return null;

  const myListings = listings.filter(l => l.donorId === user.id);

  const filteredListings = myListings.filter(l => {
    const matchesTab = activeTab === 'All' ? true : l.status === activeTab;
    const matchesQuery = searchQuery === '' || 
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.foodType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesQuery;
  });

  const getListingRequestsCount = (listingId: string) => {
    return requests.filter(r => r.listingId === listingId).length;
  };

  const handleStartEdit = (listing: FoodListing) => {
    setEditingListing(listing);
    setEditQuantity(listing.totalQuantity);
    setEditNotes(listing.handlingInstructions);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingListing) return;

    updateListing(
      editingListing.id,
      {
        totalQuantity: editQuantity,
        handlingInstructions: editNotes,
      },
      user
    );
    setEditingListing(null);
  };

  const handleConfirmRemove = () => {
    if (!listingToRemove) return;
    removeListing(listingToRemove.id, user, 'Removed by donor via listing manager');
    setListingToRemove(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Food Listings</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track surplus inventory, reserved allocations, and active pickups.
          </p>
        </div>

        <Link
          to="/donor/create-listing"
          className="flex items-center gap-2 bg-brand-800 hover:bg-brand-900 text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4 text-brand-300" />
          <span>New Surplus Listing</span>
        </Link>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {FILTER_TABS.map(tab => {
            const count = tab === 'All' 
              ? myListings.length 
              : myListings.filter(l => l.status === tab).length;
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-brand-800 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{tab}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by food name, category, or dietary type..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-700 bg-white"
          />
        </div>
      </div>

      {/* Listings Grid */}
      {filteredListings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-3">
          <Inbox className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No food listings found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {activeTab === 'All'
              ? "You haven't listed any surplus food yet."
              : `No listings currently match status "${activeTab}".`}
          </p>
          <Link
            to="/donor/create-listing"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-800 hover:underline pt-1"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create a new listing</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredListings.map(listing => {
            const reqCount = getListingRequestsCount(listing.id);
            const total = listing.totalQuantity;
            const reserved = listing.reservedQuantity;
            const collected = listing.collectedQuantity;
            const available = listing.availableQuantity;

            // Percentage widths for the stacked bar
            const collectedPct = (collected / total) * 100;
            const reservedPct = (reserved / total) * 100;
            const availablePct = (available / total) * 100;

            const isEligibleForEdit = listing.status !== 'Completed' && listing.status !== 'Removed';
            const isEligibleForRemove = listing.status !== 'Completed' && listing.status !== 'Removed' && listing.collectedQuantity === 0;

            return (
              <div
                key={listing.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Image & Status Header */}
                  <div className="relative h-40 bg-slate-100 overflow-hidden">
                    {listing.imageUrl ? (
                      <img
                        src={listing.imageUrl}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl bg-emerald-50 text-emerald-800">
                        🍲
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <Badge status={listing.status} size="sm" />
                    </div>
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded-md">
                      {listing.category}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{listing.title}</h3>
                      <p className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="font-medium text-emerald-700">{listing.foodType}</span>
                        <span>&bull;</span>
                        <span>Prep: {new Date(listing.preparationTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </p>
                    </div>

                    {/* Quantity Distribution Visual Bar */}
                    <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-700">{available} {listing.unit} Available</span>
                        <span className="text-slate-400 font-normal">Total: {total} {listing.unit}</span>
                      </div>

                      {/* Stacked Bar */}
                      <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden flex">
                        <div style={{ width: `${collectedPct}%` }} className="bg-blue-600" title={`Collected: ${collected}`} />
                        <div style={{ width: `${reservedPct}%` }} className="bg-amber-400" title={`Reserved: ${reserved}`} />
                        <div style={{ width: `${availablePct}%` }} className="bg-emerald-500" title={`Available: ${available}`} />
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                          <span>Avail ({available})</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                          <span>Reserved ({reserved})</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
                          <span>Collected ({collected})</span>
                        </span>
                      </div>
                    </div>

                    {/* Pickup Details & Expiry */}
                    <div className="space-y-1 text-[11px] text-slate-600 pt-1">
                      <p className="flex items-center gap-1.5 truncate">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Pickup: {new Date(listing.pickupStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(listing.pickupEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </p>
                      <p className="flex items-center gap-1.5 truncate">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{listing.useByType}: {new Date(listing.useByDateTime).toLocaleDateString([], { month: 'short', day: 'numeric' })} at {new Date(listing.useByDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedListing(listing)}
                    className="flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-brand-800 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Details & Audit</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {isEligibleForEdit && (
                      <button
                        onClick={() => handleStartEdit(listing)}
                        title="Edit quantity & notes"
                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {isEligibleForRemove && (
                      <button
                        onClick={() => setListingToRemove(listing)}
                        title="Remove listing"
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Detailed Listing & Status History Modal */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">{selectedListing.title}</h3>
                  <Badge status={selectedListing.status} size="sm" />
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  ID: {selectedListing.id} &bull; Listed by {selectedListing.donorName}
                </p>
              </div>
              <button
                onClick={() => setSelectedListing(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold">Category</span>
                <p className="font-semibold text-slate-800">{selectedListing.category}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold">Food Type</span>
                <p className="font-semibold text-slate-800">{selectedListing.foodType}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold">Storage</span>
                <p className="font-semibold text-slate-800">{selectedListing.storageConditions}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold">Allergens</span>
                <p className="font-semibold text-slate-800">{selectedListing.allergens.join(', ')}</p>
              </div>
            </div>

            {/* Logistics & Handling */}
            <div className="space-y-2 text-xs text-slate-700">
              <p>
                <strong>Pickup Location:</strong> {selectedListing.pickupAddress}, {selectedListing.area}, {selectedListing.city}
              </p>
              <p>
                <strong>Handling Instructions:</strong> {selectedListing.handlingInstructions}
              </p>
              <p>
                <strong>Pickup Time Window:</strong> {new Date(selectedListing.pickupStart).toLocaleString()} to {new Date(selectedListing.pickupEnd).toLocaleString()}
              </p>
              <p>
                <strong>Safety Acknowledgement:</strong> {selectedListing.safetyAcknowledged ? 'Verified on submission' : 'Unconfirmed'}
              </p>
            </div>

            {/* Status History & Audit Timeline */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-brand-700" />
                <span>Status Timeline & Lifecycle Events</span>
              </h4>

              <TimelineView
                items={statusHistory.filter(h => h.entityId === selectedListing.id)}
                emptyMessage="No lifecycle updates recorded yet."
              />
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedListing(null)}
                className="px-5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-900 text-white rounded-xl"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Listing Modal */}
      {editingListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-base text-slate-900 pb-2 border-b border-slate-100">
              Edit Listing: {editingListing.title}
            </h3>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Total Quantity ({editingListing.unit})
                </label>
                <input
                  type="number"
                  min={editingListing.reservedQuantity + editingListing.collectedQuantity}
                  required
                  value={editQuantity}
                  onChange={e => setEditQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-700 bg-white"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Cannot be lower than already reserved ({editingListing.reservedQuantity}) + collected ({editingListing.collectedQuantity}) portions.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Handling Instructions
                </label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={e => setEditNotes(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-700 resize-none bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingListing(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-brand-800 hover:bg-brand-900 text-white rounded-xl shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Remove Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(listingToRemove)}
        title="Remove Food Listing?"
        message={`Are you sure you want to remove "${listingToRemove?.title}"? Any pending requests for this food will be cancelled automatically.`}
        confirmLabel="Remove Listing"
        confirmVariant="danger"
        onConfirm={handleConfirmRemove}
        onCancel={() => setListingToRemove(null)}
      />

    </div>
  );
};

