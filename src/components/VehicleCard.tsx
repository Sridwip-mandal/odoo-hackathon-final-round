import React, { useState } from 'react';
import { Car, Users, Fuel, ShieldCheck, Edit3, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Vehicle } from '../types';
import { storage } from '../utils/storage';
import { useToast } from './Toast';
import { ConfirmationDialog } from './ConfirmationDialog';

interface VehicleCardProps {
  vehicle: Vehicle;
  onUpdate?: () => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onUpdate }) => {
  const toast = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [model, setModel] = useState(vehicle.model);
  const [capacity, setCapacity] = useState(vehicle.seatingCapacity);

  const handleDelete = () => {
    storage.deleteVehicle(vehicle.id);
    toast.info('Vehicle Removed', `${vehicle.model} has been removed from your fleet.`);
    if (onUpdate) onUpdate();
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    storage.updateVehicle({
      ...vehicle,
      model,
      seatingCapacity: Number(capacity),
    });
    toast.success('Vehicle Updated', 'Vehicle details saved successfully.');
    setShowEditModal(false);
    if (onUpdate) onUpdate();
  };

  const handleToggleStatus = () => {
    const nextStatus = vehicle.status === 'approved' ? 'inactive' : 'approved';
    storage.updateVehicle({
      ...vehicle,
      status: nextStatus,
    });
    toast.info('Status Changed', `Vehicle marked as ${nextStatus}.`);
    if (onUpdate) onUpdate();
  };

  return (
    <>
      <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl transition-all duration-300 hover:border-slate-700 hover:shadow-2xl">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-inner">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-white text-base">{vehicle.model}</h4>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    vehicle.status === 'approved'
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  [{vehicle.status === 'approved' ? 'Active' : 'Inactive'}]
                </span>
              </div>
              <p className="font-mono font-bold text-sm text-cyan-300 mt-0.5 tracking-wider">
                {vehicle.registrationNumber}
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-1 text-xs font-semibold text-slate-300 justify-end">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>{vehicle.seatingCapacity} Seats</span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono mt-0.5 block">{vehicle.fuelType}</span>
          </div>
        </div>

        {/* Driver and Specs Tag */}
        <div className="mt-4 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-slate-300 font-bold">
              {vehicle.driverName.charAt(0)}
            </div>
            <span className="text-slate-300">Driver: <strong className="text-white">{vehicle.driverName}</strong></span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Corporate Verified</span>
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800/80">
          <button
            onClick={handleToggleStatus}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
              vehicle.status === 'approved'
                ? 'bg-slate-800 text-slate-300 hover:text-white border-slate-700'
                : 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-600 hover:text-white'
            }`}
          >
            {vehicle.status === 'approved' ? 'Deactivate' : 'Activate'}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowEditModal(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>

            <button
              onClick={() => setShowDeleteDialog(true)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition"
              title="Remove Vehicle"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Vehicle Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-lg animate-fade-in">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl p-6 animate-scale-up">
            <h3 className="text-base font-bold text-white mb-4">Edit Vehicle Details</h3>
            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Vehicle Model</label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Seating Capacity</label>
                <input
                  type="number"
                  min="2"
                  max="8"
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showDeleteDialog && (
        <ConfirmationDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={handleDelete}
          title="Remove Vehicle Registration?"
          message={`Are you sure you want to remove ${vehicle.model} (${vehicle.registrationNumber}) from your account?`}
          confirmText="Yes, Remove"
          isDestructive={true}
        />
      )}
    </>
  );
};
