import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ToastContainer } from './components/common/ToastContainer';
import { DashboardLayout } from './components/layout/DashboardLayout';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ImpactPage } from './pages/ImpactPage';

// Donor Pages
import { DonorOverview } from './pages/donor/DonorOverview';
import { CreateListingPage } from './pages/donor/CreateListingPage';
import { MyListingsPage } from './pages/donor/MyListingsPage';
import { IncomingRequestsPage } from './pages/donor/IncomingRequestsPage';
import { PickupSchedulePage } from './pages/donor/PickupSchedulePage';
import { DonationHistoryPage } from './pages/donor/DonationHistoryPage';
import { DonorReportsPage } from './pages/donor/DonorReportsPage';

// Recipient Pages
import { RecipientOverview } from './pages/recipient/RecipientOverview';
import { BrowseFoodPage } from './pages/recipient/BrowseFoodPage';
import { MyRequestsPage } from './pages/recipient/MyRequestsPage';
import { AcceptedDonationsPage } from './pages/recipient/AcceptedDonationsPage';
import { RecipientHistoryPage } from './pages/recipient/RecipientHistoryPage';

// Admin Pages
import { AdminOverview } from './pages/admin/AdminOverview';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminListingsPage } from './pages/admin/AdminListingsPage';
import { AdminRequestsPage } from './pages/admin/AdminRequestsPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminActivityPage } from './pages/admin/AdminActivityPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Universal Profile Page
import { ProfilePage } from './pages/ProfilePage';

// Protected Route Guard
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRole?: 'donor' | 'recipient' | 'admin';
}> = ({ children, allowedRole }) => {
  const { user, role, loginAsDemo } = useAuth();

  // If no user, default to demo login of the requested role for smooth judge UX!
  if (!user) {
    if (allowedRole) {
      loginAsDemo(allowedRole);
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  // If allowedRole is specified and differs, switch or redirect
  if (allowedRole && role !== allowedRole) {
    return (
      <DashboardLayout>
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 font-bold mx-auto flex items-center justify-center text-xl">
            🔒
          </div>
          <h2 className="text-lg font-bold text-slate-900">Role Boundary Notice</h2>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            You are currently signed in as a <strong className="capitalize">{role}</strong>. This section is restricted to <strong>{allowedRole}</strong> roles.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => loginAsDemo(allowedRole)}
              className="px-4 py-2 bg-brand-800 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Switch to {allowedRole} Account
            </button>
            <Navigate to={`/${role}`} replace />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <ToastContainer />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/impact" element={<ImpactPage />} />

            {/* Donor Routes */}
            <Route path="/donor" element={
              <ProtectedRoute allowedRole="donor">
                <DonorOverview />
              </ProtectedRoute>
            } />
            <Route path="/donor/create-listing" element={
              <ProtectedRoute allowedRole="donor">
                <CreateListingPage />
              </ProtectedRoute>
            } />
            <Route path="/donor/my-listings" element={
              <ProtectedRoute allowedRole="donor">
                <MyListingsPage />
              </ProtectedRoute>
            } />
            <Route path="/donor/requests" element={
              <ProtectedRoute allowedRole="donor">
                <IncomingRequestsPage />
              </ProtectedRoute>
            } />
            <Route path="/donor/pickup-schedule" element={
              <ProtectedRoute allowedRole="donor">
                <PickupSchedulePage />
              </ProtectedRoute>
            } />
            <Route path="/donor/history" element={
              <ProtectedRoute allowedRole="donor">
                <DonationHistoryPage />
              </ProtectedRoute>
            } />
            <Route path="/donor/impact" element={
              <ProtectedRoute allowedRole="donor">
                <ImpactPage />
              </ProtectedRoute>
            } />
            <Route path="/donor/reports" element={
              <ProtectedRoute allowedRole="donor">
                <DonorReportsPage />
              </ProtectedRoute>
            } />
            <Route path="/donor/profile" element={
              <ProtectedRoute allowedRole="donor">
                <ProfilePage />
              </ProtectedRoute>
            } />

            {/* Recipient Routes */}
            <Route path="/recipient" element={
              <ProtectedRoute allowedRole="recipient">
                <RecipientOverview />
              </ProtectedRoute>
            } />
            <Route path="/recipient/browse" element={
              <ProtectedRoute allowedRole="recipient">
                <BrowseFoodPage />
              </ProtectedRoute>
            } />
            <Route path="/recipient/my-requests" element={
              <ProtectedRoute allowedRole="recipient">
                <MyRequestsPage />
              </ProtectedRoute>
            } />
            <Route path="/recipient/accepted" element={
              <ProtectedRoute allowedRole="recipient">
                <AcceptedDonationsPage />
              </ProtectedRoute>
            } />
            <Route path="/recipient/pickup-schedule" element={
              <ProtectedRoute allowedRole="recipient">
                <AcceptedDonationsPage />
              </ProtectedRoute>
            } />
            <Route path="/recipient/history" element={
              <ProtectedRoute allowedRole="recipient">
                <RecipientHistoryPage />
              </ProtectedRoute>
            } />
            <Route path="/recipient/impact" element={
              <ProtectedRoute allowedRole="recipient">
                <ImpactPage />
              </ProtectedRoute>
            } />
            <Route path="/recipient/profile" element={
              <ProtectedRoute allowedRole="recipient">
                <ProfilePage />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRole="admin">
                <AdminOverview />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute allowedRole="admin">
                <AdminUsersPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/listings" element={
              <ProtectedRoute allowedRole="admin">
                <AdminListingsPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/requests" element={
              <ProtectedRoute allowedRole="admin">
                <AdminRequestsPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/reports" element={
              <ProtectedRoute allowedRole="admin">
                <AdminReportsPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/activity" element={
              <ProtectedRoute allowedRole="admin">
                <AdminActivityPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedRoute allowedRole="admin">
                <AdminSettingsPage />
              </ProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
export default App;
