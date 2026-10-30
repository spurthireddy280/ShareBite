import React from 'react';
import { useData } from '../../context/DataContext';
import { History, ShieldCheck, Clock, User, ArrowRight } from 'lucide-react';

export const AdminActivityPage: React.FC = () => {
  const { adminLogs, statusHistory } = useData();

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Audit & Activity Stream</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Complete, immutable chronological audit records of listing lifecycles, requests, and administrative actions.
          </p>
        </div>
      </div>

      {/* 2-Column Log Views */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Admin Actions */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <ShieldCheck className="w-5 h-5 text-purple-700" />
            <h3 className="font-bold text-slate-900 text-sm">Administrative Audit Trail ({adminLogs.length})</h3>
          </div>

          {adminLogs.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No admin actions recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {adminLogs.map(log => (
                <div key={log.id} className="p-3 rounded-xl bg-purple-50/40 border border-purple-100 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-900">{log.action}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-700">{log.details}</p>
                  <p className="text-[10px] text-purple-700 font-semibold">Actor: {log.adminName}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Global Lifecycle Events */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <History className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-slate-900 text-sm">All Platform Events ({statusHistory.length})</h3>
          </div>

          {statusHistory.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No events recorded.</p>
          ) : (
            <div className="space-y-3">
              {statusHistory.slice(0, 15).map(hist => (
                <div key={hist.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      {hist.previousStatus ? (
                        <span className="flex items-center gap-1 text-slate-500 font-normal">
                          <span>{hist.previousStatus}</span>
                          <ArrowRight className="w-3 h-3 text-slate-400" />
                          <span className="font-bold text-slate-900">{hist.newStatus}</span>
                        </span>
                      ) : (
                        <span>{hist.newStatus}</span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {new Date(hist.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-slate-600 leading-relaxed">{hist.description}</p>
                  <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                    <span>By: <strong className="text-slate-600">{hist.actorName}</strong></span>
                    <span className="uppercase font-semibold">{hist.actorRole}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

