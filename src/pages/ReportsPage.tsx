import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  TrendingUp,
  Download,
  Fuel,
  Car,
  Leaf,
  Users,
  DollarSign,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { FuelEfficiencyChart, TopCostliestVehiclesChart, MonthlyFinancialChart } from '../components/AnalyticsCharts';
import { storage } from '../utils/storage';
import { useToast } from '../components/Toast';

export const ReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const monthlySummary = storage.getMonthlySummary();

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Top Header matching wireframe page 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Mobility Reports & Transportation Insights</h1>
          <p className="text-xs text-slate-400 mt-1">
            Summary statistics, fuel expenses, vehicle efficiency trends, and financial performance
          </p>
        </div>

        <button
          onClick={() => toast.success('Report Exported', 'Full analytical CSV summary downloaded.')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition hover:scale-105"
        >
          <Download className="w-4 h-4" />
          <span>Export Full Report</span>
        </button>
      </div>

      {/* 3 Summary Statistic Metric Pills matching wireframe page 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Fuel Cost</span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-mono">Rs. 2.6L</h3>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
            <span>-14.2%</span> <span className="text-slate-500 font-normal">saved via pooled rides</span>
          </p>
        </div>

        <div className="p-5 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Rides This Month</span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">163</h3>
          <p className="text-[11px] text-cyan-300 flex items-center gap-1 font-semibold">
            <span>+28 rides</span> <span className="text-slate-500 font-normal">vs previous month</span>
          </p>
        </div>

        <div className="p-5 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Utilization Rate</span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">82%</h3>
          <p className="text-[11px] text-slate-400">Average 2.8 colleagues per vehicle</p>
        </div>
      </div>

      {/* 2 Analytics Charts matching wireframe page 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fuel Efficiency Trend (km/L) */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Fuel Efficiency Trend (km/L)</h3>
              <p className="text-xs text-slate-400">Monthly actual fleet average km/L</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-300 text-xs font-mono font-bold">
              18.4 km/L
            </span>
          </div>

          <div className="h-64">
            <FuelEfficiencyChart height={240} />
          </div>
        </div>

        {/* Top 5 Costliest Vehicles */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Top 5 Costliest Vehicles</h3>
              <p className="text-xs text-slate-400">Vehicle-wise monthly cost analysis</p>
            </div>
            <span className="text-xs text-slate-500 font-mono">July 2026</span>
          </div>

          <div className="h-64">
            <TopCostliestVehiclesChart height={240} />
          </div>
        </div>
      </div>

      {/* Financial Summary of Month Table matching wireframe page 1 */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Financial Summary of Month</h3>
            <p className="text-xs text-slate-400">
              Provides a monthly overview of revenue, fuel expenses, maintenance costs, and net profit
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400 font-bold">2026 Fiscal Year</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 text-slate-500 uppercase font-semibold text-[10px]">
              <tr>
                <th className="py-3 px-4">Month</th>
                <th className="py-3 px-4">Revenue</th>
                <th className="py-3 px-4">Fuel Cost</th>
                <th className="py-3 px-4">Maintenance</th>
                <th className="py-3 px-4 text-emerald-400 font-bold">Net Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {monthlySummary.map((row) => (
                <tr key={row.month} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 font-bold text-white font-sans">{row.month}</td>
                  <td className="py-3.5 px-4 text-slate-300">Rs. {(row.revenue / 10000).toFixed(1)}L</td>
                  <td className="py-3.5 px-4 text-rose-300">Rs. {(row.fuelCost / 10000).toFixed(1)}L</td>
                  <td className="py-3.5 px-4 text-amber-300">Rs. {(row.maintenance / 10000).toFixed(1)}L</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400 font-sans">
                    Rs. {(row.netProfit / 10000).toFixed(1)}L
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
