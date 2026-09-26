import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { productApi } from '../../api/productApi';
import { warehouseApi } from '../../api/warehouseApi';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Search, Plus, Filter, AlertTriangle, Eye, Package } from 'lucide-react';

export function ProductsListPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);

  // New product modal state
  const getDefaultProductForm = () => ({
    name: '',
    sku: '',
    categoryId: categories[0]?.id || '',
    unitOfMeasure: 'pcs',
    minReorderLevel: 10,
    initialStock: 0,
    initialLocationId: locations[0]?.id || ''
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState(getDefaultProductForm());
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    try {
      const isLowFilter = searchParams.get('filter') === 'low-stock' || lowStockOnly;
      const prods = await productApi.getProducts({
        search: searchQuery,
        categoryId: selectedCategory,
        lowStockOnly: isLowFilter
      });
      const cats = await productApi.getCategories();
      const locs = await warehouseApi.getLocations();
      setProducts(prods);
      setCategories(cats);
      setLocations(locs);
      if (cats.length > 0 && (!newProduct.categoryId || !cats.some((cat) => cat.id === newProduct.categoryId))) {
        setNewProduct((prev) => ({ ...prev, categoryId: cats[0].id }));
      }
      if (locs.length > 0 && (!newProduct.initialLocationId || !locs.some((loc) => loc.id === newProduct.initialLocationId))) {
        setNewProduct((prev) => ({ ...prev, initialLocationId: locs[0].id }));
      }
    } catch (err) {
      console.error('Error fetching products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchParams.get('filter') === 'low-stock') {
      setLowStockOnly(true);
    }
  }, [searchParams]);

  useEffect(() => {
    loadData();
  }, [searchQuery, selectedCategory, lowStockOnly]);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!newProduct.name.trim()) {
      setFormError('Product name is required.');
      return;
    }
    if (!newProduct.sku.trim()) {
      setFormError('SKU or item code is required.');
      return;
    }
    if (!newProduct.categoryId) {
      setFormError('Please select a product category.');
      return;
    }
    if (!newProduct.initialLocationId) {
      setFormError('Please select the initial storage location.');
      return;
    }
    if (Number(newProduct.minReorderLevel) < 0 || Number(newProduct.initialStock) < 0) {
      setFormError('Stock and reorder values cannot be negative.');
      return;
    }

    setSubmitting(true);

    try {
      const targetLoc = locations.find((l) => l.id === newProduct.initialLocationId);
      await productApi.createProduct({
        ...newProduct,
        name: newProduct.name.trim(),
        sku: newProduct.sku.trim(),
        unitOfMeasure: newProduct.unitOfMeasure.trim() || 'pcs',
        initialLocationName: targetLoc ? targetLoc.name : '',
        initialLocationCode: targetLoc ? targetLoc.code : ''
      });
      setIsModalOpen(false);
      setNewProduct(getDefaultProductForm());
      loadData();
    } catch (err) {
      setFormError(err.message || 'Failed to create product.');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Product Name',
      accessorKey: 'name',
      cell: (row) => (
        <div>
          <span className="font-bold text-slate-900 block">{row.name}</span>
          <span className="text-[11px] text-slate-500 font-mono">SKU: {row.sku}</span>
        </div>
      )
    },
    {
      header: 'Category',
      accessorKey: 'categoryName',
      cell: (row) => (
        <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded-xs text-slate-700 font-medium">
          {row.categoryName}
        </span>
      )
    },
    {
      header: 'Total Stock Available',
      accessorKey: 'totalStock',
      cell: (row) => {
        const isLow = row.totalStock <= row.minReorderLevel;
        return (
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-slate-900 text-sm">
              {row.totalStock} {row.unitOfMeasure}
            </span>
            {isLow && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded-xs">
                <AlertTriangle className="w-3 h-3 text-amber-600" />
                Low Stock
              </span>
            )}
          </div>
        );
      }
    },
    {
      header: 'Reorder Level',
      accessorKey: 'minReorderLevel',
      cell: (row) => (
        <span className="font-mono text-slate-600">
          Min {row.minReorderLevel} {row.unitOfMeasure}
        </span>
      )
    },
    {
      header: 'Locations Count',
      accessorKey: 'stockByLocation',
      cell: (row) => (
        <span className="text-slate-600 font-mono text-[11px]">
          {row.stockByLocation?.length || 0} locations
        </span>
      )
    },
    {
      header: 'Action',
      cell: (row) => (
        <Button
          variant="outline"
          size="sm"
          icon={Eye}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/products/${row.id}`);
          }}
        >
          View Detail
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-5">
      {/* Header action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 border border-slate-200 rounded-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Product Catalog & Stock</h2>
          <p className="text-xs text-slate-500">Manage SKUs, categories, units of measure and location availability</p>
        </div>
        <Button variant="primary" size="md" icon={Plus} onClick={() => setIsModalOpen(true)}>
          Create Product
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 border border-slate-200 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Product Name or SKU code..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-xs focus:ring-1 focus:ring-slate-800 outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-1.5 text-xs border border-slate-300 rounded-xs bg-white text-slate-800 focus:ring-1 focus:ring-slate-800 outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={lowStockOnly}
              onChange={(e) => setLowStockOnly(e.target.checked)}
              className="rounded-xs border-slate-300 text-slate-800 focus:ring-slate-800"
            />
            <span className="font-medium text-slate-800">Low Stock Only</span>
          </label>
        </div>
      </div>

      {/* Products Table */}
      <DataTable
        columns={columns}
        data={products}
        loading={loading}
        emptyMessage="No products found in catalog."
        onRowClick={(row) => navigate(`/products/${row.id}`)}
      />

      {/* Create Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Product Entry"
      >
        {formError && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xs text-xs text-rose-700">
            {formError}
          </div>
        )}

        <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Product Name *</label>
            <input
              type="text"
              required
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              placeholder="e.g. Stainless Steel Pipe 20mm"
              className="w-full p-2 border border-slate-300 rounded-xs focus:ring-1 focus:ring-slate-800 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">SKU / Item Code *</label>
              <input
                type="text"
                required
                value={newProduct.sku}
                onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                placeholder="e.g. PIP-SS-20"
                className="w-full p-2 border border-slate-300 rounded-xs uppercase font-mono focus:ring-1 focus:ring-slate-800 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category *</label>
              <select
                value={newProduct.categoryId}
                onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-xs bg-white focus:ring-1 focus:ring-slate-800 outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Unit of Measure *</label>
              <input
                type="text"
                required
                value={newProduct.unitOfMeasure}
                onChange={(e) => setNewProduct({ ...newProduct, unitOfMeasure: e.target.value })}
                placeholder="pcs, kg, sheet, box..."
                className="w-full p-2 border border-slate-300 rounded-xs focus:ring-1 focus:ring-slate-800 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Min Reorder Level</label>
              <input
                type="number"
                min="0"
                value={newProduct.minReorderLevel}
                onChange={(e) => setNewProduct({ ...newProduct, minReorderLevel: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-xs font-mono focus:ring-1 focus:ring-slate-800 outline-none"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200">
            <h4 className="font-bold text-slate-800 mb-2">Initial Stock Setup (Optional)</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Initial Quantity</label>
                <input
                  type="number"
                  min="0"
                  value={newProduct.initialStock}
                  onChange={(e) => setNewProduct({ ...newProduct, initialStock: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-xs font-mono focus:ring-1 focus:ring-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Storage Location</label>
                <select
                  value={newProduct.initialLocationId}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, initialLocationId: e.target.value })
                  }
                  className="w-full p-2 border border-slate-300 rounded-xs bg-white focus:ring-1 focus:ring-slate-800 outline-none"
                >
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} ({loc.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" disabled={submitting}>
              {submitting ? 'Saving Product...' : 'Save Product'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
