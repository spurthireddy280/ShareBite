import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Sparkles, ArrowRight, ShieldCheck, Lock, Mail, UserCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('donor@sharebite.org');
  const [password, setPassword] = useState('demo123');
  const [selectedRole, setSelectedRole] = useState<UserRole>('donor');
  const [error, setError] = useState('');

  const handleDemoLogin = (role: UserRole) => {
    loginAsDemo(role);
    if (role === 'donor') navigate('/donor');
    else if (role === 'recipient') navigate('/recipient');
    else navigate('/admin');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = login(email, selectedRole);
    if (success) {
      if (selectedRole === 'donor') navigate('/donor');
      else if (selectedRole === 'recipient') navigate('/recipient');
      else navigate('/admin');
    } else {
      setError('Unable to authenticate. Please check email or use 1-click demo login.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5]">
      <Navbar />

      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex w-12 h-12 rounded-2xl bg-brand-800 text-white items-center justify-center text-2xl shadow-md">
              🌱
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Sign in to ShareBite
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Select a pre-configured demo account or enter your credentials.
            </p>
          </div>

          {/* Quick Demo Access Buttons Card */}
          <div className="bg-emerald-50/70 border border-emerald-200/90 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Hackathon 1-Click Demo Access
              </span>
              <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-bold">
                Instant
              </span>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Judges can enter directly without passwords to test role workflows:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleDemoLogin('donor')}
                className="flex flex-col items-center p-3 rounded-xl bg-white hover:bg-emerald-100/60 border border-emerald-300 text-slate-800 text-center transition-all shadow-xs hover:shadow"
              >
                <span className="text-xl mb-1">🍲</span>
                <span className="text-xs font-bold text-slate-900">Food Donor</span>
                <span className="text-[10px] text-slate-500">Spice Garden</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('recipient')}
                className="flex flex-col items-center p-3 rounded-xl bg-white hover:bg-teal-100/60 border border-teal-300 text-slate-800 text-center transition-all shadow-xs hover:shadow"
              >
                <span className="text-xl mb-1">🤲</span>
                <span className="text-xs font-bold text-slate-900">Recipient Org</span>
                <span className="text-[10px] text-slate-500">Hope Foundation</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="flex flex-col items-center p-3 rounded-xl bg-white hover:bg-purple-100/60 border border-purple-300 text-slate-800 text-center transition-all shadow-xs hover:shadow"
              >
                <span className="text-xl mb-1">🛡️</span>
                <span className="text-xs font-bold text-slate-900">Admin</span>
                <span className="text-[10px] text-slate-500">Platform Ops</span>
              </button>
            </div>
          </div>

          {/* Regular Login Form */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                {error}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['donor', 'recipient', 'admin'] as UserRole[]).map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        setSelectedRole(r);
                        if (r === 'donor') setEmail('donor@sharebite.org');
                        else if (r === 'recipient') setEmail('recipient@sharebite.org');
                        else setEmail('admin@sharebite.org');
                      }}
                      className={`py-2 px-3 text-xs font-semibold rounded-xl border capitalize transition-all ${
                        selectedRole === r
                          ? 'bg-brand-800 text-white border-brand-800 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-700 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-700 bg-white"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  (Demo mode pre-fills valid credentials)
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-brand-800 hover:bg-brand-900 text-white font-bold text-sm rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4 text-brand-300" />
              </button>
            </form>

            <div className="text-center pt-2 border-t border-slate-100">
              <p className="text-xs text-slate-600">
                Don't have an organization account?{' '}
                <Link to="/register" className="font-bold text-brand-800 hover:underline">
                  Register here
                </Link>
              </p>
            </div>
          </div>

          <div className="text-center text-[11px] text-slate-500">
            Fictional demo data. Does not store real private credentials.
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

