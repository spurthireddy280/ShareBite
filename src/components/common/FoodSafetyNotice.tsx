import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

interface FoodSafetyNoticeProps {
  compact?: boolean;
  className?: string;
}

export const FoodSafetyNotice: React.FC<FoodSafetyNoticeProps> = ({ compact = false, className = '' }) => {
  if (compact) {
    return (
      <div className={`flex items-start gap-2.5 p-3 rounded-lg bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 ${className}`}>
        <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="font-semibold text-amber-950">Safety Reminder:</strong> ShareBite coordinates food transfers but does not certify or inspect food. Both parties must adhere to local hygiene standards and verify condition prior to distribution.
        </p>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-950 shadow-sm ${className}`}>
      <div className="flex items-start gap-3">
        <div className="p-2 bg-amber-100 rounded-lg text-amber-800 shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-xs sm:text-sm">
          <h4 className="font-bold text-amber-950 flex items-center gap-1.5">
            Food Safety & Responsibility Notice
          </h4>
          <p className="text-amber-900/90 leading-relaxed">
            ShareBite facilitates food donation coordination. It does not inspect, certify, or guarantee food safety. Donors and recipient organizations remain responsible for safe handling, applicable food-safety requirements, and checking food condition before distribution.
          </p>
          <div className="pt-1 flex items-center gap-2 text-xs text-amber-800/80 font-medium">
            <Info className="w-3.5 h-3.5" />
            <span>Always verify storage temperature, smell, seal integrity, and allergen advisories before handing over or distributing meals.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

