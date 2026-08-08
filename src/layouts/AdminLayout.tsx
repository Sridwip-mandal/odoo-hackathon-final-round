import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AdminNavbar } from '../components/AdminNavbar';
import { AdminSidebar } from '../components/AdminSidebar';
import { storage } from '../utils/storage';
import { User } from '../types';

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser] = useState<User>(storage.getCurrentUser());

  const handleRoleSwitch = (role: 'employee' | 'admin') => {
    if (role === 'employee') {
      const empUser = storage.getUsers().find((u) => u.role === 'employee') || storage.getCurrentUser();
      storage.setCurrentUser({ ...empUser, role: 'employee' });
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* Admin Header */}
      <AdminNavbar currentUser={currentUser} onRoleSwitch={handleRoleSwitch} />

      {/* Main Governance Content Layout */}
      <div className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        <AdminSidebar />
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>

      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-purple-300">CARPOOL ADMIN GOVERNANCE CONSOLE</span>
          </div>
          <p>© 2026 Enterprise Carpooling Infrastructure.</p>
        </div>
      </footer>
    </div>
  );
};
