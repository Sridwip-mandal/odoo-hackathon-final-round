import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Clock, CheckCircle2, XCircle, Search, PlusCircle } from 'lucide-react';
import { storage } from '../utils/storage';
import { TripCard } from '../components/TripCard';

export const MyTripsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'active' | 'completed'>('upcoming');
  const [trips, setTrips] = useState(storage.getTrips());

  const refreshTrips = () => {
    setTrips(storage.getTrips());
  };

  const filteredTrips = trips.filter((t) => {
    if (activeTab === 'upcoming') return t.status === 'upcoming';
    if (activeTab === 'active') return t.status === 'active';
    if (activeTab === 'completed') return t.status === 'completed' || t.status === 'cancelled';
    return true;
  });

  const upcomingCount = trips.filter((t) => t.status === 'upcoming').length;
  const activeCount = trips.filter((t) => t.status === 'active').length;
  const completedCount = trips.filter((t) => t.status === 'completed' || t.status === 'cancelled').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header matching wireframe */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">My Carpool Trips</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your booked journeys, communicate with drivers, and complete fare payments
          </p>
        </div>

        <button
          onClick={() => navigate('/find-ride')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition hover:scale-105"
        >
          <Search className="w-4 h-4" />
          <span>Book New Ride</span>
        </button>
      </div>

      {/* Tabs matching wireframe: Upcoming, Active, Completed */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 w-fit text-xs font-semibold">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
            activeTab === 'upcoming'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          <span>Upcoming</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] font-mono">
            {upcomingCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('active')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
            activeTab === 'active'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Active Journey</span>
          {activeCount > 0 && (
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
            activeTab === 'completed'
              ? 'bg-slate-800 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Completed ({completedCount})</span>
        </button>
      </div>

      {/* Trips Grid */}
      <div className="space-y-4">
        {filteredTrips.length === 0 ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-12 text-center text-xs text-slate-500 space-y-3">
            <CalendarDays className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="font-bold text-slate-300 text-sm">No {activeTab} trips found</p>
            <p>Ready to commute? Search rides departing from your tech park.</p>
            <button
              onClick={() => navigate('/find-ride')}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold"
            >
              <span>Explore Rides</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} onUpdate={refreshTrips} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
