import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Car,
  Clock,
  Phone,
  MessageSquare,
  ShieldAlert,
  CreditCard,
  Star,
  CheckCircle2,
  Navigation,
  Compass,
  Zap,
  Leaf,
  Volume2,
} from 'lucide-react';
import { LeafletMap } from '../components/LeafletMap';
import { LiveChatModal } from '../components/LiveChatModal';
import { VoiceCallModal } from '../components/VoiceCallModal';
import { PaymentModal } from '../components/PaymentModal';
import { useToast } from '../components/Toast';
import { storage } from '../utils/storage';

export const LiveTrackingPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [etaMinutes, setEtaMinutes] = useState(5);
  const [speedKmh, setSpeedKmh] = useState(48);
  const [distanceRemaining, setDistanceRemaining] = useState(4.2);
  const [tripStatus, setTripStatus] = useState<'Scheduled' | 'Driver Arrived' | 'In Progress' | 'Completed'>('In Progress');

  const [showChat, setShowChat] = useState(false);
  const [showCall, setShowCall] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const trips = storage.getTrips();
  const activeTrip = trips.find((t) => t.status === 'active' || t.status === 'upcoming') || trips[0];

  // Dynamic ETA & Speed simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setSpeedKmh((prev) => Math.max(35, Math.min(65, prev + (Math.random() * 6 - 3))));
      setDistanceRemaining((prev) => {
        if (prev <= 0.5) {
          setEtaMinutes(1);
          setTripStatus('Driver Arrived');
          return 0.4;
        }
        return Math.max(0.4, Number((prev - 0.1).toFixed(1)));
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleSos = () => {
    toast.error('Emergency SOS Dispatched', 'Corporate Security Operations Center & Police notified with live GPS coordinates.');
  };

  const handleFinishAndPay = () => {
    setShowPayment(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header & Trip Status Banner matching wireframe page 12 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Active Journey Telemetry</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">Live Trip Tracking</h1>
          <p className="text-xs text-slate-400">
            Real-time GPS tracking between {activeTrip.startLocation} and {activeTrip.destinationLocation}
          </p>
        </div>

        {/* ETA Highlight Badge matching wireframe: "Coming in 5 Minutes" */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-blue-950 to-slate-900 border border-blue-500/40 px-5 py-2.5 rounded-2xl shadow-xl">
          <Clock className="w-5 h-5 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Arrival Estimate</span>
            <span className="text-base font-extrabold text-cyan-300 font-mono">
              Coming in {etaMinutes} Minutes
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map with Telemetry Overlay */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map Container */}
        <div className="lg:col-span-8 space-y-4">
          <LeafletMap
            startLocationName={activeTrip.startLocation}
            destLocationName={activeTrip.destinationLocation}
            showVehicleSimulation={true}
            driverName={activeTrip.driverName}
            vehicleModel={activeTrip.vehicleModel}
            height="500px"
          />

          {/* Telemetry HUD Gauges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-slate-400 text-[10px] block uppercase font-bold">Live Speed</span>
              <span className="text-xl font-bold font-mono text-white mt-1 block">{speedKmh.toFixed(0)} km/h</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-slate-400 text-[10px] block uppercase font-bold">Distance Left</span>
              <span className="text-xl font-bold font-mono text-cyan-400 mt-1 block">{distanceRemaining} km</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-slate-400 text-[10px] block uppercase font-bold">CO₂ Saved</span>
              <span className="text-xl font-bold font-mono text-emerald-400 mt-1 block">3.8 kg</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-slate-400 text-[10px] block uppercase font-bold">Trip State</span>
              <span className="text-xs font-bold text-blue-400 mt-1.5 block uppercase tracking-wider">
                {tripStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Driver & In-trip Controls matching wireframe page 12 */}
        <div className="lg:col-span-4 space-y-4">
          {/* Driver & Vehicle Profile Card */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/95 p-5 shadow-2xl backdrop-blur-xl space-y-4">
            <div className="flex items-center gap-3.5">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
                alt={activeTrip.driverName}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-500 shadow-md"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-white text-base">{activeTrip.driverName}</h3>
                  <div className="flex items-center gap-0.5 text-xs text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{activeTrip.driverRating || 4.9}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400">{activeTrip.driverPhone}</p>
                <p className="text-[11px] font-mono text-cyan-300 font-semibold mt-0.5">
                  {activeTrip.vehicleModel} • {activeTrip.registrationNumber}
                </p>
              </div>
            </div>

            {/* Quick In-Trip Actions matching wireframe */}
            <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-800/80">
              <button
                onClick={() => setShowChat(true)}
                className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition"
              >
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span>Chat with Driver</span>
              </button>

              <button
                onClick={() => setShowCall(true)}
                className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Call Driver</span>
              </button>
            </div>

            {/* Emergency SOS & Security Button */}
            <button
              onClick={handleSos}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 text-xs font-bold transition"
            >
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Emergency SOS / Security Dispatch</span>
            </button>
          </div>

          {/* Fare & Finish Trip Button */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/95 p-5 shadow-2xl backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Payable Fare</span>
                <h4 className="text-2xl font-extrabold text-white font-mono mt-0.5">₹{activeTrip.fare}</h4>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                1 Seat Reserved
              </span>
            </div>

            <button
              onClick={handleFinishAndPay}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-xl shadow-emerald-600/30 transition hover:scale-[1.02]"
            >
              <CreditCard className="w-4 h-4" />
              <span>Complete Trip & Pay ₹{activeTrip.fare}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Chat Modal */}
      {showChat && (
        <LiveChatModal
          isOpen={showChat}
          onClose={() => setShowChat(false)}
          driverName={activeTrip.driverName}
          driverPhone={activeTrip.driverPhone}
          tripId={activeTrip.id}
        />
      )}

      {/* Voice Call Modal */}
      {showCall && (
        <VoiceCallModal
          isOpen={showCall}
          onClose={() => setShowCall(false)}
          driverName={activeTrip.driverName}
          driverPhone={activeTrip.driverPhone}
        />
      )}

      {/* Payment Modal */}
      {showPayment && (
        <PaymentModal
          isOpen={showPayment}
          onClose={() => setShowPayment(false)}
          trip={activeTrip}
          fareAmount={activeTrip.fare}
          onSuccess={() => {
            setShowPayment(false);
            navigate('/trip-details');
          }}
        />
      )}
    </div>
  );
};
