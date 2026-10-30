import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { isSupabaseConfigured } from '../../services/supabaseClient';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { Settings, RefreshCw, Scale, Database, ShieldCheck, Check } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { analytics, updateMealEquivalentWeight, resetDemoDatabase } = useData();

  const [grams, setGrams] = useState(analytics.gramsPerMeal || 400);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveGrams = (e: React.FormEvent) => {
    e.preventDefault();
    updateMealEquivalentWeight(Number(grams));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleConfirmReset = () => {
    resetDemoDatabase();
    setResetModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System & Metric Settings</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure impact calculations, database persistence mode, and demo environment defaults.
          </p>
        </div>
      </div>

      {/* Card 1: Metric Configuration */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Scale className="w-5 h-5 text-purple-700" />
          <h3 className="font-bold text-slate-900 text-sm">Meal Equivalent Calculation Formula</h3>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          ShareBite uses a transparent, standardized conversion formula to estimate meals redistributed from bulk weights (kg / litres).
        </p>

        <form onSubmit={handleSaveGrams} className="space-y-4 max-w-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Grams per Meal Equivalent
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={200}
                max={1000}
                step={50}
                value={grams}
                onChange={e => setGrams(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-700 bg-white"
              />
              <span className="text-xs font-semibold text-slate-500 shrink-0">grams / portion</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Standard nutritional benchmark is 400g per balanced meal portion.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-purple-800 hover:bg-purple-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              Update Calculation Constant
            </button>
            {savedSuccess && (
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <Check className="w-4 h-4" />
                Saved
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Card 2: Database Environment Status */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Database className="w-5 h-5 text-emerald-700" />
          <h3 className="font-bold text-slate-900 text-sm">Persistence & Backend Architecture</h3>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-800">Current Mode</p>
              <p className="text-slate-500 text-[11px]">
                {isSupabaseConfigured ? 'Supabase Backend Connected' : 'Local Demo Mode (localStorage)'}
              </p>
            </div>
            <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
              isSupabaseConfigured ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
            }`}>
              {isSupabaseConfigured ? 'Live Cloud' : 'Local Sandbox'}
            </span>
          </div>

          <p className="text-slate-600 leading-relaxed">
            In demo mode, all listings, portion reservations, two-sided confirmations, and safety reports are persisted in the browser's localStorage. Refreshing or navigating retains full state.
          </p>
        </div>
      </div>

      {/* Card 3: Danger Zone / Reset Demo Data */}
      <div className="bg-rose-50/60 rounded-2xl border border-rose-200 p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2 pb-1">
          <RefreshCw className="w-5 h-5 text-rose-600" />
          <h3 className="font-bold text-rose-950 text-sm">Demo Data Reset</h3>
        </div>

        <p className="text-xs text-rose-900/80 leading-relaxed">
          Restore all tables, sample donors (Spice Garden Restaurant, Daily Crust Bakery, Grand Royal Hotel), 3 recipient organizations, and 12 food listings back to default fresh state.
        </p>

        <button
          type="button"
          onClick={() => setResetModalOpen(true)}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
        >
          Reset Demo Database to Initial Seed
        </button>
      </div>

      {/* Reset Confirmation Modal */}
      <ConfirmationModal
        isOpen={resetModalOpen}
        title="Reset All Sample Data?"
        message="This will overwrite current local storage data and restore all pre-seeded listings, sample requests, and recipient organizations."
        confirmLabel="Reset Everything"
        confirmVariant="danger"
        onConfirm={handleConfirmReset}
        onCancel={() => setResetModalOpen(false)}
      />

    </div>
  );
};
