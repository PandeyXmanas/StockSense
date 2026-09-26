import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowRightLeft,
  SlidersHorizontal,
  History,
  Building2,
  ChevronDown,
  Layers
} from 'lucide-react';

export function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const [operationsOpen, setOperationsOpen] = useState(
    location.pathname.startsWith('/operations')
  );

  const isOperationsActive = location.pathname.startsWith('/operations');

  const mainNav = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Products', path: '/products', icon: Package }
  ];

  const operationsNav = [
    { label: 'Receipts', path: '/operations/receipts', icon: ArrowDownLeft },
    { label: 'Delivery Orders', path: '/operations/deliveries', icon: ArrowUpRight },
    { label: 'Internal Transfers', path: '/operations/transfers', icon: ArrowRightLeft },
    { label: 'Inventory Adjustment', path: '/operations/adjustments', icon: SlidersHorizontal },
    { label: 'Move History / Ledger', path: '/operations/history', icon: History }
  ];

  const settingsNav = [
    { label: 'Warehouses & Locations', path: '/settings/warehouses', icon: Building2 }
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Brand Header */}
      <div className="h-14 px-5 flex items-center justify-between border-b border-slate-800 bg-slate-950">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-slate-800 border border-slate-700 rounded-xs flex items-center justify-center text-white font-bold font-mono text-sm">
            SS
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-wide font-mono m-0 p-0 leading-none">
              StockSense
            </h1>
            <span className="text-[10px] text-slate-400 block mt-0.5">Inventory Operations</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 text-xs">
        {/* Main Section */}
        <div>
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Main Menu
          </div>
          <nav className="space-y-1">
            {mainNav.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-white border-l-2 border-slate-400'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`
                }
              >
                <item.icon className="w-4 h-4 text-slate-400" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Operations Section */}
        <div>
          <div className="px-3 pb-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            <span>Operations</span>
            <button
              onClick={() => setOperationsOpen(!operationsOpen)}
              className="text-slate-500 hover:text-slate-300 p-0.5"
            >
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${operationsOpen ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => setOperationsOpen(!operationsOpen)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xs font-medium transition-colors ${
                isOperationsActive ? 'text-white font-semibold' : 'text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4 text-slate-400" />
                <span>Stock Operations</span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-500 transition-transform ${
                  operationsOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {operationsOpen && (
              <div className="ml-4 pl-3 border-l border-slate-800 space-y-1 mt-1">
                {operationsNav.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-3 py-1.5 rounded-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-slate-800 text-white font-semibold'
                          : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                      }`
                    }
                  >
                    <item.icon className="w-3.5 h-3.5 opacity-80" />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* System Settings */}
        <div>
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Administration
          </div>
          <nav className="space-y-1">
            {settingsNav.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-white border-l-2 border-slate-400'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`
                }
              >
                <item.icon className="w-4 h-4 text-slate-400" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* System Footer Info */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-[11px] text-slate-400 flex items-center justify-between font-mono">
        <span>System Version</span>
        <span className="px-1.5 py-0.5 bg-slate-800 rounded-xs text-slate-300">v1.0.0</span>
      </div>
    </aside>
  );
}
