import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from './mockData';

let productsStore = [...INITIAL_PRODUCTS];
let categoriesStore = [...INITIAL_CATEGORIES];

export const productApi = {
  async getProducts({ search = '', categoryId = '', lowStockOnly = false } = {}) {
    await new Promise((res) => setTimeout(res, 150));
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
  },

  async getProductById(id) {
    await new Promise((res) => setTimeout(res, 100));
    const product = productsStore.find((p) => p.id === id);
    if (!product) throw new Error('Product not found');
    return product;
  },

  async getCategories() {
    await new Promise((res) => setTimeout(res, 100));
    return categoriesStore;
  },

  async createProduct(data) {
    await new Promise((res) => setTimeout(res, 200));
    if (!data.name || !data.sku || !data.categoryId) {
      throw new Error('Name, SKU, and Category are required.');
    }
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
};
