import { request } from './httpClient';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from './mockData';

let productsStore = [...INITIAL_PRODUCTS];
let categoriesStore = [...INITIAL_CATEGORIES];

export const productApi = {
  async getProducts({ search = '', categoryId = '', lowStockOnly = false } = {}) {
    try {
      const query = new URLSearchParams();
      if (search) query.append('search', search);
      if (categoryId) query.append('categoryId', categoryId);
      if (lowStockOnly) query.append('lowStockOnly', 'true');

      const res = await request(`/products?${query.toString()}`);
      return res.data || res.products || res;
    } catch (err) {
      if (err.isNetworkError) {
        let filtered = [...productsStore];
        if (search.trim()) {
          const q = search.toLowerCase().trim();
          filtered = filtered.filter(
            (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
          );
        }
        if (categoryId) {
          filtered = filtered.filter((p) => p.categoryId === categoryId);
        }
        if (lowStockOnly) {
          filtered = filtered.filter((p) => p.totalStock <= p.minReorderLevel);
        }
        return filtered;
      }
      throw err;
    }
  },

  async getProductById(id) {
    try {
      const res = await request(`/products/${id}`);
      return res.data || res.product || res;
    } catch (err) {
      if (err.isNetworkError) {
        const product = productsStore.find((p) => p.id === id);
        if (!product) throw new Error('Product not found');
        return product;
      }
      throw err;
    }
  },

  async getCategories() {
    try {
      const res = await request('/categories');
      return res.data || res.categories || res;
    } catch (err) {
      if (err.isNetworkError) {
        return categoriesStore;
      }
      throw err;
    }
  },

  async createProduct(data) {
    if (!data.name || !data.sku || !data.categoryId) {
      throw new Error('Name, SKU, and Category are required.');
    }
    try {
      const res = await request('/products', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return res.data || res.product || res;
    } catch (err) {
      if (err.isNetworkError) {
        const existingSku = productsStore.find((p) => p.sku.toUpperCase() === data.sku.toUpperCase());
        if (existingSku) {
          throw new Error(`SKU "${data.sku}" already exists. SKU must be unique.`);
        }
        const cat = categoriesStore.find((c) => c.id === data.categoryId);
        const newProduct = {
          id: `prod-${Date.now()}`,
          name: data.name,
          sku: data.sku.toUpperCase(),
          categoryId: data.categoryId,
          categoryName: cat ? cat.name : 'Uncategorized',
          unitOfMeasure: data.unitOfMeasure || 'pcs',
          minReorderLevel: Number(data.minReorderLevel) || 0,
          totalStock: Number(data.initialStock) || 0,
          stockByLocation: data.initialLocationId
            ? [
                {
                  locationId: data.initialLocationId,
                  locationName: data.initialLocationName || 'Default Location',
                  locationCode: data.initialLocationCode || 'LOC-01',
                  quantity: Number(data.initialStock) || 0
                }
              ]
            : [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        productsStore = [newProduct, ...productsStore];
        return newProduct;
      }
      throw err;
    }
  }
};
