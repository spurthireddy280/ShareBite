import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Badge } from '../../components/common/Badge';
import { ReportModal } from '../../components/common/ReportModal';
import { AlertTriangle, PlusCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const DonorReportsPage: React.FC = () => {
  const { user } = useAuth();
  const { reports } = useData();

  const [reportModalOpen, setReportModalOpen] = useState(false);

  if (!user) return null;

  // Reports involving donor's listings or submitted by donor
  const donorReports = reports.filter(
    r => r.reportedUserId === user.id || r.reporterId === user.id
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Trust, Safety & Incident Reports</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitor feedback, reported concerns, or submit a report to platform administrators.
          </p>
        </div>

        <button
          onClick={() => setReportModalOpen(true)}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-all"
        >
          <AlertTriangle className="w-4 h-4 text-amber-200" />
          <span>Report an Incident / Concern</span>
        </button>
      </div>

      {donorReports.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-3">
          <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">Clear Standing & No Reports</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Your listings and organization profile have no active trust & safety violations or unresolved community reports.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {donorReports.map(report => (
            <div
              key={report.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{report.reason}</span>
                    <Badge status={report.status} size="sm" />
                  </div>
                  <p className="text-xs text-slate-500">
                    Report ID: {report.id} &bull; Filed on {new Date(report.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>

              {report.listingTitle && (
                <p className="text-xs text-slate-700">
                  <strong>Associated Listing:</strong> {report.listingTitle}
                </p>
              )}

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 italic">
                "{report.details}"
              </div>

              {report.actionTaken && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Admin Resolution:</strong> {report.actionTaken}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Report Modal */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        reportedUserName="Community Volunteer / Logistics Concern"
      />

    </div>
  );
};

