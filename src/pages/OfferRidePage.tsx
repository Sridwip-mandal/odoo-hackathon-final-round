import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Car,
  MapPin,
  Clock,
  Users,
  ArrowUpDown,
  PlusCircle,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap,
  Info,
} from 'lucide-react';
import { storage } from '../utils/storage';
import { useToast } from '../components/Toast';
import { LeafletMap } from '../components/LeafletMap';
import { Ride } from '../types';

export const OfferRidePage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const currentUser = storage.getCurrentUser();
  const vehicles = storage.getVehicles().filter((v) => v.status === 'approved');

  const [startLocation, setStartLocation] = useState('Park Street, Kolkata');
  const [destinationLocation, setDestinationLocation] = useState('Sector V, Salt Lake, Kolkata');
  const [date, setDate] = useState('18/July/26');
  const [time, setTime] = useState('07:00 PM');
  const [selectedVehicleId, setSelectedVehicleId] = useState(vehicles[0]?.id || 'veh-1');
  const [seats, setSeats] = useState(2);
  const [farePerSeat, setFarePerSeat] = useState(120);
  const [notes, setNotes] = useState('AC on, polite driving, pickups along EM Bypass welcome');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];

  const handleSwap = () => {
    const temp = startLocation;
    setStartLocation(destinationLocation);
    setDestinationLocation(temp);
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();

    if (!vehicles.length) {
      toast.error('Vehicle Required', 'Please register a vehicle before publishing a ride.');
      navigate('/my-vehicle');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      const newRide: Ride = {
        id: `ride-${Date.now()}`,
        driverId: currentUser.id,
        driverName: currentUser.name,
        driverPhone: currentUser.mobile,
        driverRating: currentUser.rating || 4.9,
        driverAvatar: currentUser.avatar,
        vehicleModel: selectedVehicle?.model || 'Swift Dzire',
        registrationNumber: selectedVehicle?.registrationNumber || 'WB02AB1234',
        startLocation,
        destinationLocation,
        startCoords: [22.5510, 88.3524],
        destCoords: [22.5804, 88.4378],
        departureDate: date,
        departureTime: time,
        availableSeats: seats,
        totalSeats: selectedVehicle?.seatingCapacity || 4,
        farePerSeat,
        distanceKm: 14.8,
        estimatedMinutes: 28,
        isRecurring: true,
        recurringDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        notes,
        status: 'scheduled',
        createdAt: new Date().toISOString(),
      };

      storage.addRide(newRide);
      toast.success('Ride published successfully.', `Colleagues can now book seats on your route to ${destinationLocation}.`);
      navigate('/find-ride');
    }, 800);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Top Header matching wireframe page 9 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Driver Ecosystem</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">Offer & Publish A Ride</h1>
          <p className="text-xs text-slate-400">
            Share empty seats in your car, reduce traffic, and earn corporate commute reimbursement
          </p>
        </div>

        <button
          onClick={() => navigate('/my-vehicle')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition"
        >
          <Car className="w-4 h-4 text-cyan-400" />
          <span>Manage Registered Fleet</span>
        </button>
      </div>

      {/* Main Publishing Form & Map Layout matching wireframe page 9 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form (7 Cols) */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/95 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            <form onSubmit={handlePublish} className="space-y-4 text-xs">
              {/* Pickup & Destination with Swap button matching wireframe page 9 */}
              <div className="space-y-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Start Location *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                    <input
                      type="text"
                      required
                      placeholder="Enter Your location"
                      value={startLocation}
                      onChange={(e) => setStartLocation(e.target.value)}
                      className="w-full rounded-2xl bg-slate-950 border border-slate-800 py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-center -my-2 relative z-10">
                  <button
                    type="button"
                    onClick={handleSwap}
                    className="p-2.5 rounded-full bg-slate-800 hover:bg-blue-600 border border-slate-700 text-slate-300 hover:text-white shadow-lg transition"
                    title="Swap Locations"
                  >
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Destination Location *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400" />
                    <input
                      type="text"
                      required
                      placeholder="Enter Drop location"
                      value={destinationLocation}
                      onChange={(e) => setDestinationLocation(e.target.value)}
                      className="w-full rounded-2xl bg-slate-950 border border-slate-800 py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Date & Departure Time matching wireframe: 18 Jul, 5:12PM */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Date & Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value="18 Jul, 5:12PM"
                      readOnly
                      className="w-full rounded-2xl bg-slate-950 border border-slate-800 py-3 pl-10 pr-4 text-white font-mono font-bold"
                    />
                  </div>
                </div>

                {/* Available Seats Dropdown */}
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Available Seats (Seat 4)</label>
                  <select
                    value={seats}
                    onChange={(e) => setSeats(Number(e.target.value))}
                    className="w-full rounded-2xl bg-slate-950 border border-slate-800 py-3 px-4 text-white font-bold focus:border-blue-500 focus:outline-none"
                  >
                    <option value={1}>Seat 1</option>
                    <option value={2}>Seat 2 Available</option>
                    <option value={3}>Seat 3 Available</option>
                    <option value={4}>Seat 4 Available</option>
                  </select>
                </div>
              </div>

              {/* Vehicle Selection */}
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Select Registered Vehicle</label>
                <select
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  className="w-full rounded-2xl bg-slate-950 border border-slate-800 py-3 px-4 text-white font-semibold focus:border-blue-500 focus:outline-none"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.model} ({v.registrationNumber}) • {v.seatingCapacity} Seats • {v.fuelType}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fare Per Seat matching wireframe: ₹ 120 / Seat 2 Available */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[11px]">Fare Per Seat</span>
                  <span className="text-xs text-slate-500">Auto-calculated via ₹8.00/km rule</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-extrabold text-2xl text-emerald-400">₹</span>
                  <input
                    type="number"
                    min="30"
                    max="500"
                    value={farePerSeat}
                    onChange={(e) => setFarePerSeat(Number(e.target.value))}
                    className="w-24 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 font-mono font-extrabold text-lg text-white text-right"
                  />
                </div>
              </div>

              {/* Notes / Ride Preferences */}
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Preferences & Pickup Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. AC On, Non-smoking, Pickups along SG Highway allowed"
                  className="w-full rounded-2xl bg-slate-950 border border-slate-800 p-3 text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Publish Button matching wireframe */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-sm shadow-xl shadow-blue-600/30 transition hover:scale-[1.01] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                      <span>Publishing Ride to Corridor...</span>
                    </>
                  ) : (
                    <span>Publish Ride</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Map Preview (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>Route Preview on Map</span>
            <span className="text-emerald-400 font-mono">24.2 km (~34 mins)</span>
          </div>

          <LeafletMap
            startLocationName={startLocation}
            destLocationName={destinationLocation}
            height="460px"
          />

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2">
            <div className="flex items-center gap-2 text-cyan-300 font-semibold">
              <Info className="w-4 h-4 shrink-0" />
              <span>Earnings & Fuel Reimbursement</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              If {seats} seats are booked, you earn <strong className="text-white">₹{farePerSeat * seats}</strong> which covers 100% of your fuel expenses for this commute!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
