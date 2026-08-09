import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Car,
  PlusCircle,
  Search,
  CheckCircle2,
  Trash2,
  Edit,
  ShieldCheck,
} from 'lucide-react';
import { storage } from '../utils/storage';
import { useToast } from '../components/Toast';
import { AddVehicleModal } from '../components/AddVehicleModal';
import { BulkImportVehiclesModal } from '../components/BulkImportVehiclesModal';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { Vehicle } from '../types';

export const AdminVehiclesPage: React.FC = () => {
  const toast = useToast();
  const [vehicles, setVehicles] = useState(storage.getVehicles());
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);

  const refreshVehicles = () => {
    setVehicles(storage.getVehicles());
  };

  const handleToggleStatus = (veh: Vehicle) => {
    const nextStatus = veh.status === 'approved' ? 'inactive' : 'approved';
    const updated = { ...veh, status: nextStatus as any };
    storage.updateVehicle(updated);
    toast.info('Vehicle Status Updated', `${veh.model} is now marked as ${nextStatus.toUpperCase()}.`);
    refreshVehicles();
  };

  const handleDeleteVehicle = () => {
    if (!vehicleToDelete) return;
    storage.deleteVehicle(vehicleToDelete.id);
    toast.info('Vehicle Deleted', `${vehicleToDelete.model} has been removed.`);
    setVehicleToDelete(null);
    refreshVehicles();
  };

  const filteredVehicles = vehicles.filter((v) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      v.registrationNumber.toLowerCase().includes(q) ||
      v.model.toLowerCase().includes(q) ||
      v.driverName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* Top 3 KPI Header Metric Cards matching wireframe page 20 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-800 bg-slate-900 shadow-xl space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Employees</span>
          <h3 className="text-3xl font-extrabold text-blue-400 font-mono">{storage.getUsers().length}</h3>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-slate-800 bg-slate-900 shadow-xl space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Registered Vehicles</span>
          <h3 className="text-3xl font-extrabold text-cyan-400 font-mono">{vehicles.length}</h3>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-slate-800 bg-slate-900 shadow-xl space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Rides This Month</span>
          <h3 className="text-3xl font-extrabold text-purple-400 font-mono">163</h3>
        </div>
      </div>

      {/* Sub-Navigation Tabs matching wireframe: Employees, Vehicles, Settings */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <NavLink
            to="/admin/employees"
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-bold transition"
          >
            Employees
          </NavLink>
          <NavLink
            to="/admin/vehicles"
            className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-md shadow-purple-600/30"
          >
            Vehicles
          </NavLink>
          <NavLink
            to="/admin/settings"
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-bold transition"
          >
            Settings
          </NavLink>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBulkImportModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs shadow-lg transition hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Import Vehicles</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Add Vehicle</span>
          </button>
        </div>
      </div>

      {/* Vehicles Table matching wireframe page 20 */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950/70 text-slate-400 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-4 px-5">Vehicle Model</th>
                <th className="py-4 px-5">WB Plate Number</th>
                <th className="py-4 px-5">Assigned Driver</th>
                <th className="py-4 px-5">Capacity</th>
                <th className="py-4 px-5">Fuel Type</th>
                <th className="py-4 px-5">Status</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredVehicles.map((veh) => {
                const isApproved = veh.status === 'approved';
                return (
                  <tr key={veh.id} className="hover:bg-slate-800/40 transition">
                    {/* Vehicle Model */}
                    <td className="py-4 px-5 font-semibold text-white font-sans">
                      {veh.model}
                    </td>

                    {/* WB Plate Number */}
                    <td className="py-4 px-5 font-bold text-cyan-300 text-sm font-mono">
                      {veh.registrationNumber}
                    </td>

                    {/* Assigned Driver */}
                    <td className="py-4 px-5 text-slate-300 font-sans font-semibold">
                      {veh.driverName}
                    </td>

                    {/* Capacity */}
                    <td className="py-4 px-5 text-slate-300">
                      {veh.seatingCapacity}
                    </td>

                    {/* Fuel Type */}
                    <td className="py-4 px-5 text-slate-400">
                      {veh.fuelType || 'Petrol'}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-5">
                      <button
                        onClick={() => handleToggleStatus(veh)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition ${
                          isApproved
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        }`}
                        title="Click to toggle status"
                      >
                        [{isApproved ? 'Active' : 'Inactive'}]
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right font-sans">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleStatus(veh)}
                          className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                        >
                          {isApproved ? 'Deactivate' : 'Approve'}
                        </button>
                        <button
                          onClick={() => setVehicleToDelete(veh)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-950/30 transition"
                          title="Delete Vehicle"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <AddVehicleModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={refreshVehicles}
        />
      )}

      {/* Bulk Import Vehicles Modal */}
      {showBulkImportModal && (
        <BulkImportVehiclesModal
          isOpen={showBulkImportModal}
          onClose={() => setShowBulkImportModal(false)}
          onSuccess={refreshVehicles}
        />
      )}

      {/* Delete Confirmation */}
      {vehicleToDelete && (
        <ConfirmationDialog
          isOpen={!!vehicleToDelete}
          onClose={() => setVehicleToDelete(null)}
          onConfirm={handleDeleteVehicle}
          title="Delete Fleet Vehicle?"
          message={`Are you sure you want to remove ${vehicleToDelete.model} (${vehicleToDelete.registrationNumber}) from company fleet records?`}
          confirmText="Delete Vehicle"
          isDestructive={true}
        />
      )}
    </div>
  );
};
