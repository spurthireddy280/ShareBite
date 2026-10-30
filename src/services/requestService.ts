import { storageService } from './storageService';
import { listingService } from './listingService';
import { DonationRequest, FoodListing, User } from '../types';

export const requestService = {
  getAllRequests(): DonationRequest[] {
    return storageService.getRequests();
  },

  getRequestsByRecipient(recipientId: string): DonationRequest[] {
    return this.getAllRequests().filter(r => r.recipientId === recipientId);
  },

  getRequestsByDonor(donorId: string): DonationRequest[] {
    return this.getAllRequests().filter(r => r.donorId === donorId);
  },

  getRequestsByListing(listingId: string): DonationRequest[] {
    return this.getAllRequests().filter(r => r.listingId === listingId);
  },

  createRequest(
    listingId: string, 
    requestedQuantity: number, 
    expectedPickupTime: string, 
    message: string, 
    recipient: User
  ): DonationRequest {
    const listing = listingService.getListingById(listingId);
    if (!listing) throw new Error('Listing not found');

    if (listing.status === 'Completed' || listing.status === 'Expired' || listing.status === 'Removed') {
      throw new Error(`This listing is currently ${listing.status.toLowerCase()} and cannot be requested.`);
    }

    if (requestedQuantity <= 0) {
      throw new Error('Requested quantity must be greater than zero.');
    }

    if (requestedQuantity > listing.availableQuantity) {
      throw new Error(`Requested quantity (${requestedQuantity}) exceeds currently available quantity (${listing.availableQuantity} ${listing.unit}).`);
    }

    const newRequest: DonationRequest = {
      id: 'req_' + Date.now(),
      listingId: listing.id,
      listingTitle: listing.title,
      listingUnit: listing.unit,
      donorId: listing.donorId,
      donorName: listing.donorName,
      recipientId: recipient.id,
      recipientName: recipient.name,
      recipientPhone: recipient.phone,
      recipientArea: recipient.area,
      requestedQuantity,
      message,
      expectedPickupTime,
      pickupLocation: listing.pickupAddress,
      status: 'Pending',
      donorPickupConfirmed: false,
      recipientPickupConfirmed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const requests = storageService.getRequests();
    storageService.saveRequests([newRequest, ...requests]);

    storageService.addStatusHistory({
      entityType: 'request',
      entityId: newRequest.id,
      actorId: recipient.id,
      actorName: recipient.name,
      actorRole: recipient.role,
      newStatus: 'Pending',
      description: `Requested ${requestedQuantity} ${listing.unit} for pickup at ${new Date(expectedPickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
    });

    return newRequest;
  },

  acceptRequest(requestId: string, donor: User): DonationRequest {
    const requests = storageService.getRequests();
    const reqIndex = requests.findIndex(r => r.id === requestId);
    if (reqIndex === -1) throw new Error('Request not found');

    const req = requests[reqIndex];
    if (req.status !== 'Pending') {
      throw new Error(`Request is already ${req.status}.`);
    }

    const listings = storageService.getListings();
    const listIndex = listings.findIndex(l => l.id === req.listingId);
    if (listIndex === -1) throw new Error('Associated listing not found');

    const listing = listings[listIndex];
    if (listing.availableQuantity < req.requestedQuantity) {
      throw new Error(`Insufficient available quantity! Available: ${listing.availableQuantity} ${listing.unit}, Requested: ${req.requestedQuantity} ${listing.unit}.`);
    }

    // Reserve quantity
    const newReserved = listing.reservedQuantity + req.requestedQuantity;
    const newAvailable = listing.totalQuantity - newReserved - listing.collectedQuantity;
    let newListingStatus = listing.status;

    if (newAvailable === 0) {
      newListingStatus = 'Fully Reserved';
    } else {
      newListingStatus = 'Partially Reserved';
    }

    listings[listIndex] = {
      ...listing,
      reservedQuantity: newReserved,
      availableQuantity: newAvailable,
      status: newListingStatus,
      updatedAt: new Date().toISOString(),
    };
    storageService.saveListings(listings);

    const updatedReq: DonationRequest = {
      ...req,
      status: 'Accepted',
      updatedAt: new Date().toISOString(),
    };
    requests[reqIndex] = updatedReq;
    storageService.saveRequests(requests);

    storageService.addStatusHistory({
      entityType: 'request',
      entityId: req.id,
      actorId: donor.id,
      actorName: donor.name,
      actorRole: donor.role,
      previousStatus: 'Pending',
      newStatus: 'Accepted',
      description: `Request accepted. Reserved ${req.requestedQuantity} ${listing.unit}. Remaining available: ${newAvailable} ${listing.unit}.`,
    });

    storageService.addStatusHistory({
      entityType: 'listing',
      entityId: listing.id,
      actorId: donor.id,
      actorName: donor.name,
      actorRole: donor.role,
      previousStatus: listing.status,
      newStatus: newListingStatus,
      description: `Allocation updated: ${req.requestedQuantity} ${listing.unit} reserved for ${req.recipientName}.`,
    });

    return updatedReq;
  },

  rejectRequest(requestId: string, donor: User, reason: string = 'Capacity full or logistics mismatch'): DonationRequest {
    const requests = storageService.getRequests();
    const reqIndex = requests.findIndex(r => r.id === requestId);
    if (reqIndex === -1) throw new Error('Request not found');

    const req = requests[reqIndex];
    if (req.status !== 'Pending') {
      throw new Error(`Request is already ${req.status}.`);
    }

    const updatedReq: DonationRequest = {
      ...req,
      status: 'Rejected',
      updatedAt: new Date().toISOString(),
    };
    requests[reqIndex] = updatedReq;
    storageService.saveRequests(requests);

    storageService.addStatusHistory({
      entityType: 'request',
      entityId: req.id,
      actorId: donor.id,
      actorName: donor.name,
      actorRole: donor.role,
      previousStatus: 'Pending',
      newStatus: 'Rejected',
      description: `Donor declined request. Note: ${reason}`,
    });

    return updatedReq;
  },

  cancelRequest(requestId: string, actor: User, reason: string = 'Cancelled by user'): DonationRequest {
    const requests = storageService.getRequests();
    const reqIndex = requests.findIndex(r => r.id === requestId);
    if (reqIndex === -1) throw new Error('Request not found');

    const req = requests[reqIndex];

    if (req.status === 'Completed') {
      throw new Error('Completed donations cannot be cancelled.');
    }

    if (req.donorPickupConfirmed || req.recipientPickupConfirmed) {
      throw new Error('Pickup has already been confirmed by one party. Cancellation requires admin support.');
    }

    // If request was accepted, release reserved quantity
    if (req.status === 'Accepted') {
      const listings = storageService.getListings();
      const listIndex = listings.findIndex(l => l.id === req.listingId);
      if (listIndex !== -1) {
        const listing = listings[listIndex];
        const newReserved = Math.max(0, listing.reservedQuantity - req.requestedQuantity);
        const newAvailable = listing.totalQuantity - newReserved - listing.collectedQuantity;
        let newListingStatus = listing.status;

        if (newAvailable > 0 && newReserved === 0 && listing.collectedQuantity === 0) {
          newListingStatus = 'Available';
        } else if (newReserved > 0 && newAvailable > 0) {
          newListingStatus = 'Partially Reserved';
        } else if (newReserved === 0 && listing.collectedQuantity > 0 && newAvailable > 0) {
          newListingStatus = 'Available';
        }

        listings[listIndex] = {
          ...listing,
          reservedQuantity: newReserved,
          availableQuantity: newAvailable,
          status: newListingStatus,
          updatedAt: new Date().toISOString(),
        };
        storageService.saveListings(listings);

        storageService.addStatusHistory({
          entityType: 'listing',
          entityId: listing.id,
          actorId: actor.id,
          actorName: actor.name,
          actorRole: actor.role,
          previousStatus: listing.status,
          newStatus: newListingStatus,
          description: `Released ${req.requestedQuantity} ${listing.unit} back to listing due to request cancellation.`,
        });
      }
    }

    const updatedReq: DonationRequest = {
      ...req,
      status: 'Cancelled',
      updatedAt: new Date().toISOString(),
    };
    requests[reqIndex] = updatedReq;
    storageService.saveRequests(requests);

    storageService.addStatusHistory({
      entityType: 'request',
      entityId: req.id,
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      previousStatus: req.status,
      newStatus: 'Cancelled',
      description: `Request cancelled by ${actor.name}. Reason: ${reason}`,
    });

    return updatedReq;
  },

  confirmPickupHandover(requestId: string, donor: User): DonationRequest {
    const requests = storageService.getRequests();
    const reqIndex = requests.findIndex(r => r.id === requestId);
    if (reqIndex === -1) throw new Error('Request not found');

    const req = requests[reqIndex];
    if (req.status !== 'Accepted') {
      throw new Error(`Only accepted requests can have pickup confirmed (currently ${req.status}).`);
    }

    if (req.donorPickupConfirmed) {
      return req; // already confirmed, avoid double-click
    }

    const now = new Date().toISOString();
    const donorConfirmedReq: DonationRequest = {
      ...req,
      donorPickupConfirmed: true,
      donorConfirmedAt: now,
      updatedAt: now,
    };

    requests[reqIndex] = donorConfirmedReq;
    storageService.saveRequests(requests);

    storageService.addStatusHistory({
      entityType: 'request',
      entityId: req.id,
      actorId: donor.id,
      actorName: donor.name,
      actorRole: 'donor',
      newStatus: 'Handover Confirmed',
      description: `Donor (${donor.name}) confirmed food was handed over. Awaiting recipient collection confirmation.`,
    });

    // Check if both confirmed
    return this.checkTwoSidedCompletion(donorConfirmedReq);
  },

  confirmPickupCollection(requestId: string, recipient: User): DonationRequest {
    const requests = storageService.getRequests();
    const reqIndex = requests.findIndex(r => r.id === requestId);
    if (reqIndex === -1) throw new Error('Request not found');

    const req = requests[reqIndex];
    if (req.status !== 'Accepted') {
      throw new Error(`Only accepted requests can have pickup confirmed (currently ${req.status}).`);
    }

    if (req.recipientPickupConfirmed) {
      return req; // already confirmed
    }

    const now = new Date().toISOString();
    const recipientConfirmedReq: DonationRequest = {
      ...req,
      recipientPickupConfirmed: true,
      recipientConfirmedAt: now,
      updatedAt: now,
    };

    requests[reqIndex] = recipientConfirmedReq;
    storageService.saveRequests(requests);

    storageService.addStatusHistory({
      entityType: 'request',
      entityId: req.id,
      actorId: recipient.id,
      actorName: recipient.name,
      actorRole: 'recipient',
      newStatus: 'Collection Confirmed',
      description: `Recipient (${recipient.name}) confirmed food was safely collected and inspected.`,
    });

    // Check if both confirmed
    return this.checkTwoSidedCompletion(recipientConfirmedReq);
  },

  checkTwoSidedCompletion(req: DonationRequest): DonationRequest {
    if (req.donorPickupConfirmed && req.recipientPickupConfirmed && req.status !== 'Completed') {
      const requests = storageService.getRequests();
      const reqIndex = requests.findIndex(r => r.id === req.id);
      
      const completedReq: DonationRequest = {
        ...req,
        status: 'Completed',
        updatedAt: new Date().toISOString(),
      };
      if (reqIndex !== -1) {
        requests[reqIndex] = completedReq;
        storageService.saveRequests(requests);
      }

      // Update Listing: move from reserved to collected
      const listings = storageService.getListings();
      const listIndex = listings.findIndex(l => l.id === req.listingId);
      if (listIndex !== -1) {
        const listing = listings[listIndex];
        const newReserved = Math.max(0, listing.reservedQuantity - req.requestedQuantity);
        const newCollected = listing.collectedQuantity + req.requestedQuantity;
        const newAvailable = Math.max(0, listing.totalQuantity - newReserved - newCollected);
        
        let newListingStatus = listing.status;
        if (newCollected >= listing.totalQuantity) {
          newListingStatus = 'Completed';
        } else if (newAvailable === 0 && newReserved > 0) {
          newListingStatus = 'Fully Reserved';
        } else if (newReserved > 0) {
          newListingStatus = 'Partially Reserved';
        } else if (newAvailable > 0) {
          newListingStatus = 'Available';
        }

        listings[listIndex] = {
          ...listing,
          reservedQuantity: newReserved,
          collectedQuantity: newCollected,
          availableQuantity: newAvailable,
          status: newListingStatus,
          updatedAt: new Date().toISOString(),
        };
        storageService.saveListings(listings);

        storageService.addStatusHistory({
          entityType: 'listing',
          entityId: listing.id,
          actorId: 'system',
          actorName: 'ShareBite Engine',
          actorRole: 'system',
          previousStatus: listing.status,
          newStatus: newListingStatus,
          description: `Completed handover of ${req.requestedQuantity} ${listing.unit}. Total collected: ${newCollected}/${listing.totalQuantity} ${listing.unit}.`,
        });
      }

      storageService.addStatusHistory({
        entityType: 'request',
        entityId: req.id,
        actorId: 'system',
        actorName: 'ShareBite Engine',
        actorRole: 'system',
        previousStatus: 'Accepted',
        newStatus: 'Completed',
        description: 'Both parties confirmed pickup. Donation successfully completed and impact registered!',
      });

      return completedReq;
    }

    return req;
  }
};

