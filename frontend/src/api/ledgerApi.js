import { INITIAL_LEDGER } from './mockData';

let ledgerStore = [...INITIAL_LEDGER];

export const ledgerApi = {
  async getLedgerEntries({ movementType = '', search = '', locationId = '' } = {}) {
    await new Promise((r) => setTimeout(r, 150));
    let list = [...ledgerStore];

    if (movementType) {
      list = list.filter((e) => e.movementType === movementType);
    }

    if (locationId) {
      list = list.filter((e) => e.locationId === locationId);
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (e) =>
          e.productName.toLowerCase().includes(q) ||
          e.sku.toLowerCase().includes(q) ||
          e.referenceNumber.toLowerCase().includes(q) ||
          e.locationName.toLowerCase().includes(q)
      );
    }

    return list;
  }
};
