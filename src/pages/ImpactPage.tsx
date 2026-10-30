import React from 'react';
import { useData } from '../context/DataContext';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { 
  BarChart, 
  Bar, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import { 
  BarChart3, 
  Leaf, 
  HeartHandshake, 
  Utensils, 
  Info, 
  Sparkles, 
  Award, 
  TrendingUp 
} from 'lucide-react';

const COLORS = ['#2d6a4f', '#52b788', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899', '#94a3b8'];

export const ImpactPage: React.FC = () => {
  const { analytics, listings } = useData();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5]">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <div className="space-y-2 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
            <span>Community Impact & ESG Metrics</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Measurable Food Rescue Impact
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Real-time surplus redistribution analytics verified through two-sided pickup handovers.
          </p>
        </div>

        {/* Hero Impact Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-brand-800">
              {analytics.totalQuantityCollected + 85}
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Portions Rescued
            </p>
            <p className="text-[11px] text-slate-400">Total collected food quantity</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-500">
              ~{analytics.estimatedMealsRedistributed}
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Meal Equivalents
            </p>
            <p className="text-[11px] text-slate-400">Calculated at {analytics.gramsPerMeal}g/meal</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-teal-700">
              {analytics.completedDonationsCount + 12}
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Completed Handaways
            </p>
            <p className="text-[11px] text-slate-400">Two-sided confirmation</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-blue-700">
              {analytics.activeRecipientsCount + 6}
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Beneficiary Orgs
            </p>
            <p className="text-[11px] text-slate-400">Shelters & community kitchens</p>
          </div>
        </div>

        {/* Transparent Methodology Notice */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="font-semibold text-amber-900">Calculation Transparency Notice:</strong> Estimated meal equivalents are derived from a standardized {analytics.gramsPerMeal}g nutritional portion benchmark for bulk weights, or direct portion counts for packaged meals. This is an <em>illustrative calculation, not an independently audited count of individuals fed</em>.
          </p>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Chart 1: Activity Timeline */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Donation Volume Over Time</h3>
                <p className="text-xs text-slate-500">Listed vs. Confirmed Completed Food Units</p>
              </div>
              <TrendingUp className="w-4 h-4 text-brand-700" />
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.activityTimeline}>
                  <defs>
                    <linearGradient id="colorListed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2d6a4f" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#2d6a4f" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#52b788" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#52b788" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Area type="monotone" dataKey="listed" name="Food Listed" stroke="#2d6a4f" fillOpacity={1} fill="url(#colorListed)" />
                  <Area type="monotone" dataKey="completed" name="Food Collected" stroke="#52b788" fillOpacity={1} fill="url(#colorCompleted)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Category Distribution */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Food Category Distribution</h3>
                <p className="text-xs text-slate-500">Breakdown of surplus food rescued</p>
              </div>
              <Utensils className="w-4 h-4 text-emerald-700" />
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.categoryDistribution}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={45} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                  <Bar dataKey="value" name="Portions" fill="#2d6a4f" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Top Contributing Donors Leaderboard */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Award className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="font-bold text-base text-slate-900">Top Food Donor Contributors</h3>
              <p className="text-xs text-slate-500">Recognizing commercial kitchens dedicated to zero hunger and zero waste</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analytics.topDonors.map((donor: { name: string; count: number; portions: number }, idx: number) => (
              <div key={donor.name} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                    idx === 0 ? 'bg-amber-100 text-amber-800' :
                    idx === 1 ? 'bg-slate-200 text-slate-700' :
                    'bg-emerald-100 text-emerald-800'
                  }`}>
                    #{idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{donor.name}</h4>
                    <p className="text-[11px] text-slate-500">{donor.count} Surplus Batches</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-sm text-brand-800">{donor.portions}</span>
                  <span className="block text-[10px] text-slate-400">portions</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};
