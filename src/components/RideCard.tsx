import React, { useState } from 'react';
import { Star, MapPin, Clock, Users, ArrowRight, ShieldCheck, Car, Check } from 'lucide-react';
import { Ride } from '../types';
import { storage } from '../utils/storage';
import { useToast } from './Toast';

interface RideCardProps {
  ride: Ride;
  onBookSuccess?: () => void;
}

export const RideCard: React.FC<RideCardProps> = ({ ride, onBookSuccess }) => {
  const toast = useToast();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState(1);
  const [pickupNote, setPickupNote] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  const currentUser = storage.getCurrentUser();

  const handleConfirmBooking = () => {
    if (selectedSeats > ride.availableSeats) {
      toast.error('Not enough seats', `Only ${ride.availableSeats} seats remaining.`);
      return;
    }

    setIsBooking(true);

    setTimeout(() => {
      setIsBooking(false);
      setShowBookingModal(false);

      // Create new trip
      const newTrip = {
        id: `trip-${Date.now()}`,
        rideId: ride.id,
        driverId: ride.driverId,
        driverName: ride.driverName,
        driverPhone: ride.driverPhone,
        driverRating: ride.driverRating,
        vehicleModel: ride.vehicleModel,
        registrationNumber: ride.registrationNumber,
        startLocation: ride.startLocation,
        destinationLocation: ride.destinationLocation,
        startCoords: ride.startCoords,
        destCoords: ride.destCoords,
        date: ride.departureDate,
        time: ride.departureTime,
        fare: ride.farePerSeat * selectedSeats,
        seatNumber: `Seat ${ride.totalSeats - ride.availableSeats + 1}`,
        seatsBooked: selectedSeats,
        status: 'upcoming' as const,
        paymentStatus: 'pending' as const,
        paymentMethod: 'UPI' as const,
        currentLocation: ride.startCoords,
        etaMinutes: ride.estimatedMinutes,
        distanceRemainingKm: ride.distanceKm,
      };

      storage.addTrip(newTrip);
      toast.success('Ride booked successfully.', `Seat reserved with ${ride.driverName} for ₹${newTrip.fare}.`);
      if (onBookSuccess) onBookSuccess();
    }, 900);
  };

  return (
    <>
      <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl transition-all duration-300 hover:border-blue-500/40 hover:-translate-y-0.5 hover:shadow-2xl">
        {/* Top Driver and Schedule Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <img
              src={ride.driverAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={ride.driverName}
              className="w-12 h-12 rounded-2xl object-cover ring-2 ring-blue-500/40 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-white text-base">{ride.driverName}</h4>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-xs font-semibold border border-amber-500/20">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{ride.driverRating}</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {ride.vehicleModel} • <span className="font-mono text-slate-300 font-semibold">{ride.registrationNumber}</span>
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs font-semibold text-slate-400 flex items-center gap-1 justify-end">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>{ride.departureTime}</span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">{ride.departureDate}</span>
          </div>
        </div>

        {/* Route Details */}
        <div className="mt-4 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <div className="flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-2 text-slate-200 truncate max-w-[180px]">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0"></div>
              <span className="truncate">{ride.startLocation.split(',')[0]}</span>
            </div>
            <span className="text-slate-500 font-mono text-[11px] px-2">→</span>
            <div className="flex items-center gap-2 text-slate-200 truncate max-w-[180px]">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400 shrink-0"></div>
              <span className="truncate">{ride.destinationLocation.split(',')[0]}</span>
            </div>
          </div>

          {ride.notes && (
            <p className="mt-2 text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 italic truncate">
              "{ride.notes}"
            </p>
          )}
        </div>

        {/* Bottom Specs & Book Button */}
        <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>
                <strong className="text-white">{ride.availableSeats}</strong> of {ride.totalSeats} seats left
              </span>
            </div>

            <span className="text-slate-700">•</span>

            <div className="text-xs font-mono text-slate-400">
              {ride.distanceKm} km (~{ride.estimatedMinutes}m)
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-lg font-extrabold text-white font-mono">₹{ride.farePerSeat}</span>
              <span className="text-[10px] text-slate-400 block -mt-1">per seat</span>
            </div>

            <button
              onClick={() => setShowBookingModal(true)}
              disabled={ride.availableSeats === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition hover:scale-105"
            >
              <span>Book Ride</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-lg animate-fade-in">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl animate-scale-up">
            <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Confirm Ride Booking</h3>
                <p className="text-xs text-slate-400">Reserve your carpool seat instantly</p>
              </div>
              <button
                onClick={() => setShowBookingModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              {/* Trip Summary Pill */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between font-semibold text-white">
                  <span>{ride.startLocation.split(',')[0]}</span>
                  <span className="text-slate-400">to</span>
                  <span>{ride.destinationLocation.split(',')[0]}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Departure: {ride.departureDate} at {ride.departureTime}</span>
                  <span className="text-cyan-400 font-semibold">{ride.vehicleModel}</span>
                </div>
              </div>

              {/* Number of Seats Selection */}
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Select Number of Seats</label>
                <div className="flex gap-2">
                  {Array.from({ length: Math.min(ride.availableSeats, 4) }, (_, i) => i + 1).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSeats(s)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                        selectedSeats === s
                          ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-600/30'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {s} Seat{s > 1 ? 's' : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pickup Point Note */}
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Pickup Landmark / Stop Note</label>
                <input
                  type="text"
                  placeholder="e.g. Near main security gate, pillar #142"
                  value={pickupNote}
                  onChange={(e) => setPickupNote(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Fare Calculation */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400">Total Payable:</span>
                  <span className="text-[10px] text-slate-500 block">₹{ride.farePerSeat} × {selectedSeats} seat(s)</span>
                </div>
                <span className="text-xl font-extrabold text-emerald-400 font-mono">
                  ₹{ride.farePerSeat * selectedSeats}
                </span>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmBooking}
                  disabled={isBooking}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2"
                >
                  {isBooking ? (
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Confirm & Book</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
