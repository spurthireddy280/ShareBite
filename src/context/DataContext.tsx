import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  FoodListing, 
  DonationRequest, 
  StatusHistoryItem, 
  Report, 
  AdminAuditLog, 
  User, 
  ReportReason, 
  ReportStatus 
} from '../types';
import { listingService } from '../services/listingService';
import { requestService } from '../services/requestService';
import { reportService } from '../services/reportService';
import { analyticsService, AnalyticsSummary } from '../services/analyticsService';
import { storageService } from '../services/storageService';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

interface DataContextType {
  listings: FoodListing[];
  requests: DonationRequest[];
  statusHistory: StatusHistoryItem[];
  reports: Report[];
  adminLogs: AdminAuditLog[];
  analytics: AnalyticsSummary;
  toasts: ToastMessage[];
  refreshData: () => void;
  showToast: (title: string, message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  dismissToast: (id: string) => void;
  
  // Listing Actions
  createListing: (data: Omit<FoodListing, 'id' | 'reservedQuantity' | 'collectedQuantity' | 'availableQuantity' | 'status' | 'createdAt' | 'updatedAt'>, actor: User) => FoodListing;
  updateListing: (id: string, updates: Partial<FoodListing>, actor: User) => FoodListing;
  removeListing: (id: string, actor: User, reason?: string) => boolean;

  // Request Actions
  createRequest: (listingId: string, requestedQuantity: number, expectedPickupTime: string, message: string, recipient: User) => DonationRequest;
  acceptRequest: (requestId: string, donor: User) => DonationRequest;
  rejectRequest: (requestId: string, donor: User, reason?: string) => DonationRequest;
  cancelRequest: (requestId: string, actor: User, reason?: string) => DonationRequest;
  confirmPickupHandover: (requestId: string, donor: User) => DonationRequest;
  confirmPickupCollection: (requestId: string, recipient: User) => DonationRequest;

  // Report & Admin Actions
  createReport: (data: { listingId?: string; listingTitle?: string; reportedUserId?: string; reportedUserName?: string; reason: ReportReason; details: string; }, reporter: User) => Report;
  updateReportStatus: (reportId: string, status: ReportStatus, actionTaken: string, admin: User, removeListing?: boolean) => Report;
  resetDemoDatabase: () => void;
  updateMealEquivalentWeight: (grams: number) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [requests, setRequests] = useState<DonationRequest[]>([]);
  const [statusHistory, setStatusHistory] = useState<StatusHistoryItem[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [adminLogs, setAdminLogs] = useState<AdminAuditLog[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary>(() => analyticsService.getSummary());
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const refreshData = useCallback(() => {
    setListings(listingService.getAllListings());
    setRequests(requestService.getAllRequests());
    setStatusHistory(storageService.getStatusHistory());
    setReports(reportService.getAllReports());
    setAdminLogs(storageService.getAdminLogs());
    setAnalytics(analyticsService.getSummary());
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const showToast = useCallback((title: string, message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    setToasts(prev => [...prev, { id, title, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2d6a4f', '#52b788', '#f59e0b', '#74c69d']
      });
    } catch {
      // ignore in tests or if canvas unsupported
    }
  };

  // Actions
  const createListing = (data: Omit<FoodListing, 'id' | 'reservedQuantity' | 'collectedQuantity' | 'availableQuantity' | 'status' | 'createdAt' | 'updatedAt'>, actor: User) => {
    try {
      const created = listingService.createListing(data, actor);
      refreshData();
      showToast('Food Listing Published', `"${created.title}" is now visible to verified recipient organizations.`, 'success');
      return created;
    } catch (err: any) {
      showToast('Listing Failed', err.message || 'Could not publish listing', 'error');
      throw err;
    }
  };

  const updateListing = (id: string, updates: Partial<FoodListing>, actor: User) => {
    try {
      const updated = listingService.updateListing(id, updates, actor);
      refreshData();
      showToast('Listing Updated', `Changes to "${updated.title}" saved successfully.`, 'success');
      return updated;
    } catch (err: any) {
      showToast('Update Failed', err.message || 'Could not update listing', 'error');
      throw err;
    }
  };

  const removeListing = (id: string, actor: User, reason?: string) => {
    try {
      const ok = listingService.removeListing(id, actor, reason);
      refreshData();
      if (ok) {
        showToast('Listing Removed', 'The food listing has been archived from public discovery.', 'info');
      }
      return ok;
    } catch (err: any) {
      showToast('Removal Failed', err.message || 'Could not remove listing', 'error');
      throw err;
    }
  };

  const createRequest = (listingId: string, requestedQuantity: number, expectedPickupTime: string, message: string, recipient: User) => {
    try {
      const req = requestService.createRequest(listingId, requestedQuantity, expectedPickupTime, message, recipient);
      refreshData();
      showToast('Request Submitted', `Your request for ${requestedQuantity} ${req.listingUnit} was sent to ${req.donorName}.`, 'success');
      return req;
    } catch (err: any) {
      showToast('Request Failed', err.message || 'Could not submit request', 'error');
      throw err;
    }
  };

  const acceptRequest = (requestId: string, donor: User) => {
    try {
      const req = requestService.acceptRequest(requestId, donor);
      refreshData();
      showToast('Request Accepted', `Reserved ${req.requestedQuantity} ${req.listingUnit} for ${req.recipientName}. Pickup schedule updated!`, 'success');
      return req;
    } catch (err: any) {
      showToast('Accept Failed', err.message || 'Could not accept request', 'error');
      throw err;
    }
  };

  const rejectRequest = (requestId: string, donor: User, reason?: string) => {
    try {
      const req = requestService.rejectRequest(requestId, donor, reason);
      refreshData();
      showToast('Request Declined', `Decline notice recorded for ${req.recipientName}.`, 'info');
      return req;
    } catch (err: any) {
      showToast('Action Failed', err.message || 'Could not decline request', 'error');
      throw err;
    }
  };

  const cancelRequest = (requestId: string, actor: User, reason?: string) => {
    try {
      const req = requestService.cancelRequest(requestId, actor, reason);
      refreshData();
      showToast('Request Cancelled', `Request for ${req.listingTitle} was cancelled and reserved quantity released.`, 'info');
      return req;
    } catch (err: any) {
      showToast('Cancel Failed', err.message || 'Could not cancel request', 'error');
      throw err;
    }
  };

  const confirmPickupHandover = (requestId: string, donor: User) => {
    try {
      const req = requestService.confirmPickupHandover(requestId, donor);
      refreshData();
      if (req.status === 'Completed') {
        triggerConfetti();
        showToast('Donation Completed! 🎉', `Both parties have confirmed handover. Impact recorded!`, 'success');
      } else {
        showToast('Handover Confirmed', `Handover confirmed. Waiting for ${req.recipientName} collection verification.`, 'info');
      }
      return req;
    } catch (err: any) {
      showToast('Confirmation Error', err.message || 'Could not confirm handover', 'error');
      throw err;
    }
  };

  const confirmPickupCollection = (requestId: string, recipient: User) => {
    try {
      const req = requestService.confirmPickupCollection(requestId, recipient);
      refreshData();
      if (req.status === 'Completed') {
        triggerConfetti();
        showToast('Donation Completed! 🎉', `Food collection confirmed & verified. Thank you for rescuing food!`, 'success');
      } else {
        showToast('Collection Confirmed', `Collection registered. Waiting for ${req.donorName} handover confirmation.`, 'info');
      }
      return req;
    } catch (err: any) {
      showToast('Confirmation Error', err.message || 'Could not confirm collection', 'error');
      throw err;
    }
  };

  const createReport = (data: { listingId?: string; listingTitle?: string; reportedUserId?: string; reportedUserName?: string; reason: ReportReason; details: string; }, reporter: User) => {
    try {
      const report = reportService.createReport(data, reporter);
      refreshData();
      showToast('Concern Reported', 'Thank you for helping maintain community safety. Platform admins will review this shortly.', 'warning');
      return report;
    } catch (err: any) {
      showToast('Report Failed', err.message || 'Could not submit report', 'error');
      throw err;
    }
  };

  const updateReportStatus = (reportId: string, status: ReportStatus, actionTaken: string, admin: User, removeListing: boolean = false) => {
    try {
      const rep = reportService.updateReportStatus(reportId, status, actionTaken, admin, removeListing);
      refreshData();
      showToast('Report Updated', `Report status changed to "${status}".`, 'success');
      return rep;
    } catch (err: any) {
      showToast('Update Failed', err.message || 'Could not update report', 'error');
      throw err;
    }
  };

  const resetDemoDatabase = () => {
    storageService.resetToDefault();
    refreshData();
    showToast('Demo Database Reset', 'All records restored to fresh initial state with sample listings, requests, and profiles.', 'info');
  };

  const updateMealEquivalentWeight = (grams: number) => {
    const settings = storageService.getSettings();
    storageService.saveSettings({ ...settings, gramsPerMeal: grams });
    refreshData();
    showToast('Metric Configured', `Meal equivalent standard set to ${grams}g per portion.`, 'info');
  };

  return (
    <DataContext.Provider
      value={{
        listings,
        requests,
        statusHistory,
        reports,
        adminLogs,
        analytics,
        toasts,
        refreshData,
        showToast,
        dismissToast,
        createListing,
        updateListing,
        removeListing,
        createRequest,
        acceptRequest,
        rejectRequest,
        cancelRequest,
        confirmPickupHandover,
        confirmPickupCollection,
        createReport,
        updateReportStatus,
        resetDemoDatabase,
        updateMealEquivalentWeight,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

