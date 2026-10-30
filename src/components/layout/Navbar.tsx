import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  HeartHandshake, 
  Menu, 
  X, 
  ArrowRight, 
  LayoutDashboard, 
  LogOut, 
  Sparkles,
  BarChart3,
  Search,
  ShieldCheck
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDashboardPath = () => {
    if (role === 'donor') return '/donor';
    if (role === 'recipient') return '/recipient';
    if (role === 'admin') return '/admin';
    return '/login';
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-800 to-brand-leaf flex items-center justify-center text-white shadow-md shadow-brand-900/10 group-hover:scale-105 transition-transform">
              <span className="text-xl">🌱</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-brand-800">
                  Share<span className="text-brand-leaf">Bite</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Rescue
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium hidden sm:block -mt-0.5">
                Good Food Deserves a Second Chance
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="/#how-it-works" className="hover:text-brand-700 transition-colors">
              How It Works
            </a>
            <Link to="/impact" className="hover:text-brand-700 transition-colors flex items-center gap-1">
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              Impact Analytics
            </Link>
            <a href="/#safety" className="hover:text-brand-700 transition-colors flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              Safety Standard
            </a>
            <Link to="/recipient/browse" className="hover:text-brand-700 transition-colors flex items-center gap-1">
              <Search className="w-4 h-4 text-slate-400" />
              Browse Surplus Food
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(getDashboardPath())}
                  className="flex items-center gap-2 bg-brand-800 hover:bg-brand-900 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all hover:shadow"
                >
                  <LayoutDashboard className="w-4 h-4 text-brand-300" />
                  <span>{role === 'admin' ? 'Admin Portal' : `${role === 'donor' ? 'Donor' : 'Recipient'} Dashboard`}</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  title="Sign out"
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-brand-800 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 bg-brand-800 hover:bg-brand-900 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 text-brand-300" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <a
            href="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-700"
          >
            How It Works
          </a>
          <Link
            to="/impact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-700"
          >
            Impact Analytics
          </Link>
          <a
            href="/#safety"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-700"
          >
            Safety Standard
          </a>
          <Link
            to="/recipient/browse"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-700"
          >
            Browse Surplus Food
          </Link>
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <>
                <button
                  onClick={() => {
                    navigate(getDashboardPath());
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2.5 bg-brand-800 text-white rounded-xl text-sm font-semibold"
                >
                  Go to {role} Dashboard
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    navigate('/');
                  }}
                  className="w-full text-center py-2 text-xs font-medium text-slate-500 hover:text-rose-600"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 border border-slate-300 text-slate-800 rounded-xl text-sm font-semibold"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 bg-brand-800 text-white rounded-xl text-sm font-semibold"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
