import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Car, User, Mail, Phone, Lock, Building, MapPin, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { storage } from '../utils/storage';
import { useToast } from '../components/Toast';
import { User as UserType } from '../types';

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [manager, setManager] = useState('A. Shah');
  const [officeLocation, setOfficeLocation] = useState('Ahmedabad Tech Hub');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.error('Validation Error', 'Please complete all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Password Mismatch', 'Password and Confirm Password do not match.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      const newUser: UserType = {
        id: `usr-${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        mobile: mobile.trim() || '+91 98765 00000',
        employeeId: employeeId.trim() || `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
        department,
        manager,
        officeLocation,
        role: 'employee',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        platformAccess: 'granted',
        status: 'active',
        rating: 5.0,
        totalTrips: 0,
        walletBalance: 500, // Welcome bonus
      };

      storage.addUser(newUser);
      storage.setCurrentUser(newUser);

      toast.success('Account Created Successfully!', `Welcome to CARPOOL, ${newUser.name}. ₹500 added to your wallet.`);
      navigate('/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-10 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-10 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header matching wireframe page 14 */}
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center">
        <Link to="/" className="inline-flex items-center gap-2 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 text-white shadow-xl shadow-blue-500/30">
            <Car className="h-6 w-6" />
          </div>
          <span className="text-2xl font-extrabold text-white">CARPOOL</span>
        </Link>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-white">Sign Up - Create Account</h2>
        <p className="mt-1 text-xs text-slate-400">Join the enterprise ride-sharing network</p>
      </div>

      {/* Sign Up Form Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl px-4 sm:px-0">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSignUp} className="space-y-4 text-xs">
            {/* Full Name */}
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Full Employee Name *</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Sridwip Mandal"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2.5 pl-10 pr-4 text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Email & Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Corporate Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="name@odoo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2.5 pl-10 pr-4 text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Mobile Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="+91 98765 43210"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2.5 pl-10 pr-4 text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Employee ID & Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Employee ID</label>
                <input
                  type="text"
                  placeholder="EMP-1052"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2.5 px-3.5 text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2.5 px-3.5 text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Sales">Sales</option>
                  <option value="Product">Product</option>
                  <option value="Design">Design</option>
                  <option value="HR & Operations">HR & Operations</option>
                </select>
              </div>
            </div>

            {/* Manager & Office Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Reporting Manager</label>
                <input
                  type="text"
                  value={manager}
                  onChange={(e) => setManager(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2.5 px-3.5 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Office Location</label>
                <select
                  value={officeLocation}
                  onChange={(e) => setOfficeLocation(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2.5 px-3.5 text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="Ahmedabad Tech Hub">Ahmedabad Tech Hub (SG Highway)</option>
                  <option value="Gandhinagar Campus">Gandhinagar Campus (Infocity)</option>
                  <option value="Ahmedabad Central">Ahmedabad Central (Vastrapur)</option>
                </select>
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2.5 pl-10 pr-4 text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Confirm Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2.5 pl-10 pr-4 text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3 space-y-2.5">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold shadow-xl shadow-blue-600/30 transition disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <span>Create Account</span>
                )}
              </button>

              <Link
                to="/login"
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-slate-400 hover:text-white transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Login</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
