import React, { useState } from 'react';
import { Car, PlusCircle, ShieldCheck, Fuel, Users, ArrowLeft } from 'lucide-react';
import { storage } from '../utils/storage';
import { VehicleCard } from '../components/VehicleCard';
import { AddVehicleModal } from '../components/AddVehicleModal';

export const MyVehiclePage: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [vehicles, setVehicles] = useState(storage.getVehicles());

  const refreshVehicles = () => {
    setVehicles(storage.getVehicles());
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Top Header matching wireframe page 3 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">My Vehicle & Fleet</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your registered corporate vehicles, seating capacity, and driver verification
          </p>
        </div>

        {/* Add Vehicle Button matching wireframe */}
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition hover:scale-105"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Vehicle</span>
        </button>
      </div>

      {/* Vehicles Grid matching wireframe page 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vehicles.map((veh) => (
          <VehicleCard key={veh.id} vehicle={veh} onUpdate={refreshVehicles} />
        ))}
      </div>

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <AddVehicleModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={refreshVehicles}
        />
      )}
    </div>
  );
};
