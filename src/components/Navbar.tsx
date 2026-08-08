import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Car,
  Search,
  Bell,
  User as UserIcon,
  Shield,
  LogOut,
  ChevronDown,
  Menu,
  X,
  CreditCard,
  History,
  Settings,
  BarChart3,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { storage } from '../utils/storage';
import { User } from '../types';
import { NotificationDropdown } from './NotificationDropdown';
import { GlobalSearchModal } from './GlobalSearchModal';

interface NavbarProps {
  currentUser: User;
  onRoleSwitch: (role: 'employee' | 'admin') => void;
  onUserChange: (user: User) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentUser, onRoleSwitch, onUserChange }) => {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const allUsers = storage.getUsers();

  const handleLogout = () => {
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/my-trips', label: 'My Trips' },
    { to: '/ride-history', label: 'Ride History' },
    { to: '/my-vehicle', label: 'My Vehicle' },
    { to: '/wallet', label: 'Wallet' },
    { to: '/settings', label: 'Setting' },
    { to: '/reports', label: 'Report' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl shadow-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              aria-label="Toggle menu"
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <NavLink to="/dashboard" className="flex items-center gap-2.5 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 text-white shadow-lg shadow-blue-500/25 transition-transform group-hover:scale-105">
                <Car className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold tracking-tight text-white text-lg">CARPOOL</span>
                  <span className="rounded-md bg-blue-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-blue-400 border border-blue-500/20">
                    ENTERPRISE
                  </span>
                </div>
                <span className="text-[10px] font-medium text-slate-400 tracking-wider">
                  Ride Together, Save Together
                </span>
              </div>
            </NavLink>
          </div>

          {/* Desktop Navigation Links (matching wireframes) */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/80">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Icons & User Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Global Search Button */}
            <button
              onClick={() => setShowSearch(true)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition text-xs"
              title="Search anything (Ctrl+K)"
            >
              <Search className="w-4 h-4 text-cyan-400" />
              <span className="hidden md:inline font-medium">Search...</span>
              <kbd className="hidden md:inline px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 rounded border border-slate-700">
                ⌘K
              </kbd>
            </button>

            {/* Notifications Center */}
            <NotificationDropdown />

            {/* Quick Role Switcher Pill */}
            <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
              <button
                onClick={() => onRoleSwitch('employee')}
                className={`px-2.5 py-1 rounded-lg font-medium transition ${
                  currentUser.role === 'employee'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Employee
              </button>
              <button
                onClick={() => onRoleSwitch('admin')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition ${
                  currentUser.role === 'admin'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Shield className="w-3 h-3 text-purple-300" />
                <span>Admin</span>
              </button>
            </div>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800/80 border border-transparent hover:border-slate-800 transition"
              >
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-lg object-cover ring-1 ring-blue-500/40"
                />
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-xs font-semibold text-white truncate max-w-[100px]">{currentUser.name}</span>
                  <span className="text-[10px] text-slate-400">{currentUser.department}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 p-2 shadow-2xl z-50 animate-slide-up">
                  <div className="p-3 border-b border-slate-800 bg-slate-950/50 rounded-xl mb-1">
                    <div className="font-bold text-white text-sm">{currentUser.name}</div>
                    <div className="text-xs text-slate-400 truncate">{currentUser.email}</div>
                    <div className="mt-2 flex items-center justify-between text-xs pt-2 border-t border-slate-800">
                      <span className="text-slate-400">Wallet Balance:</span>
                      <span className="font-mono font-bold text-emerald-400">₹{currentUser.walletBalance}</span>
                    </div>
                  </div>

                  <div className="py-1">
                    <p className="px-3 py-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                      Demo User Switcher
                    </p>
                    {allUsers.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          onUserChange(u);
                          setShowUserMenu(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition text-left ${
                          currentUser.id === u.id
                            ? 'bg-blue-600/20 text-blue-300 font-semibold border border-blue-500/30'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <img src={u.avatar} alt={u.name} className="w-5 h-5 rounded-full object-cover" />
                        <div className="flex-1 truncate">
                          <div>{u.name}</div>
                          <div className="text-[10px] text-slate-500">{u.role === 'admin' ? 'Administrator' : u.department}</div>
                        </div>
                        {currentUser.id === u.id && <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>}
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-800 mt-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate('/settings');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-slate-800"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      <span>Account Settings</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-rose-400 hover:bg-rose-950/40"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {showMobileMenu && (
          <div className="lg:hidden border-t border-slate-800 bg-slate-950 px-4 pt-2 pb-6 space-y-1 animate-slide-down">
            <div className="p-2 mb-2 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Switch Role:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onRoleSwitch('employee');
                    setShowMobileMenu(false);
                  }}
                  className={`px-3 py-1 text-xs rounded-lg ${
                    currentUser.role === 'employee' ? 'bg-blue-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Employee
                </button>
                <button
                  onClick={() => {
                    onRoleSwitch('admin');
                    setShowMobileMenu(false);
                  }}
                  className={`px-3 py-1 text-xs rounded-lg ${
                    currentUser.role === 'admin' ? 'bg-purple-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>

            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setShowMobileMenu(false)}
                className={({ isActive }) =>
                  `block px-4 py-2.5 text-sm font-medium rounded-xl transition ${
                    isActive ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-900'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      {showSearch && <GlobalSearchModal isOpen={showSearch} onClose={() => setShowSearch(false)} />}
    </>
  );
};
