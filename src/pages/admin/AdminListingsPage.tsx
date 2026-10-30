import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { FoodListing, ListingStatus } from '../../types';
import { Badge } from '../../components/common/Badge';
import { TimelineView } from '../../components/common/TimelineView';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { 
  ListFilter, 
  Search, 
  Trash2, 
  Eye, 
  AlertTriangle, 
  X, 
  Building2, 
  Clock 
} from 'lucide-react';

export const AdminListingsPage: React.FC = () => {
  const { user } = useAuth();
  const { listings, statusHistory, removeListing } = useData();

  const [activeTab, setActiveTab] = useState<ListingStatus | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedListing, setSelectedListing] = useState<FoodListing | null>(null);
  const [listingToRemove, setListingToRemove] = useState<FoodListing | null>(null);

  const filteredListings = listings.filter(l => {
    const matchesTab = activeTab === 'All' || l.status === activeTab;
    const matchesSearch = searchQuery === '' ||
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.area.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleConfirmRemove = () => {
    if (!listingToRemove || !user) return;
    removeListing(listingToRemove.id, user, 'Removed by platform administrator due to policy enforcement');
    setListingToRemove(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Food Listings Management</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Global monitoring of all surplus food published on ShareBite.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {(['All', 'Available', 'Partially Reserved', 'Fully Reserved', 'Completed', 'Expired', 'Removed'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                activeTab === tab
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
            placeholder="Search by title, donor restaurant, or area..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-700 bg-white"
          />
        </div>
      </div>

      {/* Listings Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold text-[10px]">
              <tr>
                <th className="px-4 py-3.5">Listing Title</th>
                <th className="px-4 py-3.5">Donor Restaurant</th>
                <th className="px-4 py-3.5">Category & Type</th>
                <th className="px-4 py-3.5">Quantities (Avail/Tot)</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Pickup Window</th>
                <th className="px-4 py-3.5 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredListings.map(listing => (
                <tr key={listing.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3.5">
                    <span className="font-bold text-slate-900 line-clamp-1">{listing.title}</span>
                    <span className="text-[10px] text-slate-400">{listing.id}</span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-700 font-medium">
                    {listing.donorName}
                    <span className="block text-[10px] text-slate-400">{listing.area}</span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">
                    {listing.category} &bull; {listing.foodType}
                  </td>
                  <td className="px-4 py-3.5 font-bold text-slate-800">
                    {listing.availableQuantity} / {listing.totalQuantity} {listing.unit}
                    {listing.reservedQuantity > 0 && (
                      <span className="block text-[10px] text-amber-600 font-medium">{listing.reservedQuantity} reserved</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge status={listing.status} size="sm" />
                  </td>
                  <td className="px-4 py-3.5 text-slate-500 text-[11px]">
                    {new Date(listing.pickupEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-4 py-3.5 text-right space-x-2">
                    <button
                      onClick={() => setSelectedListing(listing)}
                      className="text-purple-700 hover:text-purple-900 font-bold hover:underline"
                    >
                      Inspect
                    </button>
                    {listing.status !== 'Removed' && listing.status !== 'Completed' && (
                      <button
                        onClick={() => setListingToRemove(listing)}
                        className="text-rose-600 hover:text-rose-800 font-semibold hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Modal */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-slate-900">{selectedListing.title}</h3>
                <Badge status={selectedListing.status} size="sm" />
              </div>
              <button onClick={() => setSelectedListing(null)} className="text-slate-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 text-slate-700">
              <p><strong>Donor:</strong> {selectedListing.donorName} ({selectedListing.donorPhone})</p>
              <p><strong>Category & Dietary:</strong> {selectedListing.category} &bull; {selectedListing.foodType}</p>
              <p><strong>Quantity:</strong> Total {selectedListing.totalQuantity} {selectedListing.unit} (Available: {selectedListing.availableQuantity}, Reserved: {selectedListing.reservedQuantity}, Collected: {selectedListing.collectedQuantity})</p>
              <p><strong>Storage & Handling:</strong> {selectedListing.storageConditions} &bull; {selectedListing.handlingInstructions}</p>
              <p><strong>Allergens:</strong> {selectedListing.allergens.join(', ')}</p>
              <p><strong>Location:</strong> {selectedListing.pickupAddress}, {selectedListing.area}, {selectedListing.city}</p>
              <p><strong>Pickup Time Window:</strong> {new Date(selectedListing.pickupStart).toLocaleString()} - {new Date(selectedListing.pickupEnd).toLocaleString()}</p>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-wider mb-2">Audit Timeline</h4>
              <TimelineView
                items={statusHistory.filter(h => h.entityId === selectedListing.id)}
                emptyMessage="No updates logged for this listing."
              />
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedListing(null)}
                className="px-4 py-2 text-xs font-semibold bg-slate-800 text-white rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Confirmation */}
      <ConfirmationModal
        isOpen={Boolean(listingToRemove)}
        title="Admin Remove Listing?"
        message={`Remove "${listingToRemove?.title}" from public platform discovery? This will notify the donor and release any active reservations.`}
        confirmLabel="Enforce Removal"
        confirmVariant="danger"
        onConfirm={handleConfirmRemove}
        onCancel={() => setListingToRemove(null)}
      />

    </div>
  );
};
