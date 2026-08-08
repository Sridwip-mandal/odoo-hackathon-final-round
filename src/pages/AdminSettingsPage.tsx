import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Sliders,
  Building2,
  Fuel,
  DollarSign,
  Save,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { storage } from '../utils/storage';
import { useToast } from '../components/Toast';
import { CompanySettings } from '../types';

export const AdminSettingsPage: React.FC = () => {
  const toast = useToast();
  const [settings, setSettings] = useState<CompanySettings>(storage.getSettings());
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      storage.setSettings(settings);
      toast.success('Settings Saved Successfully.', 'Organization mobility configurations updated across enterprise.');
    }, 600);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* Top 3 KPI Header Metric Cards matching wireframe page 18 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-800 bg-slate-900 shadow-xl space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Employees</span>
          <h3 className="text-3xl font-extrabold text-blue-400 font-mono">48</h3>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-slate-800 bg-slate-900 shadow-xl space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Registered Vehicles</span>
          <h3 className="text-3xl font-extrabold text-cyan-400 font-mono">22</h3>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-slate-800 bg-slate-900 shadow-xl space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Rides This Month</span>
          <h3 className="text-3xl font-extrabold text-purple-400 font-mono">163</h3>
        </div>
      </div>

      {/* Sub-Navigation Tabs matching wireframe: Employees, Vehicles, Settings */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <NavLink
          to="/admin/employees"
          className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-bold transition"
        >
          Employees
        </NavLink>
        <NavLink
          to="/admin/vehicles"
          className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-bold transition"
        >
          Vehicles
        </NavLink>
        <NavLink
          to="/admin/settings"
          className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-md shadow-purple-600/30"
        >
          Settings
        </NavLink>
      </div>

      {/* Main Settings Form matching wireframe page 18 */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Company Details matching wireframe */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-purple-400" />
            <span>Company Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Company Name</label>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-white"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Industry</label>
              <input
                type="text"
                value={settings.industry}
                onChange={(e) => setSettings({ ...settings, industry: e.target.value })}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-white"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Registered Address</label>
              <input
                type="text"
                value={settings.registeredAddress}
                onChange={(e) => setSettings({ ...settings, registeredAddress: e.target.value })}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-white"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Admin Contact</label>
              <input
                type="email"
                value={settings.adminContact}
                onChange={(e) => setSettings({ ...settings, adminContact: e.target.value })}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Carpooling Configuration matching wireframe page 18 */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Fuel className="w-5 h-5 text-cyan-400" />
            <span>Carpooling Configuration & Operational Benchmarks</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* Fuel Cost / Liter: Rs. 96.50 */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <label className="text-[11px] font-bold uppercase text-slate-400 block">Fuel Cost / Liter</label>
              <div className="flex items-center gap-1.5 pt-1">
                <span className="font-mono font-bold text-slate-400 text-sm">Rs.</span>
                <input
                  type="number"
                  step="0.1"
                  value={settings.fuelCostPerLiter}
                  onChange={(e) => setSettings({ ...settings, fuelCostPerLiter: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white font-mono font-extrabold text-base"
                />
              </div>
            </div>

            {/* Cost Per KM: Rs. 8.00 */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <label className="text-[11px] font-bold uppercase text-slate-400 block">Cost Per KM</label>
              <div className="flex items-center gap-1.5 pt-1">
                <span className="font-mono font-bold text-slate-400 text-sm">Rs.</span>
                <input
                  type="number"
                  step="0.5"
                  value={settings.costPerKm}
                  onChange={(e) => setSettings({ ...settings, costPerKm: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white font-mono font-extrabold text-base"
                />
              </div>
            </div>

            {/* Travel Cost (Operational): Rs. 2.50 / Km */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <label className="text-[11px] font-bold uppercase text-slate-400 block">Travel Cost (Operational)</label>
              <div className="flex items-center gap-1.5 pt-1">
                <span className="font-mono font-bold text-slate-400 text-sm">Rs.</span>
                <input
                  type="number"
                  step="0.1"
                  value={settings.travelCostOperational}
                  onChange={(e) => setSettings({ ...settings, travelCostOperational: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white font-mono font-extrabold text-base"
                />
                <span className="text-[10px] text-slate-400 font-mono">/ Km</span>
              </div>
            </div>
          </div>

          {/* Default Carpooling Policy */}
          <div className="pt-2 text-xs">
            <label className="text-slate-300 font-semibold block mb-1">Default Carpooling Policy & Terms</label>
            <textarea
              rows={3}
              value={settings.defaultCarpoolingPolicy}
              onChange={(e) => setSettings({ ...settings, defaultCarpoolingPolicy: e.target.value })}
              className="w-full rounded-2xl bg-slate-950 border border-slate-800 p-3 text-white focus:border-purple-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Save Settings Button matching wireframe */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-xl shadow-purple-600/30 transition hover:scale-105 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                <span>Saving Configurations...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
