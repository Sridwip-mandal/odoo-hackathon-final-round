import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, User, Car, Route, Calendar, ArrowRight, Shield } from 'lucide-react';
import { storage } from '../utils/storage';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const users = storage.getUsers();
  const rides = storage.getRides();
  const vehicles = storage.getVehicles();
  const trips = storage.getTrips();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredUsers = query
    ? users.filter(
        (u) =>
          u.name.toLowerCase().includes(query.toLowerCase()) ||
          u.email.toLowerCase().includes(query.toLowerCase()) ||
          u.department.toLowerCase().includes(query.toLowerCase())
      )
    : users.slice(0, 3);

  const filteredRides = query
    ? rides.filter(
        (r) =>
          r.startLocation.toLowerCase().includes(query.toLowerCase()) ||
          r.destinationLocation.toLowerCase().includes(query.toLowerCase()) ||
          r.driverName.toLowerCase().includes(query.toLowerCase())
      )
    : rides.slice(0, 3);

  const filteredVehicles = query
    ? vehicles.filter(
        (v) =>
          v.model.toLowerCase().includes(query.toLowerCase()) ||
          v.registrationNumber.toLowerCase().includes(query.toLowerCase()) ||
          v.driverName.toLowerCase().includes(query.toLowerCase())
      )
    : vehicles.slice(0, 3);

  const handleSelectRide = (rideId: string) => {
    onClose();
    navigate('/find-ride');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-scale-up">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800 bg-slate-950">
          <Search className="w-5 h-5 text-blue-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search employees, routes, vehicles, trips (e.g. Sector V, Salt Lake, Swift, Raj)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-white rounded">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline px-2 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 rounded border border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Search Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {/* Rides Section */}
          {filteredRides.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Available Rides & Routes</p>
              <div className="space-y-1.5">
                {filteredRides.map((ride) => (
                  <div
                    key={ride.id}
                    onClick={() => handleSelectRide(ride.id)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 cursor-pointer border border-transparent hover:border-slate-700 transition group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-600/15 text-blue-400 border border-blue-500/20">
                        <Route className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white group-hover:text-blue-300">
                          {ride.startLocation.split(',')[0]} → {ride.destinationLocation.split(',')[0]}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Driver: {ride.driverName} • {ride.departureTime} • {ride.availableSeats} seats left
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono text-emerald-400">₹{ride.farePerSeat}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 transition" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Employees Section */}
          {filteredUsers.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Registered Employees</p>
              <div className="space-y-1.5">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => {
                      onClose();
                      navigate('/settings');
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 cursor-pointer border border-transparent hover:border-slate-700 transition"
                  >
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <div className="text-xs font-semibold text-white">{user.name}</div>
                        <div className="text-[11px] text-slate-400">
                          {user.department} • {user.officeLocation} • ID: {user.employeeId}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {user.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vehicles Section */}
          {filteredVehicles.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Registered Fleet & Vehicles</p>
              <div className="space-y-1.5">
                {filteredVehicles.map((veh) => (
                  <div
                    key={veh.id}
                    onClick={() => {
                      onClose();
                      navigate('/my-vehicle');
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 cursor-pointer border border-transparent hover:border-slate-700 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-cyan-600/15 text-cyan-400 border border-cyan-500/20">
                        <Car className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">
                          {veh.model} ({veh.registrationNumber})
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Driver: {veh.driverName} • {veh.seatingCapacity} Seats • {veh.fuelType}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-500/10 text-blue-400">
                      {veh.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
