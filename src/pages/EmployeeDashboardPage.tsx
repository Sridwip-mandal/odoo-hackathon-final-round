import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Car,
  Search,
  PlusCircle,
  Wallet,
  Clock,
  ArrowRight,
  TrendingUp,
  MapPin,
  ShieldCheck,
  Calendar,
  Sparkles,
  Zap,
  Leaf,
  Navigation,
} from 'lucide-react';
import { storage } from '../utils/storage';
import { StatCard } from '../components/StatCard';
import { RideCard } from '../components/RideCard';
import { FuelEfficiencyChart, TopCostliestVehiclesChart, MonthlyFinancialChart } from '../components/AnalyticsCharts';
import { RechargeWalletModal } from '../components/RechargeWalletModal';

export const EmployeeDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [showRechargeModal, setShowRechargeModal] = useState(false);

  const currentUser = storage.getCurrentUser();
  const rides = storage.getRides();
  const trips = storage.getTrips();
  const vehicles = storage.getVehicles();
  const monthlySummary = storage.getMonthlySummary();

  const availableRidesCount = rides.filter((r) => r.availableSeats > 0).length;
  const upcomingTrips = trips.filter((t) => t.status === 'upcoming' || t.status === 'active');
  const nextTrip = upcomingTrips[0];
  const completedTrips = trips.filter((t) => t.status === 'completed');

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Welcome & Quick Actions Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-blue-950/40 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gujarat Corporate Mobility Network</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {currentUser.name}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
              {currentUser.department} • Base: {currentUser.officeLocation} • Pool together along SG Highway and save corporate commute fuel.
            </p>
          </div>

          {/* Quick Action Pill Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/find-ride"
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition hover:scale-105"
            >
              <Search className="w-4 h-4" />
              <span>Find Ride</span>
            </Link>

            <Link
              to="/offer-ride"
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs border border-slate-700 shadow-md transition hover:scale-105"
            >
              <PlusCircle className="w-4 h-4 text-cyan-400" />
              <span>Offer Ride</span>
            </Link>

            <button
              onClick={() => setShowRechargeModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 font-bold text-xs border border-emerald-500/30 shadow-md transition hover:scale-105"
            >
              <Wallet className="w-4 h-4 text-emerald-400" />
              <span>Recharge Wallet</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Dashboard Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Available Rides"
          value={availableRidesCount}
          subtitle="Matching routes active"
          icon={Car}
          colorScheme="blue"
          trend={{ value: '+4 today', isPositive: true, label: 'vs yesterday' }}
          onClick={() => navigate('/find-ride')}
        />

        <StatCard
          title="Upcoming Trips"
          value={upcomingTrips.length}
          subtitle="Next: 07:00 PM"
          icon={Clock}
          colorScheme="cyan"
          trend={{ value: '1 Active', isPositive: true }}
          onClick={() => navigate('/my-trips')}
        />

        <StatCard
          title="Total Trips Completed"
          value={currentUser.totalTrips || 42}
          subtitle="Shared journeys"
          icon={TrendingUp}
          colorScheme="purple"
          trend={{ value: '+12% MoM', isPositive: true }}
          onClick={() => navigate('/ride-history')}
        />

        <StatCard
          title="Wallet Balance"
          value={`₹${currentUser.walletBalance}`}
          subtitle="Instant fare debit"
          icon={Wallet}
          colorScheme="emerald"
          trend={{ value: '+₹500 subsidy', isPositive: true }}
          onClick={() => setShowRechargeModal(true)}
        />
      </div>

      {/* Active / Next Upcoming Trip Banner */}
      {nextTrip && (
        <div className="relative overflow-hidden rounded-3xl border border-blue-500/40 bg-gradient-to-r from-blue-950/50 via-slate-900 to-slate-900 p-6 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Upcoming Trip Commute
                </span>
                <span className="text-xs text-slate-400">• {nextTrip.date} at {nextTrip.time}</span>
              </div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>{nextTrip.startLocation}</span>
                <span className="text-slate-500">→</span>
                <span>{nextTrip.destinationLocation}</span>
              </h3>
              <p className="text-xs text-slate-300">
                Driver: <strong className="text-white">{nextTrip.driverName}</strong> • Vehicle: {nextTrip.vehicleModel} ({nextTrip.registrationNumber}) • Fare: ₹{nextTrip.fare}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/live-tracking')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition hover:scale-105"
              >
                <Navigation className="w-4 h-4 animate-pulse" />
                <span>Open Live Tracking</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section 1: Available Rides Grid Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Car className="w-5 h-5 text-blue-400" />
              <span>Available Carpool Rides Today</span>
            </h2>
            <p className="text-xs text-slate-400">Verified employee rides departing on your corridor</p>
          </div>

          <Link to="/find-ride" className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1">
            <span>View All & Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rides.slice(0, 2).map((ride) => (
            <RideCard key={ride.id} ride={ride} />
          ))}
        </div>
      </div>

      {/* Analytics Charts Row: Fuel Efficiency & Costliest Vehicles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fuel Efficiency Trend Chart */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Leaf className="w-4 h-4 text-emerald-400" />
                <span>Fuel Efficiency Trend (km/L)</span>
              </h3>
              <p className="text-xs text-slate-400">Actual average fleet km/L vs corporate benchmark</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-300 text-xs font-mono font-bold border border-cyan-500/30">
              18.4 km/L Current
            </span>
          </div>

          <div className="h-64">
            <FuelEfficiencyChart height={240} />
          </div>
        </div>

        {/* Top 5 Costliest Vehicles Chart */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-rose-400" />
                <span>Top Costliest Fleet Vehicles</span>
              </h3>
              <p className="text-xs text-slate-400">Monthly fuel & maintenance expenses</p>
            </div>
            <span className="text-xs font-mono text-slate-400">July 2026</span>
          </div>

          <div className="h-64">
            <TopCostliestVehiclesChart height={240} />
          </div>
        </div>
      </div>

      {/* Financial Summary of Month Table (matching wireframe page 1) */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Financial Summary of Month</h3>
            <p className="text-xs text-slate-400">Monthly breakdown of gross mobility value, fuel expenses, and net profit</p>
          </div>
          <button
            onClick={() => navigate('/reports')}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300"
          >
            Full Mobility Report →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Month</th>
                <th className="py-3 px-4">Total Commute Value</th>
                <th className="py-3 px-4">Fuel Cost</th>
                <th className="py-3 px-4">Maintenance</th>
                <th className="py-3 px-4 text-emerald-400 font-bold">Net Employee Savings</th>
                <th className="py-3 px-4">Rides</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {monthlySummary.map((row, idx) => (
                <tr key={row.month} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-bold text-white font-sans">{row.month} 2026</td>
                  <td className="py-3 px-4 text-slate-300">₹{row.revenue.toLocaleString()}</td>
                  <td className="py-3 px-4 text-rose-300">₹{row.fuelCost.toLocaleString()}</td>
                  <td className="py-3 px-4 text-amber-300">₹{row.maintenance.toLocaleString()}</td>
                  <td className="py-3 px-4 font-bold text-emerald-400 font-sans">₹{row.netProfit.toLocaleString()}</td>
                  <td className="py-3 px-4 text-slate-400">{row.ridesCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recharge Wallet Modal */}
      {showRechargeModal && (
        <RechargeWalletModal
          isOpen={showRechargeModal}
          onClose={() => setShowRechargeModal(false)}
        />
      )}
    </div>
  );
};
