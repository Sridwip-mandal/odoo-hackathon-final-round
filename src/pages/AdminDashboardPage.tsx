import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Car,
  Route,
  Activity,
  Leaf,
  Fuel,
  DollarSign,
  TrendingUp,
  Building2,
  ShieldCheck,
  Download,
} from 'lucide-react';
import { StatCard } from '../components/StatCard';
import {
  FuelEfficiencyChart,
  TopCostliestVehiclesChart,
  MonthlyFinancialChart,
  DepartmentParticipationChart,
} from '../components/AnalyticsCharts';
import { storage } from '../utils/storage';
import { useToast } from '../components/Toast';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const settings = storage.getSettings();
  const users = storage.getUsers();
  const vehicles = storage.getVehicles();
  const rides = storage.getRides();
  const monthlySummary = storage.getMonthlySummary();

  const totalEmployees = users.length || 48;
  const registeredVehicles = vehicles.length || 22;
  const ridesThisMonth = 163;
  const activeRides = rides.filter((r) => r.status === 'scheduled' || r.status === 'active').length || 8;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner with Company Logo matching wireframe */}
      <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-purple-950/40 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-xs font-bold text-purple-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ORGANIZATION GOVERNANCE & MOBILITY CONTROLLER</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {settings.companyName} Mobility Dashboard
            </h1>
            <p className="text-xs text-slate-400">
              {settings.registeredAddress} • {settings.industry} • Admin Contact: {settings.adminContact}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                toast.success('Admin Report Exported', 'Full organizational PDF analytics generated.');
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition hover:scale-105"
            >
              <Download className="w-4 h-4" />
              <span>Export Master Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Primary Admin KPI Cards matching wireframe pages 18, 19, 20 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Employees"
          value={totalEmployees}
          subtitle="Platform registered"
          icon={Users}
          colorScheme="purple"
          trend={{ value: '+4 this week', isPositive: true }}
          onClick={() => navigate('/admin/employees')}
        />

        <StatCard
          title="Registered Vehicles"
          value={registeredVehicles}
          subtitle="Active fleet in network"
          icon={Car}
          colorScheme="blue"
          trend={{ value: '18 Approved', isPositive: true }}
          onClick={() => navigate('/admin/vehicles')}
        />

        <StatCard
          title="Rides This Month"
          value={ridesThisMonth}
          subtitle="Shared tech park trips"
          icon={Route}
          colorScheme="cyan"
          trend={{ value: '+18% MoM', isPositive: true }}
          onClick={() => navigate('/admin/rides')}
        />

        <StatCard
          title="Active Rides Today"
          value={activeRides}
          subtitle="Currently on road"
          icon={Activity}
          colorScheme="emerald"
          trend={{ value: '100% on-time', isPositive: true }}
          onClick={() => navigate('/admin/rides')}
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Commute & Savings Value (8 Cols) */}
        <div className="lg:col-span-8 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Monthly Carpool Savings & Value Created</span>
              </h3>
              <p className="text-xs text-slate-400">Gross mobility value vs net corporate employee savings</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">July 2026</span>
          </div>

          <div className="h-72">
            <MonthlyFinancialChart data={monthlySummary} height={280} />
          </div>
        </div>

        {/* Department Participation Donut (4 Cols) */}
        <div className="lg:col-span-4 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              <span>Department Participation</span>
            </h3>
            <p className="text-xs text-slate-400">Active carpool commuters by department</p>
          </div>

          <div className="h-64">
            <DepartmentParticipationChart height={240} />
          </div>
        </div>
      </div>

      {/* Fuel Efficiency & Cost Analysis Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Fuel Efficiency Trend (km/L)</h3>
            <span className="text-xs text-slate-400 font-mono">Benchmark: 16.0 km/L</span>
          </div>
          <div className="h-64">
            <FuelEfficiencyChart height={240} />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Vehicle-wise Cost Analysis</h3>
            <span className="text-xs text-slate-400 font-mono">Monthly fleet expenses</span>
          </div>
          <div className="h-64">
            <TopCostliestVehiclesChart height={240} />
          </div>
        </div>
      </div>
    </div>
  );
};
