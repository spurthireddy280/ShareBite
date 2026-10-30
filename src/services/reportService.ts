import { storageService } from './storageService';
import { listingService } from './listingService';
import { Report, ReportReason, ReportStatus, User } from '../types';

export const reportService = {
  getAllReports(): Report[] {
    return storageService.getReports();
  },

  createReport(data: {
    listingId?: string;
    listingTitle?: string;
    reportedUserId?: string;
    reportedUserName?: string;
    reason: ReportReason;
    details: string;
  }, reporter: User): Report {
    const newReport: Report = {
      id: 'rep_' + Date.now(),
      listingId: data.listingId,
      listingTitle: data.listingTitle,
      reportedUserId: data.reportedUserId,
      reportedUserName: data.reportedUserName,
      reporterId: reporter.id,
      reporterName: reporter.name,
      reporterRole: reporter.role,
      reason: data.reason,
      details: data.details,
      status: 'Under Review',
      createdAt: new Date().toISOString(),
    };

    const reports = storageService.getReports();
    storageService.saveReports([newReport, ...reports]);

    storageService.addAdminLog({
      adminId: reporter.id,
      adminName: reporter.name,
      action: 'Report Submitted',
      targetType: 'report',
      targetId: newReport.id,
      details: `Report for reason "${data.reason}" regarding listing/user "${data.listingTitle || data.reportedUserName}".`,
    });

    return newReport;
  },

  updateReportStatus(
    reportId: string, 
    newStatus: ReportStatus, 
    actionTaken: string, 
    admin: User, 
    removeAssociatedListing: boolean = false
  ): Report {
    const reports = storageService.getReports();
    const index = reports.findIndex(r => r.id === reportId);
    if (index === -1) throw new Error('Report not found');

    const report = reports[index];
    const updatedReport: Report = {
      ...report,
      status: newStatus,
      actionTaken,
      resolvedAt: newStatus === 'Resolved' || newStatus === 'Dismissed' ? new Date().toISOString() : undefined,
    };

    reports[index] = updatedReport;
    storageService.saveReports(reports);

    if (removeAssociatedListing && report.listingId) {
      listingService.removeListing(report.listingId, admin, `Admin action on report ${reportId}: ${actionTaken}`);
    }

    storageService.addAdminLog({
      adminId: admin.id,
      adminName: admin.name,
      action: `Report ${newStatus}`,
      targetType: 'report',
      targetId: reportId,
      details: `Action: ${actionTaken}${removeAssociatedListing ? ' (Associated listing removed)' : ''}`,
    });

    return updatedReport;
  }
};
