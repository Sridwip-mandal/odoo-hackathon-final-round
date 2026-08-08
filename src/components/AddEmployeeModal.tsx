import React, { useState, FC, FormEvent } from 'react';
import { UserPlus, X, Shield, Mail, Phone, Building, UserCheck } from 'lucide-react';
import { storage } from '../utils/storage';
import { useToast } from './Toast';
import { User } from '../types';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddEmployeeModal: FC<AddEmployeeModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const toast = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('+91 ');
  const [department, setDepartment] = useState('Engineering');
  const [manager, setManager] = useState('A. Shah');
  const [officeLocation, setOfficeLocation] = useState('Ahmedabad Tech Hub');
  const [role, setRole] = useState<'employee' | 'admin'>('employee');
  const [platformAccess, setPlatformAccess] = useState<'granted' | 'revoked'>('granted');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      toast.error('Validation Error', 'Please enter both Employee Name and Corporate Email.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      const newEmp: User = {
        id: `usr-${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
        employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
        department,
        manager,
        officeLocation,
        role,
        avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
        platformAccess,
        status: 'active',
        rating: 5.0,
        totalTrips: 0,
        walletBalance: 500,
      };

      storage.addUser(newEmp);
      toast.success('Employee registered successfully.', `${newEmp.name} can now access the carpooling portal.`);
      if (onSuccess) onSuccess();
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-lg animate-fade-in">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Add New Employee</h3>
              <p className="text-xs text-slate-400">Grant corporate carpool access to new team members</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Full Name */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Full Employee Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Sridwip Mandal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-white placeholder-slate-600 focus:border-purple-500 focus:outline-none"
            />
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Corporate Email Address *</label>
              <input
                type="email"
                required
                placeholder="name@odoo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-white placeholder-slate-600 focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Mobile Phone Number</label>
              <input
                type="text"
                placeholder="+91 98765 43210"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-white placeholder-slate-600 focus:border-purple-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Department & Manager */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2.5 text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="Engineering">Engineering</option>
                <option value="Sales">Sales</option>
                <option value="Product">Product</option>
                <option value="Design">Design</option>
                <option value="HR & Operations">HR & Operations</option>
                <option value="Finance">Finance</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Assigned Manager</label>
              <input
                type="text"
                value={manager}
                onChange={(e) => setManager(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2.5 text-white focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Office Location */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Base Office Location</label>
            <select
              value={officeLocation}
              onChange={(e) => setOfficeLocation(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2.5 text-white focus:border-purple-500 focus:outline-none"
            >
              <option value="Kolkata Tech Hub (Sector V)">Kolkata Tech Hub (Sector V, Salt Lake)</option>
              <option value="Kolkata Central (Park Street)">Kolkata Central (Park Street)</option>
              <option value="New Town Campus (Action Area II)">New Town Campus (Action Area II)</option>
              <option value="New Town Corporate Headquarters">New Town Corporate Headquarters</option>
            </select>
          </div>

          {/* Platform Access Toggle */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-semibold text-white block">Platform Access Permission</span>
              <span className="text-[11px] text-slate-400">Allow employee to discover, publish, and book rides</span>
            </div>
            <button
              type="button"
              onClick={() => setPlatformAccess(platformAccess === 'granted' ? 'revoked' : 'granted')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                platformAccess === 'granted'
                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-600/20 text-rose-400 border border-rose-500/30'
              }`}
            >
              [{platformAccess === 'granted' ? 'Granted' : 'Revoked'}]
            </button>
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-600/30 transition disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                  <span>Adding Employee...</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>Add Employee</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
