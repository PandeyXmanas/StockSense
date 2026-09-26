import React from 'react';

const STATUS_STYLES = {
  Draft: 'bg-slate-100 text-slate-700 border-slate-300',
  Waiting: 'bg-amber-50 text-amber-800 border-amber-300',
  Ready: 'bg-blue-50 text-blue-700 border-blue-300',
  Done: 'bg-emerald-50 text-emerald-800 border-emerald-300',
  Canceled: 'bg-rose-50 text-rose-700 border-rose-300'
};

export function StatusBadge({ status, className = '' }) {
  const normalized = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Draft';
  const style = STATUS_STYLES[normalized] || STATUS_STYLES.Draft;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-xs text-xs font-semibold border ${style} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 mr-1.5" />
      {normalized}
    </span>
  );
}
