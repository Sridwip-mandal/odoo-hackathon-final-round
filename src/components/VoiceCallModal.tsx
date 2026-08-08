import React, { useState, useEffect } from 'react';
import { PhoneCall, PhoneOff, Mic, MicOff, Volume2, VolumeX, ShieldCheck } from 'lucide-react';

interface VoiceCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  driverName?: string;
  driverPhone?: string;
  driverAvatar?: string;
}

export const VoiceCallModal: React.FC<VoiceCallModalProps> = ({
  isOpen,
  onClose,
  driverName = 'Raj Patel',
  driverPhone = '+91 98765 43210',
  driverAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
}) => {
  const [callState, setCallState] = useState<'ringing' | 'connected' | 'ended'>('ringing');
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      setCallState('ringing');
      setDuration(0);
      return;
    }

    // Auto connect after 2.5 seconds
    const timer = setTimeout(() => {
      setCallState('connected');
    }, 2200);

    return () => clearTimeout(timer);
  }, [isOpen]);

  // Duration timer when connected
  useEffect(() => {
    if (callState !== 'connected') return;
    const interval = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [callState]);

  if (!isOpen) return null;

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remaining = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setCallState('ended');
    setTimeout(() => {
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-lg animate-fade-in">
      <div className="w-full max-w-sm overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-6 text-center shadow-2xl animate-scale-up">
        {/* Avatar & Pulse Indicator */}
        <div className="relative mx-auto mt-4 w-28 h-28">
          {callState === 'ringing' && (
            <>
              <span className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping"></span>
              <span className="absolute -inset-2 rounded-full bg-cyan-500/10 animate-pulse"></span>
            </>
          )}
          {callState === 'connected' && (
            <span className="absolute inset-0 rounded-full bg-emerald-500/20 animate-pulse"></span>
          )}
          <img
            src={driverAvatar}
            alt={driverName}
            className="relative z-10 w-full h-full rounded-full object-cover ring-4 ring-slate-800 shadow-xl"
          />
        </div>

        {/* Driver Name & Number */}
        <h3 className="mt-5 text-xl font-bold text-white">{driverName}</h3>
        <p className="text-xs font-mono text-slate-400 mt-0.5">{driverPhone}</p>

        {/* Call Status / Timer */}
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-medium">
          {callState === 'ringing' && (
            <span className="text-blue-400 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
              Connecting VoIP Call...
            </span>
          )}
          {callState === 'connected' && (
            <span className="text-emerald-400 font-mono font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              {formatSeconds(duration)} (HD Audio)
            </span>
          )}
          {callState === 'ended' && <span className="text-rose-400">Call Ended</span>}
        </div>

        {/* Security badge */}
        <div className="mt-6 flex items-center justify-center gap-1 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          <span>End-to-end masked corporate line</span>
        </div>

        {/* Call Action Controls */}
        <div className="mt-8 flex items-center justify-center gap-6">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-4 rounded-full border transition ${
              isMuted ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            onClick={handleEndCall}
            className="p-5 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-xl shadow-red-600/40 hover:scale-105 transition"
            title="End Call"
          >
            <PhoneOff className="w-6 h-6" />
          </button>

          <button
            onClick={() => setIsSpeaker(!isSpeaker)}
            className={`p-4 rounded-full border transition ${
              isSpeaker ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title={isSpeaker ? 'Speaker On' : 'Speaker Off'}
          >
            {isSpeaker ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
