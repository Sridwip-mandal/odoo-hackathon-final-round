import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Car,
  Clock,
  Phone,
  MessageSquare,
  ShieldAlert,
  CreditCard,
  Star,
  MapPin,
  CheckCircle2,
  Navigation,
  ArrowLeft,
  XCircle,
} from 'lucide-react';
import { LeafletMap } from '../components/LeafletMap';
import { LiveChatModal } from '../components/LiveChatModal';
import { VoiceCallModal } from '../components/VoiceCallModal';
import { PaymentModal } from '../components/PaymentModal';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { storage } from '../utils/storage';
import { useToast } from '../components/Toast';

export const TripDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [showChat, setShowChat] = useState(false);
  const [showCall, setShowCall] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const trips = storage.getTrips();
  const trip = trips.find((t) => t.status === 'upcoming' || t.status === 'active') || trips[0];

  const handleCancelTrip = () => {
    storage.cancelTrip(trip.id);
    toast.info('Trip Cancelled', 'Booking has been cancelled.');
    navigate('/my-trips');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Back button and page title matching wireframe page 8 */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/my-trips')}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Trips</span>
        </button>

        <span className="px-3 py-1 rounded-full bg-blue-500/15 text-blue-300 text-xs font-bold border border-blue-500/30">
          Trip ID: {trip.id}
        </span>
      </div>

      {/* Main Trip Details Card matching wireframe page 8 */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
        {/* Header with Driver, Route & Schedule */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
              alt={trip.driverName}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-500 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{trip.driverName}</h2>
                <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-xs font-semibold">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span>{trip.driverRating || 4.9}</span>
                </div>
              </div>
              <p className="text-sm font-semibold text-cyan-300 mt-0.5">
                {trip.startLocation.split(',')[0]} to {trip.destinationLocation.split(',')[0]}
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm font-bold font-mono text-white flex items-center gap-1.5 justify-end">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>{trip.time} {trip.date}</span>
            </div>
            <span className="text-xs text-slate-400">Scheduled Departure</span>
          </div>
        </div>

        {/* 4 Block Information Matrix matching wireframe page 8 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Vehicle */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-blue-400 block">Vehicle</span>
            <p className="font-bold text-white text-sm">{trip.vehicleModel}</p>
            <p className="font-mono text-cyan-400">{trip.registrationNumber}</p>
          </div>

          {/* Pick UP Point */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-emerald-400 block">Pick UP Point</span>
            <p className="font-bold text-white text-sm">{trip.startLocation}</p>
            <p className="text-slate-400 text-[11px]">Boarding Zone A</p>
          </div>

          {/* Drop Point */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-red-400 block">Drop Point</span>
            <p className="font-bold text-white text-sm">{trip.destinationLocation}</p>
            <p className="text-slate-400 text-[11px]">Infocity Tech Corridor</p>
          </div>

          {/* Fare Details */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-purple-400 block">Fare Details</span>
            <p className="font-bold font-mono text-emerald-400 text-lg">₹ {trip.fare}</p>
            <p className="text-slate-400 text-[11px]">/ {trip.seatNumber}</p>
          </div>
        </div>

        {/* Interactive Map Preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>Route Telemetry & Waypoints</span>
            <button
              onClick={() => navigate('/live-tracking')}
              className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Open Full Live Tracking</span>
            </button>
          </div>
          <LeafletMap
            startLocationName={trip.startLocation}
            destLocationName={trip.destinationLocation}
            height="340px"
          />
        </div>

        {/* Action Buttons Toolbar matching wireframe page 8 */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowChat(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs border border-slate-700 shadow-md transition"
            >
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span>Chat with Driver</span>
            </button>

            <button
              onClick={() => setShowCall(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs border border-slate-700 shadow-md transition"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Call To Driver</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {trip.paymentStatus === 'pending' && (
              <button
                onClick={() => setShowPayment(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xl shadow-emerald-600/30 transition hover:scale-105"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pay ₹{trip.fare} Now</span>
              </button>
            )}

            <button
              onClick={() => setShowCancelDialog(true)}
              className="flex items-center gap-1.5 px-4 py-3 rounded-2xl text-rose-400 hover:bg-rose-950/40 text-xs font-semibold transition"
            >
              <XCircle className="w-4 h-4" />
              <span>Cancel Trip</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Communication Modals */}
      {showChat && (
        <LiveChatModal
          isOpen={showChat}
          onClose={() => setShowChat(false)}
          driverName={trip.driverName}
          driverPhone={trip.driverPhone}
          tripId={trip.id}
        />
      )}

      {showCall && (
        <VoiceCallModal
          isOpen={showCall}
          onClose={() => setShowCall(false)}
          driverName={trip.driverName}
          driverPhone={trip.driverPhone}
        />
      )}

      {showPayment && (
        <PaymentModal
          isOpen={showPayment}
          onClose={() => setShowPayment(false)}
          trip={trip}
          fareAmount={trip.fare}
        />
      )}

      {showCancelDialog && (
        <ConfirmationDialog
          isOpen={showCancelDialog}
          onClose={() => setShowCancelDialog(false)}
          onConfirm={handleCancelTrip}
          title="Cancel Trip Reservation?"
          message={`Are you sure you want to cancel your seat for trip from ${trip.startLocation} to ${trip.destinationLocation}?`}
          confirmText="Yes, Cancel"
          isDestructive={true}
        />
      )}
    </div>
  );
};
