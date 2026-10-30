import React from 'react';
import { ListingStatus, RequestStatus, ReportStatus, FoodType } from '../../types';

interface BadgeProps {
  status: ListingStatus | RequestStatus | ReportStatus | FoodType | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, size = 'sm', className = '' }) => {
  let colorStyles = 'bg-slate-100 text-slate-700 border-slate-200';

  switch (status) {
    // Listing statuses
    case 'Available':
      colorStyles = 'bg-emerald-50 text-emerald-800 border-emerald-200 ring-1 ring-emerald-600/10';
      break;
    case 'Partially Reserved':
      colorStyles = 'bg-amber-50 text-amber-800 border-amber-200 ring-1 ring-amber-600/10';
      break;
    case 'Fully Reserved':
      colorStyles = 'bg-indigo-50 text-indigo-800 border-indigo-200 ring-1 ring-indigo-600/10';
      break;
    case 'Completed':
      colorStyles = 'bg-blue-50 text-blue-800 border-blue-200 ring-1 ring-blue-600/10';
      break;
    case 'Expired':
      colorStyles = 'bg-rose-50 text-rose-800 border-rose-200 ring-1 ring-rose-600/10';
      break;
    case 'Removed':
      colorStyles = 'bg-gray-100 text-gray-600 border-gray-300';
      break;

    // Request statuses
    case 'Pending':
      colorStyles = 'bg-amber-50 text-amber-800 border-amber-300 ring-1 ring-amber-600/10';
      break;
    case 'Accepted':
      colorStyles = 'bg-teal-50 text-teal-800 border-teal-300 ring-1 ring-teal-600/10';
      break;
    case 'Rejected':
      colorStyles = 'bg-rose-50 text-rose-800 border-rose-200';
      break;
    case 'Cancelled':
      colorStyles = 'bg-slate-100 text-slate-600 border-slate-300';
      break;

    // Dietary
    case 'Vegetarian':
      colorStyles = 'bg-green-50 text-green-700 border-green-300';
      break;
    case 'Vegan':
      colorStyles = 'bg-emerald-50 text-emerald-700 border-emerald-300';
      break;
    case 'Non-vegetarian':
      colorStyles = 'bg-red-50 text-red-700 border-red-300';
      break;

    // Report
    case 'Under Review':
      colorStyles = 'bg-amber-50 text-amber-800 border-amber-300';
      break;
    case 'Resolved':
      colorStyles = 'bg-emerald-50 text-emerald-800 border-emerald-300';
      break;
    case 'Dismissed':
      colorStyles = 'bg-slate-100 text-slate-600 border-slate-300';
      break;

    default:
      colorStyles = 'bg-slate-100 text-slate-700 border-slate-200';
  }

  const sizeStyles = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs font-semibold',
    lg: 'px-3.5 py-1.5 text-sm font-semibold',
  }[size];

  return (
    <span
      className={`inline-flex items-center justify-center font-medium rounded-full border ${sizeStyles} ${colorStyles} ${className}`}
    >
      {status}
    </span>
  );
};

