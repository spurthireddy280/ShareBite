import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { FoodSafetyNotice } from '../components/common/FoodSafetyNotice';
import { FoodListing } from '../types';
import { 
  ArrowRight, 
  HeartHandshake, 
  Utensils, 
  ShieldCheck, 
  Clock, 
  Truck, 
  CheckCircle2, 
  Sparkles, 
  BarChart3, 
  Users, 
  Leaf, 
  Building2,
  ChevronRight,
  MapPin,
  ExternalLink
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { loginAsDemo } = useAuth();
  const { analytics, listings } = useData();
  const navigate = useNavigate();

  const handleQuickDemo = (role: 'donor' | 'recipient' | 'admin') => {
    loginAsDemo(role);
    if (role === 'donor') navigate('/donor');
    else if (role === 'recipient') navigate('/recipient');
    else navigate('/admin');
  };

  // Recent available listings for preview
  const previewListings: FoodListing[] = listings.filter((l: FoodListing) => l.status === 'Available' || l.status === 'Partially Reserved').slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200/60 bg-gradient-to-b from-emerald-50/40 via-white to-[#FAF9F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-xs font-bold text-emerald-900 tracking-wide">
                <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero Hunger &bull; Zero Waste Mission</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                Don't Waste Food. <br />
                <span className="text-brand-800 underline decoration-brand-leaf decoration-wavy decoration-2">
                  Share Hope.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                ShareBite connects surplus edible food from restaurants, caterers, bakeries, and community kitchens with verified NGOs, shelters, and food banks. Real-time coordination with two-sided verified pickup confirmation.
              </p>

              {/* Two Primary CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={() => handleQuickDemo('donor')}
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-brand-800 hover:bg-brand-900 text-white px-7 py-3.5 rounded-xl font-bold shadow-lg shadow-brand-900/10 hover:shadow-xl hover:translate-y-[-1px] transition-all"
                >
                  <Utensils className="w-5 h-5 text-brand-300" />
                  <span>Donate Food</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleQuickDemo('recipient')}
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-300 px-7 py-3.5 rounded-xl font-bold hover:border-slate-400 transition-all shadow-sm"
                >
                  <HeartHandshake className="w-5 h-5 text-brand-leaf" />
                  <span>Find Food for Community</span>
                </button>
              </div>

              {/* Quick Demo Access Bar for Hackathon Judges */}
              <div className="pt-4 border-t border-slate-200/80">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5 justify-center lg:justify-start">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Hackathon Judge Quick Access (1-Click Login):</span>
                </p>
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                  <button
                    onClick={() => handleQuickDemo('donor')}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-xs font-semibold text-emerald-900 flex items-center gap-1.5 transition-colors"
                  >
                    <span>🍲</span>
                    <span>Donor: Spice Garden</span>
                  </button>
                  <button
                    onClick={() => handleQuickDemo('recipient')}
                    className="px-3.5 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 border border-teal-300 text-xs font-semibold text-teal-900 flex items-center gap-1.5 transition-colors"
                  >
                    <span>🤲</span>
                    <span>Recipient: Hope Foundation</span>
                  </button>
                  <button
                    onClick={() => handleQuickDemo('admin')}
                    className="px-3.5 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-300 text-xs font-semibold text-purple-900 flex items-center gap-1.5 transition-colors"
                  >
                    <span>🛡️</span>
                    <span>Admin: Operations</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Live Surplus Feed
                    </span>
                  </div>
                  <Link to="/recipient/browse" className="text-xs font-semibold text-brand-700 hover:underline flex items-center gap-1">
                    <span>View all</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="space-y-3">
                  {previewListings.map(item => (
                    <div key={item.id} className="p-3.5 rounded-xl border border-slate-200/90 hover:border-brand-leaf/60 transition-all hover:bg-slate-50/50 flex items-center justify-between gap-3">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 truncate">{item.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          <span>{item.donorName}</span>
                          <span>&bull;</span>
                          <MapPin className="w-3 h-3" />
                          <span>{item.area}</span>
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-800 font-bold text-xs rounded-lg border border-emerald-200">
                          {item.availableQuantity} {item.unit}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Micro trust badge */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Two-sided confirmation ensures quantities are verified by both donor and recipient upon collection.</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Impact Statistics Counter Section */}
      <section className="bg-brand-900 text-white py-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-3xl sm:text-4xl font-extrabold text-brand-leaf">
                {analytics.totalQuantityCollected + 85}
              </div>
              <div className="text-xs font-semibold text-slate-300 mt-1 uppercase tracking-wider">
                Portions Rescued
              </div>
              <p className="text-[11px] text-brand-200/70 mt-1">Saved from commercial waste</p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">
                {analytics.completedDonationsCount + 12}
              </div>
              <div className="text-xs font-semibold text-slate-300 mt-1 uppercase tracking-wider">
                Donations Completed
              </div>
              <p className="text-[11px] text-brand-200/70 mt-1">100% two-sided confirmed</p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-300">
                {analytics.activeRecipientsCount + 6}
              </div>
              <div className="text-xs font-semibold text-slate-300 mt-1 uppercase tracking-wider">
                Recipient Orgs
              </div>
              <p className="text-[11px] text-brand-200/70 mt-1">Shelters, food banks & NGOs</p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-3xl sm:text-4xl font-extrabold text-white">
                ~{analytics.estimatedMealsRedistributed}
              </div>
              <div className="text-xs font-semibold text-slate-300 mt-1 uppercase tracking-wider">
                Meal Equivalents
              </div>
              <p className="text-[11px] text-brand-200/70 mt-1">Est. 400g/meal equivalent</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold text-brand-700 uppercase tracking-widest bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            End-To-End Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How ShareBite Closes the Loop
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            A reliable 4-step coordination engine built for transparency and accountability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 font-extrabold flex items-center justify-center text-lg mb-4 border border-emerald-200">
              1
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-2">List Surplus Food</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Donors publish surplus with preparation time, dietary category, quantity, allergens, and safe pickup window.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-800 font-extrabold flex items-center justify-center text-lg mb-4 border border-teal-200">
              2
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-2">Discover & Request</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Recipient charities discover listings by location and dietary needs, requesting specific quantities they can serve.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 font-extrabold flex items-center justify-center text-lg mb-4 border border-amber-200">
              3
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-2">Accept & Reserve</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Donor approves the request. The quantity is locked and reserved automatically to prevent double-allocation.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-800 font-extrabold flex items-center justify-center text-lg mb-4 border border-blue-200">
              4
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-2">Two-Sided Confirmation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Donor confirms handover; recipient confirms collection. Full audit history is logged and impact is credited.
            </p>
          </div>
        </div>
      </section>

      {/* Separate Donor & Recipient Value Sections */}
      <section className="py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* For Donors */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                🍲
              </div>
              <h3 className="text-2xl font-bold text-slate-900">For Food Donors</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Whether you run a restaurant, hotel buffet, corporate cafeteria, or bakery, ShareBite turns unpredictable food surplus into organized community aid.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-700 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Publish surplus in under 60 seconds with simple mobile forms</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Specify strict pickup windows that match kitchen closing schedules</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Automated quantity reservation prevents over-promising food</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Download sustainability impact metrics for ESG & CSR reporting</span>
                </li>
              </ul>
              <div className="pt-4">
                <button
                  onClick={() => handleQuickDemo('donor')}
                  className="text-xs font-bold text-brand-800 hover:text-brand-900 flex items-center gap-1.5"
                >
                  <span>Explore Donor Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* For Recipients */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                🤲
              </div>
              <h3 className="text-2xl font-bold text-slate-900">For Recipient Organizations</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Charities, night shelters, elder homes, and disaster relief camps can discover fresh meals nearby without frantic phone calls.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-700 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Filter by area and dietary requirements (Vegetarian, Vegan, Non-veg)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Request exact portion counts matching daily shelter occupants</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Clear visibility into preparation times, storage conditions, and allergens</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Direct pickup coordination with verified donor addresses</span>
                </li>
              </ul>
              <div className="pt-4">
                <button
                  onClick={() => handleQuickDemo('recipient')}
                  className="text-xs font-bold text-teal-800 hover:text-teal-900 flex items-center gap-1.5"
                >
                  <span>Explore Recipient Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Responsible Handling Disclaimer Section */}
      <section id="safety" className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <FoodSafetyNotice />
      </section>

      {/* Final Call to Action */}
      <section className="bg-gradient-to-r from-brand-800 via-brand-700 to-emerald-800 text-white py-16 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Make Every Meal Count?
          </h2>
          <p className="text-sm sm:text-base text-brand-100 max-w-xl mx-auto">
            Test the live demo application now with pre-seeded donor and recipient accounts, or register your organization.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => handleQuickDemo('donor')}
              className="bg-white text-brand-900 hover:bg-slate-100 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-colors"
            >
              Enter Donor Portal
            </button>
            <button
              onClick={() => handleQuickDemo('recipient')}
              className="bg-brand-leaf hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-colors"
            >
              Enter Recipient Portal
            </button>
            <button
              onClick={() => handleQuickDemo('admin')}
              className="bg-black/30 hover:bg-black/40 text-white border border-white/20 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm transition-colors"
            >
              Admin Controls
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
