import { storageService } from './storageService';
import { FoodListing, ListingStatus, User } from '../types';

export const listingService = {
  getAllListings(): FoodListing[] {
    const listings = storageService.getListings();
    const now = new Date();

    // Check expiration automatically
    let updated = false;
    const checked = listings.map(l => {
      if (l.status !== 'Completed' && l.status !== 'Removed' && l.status !== 'Expired') {
        const useBy = new Date(l.useByDateTime);
        const pickupEnd = new Date(l.pickupEnd);
        if (now > useBy || now > pickupEnd) {
          updated = true;
          return { ...l, status: 'Expired' as ListingStatus };
        }
      }
      return l;
    });

    if (updated) {
      storageService.saveListings(checked);
    }
    return checked;
  },

  getListingById(id: string): FoodListing | undefined {
    return this.getAllListings().find(l => l.id === id);
  },

  getListingsByDonor(donorId: string): FoodListing[] {
    return this.getAllListings().filter(l => l.donorId === donorId);
  },

  createListing(data: Omit<FoodListing, 'id' | 'reservedQuantity' | 'collectedQuantity' | 'availableQuantity' | 'status' | 'createdAt' | 'updatedAt'>, actor: User): FoodListing {
    const total = Number(data.totalQuantity);
    const newListing: FoodListing = {
      ...data,
      id: 'listing_' + Date.now(),
      totalQuantity: total,
      reservedQuantity: 0,
      collectedQuantity: 0,
      availableQuantity: total,
      status: 'Available',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const listings = storageService.getListings();
    storageService.saveListings([newListing, ...listings]);

    // Add status history
    storageService.addStatusHistory({
      entityType: 'listing',
      entityId: newListing.id,
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      newStatus: 'Available',
      description: `Listed "${newListing.title}" with ${newListing.totalQuantity} ${newListing.unit}.`,
    });

    return newListing;
  },

  updateListing(id: string, updates: Partial<FoodListing>, actor: User): FoodListing {
    const listings = storageService.getListings();
    const index = listings.findIndex(l => l.id === id);
    if (index === -1) throw new Error('Listing not found');

    const current = listings[index];
    
    // Prevent edits to collected / completed listings
    if (current.status === 'Completed') {
      throw new Error('Completed donations cannot be modified.');
    }

    const updatedTotal = updates.totalQuantity !== undefined ? Number(updates.totalQuantity) : current.totalQuantity;
    const reserved = current.reservedQuantity;
    const collected = current.collectedQuantity;

    if (updatedTotal < reserved + collected) {
      throw new Error(`Total quantity cannot be less than already reserved + collected quantity (${reserved + collected}).`);
    }

    const newAvailable = updatedTotal - reserved - collected;
    let newStatus = current.status;
    if (newAvailable === 0 && reserved > 0) newStatus = 'Fully Reserved';
    else if (reserved > 0 && newAvailable > 0) newStatus = 'Partially Reserved';
    else if (newAvailable > 0 && reserved === 0) newStatus = 'Available';

    const updatedListing: FoodListing = {
      ...current,
      ...updates,
      totalQuantity: updatedTotal,
      availableQuantity: newAvailable,
      status: updates.status || newStatus,
      updatedAt: new Date().toISOString(),
    };

    listings[index] = updatedListing;
    storageService.saveListings(listings);

    storageService.addStatusHistory({
      entityType: 'listing',
      entityId: id,
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      previousStatus: current.status,
      newStatus: updatedListing.status,
      description: `Updated listing details. Total: ${updatedListing.totalQuantity} ${updatedListing.unit}, Available: ${updatedListing.availableQuantity}.`,
    });

    return updatedListing;
  },

  removeListing(id: string, actor: User, reason: string = 'Donor cancelled listing'): boolean {
    const listings = storageService.getListings();
    const index = listings.findIndex(l => l.id === id);
    if (index === -1) return false;

    const listing = listings[index];
    if (listing.collectedQuantity > 0) {
      throw new Error('Cannot remove a listing that has completed pickups.');
    }

    // Cancel any pending or accepted requests and log
    const requests = storageService.getRequests();
    const updatedRequests = requests.map(r => {
      if (r.listingId === id && (r.status === 'Pending' || r.status === 'Accepted')) {
        return {
          ...r,
          status: 'Cancelled' as const,
          updatedAt: new Date().toISOString(),
        };
      }
      return r;
    });
    storageService.saveRequests(updatedRequests);

    listings[index] = {
      ...listing,
      status: 'Removed',
      reservedQuantity: 0,
      availableQuantity: 0,
      updatedAt: new Date().toISOString(),
    };
    storageService.saveListings(listings);

    storageService.addStatusHistory({
      entityType: 'listing',
      entityId: id,
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      previousStatus: listing.status,
      newStatus: 'Removed',
      description: `Listing removed. Reason: ${reason}`,
    });

    return true;
  }
};

