import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Car,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { storage } from '../utils/storage';
import { useToast } from '../components/Toast';
import { User } from '../types';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const toast = useToast();

  const [identifier, setIdentifier] = useState('raj.patel@odoo.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const allUsers = storage.getUsers();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!identifier.trim() || !password.trim()) {
      toast.error('Required Fields', 'Please enter your email/mobile and password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      // Find matching user or fallback to matching email/name
      const found = allUsers.find(
        (u) =>
          u.email.toLowerCase() === identifier.toLowerCase().trim() ||
          u.mobile === identifier.trim() ||
          u.name.toLowerCase() === identifier.toLowerCase().trim()
      ) || allUsers[0];

      if (found.platformAccess === 'revoked') {
        toast.error('Access Revoked', 'Your carpool access has been deactivated by the company administrator.');
        return;
      }

      storage.setCurrentUser(found);
      onLoginSuccess(found);

      toast.success('Login Successful', `Welcome back, ${found.name}!`);

      if (found.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    }, 600);
  };

  const handleQuickLogin = (user: User) => {
    setIdentifier(user.email);
    setPassword('password123');
    storage.setCurrentUser(user);
    onLoginSuccess(user);
    toast.success('Switched User', `Logged in as ${user.name} (${user.role.toUpperCase()})`);

    if (user.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow meshes */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header matching wireframe page 16 */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 group">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 text-white shadow-xl shadow-blue-500/30">
            <Car className="h-6 w-6" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-white">CARPOOL</span>
        </Link>

        <h2 className="mt-4 text-2xl font-bold tracking-tight text-white">
          Login To Continue
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Enterprise Employee Mobility Portal
        </p>
      </div>

      {/* Login Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email / Mobile input matching wireframe */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email / Mobile *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="raj.patel@odoo.com or +91 98765..."
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 py-3 pl-10 pr-4 text-xs text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none transition"
                />
              </div>
            </div>

            {/* Password input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 py-3 pl-10 pr-10 text-xs text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none transition font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-950 text-blue-600 focus:ring-0"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-cyan-400 hover:text-cyan-300 transition font-medium"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button matching wireframe */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-xl shadow-blue-600/30 transition disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-slate-900 px-3 text-slate-500 font-semibold tracking-wider">Or</span>
            </div>
          </div>

          {/* Create New Account Button */}
          <Link
            to="/signup"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold transition"
          >
            <span>Create New Account</span>
          </Link>

          {/* Quick Demo Credentials Switcher matching prompt requirement */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <span className="flex items-center gap-1 text-cyan-400">
                <Sparkles className="w-3 h-3" />
                <span>Instant Demo Login</span>
              </span>
              <span className="text-slate-600">Click to switch</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {allUsers.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickLogin(u)}
                  className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition"
                >
                  <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover shrink-0" />
                  <div className="truncate">
                    <div className="text-[11px] font-bold text-white truncate">{u.name}</div>
                    <div className="text-[9px] text-slate-500 uppercase">{u.role}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-center space-y-4">
            <h3 className="text-base font-bold text-white">Reset Corporate Password</h3>
            <p className="text-xs text-slate-400">
              Enter your registered corporate email to receive a password reset link.
            </p>
            <input
              type="email"
              placeholder="raj.patel@odoo.com"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowForgotModal(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-xs text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toast.success('Reset Link Sent', 'Check your corporate inbox.');
                  setShowForgotModal(false);
                }}
                className="flex-1 py-2 rounded-xl bg-blue-600 text-xs font-bold text-white"
              >
                Send Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
