import {
  INITIAL_PRODUCTS,
  INITIAL_RECEIPTS,
  INITIAL_DELIVERIES,
  INITIAL_TRANSFERS,
  INITIAL_ADJUSTMENTS
} from './mockData';

export const dashboardApi = {
  async getSummary() {
    await new Promise((r) => setTimeout(r, 150));

    // Calculate real KPIs from mock stores
    const totalProducts = INITIAL_PRODUCTS.length;
    const lowStockItems = INITIAL_PRODUCTS.filter((p) => p.totalStock <= p.minReorderLevel).length;

    const pendingReceipts = INITIAL_RECEIPTS.filter(
      (r) => r.status === 'Draft' || r.status === 'Waiting' || r.status === 'Ready'
    ).length;

    const pendingDeliveries = INITIAL_DELIVERIES.filter(
      (d) => d.status === 'Draft' || d.status === 'Waiting' || d.status === 'Ready'
    ).length;

    const scheduledTransfers = INITIAL_TRANSFERS.filter(
      (t) => t.status === 'Draft' || t.status === 'Waiting' || t.status === 'Ready'
    ).length;

    // Combine recent operations for dashboard table feed
    const allOperations = [
      ...INITIAL_RECEIPTS.map((r) => ({
        id: r.id,
        referenceNumber: r.referenceNumber,
        docType: 'Receipt',
        party: r.supplierName,
        status: r.status,
        date: r.createdAt,
        itemCount: r.items.length
      })),
      ...INITIAL_DELIVERIES.map((d) => ({
        id: d.id,
        referenceNumber: d.referenceNumber,
        docType: 'Delivery',
        party: d.recipientName,
        status: d.status,
        date: d.createdAt,
        itemCount: d.items.length
      })),
      ...INITIAL_TRANSFERS.map((t) => ({
        id: t.id,
        referenceNumber: t.referenceNumber,
        docType: 'Internal Transfer',
        party: `${t.fromLocationName} -> ${t.toLocationName}`,
        status: t.status,
        date: t.createdAt,
        itemCount: t.items.length
      })),
      ...INITIAL_ADJUSTMENTS.map((a) => ({
        id: a.id,
        referenceNumber: a.referenceNumber,
        docType: 'Adjustment',
        party: a.locationName,
        status: a.status,
        date: a.createdAt,
        itemCount: a.items.length
      }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    return {
      kpis: {
        totalProducts,
        lowStockItems,
        pendingReceipts,
        pendingDeliveries,
        scheduledTransfers
      },
      recentOperations: allOperations
    };
  }
};
