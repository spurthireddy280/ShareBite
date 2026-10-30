import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, ExternalLink, Leaf } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-leaf flex items-center justify-center text-white font-bold">
                🌱
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                Share<span className="text-brand-leaf">Bite</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              "Good Food Deserves a Second Chance." Connecting commercial kitchens, restaurants, bakeries, and caterers with verified charities and community shelters to fight hunger and eliminate food waste.
            </p>
            <div className="flex items-center gap-2 text-xs text-brand-300 font-medium">
              <ShieldCheck className="w-4 h-4 text-brand-leaf" />
              <span>Two-sided verified pickup handover protocol</span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="/#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <Link to="/recipient/browse" className="hover:text-white transition-colors">
                  Discover Surplus Food
                </Link>
              </li>
              <li>
                <Link to="/impact" className="hover:text-white transition-colors">
                  Impact & Meal Analytics
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">
                  Register as Donor or Recipient
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Demo Role Switcher
                </Link>
              </li>
            </ul>
          </div>

          {/* Safety & Compliance */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">
              Safety & Governance
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="/#safety" className="hover:text-white transition-colors">
                  Food Safety Guidelines
                </a>
              </li>
              <li>
                <span className="text-slate-400">FSSAI / Local Hygiene Best Practices</span>
              </li>
              <li>
                <span className="text-slate-400">Thermal Packaging Requirements</span>
              </li>
              <li>
                <span className="text-slate-400">Allergen Transparency</span>
              </li>
              <li>
                <span className="text-slate-400">Community Trust & Incident Reporting</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} ShareBite — HACK-P197 Food Donation & Distribution Platform. Built with React & Tailwind CSS.
          </p>
          <p className="text-[11px] max-w-xl text-center md:text-right text-slate-400">
            ShareBite is a coordination tool and does not guarantee or certify food quality. Participants must verify safety conditions prior to distribution.
          </p>
        </div>
      </div>
    </footer>
  );
};
