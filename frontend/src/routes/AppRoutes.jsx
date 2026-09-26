import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { MainLayout } from '../components/layout/MainLayout';

// Auth Pages
import { LoginPage } from '../pages/auth/LoginPage';
import { SignupPage } from '../pages/auth/SignupPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';

// Main Application Modules
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { ProductsListPage } from '../pages/products/ProductsListPage';
import { ProductDetailPage } from '../pages/products/ProductDetailPage';

import { ReceiptsPage } from '../pages/operations/ReceiptsPage';
import { ReceiptDetailPage } from '../pages/operations/ReceiptDetailPage';
import { DeliveriesPage } from '../pages/operations/DeliveriesPage';
import { DeliveryDetailPage } from '../pages/operations/DeliveryDetailPage';
import { TransfersPage } from '../pages/operations/TransfersPage';
import { TransferDetailPage } from '../pages/operations/TransferDetailPage';
import { AdjustmentsPage } from '../pages/operations/AdjustmentsPage';
import { AdjustmentDetailPage } from '../pages/operations/AdjustmentDetailPage';
import { StockLedgerPage } from '../pages/ledger/StockLedgerPage';

import { WarehousesPage } from '../pages/settings/WarehousesPage';
import { ProfilePage } from '../pages/profile/ProfilePage';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Authentication Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Authenticated Layout Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Products */}
          <Route path="/products" element={<ProductsListPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />

          {/* Operations */}
          <Route path="/operations" element={<Navigate to="/operations/receipts" replace />} />
          <Route path="/operations/receipts" element={<ReceiptsPage />} />
          <Route path="/operations/receipts/:id" element={<ReceiptDetailPage />} />
          <Route path="/operations/deliveries" element={<DeliveriesPage />} />
          <Route path="/operations/deliveries/:id" element={<DeliveryDetailPage />} />
          <Route path="/operations/transfers" element={<TransfersPage />} />
          <Route path="/operations/transfers/:id" element={<TransferDetailPage />} />
          <Route path="/operations/adjustments" element={<AdjustmentsPage />} />
          <Route path="/operations/adjustments/:id" element={<AdjustmentDetailPage />} />
          <Route path="/operations/history" element={<StockLedgerPage />} />

          {/* Settings */}
          <Route path="/settings" element={<Navigate to="/settings/warehouses" replace />} />
          <Route path="/settings/warehouses" element={<WarehousesPage />} />

          {/* User Profile */}
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
