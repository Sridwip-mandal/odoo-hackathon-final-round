import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import {
  FUEL_EFFICIENCY_TREND_DATA,
  TOP_COSTLIEST_VEHICLES_DATA,
  DEPARTMENT_PARTICIPATION_DATA,
} from '../data/mockData';
import { MonthlyFinancialSummary } from '../types';

interface ChartProps {
  data?: any[];
  height?: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-900/95 p-3 text-xs shadow-2xl backdrop-blur-md">
        <p className="font-semibold text-slate-200">{label}</p>
        <div className="mt-2 space-y-1">
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className="flex items-center gap-2 font-mono" style={{ color: entry.color }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-slate-400 capitalize">{entry.name}:</span>
              <span className="font-bold text-white">
                {entry.name.toLowerCase().includes('cost') || entry.name.toLowerCase().includes('revenue') || entry.name.toLowerCase().includes('profit')
                  ? `₹${entry.value.toLocaleString()}`
                  : entry.name.toLowerCase().includes('kmpl')
                  ? `${entry.value} km/L`
                  : entry.value}
              </span>
            </p>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// 1. Fuel Efficiency Trend (km/L)
export const FuelEfficiencyChart: React.FC<ChartProps> = ({ data = FUEL_EFFICIENCY_TREND_DATA, height = 260 }) => {
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
          <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
          <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[12, 20]} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{ fontSize: '11px', paddingBottom: '8px' }}
          />
          <Line
            type="monotone"
            dataKey="actualKmpl"
            name="Actual Fuel Efficiency (km/L)"
            stroke="#06b6d4"
            strokeWidth={3}
            dot={{ r: 4, fill: '#06b6d4' }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="targetKmpl"
            name="Benchmark Target (16 km/L)"
            stroke="#94a3b8"
            strokeDasharray="5 5"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// 2. Top 5 Costliest Vehicles
export const TopCostliestVehiclesChart: React.FC<ChartProps> = ({ data = TOP_COSTLIEST_VEHICLES_DATA, height = 260 }) => {
  const colors = ['#f43f5e', '#fb923c', '#facc15', '#38bdf8', '#4ade80'];

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} layout="vertical" margin={{ top: 10, right: 20, left: 40, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
          <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${v / 1000}k`} />
          <YAxis type="category" dataKey="vehicle" stroke="#64748b" tick={{ fontSize: 10 }} width={80} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="costPerMonth" name="Monthly Cost (₹)" radius={[0, 8, 8, 0]}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// 3. Monthly Financial Summary Chart
export const MonthlyFinancialChart: React.FC<{ data: MonthlyFinancialSummary[]; height?: number }> = ({
  data,
  height = 280,
}) => {
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
          <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
          <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${v / 1000}k`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: '11px', paddingBottom: '8px' }} />
          <Area
            type="monotone"
            dataKey="revenue"
            name="Gross Commute Value (₹)"
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#colorRevenue)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="netProfit"
            name="Net Employee Savings (₹)"
            stroke="#10b981"
            fillOpacity={1}
            fill="url(#colorProfit)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// 4. Department Participation Donut
export const DepartmentParticipationChart: React.FC<{ height?: number }> = ({ height = 240 }) => {
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={DEPARTMENT_PARTICIPATION_DATA}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={4}
            dataKey="totalTrips"
            nameKey="department"
          >
            {DEPARTMENT_PARTICIPATION_DATA.map((entry, index) => (
              <Cell key={`dept-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
