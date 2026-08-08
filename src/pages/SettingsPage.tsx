import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import {
  Settings as SettingsIcon,
  CalendarDays,
  Car,
  CreditCard,
  History,
  MapPin,
  HelpCircle,
  MessageSquare,
  Lock,
  Save,
  ShieldCheck,
  PlusCircle,
  Trash2,
} from 'lucide-react';
import { storage } from '../utils/storage';
import { useToast } from '../components/Toast';
import { SavedPlace } from '../types';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [user, setUser] = useState(storage.getCurrentUser());
  const [savedPlaces, setSavedPlaces] = useState(storage.getSavedPlaces());
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [mobile, setMobile] = useState(user.mobile);
  const [department, setDepartment] = useState(user.department);
  const [manager, setManager] = useState(user.manager);
  const [officeLocation, setOfficeLocation] = useState(user.officeLocation);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPlaceAddress, setNewPlaceAddress] = useState('');
  const [newPlaceLabel, setNewPlaceLabel] = useState<'Home' | 'Office' | 'Gym' | 'Custom'>('Custom');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...user,
      name,
      email,
      mobile,
      department,
      manager,
      officeLocation,
    };
    setUser(updated);
    storage.updateUser(updated);
    toast.success('Settings Saved', 'Your profile and corporate preferences have been updated.');
  };

  const handleAddPlace = () => {
    if (!newPlaceAddress.trim()) return;
    const newPlace: SavedPlace = {
      id: `sp-${Date.now()}`,
      userId: user.id,
      label: newPlaceLabel,
      address: newPlaceAddress.trim(),
      coords: [22.5510, 88.3524],
    };
    const updated = [...savedPlaces, newPlace];
    setSavedPlaces(updated);
    storage.setSavedPlaces(updated);
    setNewPlaceAddress('');
    toast.success('Place Saved', `${newPlace.label} location added.`);
  };

  const handleDeletePlace = (id: string) => {
    const updated = savedPlaces.filter((p) => p.id !== id);
    setSavedPlaces(updated);
    storage.setSavedPlaces(updated);
    toast.info('Place Removed', 'Saved location removed.');
  };

  // Quick access navigation items matching wireframe page 2
  const quickAccessItems = [
    { label: 'My Trips', icon: CalendarDays, to: '/my-trips' },
    { label: 'My Vehicle', icon: Car, to: '/my-vehicle' },
    { label: 'Payment Method', icon: CreditCard, to: '/payment-methods' },
    { label: 'Ride History', icon: History, to: '/ride-history' },
    { label: 'Saved Places', icon: MapPin, to: '/settings' },
    { label: 'Help', icon: HelpCircle, to: '/help-chat' },
    { label: 'Chat', icon: MessageSquare, to: '/help-chat' },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Top Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-white">Application Settings & Preferences</h1>
        <p className="text-xs text-slate-400 mt-1">
          Centralizes application settings, corporate credentials, and frequently used modules
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Quick Access List matching wireframe page 2 (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 mb-2">
              Quick Access Modules
            </h3>
            {quickAccessItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={index}
                  to={item.to}
                  className="flex items-center gap-3 px-3.5 py-3 rounded-2xl bg-slate-950/80 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white border border-slate-800/80 transition"
                >
                  <div className="p-1.5 rounded-lg bg-slate-800 text-blue-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Saved Places Panel */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Saved Commute Places
            </h3>

            <div className="space-y-2">
              {savedPlaces.map((place) => (
                <div
                  key={place.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs"
                >
                  <div>
                    <span className="font-bold text-white block">{place.label}</span>
                    <span className="text-[11px] text-slate-400 truncate max-w-[180px] block">
                      {place.address}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeletePlace(place.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Place */}
            <div className="pt-2 space-y-2 text-xs">
              <input
                type="text"
                placeholder="e.g. Sector V, Salt Lake, Kolkata"
                value={newPlaceAddress}
                onChange={(e) => setNewPlaceAddress(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
              <button
                type="button"
                onClick={handleAddPlace}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center justify-center gap-1.5 transition"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Save New Location</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Profile Form matching wireframe (8 Cols) */}
        <div className="lg:col-span-8">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            <h3 className="text-base font-bold text-white mb-4">Employee Profile Details</h3>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Mobile Number</label>
                  <input
                    type="text"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Employee ID</label>
                  <input
                    type="text"
                    readOnly
                    value={user.employeeId}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-400 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Manager</label>
                  <input
                    type="text"
                    value={manager}
                    onChange={(e) => setManager(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Office Location</label>
                  <input
                    type="text"
                    value={officeLocation}
                    onChange={(e) => setOfficeLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold"
                >
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Change Password</span>
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/30 transition hover:scale-105"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-lg animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4 text-xs animate-scale-up">
            <h3 className="text-base font-bold text-white">Change Security Password</h3>
            <div className="space-y-3">
              <input
                type="password"
                placeholder="Current Password"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
              <input
                type="password"
                placeholder="New Password"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-3 py-1.5 text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toast.success('Password Updated', 'Your security password has been changed.');
                  setShowPasswordModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
