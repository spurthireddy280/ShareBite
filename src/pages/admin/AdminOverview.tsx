import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Badge } from '../../components/common/Badge';
import { 
  ShieldCheck, 
  Users, 
  ListFilter, 
  Inbox, 
  AlertTriangle, 
  BarChart3, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  Clock,
  Settings,
  Activity
} from 'lucide-react';

export const AdminOverview: React.FC = () => {
  const { user } = useAuth();
  const { listings, requests, reports, adminLogs, analytics, resetDemoDatabase } = useData();

  const totalListings = listings.length;
  const activeListings = listings.filter(l => l.status === 'Available' || l.status === 'Partially Reserved').length;
  const pendingRequests = requests.filter(r => r.status === 'Pending').length;
  const completedDonations = requests.filter(r => r.status === 'Completed').length;
  const reportsUnderReview = reports.filter(r => r.status === 'Under Review').length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛡️</span>
            <h1 className="text-2xl font-bold tracking-tight">Platform Operations & Trust Center</h1>
          </div>
          <p className="text-xs sm:text-sm text-purple-200">
            System administration &bull; Real-time audit monitoring &bull; Incident moderation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/reports"
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-900 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-sm transition-all"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Review Incidents ({reportsUnderReview})</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Registered Entities</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            {analytics.activeDonorsCount + analytics.activeRecipientsCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {analytics.activeDonorsCount} Donors &bull; {analytics.activeRecipientsCount} Recipient Orgs
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Active Listings</span>
            <ListFilter className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-700 mt-2">
            {activeListings}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {totalListings} total surplus listings logged
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Completed Deliveries</span>
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold text-blue-700 mt-2">
            {completedDonations}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            100% two-sided verified
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Reported Concerns</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-amber-600 mt-2">
            {reportsUnderReview}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {reports.length} total reports filed
          </p>
        </div>
      </div>

      {/* Main 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Reports needing attention & quick listing management */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Incidents Needing Review */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Community Reports Under Review ({reportsUnderReview})
                </h3>
              </div>
              <Link to="/admin/reports" className="text-xs font-semibold text-purple-700 hover:underline">
                Manage all
              </Link>
            </div>

            {reports.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs italic">
                No reports submitted to the platform.
              </div>
            ) : (
              <div className="space-y-3">
                {reports.slice(0, 3).map(rep => (
                  <div key={rep.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{rep.reason}</span>
                      <Badge status={rep.status} size="sm" />
                    </div>

                    <p className="text-xs text-slate-700 italic bg-white p-2.5 rounded-lg border border-slate-200">
                      "{rep.details}"
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>Reporter: {rep.reporterName}</span>
                      <Link to="/admin/reports" className="font-bold text-purple-700 hover:underline">
                        Take action &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* System Health Overview */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600" />
              <span>System & Environmental Health</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-600 font-medium">Estimated Meal Equivalents Distributed:</span>
                <span className="font-bold text-emerald-800">~{analytics.estimatedMealsRedistributed} meals</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-600 font-medium">Standard Grams per Meal Formula:</span>
                <span className="font-bold text-slate-800">{analytics.gramsPerMeal}g / meal equivalent</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-600 font-medium">Two-Sided Handover Verification Engine:</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Online & Active
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-600 font-medium">Storage Engine Persistence:</span>
                <span className="font-bold text-brand-800">Browser LocalStorage (Demo Mode)</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Admin Audit Log */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-700" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">Administrative Audit Trail</h3>
              </div>
              <Link to="/admin/activity" className="text-xs font-semibold text-purple-700 hover:underline">
                View all
              </Link>
            </div>

            {adminLogs.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs italic">
                No admin actions logged.
              </div>
            ) : (
              <div className="space-y-3">
                {adminLogs.slice(0, 5).map(log => (
                  <div key={log.id} className="text-xs border-l-2 border-purple-600 pl-3 py-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{log.action}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-snug">{log.details}</p>
                    <span className="text-[10px] text-purple-800 font-medium">By {log.adminName}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

