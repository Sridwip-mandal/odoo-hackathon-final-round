import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Building2, Shield, Bell, User as UserIcon, LogOut, ArrowLeftRight, ExternalLink } from 'lucide-react';
import { User, CompanySettings } from '../types';
import { NotificationDropdown } from './NotificationDropdown';
import { storage } from '../utils/storage';

interface AdminNavbarProps {
  currentUser: User;
  onRoleSwitch: (role: 'employee' | 'admin') => void;
}

export const AdminNavbar: React.FC<AdminNavbarProps> = ({ currentUser, onRoleSwitch }) => {
  const navigate = useNavigate();
  const settings = storage.getSettings();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl shadow-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Company Logo & Branding matching wireframe */}
        <div className="flex items-center gap-4">
          <NavLink to="/admin/dashboard" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white shadow-lg shadow-purple-500/25">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base tracking-tight">{settings.companyName}</span>
                <span className="rounded-md bg-purple-500/15 px-2 py-0.5 text-[10px] font-bold text-purple-300 border border-purple-500/30">
                  ADMIN CONSOLE
                </span>
              </div>
              <span className="text-[10px] text-slate-400">Enterprise Mobility & Carpool Governance</span>
            </div>
          </NavLink>
        </div>

          {/* Theme Toggle Button */}
          <button
            onClick={() => {
              const currentTheme = localStorage.getItem('carpool_theme') || 'dark';
              const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
              localStorage.setItem('carpool_theme', nextTheme);
              if (nextTheme === 'light') {
                document.documentElement.classList.remove('dark');
                document.documentElement.classList.add('light');
                document.body.classList.remove('dark');
                document.body.classList.add('light');
              } else {
                document.documentElement.classList.remove('light');
                document.documentElement.classList.add('dark');
                document.body.classList.remove('light');
                document.body.classList.add('dark');
              }
              window.dispatchEvent(new CustomEvent('carpool_store_event', { detail: { key: 'carpool_theme', theme: nextTheme } }));
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-yellow-400/10 border border-yellow-400/40 text-yellow-400 hover:bg-yellow-400 hover:text-black transition text-xs font-bold shadow-sm"
            title="Toggle Dark / Light Theme"
          >
            <span>Theme ☀️/🌙</span>
          </button>

          <button
            onClick={() => onRoleSwitch('employee')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-950/70 border border-blue-500/30 text-blue-300 hover:bg-blue-900/60 hover:text-white transition text-xs font-semibold"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Switch to Employee View</span>
          </button>

          <NotificationDropdown />

          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150"
              alt="Admin"
              className="w-8 h-8 rounded-lg object-cover ring-2 ring-purple-500/50"
            />
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-white">Admin Console</span>
              <span className="text-[10px] text-purple-400">Master Governance</span>
            </div>

            <button
              onClick={() => navigate('/login')}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
