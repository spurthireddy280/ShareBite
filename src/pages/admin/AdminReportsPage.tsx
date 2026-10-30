import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Report, ReportStatus } from '../../types';
import { Badge } from '../../components/common/Badge';
import { 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  ShieldCheck, 
  Clock, 
  FileText, 
  Trash2,
  Filter
} from 'lucide-react';

export const AdminReportsPage: React.FC = () => {
  const { user } = useAuth();
  const { reports, updateReportStatus } = useData();

  const [filterStatus, setFilterStatus] = useState<ReportStatus | 'All'>('All');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [newStatus, setNewStatus] = useState<ReportStatus>('Resolved');
  const [actionNotes, setActionNotes] = useState('Reviewed food allergen advisories and contacted donor.');
  const [removeListingChecked, setRemoveListingChecked] = useState(false);

  const filteredReports = reports.filter(r => {
    if (filterStatus === 'All') return true;
    return r.status === filterStatus;
  });

  const handleOpenActionModal = (report: Report) => {
    setSelectedReport(report);
    setNewStatus(report.status === 'Under Review' ? 'Resolved' : report.status);
    setActionNotes(report.actionTaken || 'Verified compliance and resolved incident.');
    setRemoveListingChecked(false);
  };

  const handleSaveAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport || !user) return;

    updateReportStatus(
      selectedReport.id,
      newStatus,
      actionNotes.trim(),
      user,
      removeListingChecked
    );
    setSelectedReport(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Trust & Safety Reports</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review community safety complaints, inaccurate food descriptions, and hygiene concerns.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs">
        {(['All', 'Under Review', 'Resolved', 'Dismissed'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilterStatus(tab)}
            className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all ${
              filterStatus === tab
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {filteredReports.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-3">
          <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No reports found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {filterStatus === 'All'
              ? 'No safety or quality complaints have been filed by users.'
              : `No reports match status "${filterStatus}".`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReports.map(rep => (
            <div
              key={rep.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <h3 className="font-bold text-base text-slate-900">{rep.reason}</h3>
                    <Badge status={rep.status} size="sm" />
                  </div>
                  <p className="text-xs text-slate-500">
                    Report ID: {rep.id} &bull; Filed by {rep.reporterName} ({rep.reporterRole}) on {new Date(rep.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>

                <button
                  onClick={() => handleOpenActionModal(rep)}
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
                >
                  Manage / Resolve
                </button>
              </div>

              {rep.listingTitle && (
                <p className="text-xs text-slate-700">
                  <strong>Associated Listing:</strong> {rep.listingTitle}
                </p>
              )}

              {rep.reportedUserName && (
                <p className="text-xs text-slate-700">
                  <strong>Reported Entity:</strong> {rep.reportedUserName}
                </p>
              )}

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700 italic">
                "{rep.details}"
              </div>

              {rep.actionTaken && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Audit Resolution:</strong> {rep.actionTaken}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Action / Resolve Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Resolve Safety Incident</h3>
              <button onClick={() => setSelectedReport(null)} className="text-slate-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAction} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Report Status
                </label>
                <select
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value as ReportStatus)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-600 bg-white"
                >
                  <option value="Under Review">Under Review</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Dismissed">Dismissed</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Action Taken / Resolution Summary <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={actionNotes}
                  onChange={e => setActionNotes(e.target.value)}
                  placeholder="Describe resolution taken for audit logs..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-600 resize-none bg-white"
                />
              </div>

              {selectedReport.listingId && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
                  <label className="flex items-center gap-2 cursor-pointer text-rose-900 font-semibold">
                    <input
                      type="checkbox"
                      checked={removeListingChecked}
                      onChange={e => setRemoveListingChecked(e.target.checked)}
                      className="rounded text-rose-600"
                    />
                    <span>Permanently remove associated food listing</span>
                  </label>
                  <p className="text-[10px] text-rose-700 mt-1 ml-5">
                    Select if the food is spoiled, hazardous, or violates hygiene policies.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-xs"
                >
                  Save Resolution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

