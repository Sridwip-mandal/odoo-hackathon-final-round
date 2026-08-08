import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History,
  Search,
  Filter,
  Calendar,
  Eye,
  Download,
  Car,
  Star,
  CheckCircle2,
  Receipt,
  X,
  MapPin,
  Clock,
  User,
  Shield,
  CreditCard,
  Phone,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { storage } from '../utils/storage';
import { useToast } from '../components/Toast';

export const RideHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const currentUser = storage.getCurrentUser();

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'cancelled' | 'pending' | 'upcoming'>('all');
  const [dateFilter, setDateFilter] = useState<'7d' | '30d' | '3m' | '6m' | '1y' | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'passenger' | 'driver'>('all');

  // Selected Trip for Details Modal
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);

  // All historical records belonging to current user
  const records = useMemo(() => {
    return storage.getUserRideHistory(currentUser.id);
  }, [currentUser.id]);

  // Filtered dataset
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // Type Filter
      if (typeFilter !== 'all' && r.type !== typeFilter) return false;

      // Status Filter
      if (statusFilter !== 'all') {
        if (statusFilter === 'pending' && r.status !== 'pending' && r.status !== 'upcoming') return false;
        if (statusFilter !== 'pending' && r.status !== statusFilter) return false;
      }

      // Search Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesDriver = r.driverName?.toLowerCase().includes(q);
        const matchesRider = r.riderName?.toLowerCase().includes(q);
        const matchesStart = r.startLocation?.toLowerCase().includes(q);
        const matchesDest = r.destinationLocation?.toLowerCase().includes(q);
        const matchesVeh = r.vehicleModel?.toLowerCase().includes(q);
        const matchesPlate = r.registrationNumber?.toLowerCase().includes(q);
        const matchesId = r.id?.toLowerCase().includes(q);
        if (!matchesDriver && !matchesRider && !matchesStart && !matchesDest && !matchesVeh && !matchesPlate && !matchesId) {
          return false;
        }
      }

      return true;
    });
  }, [records, typeFilter, statusFilter, searchQuery]);

  const handleExportCSV = () => {
    const csvRows = [
      ['Ride ID', 'Type', 'Driver', 'Rider', 'Origin', 'Destination', 'Vehicle', 'Plate', 'Date', 'Time', 'Fare (INR)', 'Payment Status', 'Ride Status'],
      ...filteredRecords.map((r) => [
        r.id,
        r.type,
        r.driverName,
        r.riderName || currentUser.name,
        r.startLocation,
        r.destinationLocation,
        r.vehicleModel,
        r.registrationNumber,
        r.date,
        r.time,
        r.fare,
        r.paymentStatus,
        r.status,
      ]),
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `carpool_ride_history_${currentUser.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Ride History Exported', 'CSV ride ledger downloaded successfully.');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto pb-12 text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Ride History</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30 font-mono">
              {records.length} Total Journeys
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete historical records of your Kolkata carpool commutes, route logs, driver ratings, and receipts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold border border-slate-700 shadow-md transition hover:scale-105"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Multi-Dimensional Filter Toolbar */}
      <div className="p-4 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-xl space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search driver, route, plate, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-semibold shrink-0">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white focus:border-blue-500 focus:outline-none font-medium"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="pending">Pending / Upcoming</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-semibold shrink-0">Period:</span>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white focus:border-blue-500 focus:outline-none font-medium"
            >
              <option value="all">All Time</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="3m">Last 3 Months</option>
              <option value="6m">Last 6 Months</option>
              <option value="1y">Last 1 Year</option>
            </select>
          </div>

          {/* Ride Type Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-semibold shrink-0">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white focus:border-blue-500 focus:outline-none font-medium"
            >
              <option value="all">All (Passenger & Driver)</option>
              <option value="passenger">Passenger Rides Only</option>
              <option value="driver">Offered Driver Rides</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table or Empty State */}
      {filteredRecords.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mx-auto shadow-inner">
            <History className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">No Ride History Yet</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Your completed and previous rides will appear here. Start by finding a ride to Sector V or offering a commute.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigate('/find-ride')}
              className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/30 transition"
            >
              Find a Ride
            </button>
            <button
              onClick={() => navigate('/offer-ride')}
              className="px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold border border-slate-700 transition"
            >
              Offer a Ride
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-950/70 text-slate-400 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-4 px-4">Ride ID / Date</th>
                  <th className="py-4 px-4">Type</th>
                  <th className="py-4 px-4">Driver / Passenger</th>
                  <th className="py-4 px-4">Route Corridors</th>
                  <th className="py-4 px-4">Vehicle & Plate</th>
                  <th className="py-4 px-4">Fare (₹)</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredRecords.map((r) => {
                  const isCompleted = r.status === 'completed';
                  const isCancelled = r.status === 'cancelled';
                  const isUpcoming = r.status === 'upcoming' || r.status === 'active' || r.status === 'scheduled';
                  const isDriver = r.type === 'driver';

                  return (
                    <tr key={r.id} className="hover:bg-slate-800/40 transition">
                      {/* ID & Date */}
                      <td className="py-4 px-4">
                        <div className="font-mono font-bold text-white text-xs">{r.id}</div>
                        <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-cyan-400" />
                          <span>{r.date} • {r.time}</span>
                        </div>
                      </td>

                      {/* Type Badge */}
                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase border ${
                            isDriver
                              ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                              : 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                          }`}
                        >
                          {isDriver ? 'Driver' : 'Passenger'}
                        </span>
                      </td>

                      {/* Driver / Rider */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={r.driverAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                            className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/30"
                          />
                          <div>
                            <div className="font-bold text-white text-xs">{isDriver ? r.riderName : r.driverName}</div>
                            <div className="flex items-center gap-1 text-[10px] text-amber-400 font-semibold">
                              <Star className="w-3 h-3 fill-amber-400" />
                              <span>{r.rating || 4.9}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Route */}
                      <td className="py-4 px-4">
                        <div className="space-y-0.5 max-w-[200px]">
                          <div className="font-semibold text-slate-200 truncate flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                            <span className="truncate">{r.startLocation.split(',')[0]}</span>
                          </div>
                          <div className="font-semibold text-slate-400 truncate flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                            <span className="truncate">{r.destinationLocation.split(',')[0]}</span>
                          </div>
                        </div>
                      </td>

                      {/* Vehicle */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5">
                          <Car className="w-4 h-4 text-cyan-400 shrink-0" />
                          <div>
                            <div className="font-mono font-bold text-white text-xs">{r.registrationNumber}</div>
                            <div className="text-[10px] text-slate-400">{r.vehicleModel}</div>
                          </div>
                        </div>
                      </td>

                      {/* Fare */}
                      <td className="py-4 px-4">
                        <div className="font-mono font-extrabold text-sm text-emerald-400">
                          {isDriver ? `+₹${r.fare}` : `₹${r.fare}`}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {r.paymentMethod || 'UPI'} • {r.paymentStatus || 'paid'}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider border ${
                            isCompleted
                              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                              : isCancelled
                              ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                              : 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => setSelectedRecord(r)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold border border-slate-700 transition"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: RIDE DETAILS & RECEIPT */}
      {/* ========================================================================= */}
      {selectedRecord && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in text-xs">
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl p-6 sm:p-7 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-extrabold text-sm text-cyan-400">{selectedRecord.id}</span>
                  <span className="px-2 py-0.5 rounded-full font-bold text-[10px] uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    {selectedRecord.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">Ride Summary & Tax Invoice</h3>
                <p className="text-[10px] text-slate-400 font-mono">
                  {selectedRecord.date} at {selectedRecord.time} • Odoo Enterprise Mobility Kolkata
                </p>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Route Points */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-400 mt-1 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Pickup Origin</span>
                  <p className="font-bold text-white text-xs">{selectedRecord.startLocation}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-3 h-3 rounded-full bg-rose-400 mt-1 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Drop Destination</span>
                  <p className="font-bold text-white text-xs">{selectedRecord.destinationLocation}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/80">
                <span>Estimated Distance: <strong>{selectedRecord.distanceKm || 14.8} km</strong></span>
                <span>Seats Booked: <strong>{selectedRecord.seats || 1} Seat</strong></span>
              </div>
            </div>

            {/* Driver & Vehicle Breakdown */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500">Driver</span>
                <div className="font-bold text-white text-xs">{selectedRecord.driverName}</div>
                <div className="text-[10px] text-slate-400 font-mono">{selectedRecord.driverPhone || '+91 98765 43210'}</div>
                <div className="text-[10px] text-amber-400 font-semibold">⭐ {selectedRecord.rating || 4.9} / 5.0</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500">Vehicle</span>
                <div className="font-mono font-bold text-white text-xs">{selectedRecord.registrationNumber}</div>
                <div className="text-[10px] text-slate-400">{selectedRecord.vehicleModel}</div>
                <div className="text-[10px] text-cyan-400 font-semibold">WB Verified Fleet</div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Payment Breakdown:</span>
                <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {selectedRecord.paymentStatus?.toUpperCase() || 'PAID'}
                </span>
              </div>

              <div className="flex justify-between text-xs pt-1">
                <span className="text-slate-400">Carpool Base Commute Fare</span>
                <span className="font-mono font-bold text-white">₹{selectedRecord.fare}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">FASTag & Fuel Subsidy</span>
                <span className="font-mono text-emerald-400 font-bold">Included (₹0 Toll)</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Payment Gateway / Method</span>
                <span className="font-mono font-bold text-slate-200">{selectedRecord.paymentMethod || 'UPI'}</span>
              </div>
              <div className="flex justify-between text-xs pt-2 border-t border-slate-800">
                <span className="font-bold text-white">Total Amount Settled</span>
                <span className="font-mono font-extrabold text-sm text-emerald-400">₹{selectedRecord.fare}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  toast.success('GST Invoice Ready', `Receipt for ${selectedRecord.id} generated.`);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold border border-slate-700 transition"
              >
                <Receipt className="w-4 h-4 text-cyan-400" />
                <span>Download Tax Invoice</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
