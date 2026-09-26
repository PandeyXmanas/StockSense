import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

const PAGE_TITLES = {
  '/dashboard': 'Inventory Operations Dashboard',
  '/products': 'Products & Stock Catalog',
  '/operations/receipts': 'Stock Receipts (Incoming)',
  '/operations/deliveries': 'Delivery Orders (Outgoing)',
  '/operations/transfers': 'Internal Stock Transfers',
  '/operations/adjustments': 'Inventory Adjustments',
  '/operations/history': 'Stock Ledger & Movement History',
  '/settings/warehouses': 'Warehouses & Location Configuration',
  '/profile': 'User Profile & Settings'
};

export function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getTitle = () => {
    if (PAGE_TITLES[location.pathname]) return PAGE_TITLES[location.pathname];
    if (location.pathname.startsWith('/products/')) return 'Product Detail View';
    if (location.pathname.startsWith('/operations/receipts/')) return 'Receipt Document View';
    if (location.pathname.startsWith('/operations/deliveries/')) return 'Delivery Order View';
    if (location.pathname.startsWith('/operations/transfers/')) return 'Internal Transfer View';
    if (location.pathname.startsWith('/operations/adjustments/')) return 'Adjustment View';
    return 'StockSense IMS';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-800 font-sans">
      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/50 z-30 md:hidden"
        />
      )}

      {/* Left Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Body */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} pageTitle={getTitle()} />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
