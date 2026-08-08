import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  CalendarDays,
  PlusCircle,
  History,
  Car,
  Wallet,
  CreditCard,
  Settings,
  BarChart3,
  HelpCircle,
  Compass,
} from 'lucide-react';

export const EmployeeSidebar: React.FC = () => {
  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/find-ride', label: 'Find Ride', icon: Search },
    { to: '/my-trips', label: 'My Trips', icon: CalendarDays },
    { to: '/offer-ride', label: 'Offer Ride', icon: PlusCircle },
    { to: '/ride-history', label: 'Ride History', icon: History },
    { to: '/my-vehicle', label: 'My Vehicle', icon: Car },
    { to: '/wallet', label: 'Wallet', icon: Wallet },
    { to: '/payment-methods', label: 'Payment Methods', icon: CreditCard },
    { to: '/settings', label: 'Settings', icon: Settings },
    { to: '/reports', label: 'Reports & Analytics', icon: BarChart3 },
    { to: '/help-chat', label: 'Help & Chat', icon: HelpCircle },
  ];

  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-20 rounded-2xl border border-slate-800/80 bg-slate-950/80 p-3.5 backdrop-blur-xl shadow-xl space-y-1">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Main Navigation
        </div>

        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}

        {/* Quick Quick-Action Banner */}
        <div className="pt-4 mt-4 border-t border-slate-800/80 px-2 pb-2">
          <div className="rounded-xl bg-gradient-to-br from-blue-950/70 to-slate-900 border border-blue-500/30 p-3 text-xs">
            <p className="font-bold text-blue-400">Carpool & Save Fuel</p>
            <p className="mt-1 text-[11px] text-slate-300 leading-relaxed">
              Earn ₹8.00/km corporate reimbursement per pooled colleague.
            </p>
            <NavLink
              to="/offer-ride"
              className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold shadow transition"
            >
              <PlusCircle className="w-3 h-3" />
              <span>Publish Trip</span>
            </NavLink>
          </div>
        </div>
      </div>
    </aside>
  );
};
