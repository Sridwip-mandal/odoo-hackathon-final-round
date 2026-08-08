import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  ArrowUpDown,
  Calendar,
  Clock,
  Users,
  Repeat,
  SlidersHorizontal,
  MapPin,
  Car,
  Star,
  Check,
  Zap,
} from 'lucide-react';
import { storage } from '../utils/storage';
import { LeafletMap } from '../components/LeafletMap';
import { RideCard } from '../components/RideCard';
import { Ride } from '../types';

export const FindRidePage: React.FC = () => {
  const navigate = useNavigate();

  const [startLocation, setStartLocation] = useState('Park Street, Kolkata');
  const [destinationLocation, setDestinationLocation] = useState('Sector V, Salt Lake, Kolkata');
  const [date, setDate] = useState('2026-07-18');
  const [time, setTime] = useState('07:00 PM');
  const [seats, setSeats] = useState(1);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringDays, setRecurringDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);

  // Filters
  const [maxPrice, setMaxPrice] = useState(250);
  const [minRating, setMinRating] = useState(4.5);
  const [vehicleFilter, setVehicleFilter] = useState('all');
  const [hasSearched, setHasSearched] = useState(true);

  const rides = storage.getRides();

  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const toggleDay = (day: string) => {
    if (recurringDays.includes(day)) {
      setRecurringDays(recurringDays.filter((d) => d !== day));
    } else {
      setRecurringDays([...recurringDays, day]);
    }
  };

  const handleSwap = () => {
    const temp = startLocation;
    setStartLocation(destinationLocation);
    setDestinationLocation(temp);
  };

  const filteredRides = rides.filter((ride) => {
    if (ride.availableSeats < seats) return false;
    if (ride.farePerSeat > maxPrice) return false;
    if (ride.driverRating < minRating) return false;
    if (vehicleFilter !== 'all' && !ride.vehicleModel.toLowerCase().includes(vehicleFilter.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Search & Filter Hero Card matching wireframe page 9 & 15 */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/95 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-white">Find A Pooled Ride</h1>
            <p className="text-xs text-slate-400 mt-1">
              Search verified colleague rides along your Gujarat commute corridor
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/route-confirmation')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition"
            >
              Preview Calculated Route →
            </button>
          </div>
        </div>

        {/* Search Fields Grid */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-3 items-center">
            {/* Start Location */}
            <div className="relative">
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Start Location</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={startLocation}
                  onChange={(e) => setStartLocation(e.target.value)}
                  placeholder="Enter Your Pickup Location..."
                  className="w-full rounded-2xl bg-slate-950 border border-slate-800 py-3 pl-10 pr-4 text-xs font-semibold text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center md:pt-5">
              <button
                type="button"
                onClick={handleSwap}
                className="p-3 rounded-2xl bg-slate-800 hover:bg-blue-600 border border-slate-700 text-slate-300 hover:text-white shadow-lg transition transform hover:rotate-180 duration-300"
                title="Swap Pickup & Destination"
              >
                <ArrowUpDown className="w-4 h-4" />
              </button>
            </div>

            {/* Destination Location */}
            <div className="relative">
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Destination Location</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-red-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={destinationLocation}
                  onChange={(e) => setDestinationLocation(e.target.value)}
                  placeholder="Enter Drop Location..."
                  className="w-full rounded-2xl bg-slate-950 border border-slate-800 py-3 pl-10 pr-4 text-xs font-semibold text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Date, Time, Seats & Recurring Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {/* Date & Time */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Date & Departure Time</label>
              <div className="relative">
                <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value="18 Jul, 5:12PM"
                  readOnly
                  className="w-full rounded-2xl bg-slate-950 border border-slate-800 py-3 pl-10 pr-4 text-xs font-bold text-white font-mono"
                />
              </div>
            </div>

            {/* Number of Seats */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Number of Seats</label>
              <select
                value={seats}
                onChange={(e) => setSeats(Number(e.target.value))}
                className="w-full rounded-2xl bg-slate-950 border border-slate-800 py-3 px-4 text-xs font-bold text-white focus:border-blue-500 focus:outline-none"
              >
                <option value={1}>Seat 1 (Solo)</option>
                <option value={2}>Seat 2</option>
                <option value={3}>Seat 3</option>
                <option value={4}>Seat 4</option>
              </select>
            </div>

            {/* Recurring Ride Toggle matching wireframe page 15 */}
            <div className="sm:col-span-2 flex flex-col justify-center">
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2">
                  <Repeat className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold text-white">Recurring Ride</span>
                  <span className="text-[10px] text-slate-400">(Mo, Tu, We, Th, Fr)</span>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Weekdays selector if recurring */}
          {isRecurring && (
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-blue-500/30 flex flex-wrap items-center gap-2 animate-slide-down">
              <span className="text-xs font-semibold text-blue-300 mr-2">Select Active Days:</span>
              {weekdays.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                    recurringDays.includes(day)
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          )}

          {/* Find Ride Action Button matching wireframe */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setHasSearched(true)}
              className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-sm shadow-xl shadow-blue-600/30 transition hover:scale-[1.01]"
            >
              <Search className="w-5 h-5" />
              <span>Find Ride</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Map & Available Matching Rides Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Map Preview with Route Waypoints */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>Corridor Route & Driver Markers</span>
            </h3>
            <span className="text-xs text-slate-400">OpenStreetMap</span>
          </div>

          <LeafletMap
            startLocationName={startLocation}
            destLocationName={destinationLocation}
            height="520px"
          />
        </div>

        {/* Right Column: Matching Rides List with Filters */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-blue-400" />
              <span className="font-bold text-white">Filters:</span>
            </div>

            {/* Max Fare slider */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Max Fare:</span>
              <span className="font-mono font-bold text-cyan-400">₹{maxPrice}</span>
              <input
                type="range"
                min="80"
                max="300"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-24 accent-blue-500"
              />
            </div>

            {/* Rating Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Rating:</span>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white"
              >
                <option value={4.0}>4.0+ ★</option>
                <option value={4.5}>4.5+ ★</option>
                <option value={4.8}>4.8+ ★</option>
              </select>
            </div>

            {/* Vehicle Type Filter */}
            <div className="flex items-center gap-1.5">
              <select
                value={vehicleFilter}
                onChange={(e) => setVehicleFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white"
              >
                <option value="all">All Vehicles</option>
                <option value="Swift">Swift Dzire</option>
                <option value="Alto">Alto 800</option>
                <option value="Nexon">Tata Nexon EV</option>
                <option value="Honda">Honda City</option>
              </select>
            </div>
          </div>

          {/* Ride Cards List */}
          <div className="space-y-4">
            {filteredRides.length === 0 ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center text-xs text-slate-500 space-y-2">
                <Car className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="font-semibold text-slate-300 text-sm">No Matching Rides Found</p>
                <p>Try adjusting your price filter or seat requirement.</p>
              </div>
            ) : (
              filteredRides.map((ride) => (
                <RideCard
                  key={ride.id}
                  ride={ride}
                  onBookSuccess={() => navigate('/my-trips')}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
