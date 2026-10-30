import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Badge } from '../components/common/Badge';
import { UserCircle, Building2, MapPin, Phone, Mail, ShieldCheck, Check } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useData();

  const [name, setName] = useState(user?.name || '');
  const [contactPerson, setContactPerson] = useState(user?.contactPerson || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [area, setArea] = useState(user?.area || '');
  const [city, setCity] = useState(user?.city || 'Bangalore');
  const [peopleServed, setPeopleServed] = useState(user?.peopleServed || 100);
  const [description, setDescription] = useState(user?.description || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim(),
      contactPerson: contactPerson.trim(),
      phone: phone.trim(),
      address: address.trim(),
      area: area.trim(),
      city: city.trim(),
      peopleServed: user.role === 'recipient' ? Number(peopleServed) : undefined,
      description: description.trim(),
    });
    setSavedSuccess(true);
    showToast('Profile Updated', 'Organization profile changes saved.', 'success');
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Organization Profile</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your organization information, contact details, and pickup location.
          </p>
        </div>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
        
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-12 h-12 rounded-xl bg-brand-800 text-white font-extrabold flex items-center justify-center text-xl">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">{user.name}</h2>
              <span className="capitalize text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{user.email} &bull; {user.orgType}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Organization Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-700 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Contact Representative Name
            </label>
            <input
              type="text"
              required
              value={contactPerson}
              onChange={e => setContactPerson(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-700 bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Contact Phone Number
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-700 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Locality / Service Area
            </label>
            <input
              type="text"
              required
              value={area}
              onChange={e => setArea(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-700 bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Complete Street / Pickup Address
          </label>
          <textarea
            rows={2}
            required
            value={address}
            onChange={e => setAddress(e.target.value)}
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-700 resize-none bg-white"
          />
        </div>

        {user.role === 'recipient' && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Average Number of People Served Daily
            </label>
            <input
              type="number"
              min={5}
              value={peopleServed}
              onChange={e => setPeopleServed(Number(e.target.value))}
              className="w-full max-w-xs px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-700 bg-white"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Mission Statement / Operational Notes
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-700 resize-none bg-white"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          {savedSuccess && (
            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
              <Check className="w-4 h-4" />
              Profile Saved
            </span>
          )}
          <button
            type="submit"
            className="px-6 py-2.5 bg-brand-800 hover:bg-brand-900 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors"
          >
            Save Changes
          </button>
        </div>

      </form>

    </div>
  );
};
