import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Car,
  Clock,
  Phone,
  MessageSquare,
  XCircle,
  Eye,
  CheckCircle2,
  Navigation,
  CreditCard,
  Star,
  MapPin,
} from 'lucide-react';
import { Trip } from '../types';
import { storage } from '../utils/storage';
import { useToast } from './Toast';
import { LiveChatModal } from './LiveChatModal';
import { VoiceCallModal } from './VoiceCallModal';
import { PaymentModal } from './PaymentModal';
import { ConfirmationDialog } from './ConfirmationDialog';

interface TripCardProps {
  trip: Trip;
  onUpdate?: () => void;
}

export const TripCard: React.FC<TripCardProps> = ({ trip, onUpdate }) => {
  const navigate = useNavigate();
  const toast = useToast();

  const [showChat, setShowChat] = useState(false);
  const [showCall, setShowCall] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const isUpcoming = trip.status === 'upcoming';
  const isActive = trip.status === 'active';
  const isCompleted = trip.status === 'completed';
  const isCancelled = trip.status === 'cancelled';

  const handleCancelTrip = () => {
    storage.cancelTrip(trip.id);
    toast.info('Trip Cancelled', 'Your booking has been cancelled.');
    if (onUpdate) onUpdate();
  };

  const statusStyles = {
    upcoming: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 animate-pulse',
    completed: 'bg-slate-800 text-slate-400 border-slate-700',
    cancelled: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  };

  return (
    <>
      <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl transition-all duration-300 hover:border-slate-700 hover:shadow-2xl">
        {/* Top Status & Route Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                statusStyles[trip.status]
              }`}
            >
              {trip.status}
            </span>

            {trip.paymentStatus === 'pending' && trip.status !== 'cancelled' && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                Payment Pending
              </span>
            )}
            {trip.paymentStatus === 'paid' && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                Paid ({trip.paymentMethod || 'UPI'})
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{trip.date} at {trip.time}</span>
          </div>
        </div>

        {/* Route Points matching wireframe */}
        <div className="mt-4 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 block">Pick UP Point</span>
              <p className="font-bold text-white mt-0.5 text-sm">{trip.startLocation}</p>
            </div>
            <span className="text-slate-600 font-mono text-sm px-3">→</span>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-red-400 block">Drop Point</span>
              <p className="font-bold text-white mt-0.5 text-sm">{trip.destinationLocation}</p>
            </div>
          </div>
        </div>

        {/* Driver & Vehicle Details matching wireframe page 8 */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/15 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
              {trip.driverName.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-white">{trip.driverName}</p>
              <div className="flex items-center gap-1 text-[11px] text-amber-400">
                <Star className="w-3 h-3 fill-amber-400" />
                <span>{trip.driverRating || 4.9}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 text-right">
            <div>
              <p className="font-semibold text-slate-200">{trip.vehicleModel}</p>
              <p className="font-mono text-[11px] text-slate-400">{trip.registrationNumber}</p>
            </div>
            <div className="pl-3 border-l border-slate-800 text-right">
              <span className="text-base font-extrabold text-white font-mono">₹{trip.fare}</span>
              <span className="text-[10px] text-slate-500 block">/ {trip.seatNumber}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-slate-800/80">
          {/* Live Tracking button */}
          {(isActive || isUpcoming) && (
            <button
              onClick={() => navigate('/live-tracking')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition"
            >
              <Navigation className="w-3.5 h-3.5 animate-pulse" />
              <span>Live Track</span>
            </button>
          )}

          {/* Details Page */}
          <button
            onClick={() => navigate(`/trip-details`)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Details</span>
          </button>

          {/* Chat with Driver */}
          {!isCancelled && (
            <button
              onClick={() => setShowChat(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
              <span>Chat with Driver</span>
            </button>
          )}

          {/* Call Driver */}
          {!isCancelled && (
            <button
              onClick={() => setShowCall(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Call Driver</span>
            </button>
          )}

          {/* Pay Now button (if pending) */}
          {trip.paymentStatus === 'pending' && !isCancelled && (
            <button
              onClick={() => setShowPayment(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition ml-auto"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Pay ₹{trip.fare}</span>
            </button>
          )}

          {/* Cancel Trip button (if upcoming) */}
          {isUpcoming && (
            <button
              onClick={() => setShowCancelDialog(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 text-xs font-medium transition ml-auto"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </button>
          )}
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
          onSuccess={onUpdate}
        />
      )}

      {showCancelDialog && (
        <ConfirmationDialog
          isOpen={showCancelDialog}
          onClose={() => setShowCancelDialog(false)}
          onConfirm={handleCancelTrip}
          title="Cancel Trip Booking?"
          message={`Are you sure you want to cancel your seat for trip from ${trip.startLocation} to ${trip.destinationLocation}? Any paid amount will be refunded to your wallet.`}
          confirmText="Yes, Cancel Booking"
          isDestructive={true}
        />
      )}
    </>
  );
};
