import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { EmployeeSidebar } from '../components/EmployeeSidebar';
import { storage } from '../utils/storage';
import { User } from '../types';

export const EmployeeLayout: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User>(storage.getCurrentUser());

  const handleRoleSwitch = (role: 'employee' | 'admin') => {
    if (role === 'admin') {
      const adminUser = storage.getUsers().find((u) => u.role === 'admin') || storage.getCurrentUser();
      storage.setCurrentUser({ ...adminUser, role: 'admin' });
      navigate('/admin/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  const handleUserChange = (newUser: User) => {
    storage.setCurrentUser(newUser);
    setCurrentUser(newUser);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Header Navbar */}
      <Navbar
        currentUser={currentUser}
        onRoleSwitch={handleRoleSwitch}
        onUserChange={handleUserChange}
      />

      {/* Main Content Area with Sidebar */}
      <div className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        <EmployeeSidebar />
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">CARPOOL ENTERPRISE</span>
            <span>•</span>
            <span>“Ride Together, Save Together”</span>
          </div>
          <p>© 2026 Odoo Pvt. Ltd. Corporate Mobility & Carpooling System.</p>
        </div>
      </footer>
    </div>
  );
};
