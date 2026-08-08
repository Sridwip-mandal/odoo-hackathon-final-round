import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, ArrowRight, ShieldCheck, Sparkles, Users, Zap, Leaf } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/login');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="relative min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4 overflow-hidden text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Background glow meshes */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/3 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Branding Card matching wireframe page 17 */}
      <div className="relative z-10 w-full max-w-xl text-center space-y-8 p-8 sm:p-12 rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-2xl shadow-2xl shadow-blue-950/50">
        {/* Animated Car Graphic */}
        <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 opacity-25 animate-ping"></div>
          <div className="relative flex items-center justify-center w-28 h-28 rounded-3xl bg-gradient-to-tr from-blue-600 via-blue-500 to-cyan-400 text-white shadow-2xl shadow-blue-500/40 transform hover:scale-105 transition-transform duration-500">
            <Car className="w-14 h-14 animate-bounce" style={{ animationDuration: '2.5s' }} />
          </div>

          {/* Floating Passenger Badges */}
          <div className="absolute -top-2 -right-2 flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500 text-white shadow-lg border-2 border-slate-900">
            <Users className="w-4 h-4" />
          </div>
          <div className="absolute -bottom-2 -left-2 flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500 text-white shadow-lg border-2 border-slate-900">
            <Leaf className="w-4 h-4" />
          </div>
        </div>

        {/* Title & Tagline */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ENTERPRISE MOBILITY PLATFORM</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            CARPOOL
          </h1>

          <p className="text-lg sm:text-xl font-medium text-cyan-300 font-sans tracking-wide">
            “Ride Together, Save Together”
          </p>

          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed pt-2">
            Secure, sustainable, and cost-effective daily employee commutes across corporate tech parks.
          </p>
        </div>

        {/* Action Button & Auto-redirect countdown */}
        <div className="space-y-3 pt-4 border-t border-slate-800/80">
          <button
            onClick={() => navigate('/login')}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition transform hover:scale-[1.02]"
          >
            <span>Proceed to Login</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-xs text-slate-500 font-mono">
            Auto redirecting to portal in <span className="text-cyan-400 font-bold">{countdown}s</span>...
          </p>
        </div>
      </div>
    </div>
  );
};
