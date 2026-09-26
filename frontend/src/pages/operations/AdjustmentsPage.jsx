import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { operationApi } from '../../api/operationApi';
import { productApi } from '../../api/productApi';
import { warehouseApi } from '../../api/warehouseApi';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Plus, Search, SlidersHorizontal, Eye } from 'lucide-react';

export function AdjustmentsPage() {
  const [adjustments, setAdjustments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [locationId, setLocationId] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [recordedQty, setRecordedQty] = useState(20);
  const [countedQty, setCountedQty] = useState(18);
  const [reason, setReason] = useState('Physical Inventory Count Reconciliation');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const loadAdjustments = async () => {
    setLoading(true);
    try {
      const data = await operationApi.getAdjustments({ status: statusFilter, search: searchQuery });
      const prods = await productApi.getProducts();
      const locs = await warehouseApi.getLocations();
      setAdjustments(data);
      setProducts(prods);
      setLocations(locs);
      if (locs.length > 0 && !locationId) setLocationId(locs[0].id);
      if (prods.length > 0 && !selectedProductId) {
        setSelectedProductId(prods[0].id);
        setRecordedQty(prods[0].totalStock);
        setCountedQty(prods[0].totalStock);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdjustments();
  }, [statusFilter, searchQuery]);

  const handleProductChange = (prodId) => {
    setSelectedProductId(prodId);
    const p = products.find((pr) => pr.id === prodId);
    if (p) {
      setRecordedQty(p.totalStock);
      setCountedQty(p.totalStock);
    }
  };

  const delta = Number(countedQty) - Number(recordedQty);

  const handleCreateAdjustment = async (e) => {
    e.preventDefault();
    setFormError('');

    setSubmitting(true);
    try {
      const loc = locations.find((l) => l.id === locationId);
      const p = products.find((pr) => pr.id === selectedProductId);

      const items = [
        {
          id: `ai-${Date.now()}`,
          productId: selectedProductId,
          productName: p ? p.name : 'Product',
          sku: p ? p.sku : 'SKU',
          previousQuantity: Number(recordedQty),
          countedQuantity: Number(countedQty),
          deltaQuantity: delta,
          unitOfMeasure: p ? p.unitOfMeasure : 'pcs'
        }
      ];

      await operationApi.createAdjustment({
        locationId,
        locationName: loc ? `${loc.name} (${loc.code})` : 'Location',
        reason,
        items
      });

      setIsModalOpen(false);
      loadAdjustments();
    } catch (err) {
      setFormError(err.message || 'Failed to create adjustment.');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Reference',
      accessorKey: 'referenceNumber',
      cell: (row) => (
        <span className="font-mono font-bold text-slate-900">{row.referenceNumber}</span>
      )
    },
    {
      header: 'Audit Location',
      accessorKey: 'locationName',
      cell: (row) => <span className="font-medium text-slate-800">{row.locationName}</span>
    },
    {
      header: 'Reason',
      accessorKey: 'reason',
      cell: (row) => <span className="text-slate-600 truncate max-w-xs">{row.reason}</span>
    },
    {
      header: 'Created Date',
      accessorKey: 'createdAt',
      cell: (row) => (
        <span className="font-mono text-slate-500 text-[11px]">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      )
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => <StatusBadge status={row.status} />
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
            navigate(`/operations/adjustments/${row.id}`);
          }}
        >
          View Adjustment
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 border border-slate-200 rounded-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-amber-600" />
            Inventory Stock Adjustments
          </h2>
          <p className="text-xs text-slate-500">
            Reconcile physical counted stock against recorded inventory balance.
          </p>
        </div>
        <Button variant="primary" size="md" icon={Plus} onClick={() => setIsModalOpen(true)}>
          Create Stock Adjustment
        </Button>
      </div>

      <div className="bg-white p-3 border border-slate-200 rounded-sm flex flex-col md:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="flex-1 relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Adjustment Reference or Location..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-xs focus:ring-1 focus:ring-slate-800 outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-1.5 text-xs border border-slate-300 rounded-xs bg-white text-slate-800 focus:ring-1 focus:ring-slate-800 outline-none w-full md:w-48"
        >
          <option value="">All Statuses</option>
          <option value="Draft">Draft</option>
          <option value="Done">Done</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={adjustments}
        loading={loading}
        emptyMessage="No stock adjustment records found."
        onRowClick={(row) => navigate(`/operations/adjustments/${row.id}`)}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Record Physical Count Adjustment"
      >
        {formError && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xs text-xs text-rose-700">
            {formError}
          </div>
        )}

        <form onSubmit={handleCreateAdjustment} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Location Audited *</label>
            <select
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-xs bg-white focus:ring-1 focus:ring-slate-800 outline-none"
            >
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} ({loc.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Select Product *</label>
            <select
              value={selectedProductId}
              onChange={(e) => handleProductChange(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-xs bg-white focus:ring-1 focus:ring-slate-800 outline-none"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.sku})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xs">
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Recorded Qty</label>
              <input
                type="number"
                disabled
                value={recordedQty}
                className="w-full p-2 border border-slate-300 bg-slate-100 font-mono text-slate-700 rounded-xs outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">Physical Count *</label>
              <input
                type="number"
                required
                value={countedQty}
                onChange={(e) => setCountedQty(e.target.value)}
                className="w-full p-2 border border-slate-300 font-mono text-slate-900 font-bold rounded-xs focus:ring-1 focus:ring-slate-800 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-600 mb-1">Adjustment Delta</label>
              <div
                className={`w-full p-2 border rounded-xs font-mono font-bold ${
                  delta === 0
                    ? 'border-slate-300 bg-slate-100 text-slate-700'
                    : delta > 0
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                    : 'border-rose-300 bg-rose-50 text-rose-800'
                }`}
              >
                {delta > 0 ? `+${delta}` : delta}
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Adjustment Reason / Notes</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Damage during transport, misplaced items found..."
              className="w-full p-2 border border-slate-300 rounded-xs focus:ring-1 focus:ring-slate-800 outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
            <Button type="button" variant="outline" size="md" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Draft Adjustment'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
