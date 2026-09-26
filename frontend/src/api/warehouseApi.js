import { INITIAL_WAREHOUSES, INITIAL_LOCATIONS } from './mockData';

let warehousesStore = [...INITIAL_WAREHOUSES];
let locationsStore = [...INITIAL_LOCATIONS];

export const warehouseApi = {
  async getWarehouses() {
    await new Promise((r) => setTimeout(r, 100));
    return warehousesStore;
  },

  async getLocations(warehouseId = null) {
    await new Promise((r) => setTimeout(r, 100));
    if (warehouseId) {
      return locationsStore.filter((l) => l.warehouseId === warehouseId);
    }
    return locationsStore;
  },

  async createWarehouse(data) {
    await new Promise((r) => setTimeout(r, 150));
    if (!data.name || !data.code) {
      throw new Error('Warehouse Name and Code are required.');
    }
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
  },

  async createLocation(data) {
    await new Promise((r) => setTimeout(r, 150));
    if (!data.name || !data.code || !data.warehouseId) {
      throw new Error('Location Name, Code, and Target Warehouse are required.');
    }
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
};
