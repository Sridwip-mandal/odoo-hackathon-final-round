import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Fuel,
  Car,
  Leaf,
  Users,
  DollarSign,
  Activity,
  FileSpreadsheet,
} from 'lucide-react';
import {
  FuelEfficiencyChart,
  TopCostliestVehiclesChart,
  MonthlyFinancialChart,
  DepartmentParticipationChart,
} from '../components/AnalyticsCharts';
import { storage } from '../utils/storage';
import { useToast } from '../components/Toast';

export const AdminReportsPage: React.FC = () => {
  const toast = useToast();
  const monthlySummary = storage.getMonthlySummary();

  const handleExport = () => {
    toast.success('Enterprise Mobility Report Exported', 'CSV analytics dataset generated and ready for corporate audit.');
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Enterprise Mobility & ESG Analytics</h1>
          <p className="text-xs text-slate-400 mt-1">
            Corporate transportation intelligence, carbon reduction benchmarks, and cost efficiency metrics
          </p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition hover:scale-105"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export Corporate ESG Audit</span>
        </button>
      </div>

      {/* 6 Executive Metric Indicators matching prompt */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900 shadow-xl space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Rides</span>
          <h4 className="text-2xl font-extrabold text-white font-mono">163</h4>
          <span className="text-[10px] text-emerald-400 font-semibold">+18% MoM</span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900 shadow-xl space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Passengers</span>
          <h4 className="text-2xl font-extrabold text-cyan-400 font-mono">412</h4>
          <span className="text-[10px] text-slate-400">Pooled commuters</span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900 shadow-xl space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Distance</span>
          <h4 className="text-2xl font-extrabold text-purple-400 font-mono">3,940 km</h4>
          <span className="text-[10px] text-slate-400">Expressway lines</span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900 shadow-xl space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Fuel Saved</span>
          <h4 className="text-2xl font-extrabold text-emerald-400 font-mono">2,180 L</h4>
          <span className="text-[10px] text-emerald-400 font-semibold">₹2.1L saved</span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900 shadow-xl space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">CO₂ Reduction</span>
          <h4 className="text-2xl font-extrabold text-teal-300 font-mono">2,940 kg</h4>
          <span className="text-[10px] text-teal-400 font-semibold">ESG Grade A+</span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900 shadow-xl space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Avg Fare / Ride</span>
          <h4 className="text-2xl font-extrabold text-amber-400 font-mono">₹122</h4>
          <span className="text-[10px] text-slate-400">Per seat subsidy</span>
        </div>
      </div>

      {/* Main Charts Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Monthly Rides & Commute Value Growth</h3>
              <p className="text-xs text-slate-400">Fiscal revenue vs net employee benefit trend</p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold font-mono">
              +28% Annual Velocity
            </span>
          </div>

          <div className="h-72">
            <MonthlyFinancialChart data={monthlySummary} height={280} />
          </div>
        </div>

        <div className="lg:col-span-4 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">Department Adoption Rate</h3>
            <p className="text-xs text-slate-400">Participation breakdown across business units</p>
          </div>

          <div className="h-64">
            <DepartmentParticipationChart height={240} />
          </div>
        </div>
      </div>

      {/* Secondary Charts: Fuel Efficiency & Cost Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white">Fleet Average Fuel Economy (km/L)</h3>
          <div className="h-64">
            <FuelEfficiencyChart height={240} />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white">Fleet Expense Distribution</h3>
          <div className="h-64">
            <TopCostliestVehiclesChart height={240} />
          </div>
        </div>
      </div>
    </div>
  );
};
