import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { ReportReason } from '../../types';
import { AlertTriangle, X } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  listingId?: string;
  listingTitle?: string;
  reportedUserId?: string;
  reportedUserName?: string;
}

const REPORT_REASONS: ReportReason[] = [
  'Inaccurate food information',
  'Suspicious listing',
  'Expired food',
  'Misleading quantities',
  'Inappropriate content',
  'Other',
];

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  listingId,
  listingTitle,
  reportedUserId,
  reportedUserName,
}) => {
  const { user } = useAuth();
  const { createReport } = useData();

  const [reason, setReason] = useState<ReportReason>('Inaccurate food information');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) return;

    setSubmitting(true);
    try {
      createReport(
        {
          listingId,
          listingTitle,
          reportedUserId,
          reportedUserName,
          reason,
          details: details.trim(),
        },
        user
      );
      setDetails('');
      onClose();
    } catch {
      // handled in context toast
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-amber-700">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-lg text-slate-900">Report an Issue</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700">
            {listingTitle && (
              <p>
                <strong>Listing:</strong> {listingTitle}
              </p>
            )}
            {reportedUserName && (
              <p>
                <strong>Reported Entity:</strong> {reportedUserName}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Reason for report <span className="text-rose-500">*</span>
            </label>
            <select
              value={reason}
              onChange={e => setReason(e.target.value as ReportReason)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-700 bg-white"
            >
              {REPORT_REASONS.map(r => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Detailed description <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={details}
              onChange={e => setDetails(e.target.value)}
              placeholder="Please provide specific details so platform administrators can investigate responsibly..."
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-700 resize-none"
            />
          </div>

          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-[11px] text-amber-900 leading-relaxed">
            All reports are investigated by the ShareBite trust & operations team. Misleading or false reports will be flagged.
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !details.trim()}
              className="px-5 py-2 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-sm transition-colors disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
