import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: 'danger' | 'primary' | 'warning';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'primary',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  let btnColor = 'bg-brand-700 hover:bg-brand-800 text-white';
  if (confirmVariant === 'danger') {
    btnColor = 'bg-rose-600 hover:bg-rose-700 text-white';
  } else if (confirmVariant === 'warning') {
    btnColor = 'bg-amber-600 hover:bg-amber-700 text-white';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-slate-100 text-slate-700 shrink-0">
            <AlertCircle className="w-5 h-5 text-slate-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-base text-slate-900">{title}</h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-5 py-2 text-xs font-semibold rounded-xl shadow-sm transition-colors ${btnColor}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

