import React, { useState } from 'react';
import { Car, X, PlusCircle, ShieldCheck, Fuel, Users } from 'lucide-react';
import { storage } from '../utils/storage';
import { useToast } from './Toast';
import { Vehicle } from '../types';

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddVehicleModal: React.FC<AddVehicleModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const toast = useToast();
  const currentUser = storage.getCurrentUser();

  const [model, setModel] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [seatingCapacity, setSeatingCapacity] = useState(4);
  const [vehicleType, setVehicleType] = useState<Vehicle['vehicleType']>('Sedan');
  const [fuelType, setFuelType] = useState<Vehicle['fuelType']>('Petrol');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!model.trim() || !registrationNumber.trim()) {
      toast.error('Validation Error', 'Please provide both Vehicle Model and Registration Number.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      const newVehicle: Vehicle = {
        id: `veh-${Date.now()}`,
        userId: currentUser.id,
        driverName: currentUser.name,
        model: model.trim(),
        registrationNumber: registrationNumber.toUpperCase().trim(),
        seatingCapacity: Number(seatingCapacity),
        vehicleType,
        fuelType,
        status: 'approved',
        isDefault: false,
      };

      storage.addVehicle(newVehicle);
      toast.success('Vehicle registered successfully.', `${newVehicle.model} is now ready for ride sharing.`);
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
            <div className="p-2 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Register New Vehicle</h3>
              <p className="text-xs text-slate-400">Add vehicle details before publishing rides</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Vehicle Model */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Vehicle Model & Make *</label>
            <input
              type="text"
              required
              placeholder="e.g. Maruti Suzuki Swift Dzire, Tata Nexon EV"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Registration Number */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Registration Number (Number Plate) *</label>
            <input
              type="text"
              required
              placeholder="e.g. GJ01AB1234"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              className="w-full uppercase font-mono font-bold rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Seating Capacity & Vehicle Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Seating Capacity</label>
              <select
                value={seatingCapacity}
                onChange={(e) => setSeatingCapacity(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2.5 text-white focus:border-blue-500 focus:outline-none"
              >
                {[2, 3, 4, 5, 6, 7].map((num) => (
                  <option key={num} value={num}>
                    {num} Seats ({num - 1} Passengers)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Vehicle Category</label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value as any)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2.5 text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="Sedan">Sedan</option>
                <option value="Hatchback">Hatchback</option>
                <option value="SUV">SUV</option>
                <option value="EV">Electric (EV)</option>
                <option value="Compact">Compact</option>
              </select>
            </div>
          </div>

          {/* Fuel Type */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Fuel Type</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {(['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'] as const).map((fuel) => (
                <button
                  key={fuel}
                  type="button"
                  onClick={() => setFuelType(fuel)}
                  className={`py-2 rounded-xl text-[11px] font-semibold border transition ${
                    fuelType === fuel
                      ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {fuel}
                </button>
              ))}
            </div>
          </div>

          {/* Corporate Compliance Note */}
          <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/20 text-[11px] text-blue-300 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-blue-400" />
            <span>Vehicles are instantly verified under the company enterprise mobility & insurance policy.</span>
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
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/30 transition disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Register Vehicle</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
