import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Route, Search, Filter, Eye, Navigation, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { storage } from '../utils/storage';
import { useToast } from '../components/Toast';

export const AdminRidesPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const rides = storage.getRides();

  const filtered = rides.filter((r) => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        r.driverName.toLowerCase().includes(q) ||
        r.startLocation.toLowerCase().includes(q) ||
        r.destinationLocation.toLowerCase().includes(q) ||
        r.vehicleModel.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Fleet Rides & Trajectory Oversight</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time monitoring of all scheduled, active, and completed carpool journeys
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search route, driver, car..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl py-2 pl-10 pr-3 text-xs text-white placeholder-slate-500 w-64"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white"
          >
            <option value="all">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Rides Table */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950/70 text-slate-400 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-4 px-5">Ride ID</th>
                <th className="py-4 px-5">Driver</th>
                <th className="py-4 px-5">Corridor Route</th>
                <th className="py-4 px-5">Date & Time</th>
                <th className="py-4 px-5">Available / Total</th>
                <th className="py-4 px-5">Fare</th>
                <th className="py-4 px-5">Status</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filtered.map((ride) => (
                <tr key={ride.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-4 px-5 font-bold text-cyan-300 font-sans text-xs">
                    {ride.id}
                  </td>
                  <td className="py-4 px-5 text-white font-sans font-semibold">
                    <div>{ride.driverName}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{ride.vehicleModel}</div>
                  </td>
                  <td className="py-4 px-5 text-slate-200 font-sans">
                    {ride.startLocation.split(',')[0]} → {ride.destinationLocation.split(',')[0]}
                  </td>
                  <td className="py-4 px-5 text-slate-400 text-[11px]">
                    <div>{ride.departureTime}</div>
                    <div className="text-[10px] text-slate-500">{ride.departureDate}</div>
                  </td>
                  <td className="py-4 px-5 text-slate-300">
                    <span className="font-bold text-white">{ride.availableSeats}</span> / {ride.totalSeats} seats
                  </td>
                  <td className="py-4 px-5 font-bold text-emerald-400 text-sm">
                    ₹{ride.farePerSeat}
                  </td>
                  <td className="py-4 px-5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        ride.status === 'active'
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 animate-pulse'
                          : ride.status === 'scheduled'
                          ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {ride.status}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right font-sans">
                    <button
                      onClick={() => navigate('/live-tracking')}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-white transition"
                      title="Inspect Live Track"
                    >
                      <Navigation className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
