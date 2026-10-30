import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { FoodSafetyNotice } from '../components/common/FoodSafetyNotice';
import { Utensils, HeartHandshake, CheckCircle2, ArrowRight } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState<'donor' | 'recipient'>('donor');
  const [name, setName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [orgType, setOrgType] = useState('Restaurant');
  const [city, setCity] = useState('Bangalore');
  const [area, setArea] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [peopleServed, setPeopleServed] = useState<number>(100);
  const [safetyAgreed, setSafetyAgreed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!safetyAgreed) {
      setError('Please acknowledge the food safety & responsible handling statement.');
      return;
    }

    try {
      const newUser = register({
        email,
        role,
        name,
        contactPerson,
        phone,
        city,
        area: area || 'Central Area',
        address,
        orgType,
        description,
        peopleServed: role === 'recipient' ? Number(peopleServed) : undefined,
      });

      if (newUser.role === 'donor') navigate('/donor');
      else navigate('/recipient');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
  };

  const donorTypes = ['Restaurant', 'Hotel', 'Bakery', 'Caterer', 'Grocery Store', 'Community Kitchen', 'Other'];
  const recipientTypes = ['NGO', 'Charity', 'Shelter', 'Community Kitchen', 'Food Bank', 'Other'];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5]">
      <Navbar />

      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Register Your Organization
          </h2>
          <p className="text-sm text-slate-600">
            Join ShareBite to coordinate surplus food donations and build zero-waste communities.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-3 mb-6 bg-slate-200/70 p-1.5 rounded-2xl">
          <button
            type="button"
            onClick={() => {
              setRole('donor');
              setOrgType('Restaurant');
            }}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
              role === 'donor'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Utensils className="w-4 h-4 text-emerald-600" />
            <span>I am a Food Donor</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setRole('recipient');
              setOrgType('Shelter');
            }}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
              role === 'recipient'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HeartHandshake className="w-4 h-4 text-teal-600" />
            <span>I am a Recipient Org</span>
          </button>
        </div>

        {/* Registration Form */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Organization / Business Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={role === 'donor' ? 'e.g., Grand Seasons Hotel' : 'e.g., Hope Community Center'}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-700 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Person <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Full name of representative"
                  value={contactPerson}
                  onChange={e => setContactPerson(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-700 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Official Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="contact@organization.org"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-700 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 00000"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-700 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Organization Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={orgType}
                  onChange={e => setOrgType(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-700 bg-white"
                >
                  {(role === 'donor' ? donorTypes : recipientTypes).map(t => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  City & Locality / Area <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Indiranagar, Bangalore"
                  value={area}
                  onChange={e => setArea(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-700 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {role === 'donor' ? 'Pickup Address' : 'Facility / Delivery Address'} <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={2}
                placeholder="Complete street address for logistics and pickups"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-700 resize-none bg-white"
              />
            </div>

            {role === 'recipient' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Approximate People Served Daily
                  </label>
                  <input
                    type="number"
                    min={5}
                    value={peopleServed}
                    onChange={e => setPeopleServed(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-700 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Organization Mission / Summary
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Evening study center shelter"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-700 bg-white"
                  />
                </div>
              </div>
            )}

            {/* Mandatory Safety Agreement */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/70 border border-amber-200 cursor-pointer text-xs text-amber-950">
                <input
                  type="checkbox"
                  required
                  checked={safetyAgreed}
                  onChange={e => setSafetyAgreed(e.target.checked)}
                  className="mt-0.5 rounded text-brand-700 focus:ring-brand-700"
                />
                <span className="leading-relaxed">
                  <strong>Food Safety & Compliance Acknowledgement:</strong> I confirm that our organization will adhere to applicable food hygiene and safe storage standards. I understand that ShareBite facilitates donation coordination and does not certify food condition.
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-brand-800 hover:bg-brand-900 text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 mt-4"
            >
              <span>Complete Registration & Open Dashboard</span>
              <ArrowRight className="w-4 h-4 text-brand-300" />
            </button>
          </form>

          <div className="text-center pt-3 border-t border-slate-100 text-xs text-slate-600">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-brand-800 hover:underline">
              Sign in with your account or demo
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

