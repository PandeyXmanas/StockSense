import { request } from './httpClient';
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
    try {
      const query = new URLSearchParams();
      if (status) query.append('status', status);
      if (search) query.append('search', search);
      const res = await request(`/receipts?${query.toString()}`);
      return res.data || res.receipts || res;
    } catch (err) {
      if (err.isNetworkError) {
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
      }
      throw err;
    }
  },

  async getReceiptById(id) {
    try {
      const res = await request(`/receipts/${id}`);
      return res.data || res.receipt || res;
    } catch (err) {
      if (err.isNetworkError) {
        const doc = receiptsStore.find((r) => r.id === id);
        if (!doc) throw new Error('Receipt not found');
        return doc;
      }
      throw err;
    }
  },

  async createReceipt(data) {
    try {
      const res = await request('/receipts', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return res.data || res.receipt || res;
    } catch (err) {
      if (err.isNetworkError) {
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
      }
      throw err;
    }
  },

  async validateReceipt(id) {
    try {
      const res = await request(`/receipts/${id}/validate`, { method: 'POST' });
      return res.data || res.receipt || res;
    } catch (err) {
      if (err.isNetworkError) {
        const doc = receiptsStore.find((r) => r.id === id);
        if (!doc) throw new Error('Receipt not found');
        if (doc.status === 'Done') throw new Error('Receipt is already validated and done.');
        if (doc.status === 'Canceled') throw new Error('Cannot validate a canceled receipt.');

        doc.status = 'Done';
        doc.validatedAt = new Date().toISOString();
        return doc;
      }
      throw err;
    }
  },

  // === DELIVERY ORDERS ===
  async getDeliveries({ status = '', search = '' } = {}) {
    try {
      const query = new URLSearchParams();
      if (status) query.append('status', status);
      if (search) query.append('search', search);
      const res = await request(`/deliveries?${query.toString()}`);
      return res.data || res.deliveries || res;
    } catch (err) {
      if (err.isNetworkError) {
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
      }
      throw err;
    }
  },

  async getDeliveryById(id) {
    try {
      const res = await request(`/deliveries/${id}`);
      return res.data || res.delivery || res;
    } catch (err) {
      if (err.isNetworkError) {
        const doc = deliveriesStore.find((d) => d.id === id);
        if (!doc) throw new Error('Delivery Order not found');
        return doc;
      }
      throw err;
    }
  },

  async createDelivery(data) {
    try {
      const res = await request('/deliveries', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return res.data || res.delivery || res;
    } catch (err) {
      if (err.isNetworkError) {
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
      }
      throw err;
    }
  },

  async validateDelivery(id) {
    try {
      const res = await request(`/deliveries/${id}/validate`, { method: 'POST' });
      return res.data || res.delivery || res;
    } catch (err) {
      if (err.isNetworkError) {
        const doc = deliveriesStore.find((d) => d.id === id);
        if (!doc) throw new Error('Delivery Order not found');
        if (doc.status === 'Done') throw new Error('Delivery Order is already validated.');
        if (doc.status === 'Canceled') throw new Error('Cannot validate a canceled delivery order.');

        doc.status = 'Done';
        doc.validatedAt = new Date().toISOString();
        return doc;
      }
      throw err;
    }
  },

  // === INTERNAL TRANSFERS ===
  async getTransfers({ status = '', search = '' } = {}) {
    try {
      const query = new URLSearchParams();
      if (status) query.append('status', status);
      if (search) query.append('search', search);
      const res = await request(`/transfers?${query.toString()}`);
      return res.data || res.transfers || res;
    } catch (err) {
      if (err.isNetworkError) {
        let list = [...transfersStore];
        if (status) list = list.filter((item) => item.status.toLowerCase() === status.toLowerCase());
        if (search.trim()) {
          const q = search.toLowerCase();
          list = list.filter((item) => item.referenceNumber.toLowerCase().includes(q));
        }
        return list;
      }
      throw err;
    }
  },

  async getTransferById(id) {
    try {
      const res = await request(`/transfers/${id}`);
      return res.data || res.transfer || res;
    } catch (err) {
      if (err.isNetworkError) {
        const doc = transfersStore.find((t) => t.id === id);
        if (!doc) throw new Error('Internal Transfer not found');
        return doc;
      }
      throw err;
    }
  },

  async createTransfer(data) {
    if (data.fromLocationId === data.toLocationId) {
      throw new Error('Source and Destination locations must be different for internal transfer.');
    }
    try {
      const res = await request('/transfers', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return res.data || res.transfer || res;
    } catch (err) {
      if (err.isNetworkError) {
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
      }
      throw err;
    }
  },

  async validateTransfer(id) {
    try {
      const res = await request(`/transfers/${id}/validate`, { method: 'POST' });
      return res.data || res.transfer || res;
    } catch (err) {
      if (err.isNetworkError) {
        const doc = transfersStore.find((t) => t.id === id);
        if (!doc) throw new Error('Transfer not found');
        if (doc.status === 'Done') throw new Error('Transfer is already validated.');

        doc.status = 'Done';
        doc.validatedAt = new Date().toISOString();
        return doc;
      }
      throw err;
    }
  },

  // === ADJUSTMENTS ===
  async getAdjustments({ status = '', search = '' } = {}) {
    try {
      const query = new URLSearchParams();
      if (status) query.append('status', status);
      if (search) query.append('search', search);
      const res = await request(`/adjustments?${query.toString()}`);
      return res.data || res.adjustments || res;
    } catch (err) {
      if (err.isNetworkError) {
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
      }
      throw err;
    }
  },

  async getAdjustmentById(id) {
    try {
      const res = await request(`/adjustments/${id}`);
      return res.data || res.adjustment || res;
    } catch (err) {
      if (err.isNetworkError) {
        const doc = adjustmentsStore.find((a) => a.id === id);
        if (!doc) throw new Error('Adjustment record not found');
        return doc;
      }
      throw err;
    }
  },

  async createAdjustment(data) {
    try {
      const res = await request('/adjustments', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return res.data || res.adjustment || res;
    } catch (err) {
      if (err.isNetworkError) {
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
      }
      throw err;
    }
  },

  async validateAdjustment(id) {
    try {
      const res = await request(`/adjustments/${id}/validate`, { method: 'POST' });
      return res.data || res.adjustment || res;
    } catch (err) {
      if (err.isNetworkError) {
        const doc = adjustmentsStore.find((a) => a.id === id);
        if (!doc) throw new Error('Adjustment not found');
        if (doc.status === 'Done') throw new Error('Adjustment is already validated.');

        doc.status = 'Done';
        doc.validatedAt = new Date().toISOString();
        return doc;
      }
      throw err;
    }
  }
};
