import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { UserRole } from '../../types';
import { Sparkles, RefreshCw, UserCheck, ShieldAlert, ChevronDown, Check } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const { user, role, loginAsDemo } = useAuth();
  const { resetDemoDatabase } = useData();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const roles: { id: UserRole; label: string; desc: string; icon: string }[] = [
    { id: 'donor', label: 'Food Donor', desc: 'Spice Garden Restaurant', icon: '🍲' },
    { id: 'recipient', label: 'Recipient Org', desc: 'Hope Foundation', icon: '🤲' },
    { id: 'admin', label: 'Administrator', desc: 'ShareBite Operations', icon: '🛡️' },
  ];

  const handleReset = () => {
    resetDemoDatabase();
    setConfirmReset(false);
  };

  return (
    <div className="bg-[#1b4332] text-white px-3 sm:px-6 py-2 border-b border-brand-leaf/30 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 bg-brand-leaf/20 border border-brand-leaf/40 px-2.5 py-0.5 rounded-full font-semibold text-brand-300 text-xs tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            DEMO MODE (LOCAL)
          </span>
          <span className="hidden md:inline text-brand-100 text-xs">
            Fictional sample data stored in browser localStorage. Real-time multi-role simulation ready for judges.
          </span>
        </div>

        <div className="flex items-center gap-2 relative">
          <span className="text-brand-200 text-xs hidden sm:inline">Role:</span>

          {/* Quick role switcher dropdown/pills */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 border border-white/20 px-2.5 py-1 rounded-lg font-medium text-xs text-white transition-colors"
            >
              <span>{roles.find(r => r.id === role)?.icon}</span>
              <span className="capitalize">{role || 'Select Role'}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>

            {showRoleMenu && (
              <div 
                className="absolute right-0 top-full mt-1.5 w-60 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 p-1.5 z-50 animate-fade-in"
                onMouseLeave={() => setShowRoleMenu(false)}
              >
                <div className="px-2.5 py-1.5 border-b border-slate-100 mb-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Switch Demo Persona</p>
                </div>
                {roles.map(r => (
                  <button
                    key={r.id}
                    onClick={() => {
                      loginAsDemo(r.id);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition-colors ${
                      role === r.id ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{r.icon}</span>
                      <div>
                        <div className="font-semibold text-slate-900">{r.label}</div>
                        <div className="text-[11px] text-slate-500">{r.desc}</div>
                      </div>
                    </div>
                    {role === r.id && <Check className="w-4 h-4 text-emerald-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reset Demo Data Button */}
          {confirmReset ? (
            <div className="flex items-center gap-1 bg-rose-600/90 text-white px-2 py-0.5 rounded-lg text-xs">
              <span>Reset data?</span>
              <button
                onClick={handleReset}
                className="font-bold underline ml-1 hover:text-white"
              >
                Yes
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="ml-1 text-rose-200 hover:text-white"
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmReset(true)}
              title="Reset all sample data to default seed"
              className="flex items-center gap-1 bg-white/10 hover:bg-white/20 border border-white/20 px-2.5 py-1 rounded-lg text-xs text-brand-100 hover:text-white transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              <span className="hidden sm:inline">Reset Seed</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

