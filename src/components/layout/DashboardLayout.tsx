import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { DemoBanner } from '../common/DemoBanner';
import { FoodSafetyNotice } from '../common/FoodSafetyNotice';
import { 
  LayoutDashboard, 
  PlusCircle, 
  ListFilter, 
  Inbox, 
  CalendarClock, 
  History, 
  BarChart3, 
  AlertTriangle, 
  UserCircle, 
  LogOut, 
  Search, 
  CheckCircle2, 
  Users, 
  FileText, 
  Settings, 
  Menu, 
  X, 
  ShieldCheck,
  Building2,
  MapPin,
  Sparkles
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, role, logout } = useAuth();
  const { requests, reports } = useData();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Compute live badges
  const pendingIncomingCount = role === 'donor' && user
    ? requests.filter(r => r.donorId === user.id && r.status === 'Pending').length
    : 0;

  const activeRecipientRequestsCount = role === 'recipient' && user
    ? requests.filter(r => r.recipientId === user.id && (r.status === 'Pending' || r.status === 'Accepted')).length
    : 0;

  const underReviewReportsCount = role === 'admin'
    ? reports.filter(r => r.status === 'Under Review').length
    : 0;

  // Build navigation items based on current role
  let navItems: { label: string; to: string; icon: React.ReactNode; badge?: number }[] = [];

  if (role === 'donor') {
    navItems = [
      { label: 'Overview', to: '/donor', icon: <LayoutDashboard className="w-4 h-4" /> },
      { label: 'Create Food Listing', to: '/donor/create-listing', icon: <PlusCircle className="w-4 h-4" /> },
      { label: 'My Listings', to: '/donor/my-listings', icon: <ListFilter className="w-4 h-4" /> },
      { 
        label: 'Incoming Requests', 
        to: '/donor/requests', 
        icon: <Inbox className="w-4 h-4" />, 
        badge: pendingIncomingCount 
      },
      { label: 'Pickup Schedule', to: '/donor/pickup-schedule', icon: <CalendarClock className="w-4 h-4" /> },
      { label: 'Donation History', to: '/donor/history', icon: <History className="w-4 h-4" /> },
      { label: 'Impact Analytics', to: '/donor/impact', icon: <BarChart3 className="w-4 h-4" /> },
      { label: 'Reports', to: '/donor/reports', icon: <AlertTriangle className="w-4 h-4" /> },
      { label: 'Profile', to: '/donor/profile', icon: <UserCircle className="w-4 h-4" /> },
    ];
  } else if (role === 'recipient') {
    navItems = [
      { label: 'Overview', to: '/recipient', icon: <LayoutDashboard className="w-4 h-4" /> },
      { label: 'Browse Available Food', to: '/recipient/browse', icon: <Search className="w-4 h-4" /> },
      { 
        label: 'My Requests', 
        to: '/recipient/my-requests', 
        icon: <Inbox className="w-4 h-4" />, 
        badge: activeRecipientRequestsCount 
      },
      { label: 'Accepted Donations', to: '/recipient/accepted', icon: <CheckCircle2 className="w-4 h-4" /> },
      { label: 'Pickup Schedule', to: '/recipient/pickup-schedule', icon: <CalendarClock className="w-4 h-4" /> },
      { label: 'Donation History', to: '/recipient/history', icon: <History className="w-4 h-4" /> },
      { label: 'Impact', to: '/recipient/impact', icon: <BarChart3 className="w-4 h-4" /> },
      { label: 'Profile', to: '/recipient/profile', icon: <UserCircle className="w-4 h-4" /> },
    ];
  } else if (role === 'admin') {
    navItems = [
      { label: 'Overview', to: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
      { label: 'Users', to: '/admin/users', icon: <Users className="w-4 h-4" /> },
      { label: 'Food Listings', to: '/admin/listings', icon: <ListFilter className="w-4 h-4" /> },
      { label: 'Requests', to: '/admin/requests', icon: <Inbox className="w-4 h-4" /> },
      { 
        label: 'Reports', 
        to: '/admin/reports', 
        icon: <AlertTriangle className="w-4 h-4" />, 
        badge: underReviewReportsCount 
      },
      { label: 'Donation Activity', to: '/admin/activity', icon: <History className="w-4 h-4" /> },
      { label: 'Settings', to: '/admin/settings', icon: <Settings className="w-4 h-4" /> },
    ];
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleBadge = () => {
    if (role === 'donor') {
      return (
        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
          Food Donor
        </span>
      );
    }
    if (role === 'recipient') {
      return (
        <span className="bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
          Recipient Org
        </span>
      );
    }
    return (
      <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
        System Admin
      </span>
    );
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#1b4332] text-slate-100 selection:bg-brand-leaf">
      {/* Brand Header */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-leaf flex items-center justify-center text-white font-bold shadow">
            🌱
          </div>
          <div>
            <span className="font-extrabold text-lg text-white tracking-tight">
              Share<span className="text-brand-300">Bite</span>
            </span>
            <div className="flex items-center gap-1.5 -mt-1">
              {getRoleBadge()}
            </div>
          </div>
        </Link>
        <button
          onClick={() => setMobileSidebarOpen(false)}
          className="md:hidden text-white/70 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Active User Card */}
      {user && (
        <div className="p-4 mx-3 my-3 rounded-xl bg-white/5 border border-white/10 text-xs">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/30 text-emerald-300 font-bold flex items-center justify-center shrink-0 border border-emerald-500/20">
              {user.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-white truncate">{user.name}</p>
              <p className="text-[11px] text-brand-200 truncate flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 shrink-0" />
                {user.area || user.city}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-300/60">
          Main Navigation
        </p>
        {navItems.map(item => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileSidebarOpen(false)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-brand-leaf text-white shadow-sm'
                  : 'text-brand-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-white text-brand-800' : 'bg-amber-400 text-slate-900'
                }`}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-white/10 space-y-1">
        <Link
          to="/"
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-brand-200 hover:bg-white/5 hover:text-white transition-colors"
        >
          <Building2 className="w-4 h-4" />
          <span>Public Landing Page</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-rose-300 hover:bg-rose-500/20 hover:text-rose-100 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5]">
      {/* Top Demo Banner */}
      <DemoBanner />

      <div className="flex-1 flex overflow-hidden">
        {/* Fixed Desktop Left Sidebar */}
        <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:top-[38px] md:bottom-0 md:left-0 z-30 shadow-xl border-r border-brand-900/10">
          {sidebarContent}
        </aside>

        {/* Mobile Header Bar */}
        <div className="md:hidden fixed top-[38px] left-0 right-0 z-20 bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg"
              aria-label="Open sidebar menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-bold text-slate-900 text-sm">
              Share<span className="text-brand-leaf">Bite</span> Dashboard
            </span>
          </div>
          {getRoleBadge()}
        </div>

        {/* Mobile Collapsible Sidebar Modal */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="relative w-72 max-w-xs flex-1 z-10 animate-fade-in">
              {sidebarContent}
            </div>
          </div>
        )}

        {/* Independent Scrollable Main Content Area */}
        <main className="flex-1 md:ml-64 pt-12 md:pt-0 overflow-y-auto min-h-[calc(100vh-38px)] flex flex-col justify-between">
          <div className="p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto space-y-6">
            {children}
          </div>

          {/* Discreet Footer Notice */}
          <div className="border-t border-slate-200/80 bg-white/70 py-4 px-6 text-center text-xs text-slate-500">
            ShareBite Platform Coordination System &bull; Fictional Demo Instance for Hackathon Demonstration
          </div>
        </main>
      </div>
    </div>
  );
};

