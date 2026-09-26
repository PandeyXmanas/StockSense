import { request } from './httpClient';
import { INITIAL_LEDGER } from './mockData';

let ledgerStore = [...INITIAL_LEDGER];

export const ledgerApi = {
  async getLedgerEntries({ movementType = '', search = '', locationId = '' } = {}) {
    try {
      const query = new URLSearchParams();
      if (movementType) query.append('movementType', movementType);
      if (search) query.append('search', search);
      if (locationId) query.append('locationId', locationId);

      const res = await request(`/ledger?${query.toString()}`);
      return res.data || res.entries || res;
    } catch (err) {
      if (err.isNetworkError) {
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
      throw err;
    }
  }
};
