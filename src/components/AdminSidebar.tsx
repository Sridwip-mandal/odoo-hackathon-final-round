import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Car,
  Route,
  BarChart3,
  Sliders,
  ShieldCheck,
  Fuel,
  Leaf,
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/employees', label: 'Employees', icon: Users },
    { to: '/admin/vehicles', label: 'Vehicles', icon: Car },
    { to: '/admin/rides', label: 'Rides', icon: Route },
    { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
    { to: '/admin/settings', label: 'Settings', icon: Sliders },
  ];

  return (
    <aside className="w-full md:w-60 shrink-0">
      <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3 backdrop-blur-xl shadow-xl space-y-1">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Governance Navigation
        </div>
        {adminLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}

        {/* Quick ESG environmental banner */}
        <div className="pt-4 mt-4 border-t border-slate-800/80 px-2 pb-2">
          <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/20 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-emerald-400">
              <Leaf className="w-3.5 h-3.5" />
              <span>ESG Impact Score</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-300 leading-relaxed">
              2,940 kg CO₂ reduced this month via corporate carpooling.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
