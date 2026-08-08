import React, { useState } from 'react';
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
} from 'lucide-react';
import { storage } from '../utils/storage';
import { Trip } from '../types';
import { useToast } from '../components/Toast';

export const RideHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const trips = storage.getTrips();
  const completedRides = trips.filter((t) => t.status === 'completed' || t.status === 'cancelled' || t.status === 'upcoming');

  const filtered = completedRides.filter((r) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      r.driverName.toLowerCase().includes(query) ||
      r.startLocation.toLowerCase().includes(query) ||
      r.destinationLocation.toLowerCase().includes(query) ||
      r.vehicleModel.toLowerCase().includes(query) ||
      r.registrationNumber.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Header matching wireframe page 5 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Ride History & Completed Journeys</h1>
          <p className="text-xs text-slate-400 mt-1">
            Historical records of your employee carpool commutes, route logs, and paid receipts
          </p>
        </div>

        {/* Search & Export Toolbar */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search driver, route, vehicle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-2xl bg-slate-900 border border-slate-800 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none w-64"
            />
          </div>

          <button
            onClick={() => toast.info('Export Completed', 'CSV trip logs downloaded.')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Main Table matching wireframe page 5 */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-4 px-5">Driver / Rider</th>
                <th className="py-4 px-5">Travel Route</th>
                <th className="py-4 px-5">Vehicle & Number Plate</th>
                <th className="py-4 px-5">Date & Time</th>
                <th className="py-4 px-5">Fare</th>
                <th className="py-4 px-5">Payment Status</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((record) => (
                <tr key={record.id} className="hover:bg-slate-800/40 transition">
                  {/* Driver / Rider Avatar & Name matching wireframe page 5 */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
                        {record.driverName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">{record.driverName}</div>
                        <div className="flex items-center gap-1 text-[10px] text-amber-400 font-semibold">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>{record.driverRating || 4.9}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Route matching wireframe: [Pin] ISKCON to Infocity */}
                  <td className="py-4 px-5">
                    <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <span>{record.startLocation.split(',')[0]} to {record.destinationLocation.split(',')[0]}</span>
                    </div>
                  </td>

                  {/* Vehicle & Plate matching wireframe: [Car] GJ01AB1234 */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-cyan-400" />
                      <div>
                        <span className="font-mono font-bold text-white">{record.registrationNumber}</span>
                        <span className="text-[10px] text-slate-400 block">{record.vehicleModel}</span>
                      </div>
                    </div>
                  </td>

                  {/* Date & Time matching wireframe: 07:00 PM 18/July/26 */}
                  <td className="py-4 px-5 font-mono text-slate-300">
                    <div>{record.time}</div>
                    <div className="text-[10px] text-slate-500">{record.date}</div>
                  </td>

                  {/* Fare */}
                  <td className="py-4 px-5 font-mono font-extrabold text-emerald-400 text-sm">
                    ₹{record.fare}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        record.paymentStatus === 'paid'
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {record.paymentStatus === 'paid' ? `Paid (${record.paymentMethod || 'UPI'})` : 'Pending'}
                    </span>
                  </td>

                  {/* View Details button */}
                  <td className="py-4 px-5 text-right">
                    <button
                      onClick={() => setSelectedTrip(record)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                      title="View Receipt Summary"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt Modal */}
      {selectedTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-lg animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4 text-xs animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <Receipt className="w-5 h-5 text-blue-400" />
                <span>Carpool Commute Receipt</span>
              </div>
              <button onClick={() => setSelectedTrip(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Driver:</span>
                <span className="font-bold text-white">{selectedTrip.driverName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Route:</span>
                <span className="font-bold text-white">{selectedTrip.startLocation} → {selectedTrip.destinationLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date & Time:</span>
                <span className="text-slate-200">{selectedTrip.date} at {selectedTrip.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Vehicle:</span>
                <span className="text-cyan-400">{selectedTrip.vehicleModel} ({selectedTrip.registrationNumber})</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-sm">
                <span className="font-bold text-white">Total Paid:</span>
                <span className="font-extrabold text-emerald-400">₹{selectedTrip.fare}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setSelectedTrip(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  toast.success('Invoice Downloaded', 'PDF saved to your downloads.');
                  setSelectedTrip(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
