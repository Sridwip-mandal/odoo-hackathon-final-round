import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Users,
  Car,
  Sliders,
  UserPlus,
  Search,
  Eye,
  Edit,
  UserX,
  Trash2,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { storage } from '../utils/storage';
import { useToast } from '../components/Toast';
import { AddEmployeeModal } from '../components/AddEmployeeModal';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { User } from '../types';

export const AdminEmployeesPage: React.FC = () => {
  const toast = useToast();
  const [users, setUsers] = useState(storage.getUsers());
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const refreshUsers = () => {
    setUsers(storage.getUsers());
  };

  const handleToggleAccess = (emp: User) => {
    const nextAccess: 'granted' | 'revoked' = emp.platformAccess === 'granted' ? 'revoked' : 'granted';
    const updated: User = { ...emp, platformAccess: nextAccess };
    storage.updateUser(updated);
    toast.info('Access Updated', `${emp.name} platform access is now ${nextAccess.toUpperCase()}.`);
    refreshUsers();
  };

  const handleDeleteEmployee = () => {
    if (!userToDelete) return;
    const updated = users.filter((u) => u.id !== userToDelete.id);
    storage.setUsers(updated);
    toast.info('Employee Deleted', `${userToDelete.name} has been removed from organization records.`);
    setUserToDelete(null);
    refreshUsers();
  };

  const filteredUsers = users.filter((u) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.department.toLowerCase().includes(q) ||
      u.officeLocation.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* Top 3 KPI Header Metric Cards matching wireframe page 19 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-800 bg-slate-900 shadow-xl space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Employees</span>
          <h3 className="text-3xl font-extrabold text-blue-400 font-mono">48</h3>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-slate-800 bg-slate-900 shadow-xl space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Registered Vehicles</span>
          <h3 className="text-3xl font-extrabold text-cyan-400 font-mono">22</h3>
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
            className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-md shadow-purple-600/30"
          >
            Employees
          </NavLink>
          <NavLink
            to="/admin/vehicles"
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-bold transition"
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

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition hover:scale-105"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Add Employee</span>
        </button>
      </div>

      {/* Search Filter */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search employee, email, department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Employee Management Table matching wireframe page 19 */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950/70 text-slate-400 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-4 px-5">Name</th>
                <th className="py-4 px-5">Email</th>
                <th className="py-4 px-5">Department</th>
                <th className="py-4 px-5">Manager</th>
                <th className="py-4 px-5">Location</th>
                <th className="py-4 px-5">Platform Access</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredUsers.map((emp) => {
                const isGranted = emp.platformAccess === 'granted';
                return (
                  <tr key={emp.id} className="hover:bg-slate-800/40 transition">
                    {/* Name */}
                    <td className="py-4 px-5 font-bold text-white font-sans flex items-center gap-2.5">
                      <img src={emp.avatar} alt={emp.name} className="w-7 h-7 rounded-full object-cover shrink-0" />
                      <span>{emp.name}</span>
                    </td>

                    {/* Email */}
                    <td className="py-4 px-5 text-slate-300 font-sans text-xs">
                      {emp.email}
                    </td>

                    {/* Department */}
                    <td className="py-4 px-5 text-slate-300 font-sans">
                      {emp.department}
                    </td>

                    {/* Manager */}
                    <td className="py-4 px-5 text-slate-400 font-sans">
                      {emp.manager}
                    </td>

                    {/* Location */}
                    <td className="py-4 px-5 text-slate-300 font-sans">
                      {emp.officeLocation.split(' ')[0]}
                    </td>

                    {/* Platform Access Badge matching wireframe: [Granted] / [Revoked] */}
                    <td className="py-4 px-5">
                      <button
                        onClick={() => handleToggleAccess(emp)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition ${
                          isGranted
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30'
                        }`}
                        title="Click to toggle access"
                      >
                        [{isGranted ? 'Granted' : 'Revoked'}]
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right font-sans">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleToggleAccess(emp)}
                          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                          title="Toggle Access"
                        >
                          <UserX className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setUserToDelete(emp)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-950/30 transition"
                          title="Delete Employee"
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

      {/* Add Employee Modal */}
      {showAddModal && (
        <AddEmployeeModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={refreshUsers}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {userToDelete && (
        <ConfirmationDialog
          isOpen={!!userToDelete}
          onClose={() => setUserToDelete(null)}
          onConfirm={handleDeleteEmployee}
          title="Delete Employee Record?"
          message={`Are you sure you want to delete ${userToDelete.name} (${userToDelete.email}) from the corporate carpooling platform?`}
          confirmText="Delete Record"
          isDestructive={true}
        />
      )}
    </div>
  );
};
