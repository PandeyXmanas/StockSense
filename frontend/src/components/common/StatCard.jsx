import React from 'react';

export function StatCard({ title, value, subtitle, icon: Icon, badge, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white p-5 border border-slate-200 rounded-sm shadow-2xs transition-colors ${
        onClick ? 'cursor-pointer hover:border-slate-300 hover:bg-slate-50/50' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className="p-2 bg-slate-100 rounded-sm text-slate-600">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <div className="mt-2 flex items-baseline justify-between">
        <div className="text-2xl font-bold text-slate-900 font-mono">{value}</div>
        {badge && (
          <span className={`text-xs px-2 py-0.5 font-medium rounded-xs ${badge.colorClass}`}>
            {badge.label}
          </span>
        )}
      </div>
      {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
    </div>
  );
}
