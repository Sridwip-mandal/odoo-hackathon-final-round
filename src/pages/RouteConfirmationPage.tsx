import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Clock, ShieldCheck, ArrowRight, CheckCircle2, Leaf, Zap } from 'lucide-react';
import { LeafletMap } from '../components/LeafletMap';

export const RouteConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const [startLocation, setStartLocation] = useState('ISKCON Cross Road, Ahmedabad');
  const [destLocation, setDestLocation] = useState('Infocity, Gandhinagar');

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Header matching wireframe page 11 & 13 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
            <Navigation className="w-3.5 h-3.5" />
            <span>Step 2 • Route Verification</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">Route Confirmation & Telemetry</h1>
          <p className="text-xs text-slate-400">
            Calculated high-efficiency trajectory along SG Highway / Gandhinagar Expressway
          </p>
        </div>

        <button
          onClick={() => navigate('/find-ride')}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xl shadow-blue-600/30 transition hover:scale-105"
        >
          <span>Confirm & View Matching Rides</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Map Box matching wireframe */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-4 sm:p-6 shadow-2xl backdrop-blur-xl space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">Start Location</span>
            <p className="font-bold text-white text-xs">{startLocation}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-red-400 block mb-1">Destination Location</span>
            <p className="font-bold text-white text-xs">{destLocation}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-cyan-400 block mb-1">Estimated Journey</span>
              <p className="font-mono font-extrabold text-white text-base">24.2 km • ~34 min</p>
            </div>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Leaflet Map Preview */}
        <LeafletMap
          startLocationName={startLocation}
          destLocationName={destLocation}
          height="460px"
        />

        {/* Route Highlights Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="font-semibold text-white">Dedicated Express Corridor</p>
              <p className="text-[11px] text-slate-400">Zero toll delays with FASTag</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
            <Leaf className="w-5 h-5 text-cyan-400 shrink-0" />
            <div>
              <p className="font-semibold text-white">CO₂ Emission Avoided</p>
              <p className="text-[11px] text-slate-400">~3.8 kg per passenger shared</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
            <Zap className="w-5 h-5 text-purple-400 shrink-0" />
            <div>
              <p className="font-semibold text-white">Instant Verification</p>
              <p className="text-[11px] text-slate-400">GPS geofencing & telemetry active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
