import { request } from './httpClient';
import { INITIAL_WAREHOUSES, INITIAL_LOCATIONS } from './mockData';

let warehousesStore = [...INITIAL_WAREHOUSES];
let locationsStore = [...INITIAL_LOCATIONS];

export const warehouseApi = {
  async getWarehouses() {
    try {
      const res = await request('/warehouses');
      const payload = res?.data ?? res?.warehouses ?? res ?? [];
      if (Array.isArray(payload) && payload.length === 0) {
        return [...warehousesStore];
      }
      return payload;
    } catch (err) {
      if (err.isNetworkError) {
        return warehousesStore;
      }
      throw err;
    }
  },

  async getLocations(warehouseId = null) {
    try {
      const endpoint = warehouseId ? `/locations?warehouseId=${warehouseId}` : '/locations';
      const res = await request(endpoint);
      const payload = res?.data ?? res?.locations ?? res ?? [];
      if (Array.isArray(payload) && payload.length === 0) {
        if (warehouseId) {
          return locationsStore.filter((l) => l.warehouseId === warehouseId);
        }
        return [...locationsStore];
      }
      return payload;
    } catch (err) {
      if (err.isNetworkError) {
        if (warehouseId) {
          return locationsStore.filter((l) => l.warehouseId === warehouseId);
        }
        return locationsStore;
      }
      throw err;
    }
  },

  async createWarehouse(data) {
    if (!data.name || !data.code) {
      throw new Error('Warehouse Name and Code are required.');
    }
    try {
      const res = await request('/warehouses', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return res.data || res.warehouse || res;
    } catch (err) {
      if (err.isNetworkError) {
        const newWh = {
          id: `wh-${Date.now()}`,
          name: data.name,
          code: data.code.toUpperCase(),
          address: data.address || '',
          locationsCount: 0,
          totalItems: 0
        };
        warehousesStore = [...warehousesStore, newWh];
        return newWh;
      }
      throw err;
    }
  },

  async createLocation(data) {
    if (!data.name || !data.code || !data.warehouseId) {
      throw new Error('Location Name, Code, and Target Warehouse are required.');
    }
    try {
      const res = await request('/locations', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return res.data || res.location || res;
    } catch (err) {
      if (err.isNetworkError) {
        const wh = warehousesStore.find((w) => w.id === data.warehouseId);
        const newLoc = {
          id: `loc-${Date.now()}`,
          warehouseId: data.warehouseId,
          warehouseName: wh ? wh.name : 'Unknown Warehouse',
          name: data.name,
          code: data.code.toUpperCase()
        };
        locationsStore = [...locationsStore, newLoc];
        return newLoc;
      }
      throw err;
    }
  }
};
