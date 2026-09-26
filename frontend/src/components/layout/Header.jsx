import React from 'react';
import { Menu, Building2, Search } from 'lucide-react';
import { ProfileDropdown } from './ProfileDropdown';

export function Header({ onMenuClick, pageTitle = 'Dashboard' }) {
  return (
    <header className="h-14 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Left side: Hamburger button + Page title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden text-slate-600 hover:text-slate-900 p-1.5 rounded-xs hover:bg-slate-100"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="text-base font-bold text-slate-800 tracking-tight m-0">{pageTitle}</h2>
      </div>

      {/* Right side: Global search indicator, Warehouse selection, User menu */}
      <div className="flex items-center gap-3">
        {/* Active Warehouse Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 bg-slate-100 rounded-xs border border-slate-200 text-xs text-slate-700">
          <Building2 className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-medium">Active: Main Central WH</span>
        </div>

        <div className="h-4 w-px bg-slate-200 hidden lg:block" />

        {/* Profile Menu */}
        <ProfileDropdown />
      </div>
    </header>
  );
}
