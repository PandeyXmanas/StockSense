import {
  INITIAL_RECEIPTS,
  INITIAL_DELIVERIES,
  INITIAL_TRANSFERS,
  INITIAL_ADJUSTMENTS
} from './mockData';

let receiptsStore = [...INITIAL_RECEIPTS];
let deliveriesStore = [...INITIAL_DELIVERIES];
let transfersStore = [...INITIAL_TRANSFERS];
let adjustmentsStore = [...INITIAL_ADJUSTMENTS];

export const operationApi = {
  // === RECEIPTS ===
  async getReceipts({ status = '', search = '' } = {}) {
    await new Promise((r) => setTimeout(r, 150));
    let list = [...receiptsStore];
    if (status) list = list.filter((item) => item.status.toLowerCase() === status.toLowerCase());
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (item) =>
          item.referenceNumber.toLowerCase().includes(q) ||
          item.supplierName.toLowerCase().includes(q)
      );
    }
    return list;
  },

  async getReceiptById(id) {
    await new Promise((r) => setTimeout(r, 100));
    const doc = receiptsStore.find((r) => r.id === id);
    if (!doc) throw new Error('Receipt not found');
    return doc;
  },

  async createReceipt(data) {
    await new Promise((r) => setTimeout(r, 200));
    const newDoc = {
      id: `rec-${Date.now()}`,
      referenceNumber: `REC-2026-${String(receiptsStore.length + 1).padStart(3, '0')}`,
      supplierName: data.supplierName,
      status: 'Draft',
      createdBy: 'Inventory Manager',
      destinationLocationId: data.destinationLocationId,
      destinationLocationName: data.destinationLocationName || 'Selected Location',
      createdAt: new Date().toISOString(),
      validatedAt: null,
      items: data.items || []
    };
    receiptsStore = [newDoc, ...receiptsStore];
    return newDoc;
  },

  async validateReceipt(id) {
    await new Promise((r) => setTimeout(r, 200));
    const doc = receiptsStore.find((r) => r.id === id);
    if (!doc) throw new Error('Receipt not found');
    if (doc.status === 'Done') throw new Error('Receipt is already validated and done.');
    if (doc.status === 'Canceled') throw new Error('Cannot validate a canceled receipt.');

    doc.status = 'Done';
    doc.validatedAt = new Date().toISOString();
    return doc;
  },

  // === DELIVERY ORDERS ===
  async getDeliveries({ status = '', search = '' } = {}) {
    await new Promise((r) => setTimeout(r, 150));
    let list = [...deliveriesStore];
    if (status) list = list.filter((item) => item.status.toLowerCase() === status.toLowerCase());
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (item) =>
          item.referenceNumber.toLowerCase().includes(q) ||
          item.recipientName.toLowerCase().includes(q)
      );
    }
    return list;
  },

  async getDeliveryById(id) {
    await new Promise((r) => setTimeout(r, 100));
    const doc = deliveriesStore.find((d) => d.id === id);
    if (!doc) throw new Error('Delivery Order not found');
    return doc;
  },

  async createDelivery(data) {
    await new Promise((r) => setTimeout(r, 200));
    const newDoc = {
      id: `del-${Date.now()}`,
      referenceNumber: `DEL-2026-${String(deliveriesStore.length + 1).padStart(3, '0')}`,
      recipientName: data.recipientName,
      status: 'Draft',
      createdBy: 'Inventory Manager',
      sourceLocationId: data.sourceLocationId,
      sourceLocationName: data.sourceLocationName || 'Source Location',
      createdAt: new Date().toISOString(),
      validatedAt: null,
      items: data.items || []
    };
    deliveriesStore = [newDoc, ...deliveriesStore];
    return newDoc;
  },

  async validateDelivery(id) {
    await new Promise((r) => setTimeout(r, 200));
    const doc = deliveriesStore.find((d) => d.id === id);
    if (!doc) throw new Error('Delivery Order not found');
    if (doc.status === 'Done') throw new Error('Delivery Order is already validated.');
    if (doc.status === 'Canceled') throw new Error('Cannot validate a canceled delivery order.');

    doc.status = 'Done';
    doc.validatedAt = new Date().toISOString();
    return doc;
  },

  // === INTERNAL TRANSFERS ===
  async getTransfers({ status = '', search = '' } = {}) {
    await new Promise((r) => setTimeout(r, 150));
    let list = [...transfersStore];
    if (status) list = list.filter((item) => item.status.toLowerCase() === status.toLowerCase());
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((item) => item.referenceNumber.toLowerCase().includes(q));
    }
    return list;
  },

  async getTransferById(id) {
    await new Promise((r) => setTimeout(r, 100));
    const doc = transfersStore.find((t) => t.id === id);
    if (!doc) throw new Error('Internal Transfer not found');
    return doc;
  },

  async createTransfer(data) {
    await new Promise((r) => setTimeout(r, 200));
    if (data.fromLocationId === data.toLocationId) {
      throw new Error('Source and Destination locations must be different for internal transfer.');
    }
    const newDoc = {
      id: `trn-${Date.now()}`,
      referenceNumber: `TRN-2026-${String(transfersStore.length + 1).padStart(3, '0')}`,
      fromLocationId: data.fromLocationId,
      fromLocationName: data.fromLocationName,
      toLocationId: data.toLocationId,
      toLocationName: data.toLocationName,
      status: 'Draft',
      createdBy: 'Warehouse Staff',
      createdAt: new Date().toISOString(),
      validatedAt: null,
      items: data.items || []
    };
    transfersStore = [newDoc, ...transfersStore];
    return newDoc;
  },

  async validateTransfer(id) {
    await new Promise((r) => setTimeout(r, 200));
    const doc = transfersStore.find((t) => t.id === id);
    if (!doc) throw new Error('Transfer not found');
    if (doc.status === 'Done') throw new Error('Transfer is already validated.');

    doc.status = 'Done';
    doc.validatedAt = new Date().toISOString();
    return doc;
  },

  // === ADJUSTMENTS ===
  async getAdjustments({ status = '', search = '' } = {}) {
    await new Promise((r) => setTimeout(r, 150));
    let list = [...adjustmentsStore];
    if (status) list = list.filter((item) => item.status.toLowerCase() === status.toLowerCase());
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (item) =>
          item.referenceNumber.toLowerCase().includes(q) ||
          item.locationName.toLowerCase().includes(q)
      );
    }
    return list;
  },

  async getAdjustmentById(id) {
    await new Promise((r) => setTimeout(r, 100));
    const doc = adjustmentsStore.find((a) => a.id === id);
    if (!doc) throw new Error('Adjustment record not found');
    return doc;
  },

  async createAdjustment(data) {
    await new Promise((r) => setTimeout(r, 200));
    const newDoc = {
      id: `adj-${Date.now()}`,
      referenceNumber: `ADJ-2026-${String(adjustmentsStore.length + 1).padStart(3, '0')}`,
      locationId: data.locationId,
      locationName: data.locationName,
      status: 'Draft',
      createdBy: 'Inventory Manager',
      reason: data.reason || 'Physical Inventory Count Audit',
      createdAt: new Date().toISOString(),
      validatedAt: null,
      items: data.items || []
    };
    adjustmentsStore = [newDoc, ...adjustmentsStore];
    return newDoc;
  },

  async validateAdjustment(id) {
    await new Promise((r) => setTimeout(r, 200));
    const doc = adjustmentsStore.find((a) => a.id === id);
    if (!doc) throw new Error('Adjustment not found');
    if (doc.status === 'Done') throw new Error('Adjustment is already validated.');

    doc.status = 'Done';
    doc.validatedAt = new Date().toISOString();
    return doc;
  }
};
