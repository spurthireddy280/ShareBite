import React from 'react';
import { StatusHistoryItem } from '../../types';
import { Clock, User, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

interface TimelineViewProps {
  items: StatusHistoryItem[];
  emptyMessage?: string;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ 
  items, 
  emptyMessage = 'No activity recorded yet.' 
}) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-6 text-slate-500 text-xs italic">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
      {items.map((item, index) => {
        const date = new Date(item.timestamp);
        const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        return (
          <div key={item.id || index} className="relative group">
            {/* Dot */}
            <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-brand-700 border-2 border-white ring-2 ring-brand-200 shadow-sm" />

            <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-sm text-xs space-y-1.5 transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                  {item.previousStatus ? (
                    <span className="flex items-center gap-1 text-slate-600">
                      <span>{item.previousStatus}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                      <span className="text-brand-800 font-bold">{item.newStatus}</span>
                    </span>
                  ) : (
                    <span className="text-brand-800 font-bold">{item.newStatus}</span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                  <Clock className="w-3 h-3" />
                  <span>{formattedDate} at {formattedTime}</span>
                </div>
              </div>

              <p className="text-slate-700 leading-relaxed">
                {item.description}
              </p>

              <div className="pt-1 flex items-center justify-between border-t border-slate-100 text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-400" />
                  <span>By <strong className="text-slate-700">{item.actorName}</strong></span>
                </span>
                <span className="uppercase text-[10px] tracking-wider font-semibold px-1.5 py-0.2 bg-slate-100 rounded text-slate-600">
                  {item.actorRole}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

