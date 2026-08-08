import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import { storage } from './utils/storage';
import { User } from './types';

// Layouts
import { EmployeeLayout } from './layouts/EmployeeLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Pages
import { SplashScreen } from './pages/SplashScreen';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { EmployeeDashboardPage } from './pages/EmployeeDashboardPage';
import { FindRidePage } from './pages/FindRidePage';
import { RouteConfirmationPage } from './pages/RouteConfirmationPage';
import { LiveTrackingPage } from './pages/LiveTrackingPage';
import { MyTripsPage } from './pages/MyTripsPage';
import { TripDetailsPage } from './pages/TripDetailsPage';
import { TripFinishPaymentPage } from './pages/TripFinishPaymentPage';
import { OfferRidePage } from './pages/OfferRidePage';
import { MyVehiclePage } from './pages/MyVehiclePage';
import { WalletPage } from './pages/WalletPage';
import { PaymentMethodsPage } from './pages/PaymentMethodsPage';
import { RideHistoryPage } from './pages/RideHistoryPage';
import { SettingsPage } from './pages/SettingsPage';
import { ReportsPage } from './pages/ReportsPage';
import { HelpChatPage } from './pages/HelpChatPage';

// Admin Pages
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminEmployeesPage } from './pages/AdminEmployeesPage';
import { AdminVehiclesPage } from './pages/AdminVehiclesPage';
import { AdminRidesPage } from './pages/AdminRidesPage';
import { AdminReportsPage } from './pages/AdminReportsPage';
import { AdminSettingsPage } from './pages/AdminSettingsPage';

export function App() {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    storage.init();
    return storage.getCurrentUser();
  });

  useEffect(() => {
    storage.init();
    const handleStorage = () => {
      setCurrentUser(storage.getCurrentUser());
    };
    window.addEventListener('carpool_storage_update', handleStorage);
    return () => window.removeEventListener('carpool_storage_update', handleStorage);
  }, []);

  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* Public & Authentication Flow */}
          <Route path="/" element={<SplashScreen />} />
          <Route path="/login" element={<LoginPage onLoginSuccess={(u: User) => setCurrentUser(u)} />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* Employee Routes */}
          <Route element={<EmployeeLayout />}>
            <Route path="/dashboard" element={<EmployeeDashboardPage />} />
            <Route path="/find-ride" element={<FindRidePage />} />
            <Route path="/route-confirmation" element={<RouteConfirmationPage />} />
            <Route path="/live-tracking" element={<LiveTrackingPage />} />
            <Route path="/my-trips" element={<MyTripsPage />} />
            <Route path="/trip-details" element={<TripDetailsPage />} />
            <Route path="/trip-finish" element={<TripFinishPaymentPage />} />
            <Route path="/offer-ride" element={<OfferRidePage />} />
            <Route path="/my-vehicle" element={<MyVehiclePage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/payment-methods" element={<PaymentMethodsPage />} />
            <Route path="/ride-history" element={<RideHistoryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/help-chat" element={<HelpChatPage />} />
          </Route>

          {/* Administrator Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="employees" element={<AdminEmployeesPage />} />
            <Route path="vehicles" element={<AdminVehiclesPage />} />
            <Route path="rides" element={<AdminRidesPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
