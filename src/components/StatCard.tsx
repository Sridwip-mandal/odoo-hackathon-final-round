import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
    label?: string;
  };
  colorScheme?: 'blue' | 'cyan' | 'purple' | 'emerald' | 'amber';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  colorScheme = 'blue',
  onClick,
}) => {
  const colorStyles = {
    blue: 'from-blue-600/20 to-blue-900/10 border-blue-500/20 text-blue-400 group-hover:border-blue-500/50',
    cyan: 'from-cyan-600/20 to-cyan-900/10 border-cyan-500/20 text-cyan-400 group-hover:border-cyan-500/50',
    purple: 'from-purple-600/20 to-purple-900/10 border-purple-500/20 text-purple-400 group-hover:border-purple-500/50',
    emerald: 'from-emerald-600/20 to-emerald-900/10 border-emerald-500/20 text-emerald-400 group-hover:border-emerald-500/50',
    amber: 'from-amber-600/20 to-amber-900/10 border-amber-500/20 text-amber-400 group-hover:border-amber-500/50',
  };

  const iconBgStyles = {
    blue: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    cyan: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    purple: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    amber: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  };

  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl bg-gradient-to-b ${colorStyles[colorScheme]} p-5 border backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl border ${iconBgStyles[colorScheme]} shadow-inner transition-transform group-hover:scale-110`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(trend || subtitle) && (
        <div className="mt-4 flex items-center justify-between text-xs pt-3 border-t border-slate-800/80">
          {trend && (
            <div
              className={`flex items-center gap-1 font-semibold ${
                trend.isPositive ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {trend.isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              <span>{trend.value}</span>
              {trend.label && <span className="text-slate-500 font-normal ml-0.5">{trend.label}</span>}
            </div>
          )}
          {subtitle && <span className="text-slate-400 truncate">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
