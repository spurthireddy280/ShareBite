export type UserRole = 'donor' | 'recipient' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  contactPerson: string;
  phone: string;
  city: string;
  area: string;
  address: string;
  orgType: string;
  description?: string;
  peopleServed?: number; // for recipient
  verified: boolean;
  isDemo: boolean;
  createdAt: string;
}

export type FoodType = 'Vegetarian' | 'Vegan' | 'Non-vegetarian' | 'Eggetarian' | 'Other';

export type FoodCategory = 
  | 'Cooked Meals' 
  | 'Bakery & Bread' 
  | 'Fruits & Vegetables' 
  | 'Packaged Food' 
  | 'Dairy & Beverages' 
  | 'Desserts & Sweets' 
  | 'Other';

export type ListingStatus = 
  | 'Available' 
  | 'Partially Reserved' 
  | 'Fully Reserved' 
  | 'Completed' 
  | 'Expired' 
  | 'Removed';

export interface FoodListing {
  id: string;
  donorId: string;
  donorName: string;
  donorType: string;
  donorPhone: string;
  title: string;
  description: string;
  category: FoodCategory;
  foodType: FoodType;
  totalQuantity: number;
  reservedQuantity: number;
  collectedQuantity: number;
  availableQuantity: number;
  unit: string; // 'portions', 'kg', 'boxes', 'packets', 'trays', 'litres'
  preparationTime: string;
  listedAt: string;
  storageConditions: string;
  allergens: string[];
  pickupAddress: string;
  city: string;
  area: string;
  pickupStart: string;
  pickupEnd: string;
  useByType: 'Use-by' | 'Best-before';
  useByDateTime: string;
  handlingInstructions: string;
  safetyAcknowledged: boolean;
  imageUrl?: string;
  status: ListingStatus;
  createdAt: string;
  updatedAt: string;
}

export type RequestStatus = 
  | 'Pending' 
  | 'Accepted' 
  | 'Rejected' 
  | 'Cancelled' 
  | 'Completed';

export interface DonationRequest {
  id: string;
  listingId: string;
  listingTitle: string;
  listingUnit: string;
  donorId: string;
  donorName: string;
  recipientId: string;
  recipientName: string;
  recipientPhone: string;
  recipientArea: string;
  requestedQuantity: number;
  message: string;
  expectedPickupTime: string;
  pickupLocation: string;
  status: RequestStatus;
  donorPickupConfirmed: boolean;
  donorConfirmedAt?: string;
  recipientPickupConfirmed: boolean;
  recipientConfirmedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StatusHistoryItem {
  id: string;
  entityType: 'listing' | 'request' | 'report';
  entityId: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole | 'system';
  previousStatus?: string;
  newStatus: string;
  description: string;
  timestamp: string;
}

export type ReportStatus = 'Under Review' | 'Resolved' | 'Dismissed';

export type ReportReason = 
  | 'Inaccurate food information' 
  | 'Suspicious listing' 
  | 'Expired food' 
  | 'Misleading quantities' 
  | 'Inappropriate content' 
  | 'Other';

export interface Report {
  id: string;
  listingId?: string;
  listingTitle?: string;
  reportedUserId?: string;
  reportedUserName?: string;
  reporterId: string;
  reporterName: string;
  reporterRole: UserRole;
  reason: ReportReason;
  details: string;
  status: ReportStatus;
  actionTaken?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface AdminAuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetType: 'listing' | 'user' | 'report' | 'system';
  targetId: string;
  details: string;
  timestamp: string;
}
