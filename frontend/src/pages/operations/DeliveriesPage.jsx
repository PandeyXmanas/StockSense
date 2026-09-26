import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { operationApi } from '../../api/operationApi';
import { productApi } from '../../api/productApi';
import { warehouseApi } from '../../api/warehouseApi';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Plus, Search, ArrowUpRight, Eye, Trash2 } from 'lucide-react';

export function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [recipientName, setRecipientName] = useState('');
  const [sourceLocationId, setSourceLocationId] = useState('');
  const [items, setItems] = useState([{ productId: '', quantity: 1 }]);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const loadDeliveries = async () => {
    setLoading(true);
    try {
      const data = await operationApi.getDeliveries({ status: statusFilter, search: searchQuery });
      const prods = await productApi.getProducts();
      const locs = await warehouseApi.getLocations();
      setDeliveries(data);
      setProducts(prods);
      setLocations(locs);
      if (locs.length > 0 && !sourceLocationId) {
        setSourceLocationId(locs[0].id);
      }
      if (prods.length > 0 && !items[0].productId) {
        setItems([{ productId: prods[0].id, quantity: 1 }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeliveries();
  }, [statusFilter, searchQuery]);

  const handleAddItemRow = () => {
    if (products.length === 0) return;
    setItems([...items, { productId: products[0].id, quantity: 1 }]);
  };

  const handleRemoveItemRow = (idx) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleCreateDelivery = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!recipientName.trim()) {
      setFormError('Recipient / Customer name is required.');
      return;
    }

    setSubmitting(true);
    try {
      const loc = locations.find((l) => l.id === sourceLocationId);
      const formattedItems = items.map((it, idx) => {
        const p = products.find((prod) => prod.id === it.productId);
        return {
          id: `di-${Date.now()}-${idx}`,
          productId: it.productId,
          productName: p ? p.name : 'Product',
          sku: p ? p.sku : 'SKU',
          quantity: Number(it.quantity) || 1,
          unitOfMeasure: p ? p.unitOfMeasure : 'pcs'
        };
      });

      await operationApi.createDelivery({
        recipientName,
        sourceLocationId,
        sourceLocationName: loc ? `${loc.name} (${loc.code})` : 'Source',
        items: formattedItems
      });

      setIsModalOpen(false);
      setRecipientName('');
      loadDeliveries();
    } catch (err) {
      setFormError(err.message || 'Failed to create delivery order.');
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
      header: 'Recipient / Customer',
      accessorKey: 'recipientName',
      cell: (row) => <span className="font-semibold text-slate-800">{row.recipientName}</span>
    },
    {
      header: 'Source Location',
      accessorKey: 'sourceLocationName',
      cell: (row) => <span className="text-slate-600">{row.sourceLocationName}</span>
    },
    {
      header: 'Line Items',
      accessorKey: 'items',
      cell: (row) => <span className="font-mono text-slate-600">{row.items?.length || 0} items</span>
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
            navigate(`/operations/deliveries/${row.id}`);
          }}
        >
          View Order
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 border border-slate-200 rounded-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ArrowUpRight className="w-5 h-5 text-blue-600" />
            Delivery Orders (Outgoing Stock)
          </h2>
          <p className="text-xs text-slate-500">
            Pick, pack and ship stock to customers. Validating decreases inventory balance.
          </p>
        </div>
        <Button variant="primary" size="md" icon={Plus} onClick={() => setIsModalOpen(true)}>
          Create Delivery Order
        </Button>
      </div>

      <div className="bg-white p-3 border border-slate-200 rounded-sm flex flex-col md:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="flex-1 relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Reference Number or Recipient Name..."
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
          <option value="Waiting">Waiting</option>
          <option value="Ready">Ready</option>
          <option value="Done">Done</option>
          <option value="Canceled">Canceled</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={deliveries}
        loading={loading}
        emptyMessage="No delivery order documents found."
        onRowClick={(row) => navigate(`/operations/deliveries/${row.id}`)}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Delivery Order Document"
      >
        {formError && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xs text-xs text-rose-700">
            {formError}
          </div>
        )}

        <form onSubmit={handleCreateDelivery} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Customer / Recipient *</label>
            <input
              type="text"
              required
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="e.g. BuildCorp Construction"
              className="w-full p-2 border border-slate-300 rounded-xs focus:ring-1 focus:ring-slate-800 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Source Location *</label>
            <select
              value={sourceLocationId}
              onChange={(e) => setSourceLocationId(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-xs bg-white focus:ring-1 focus:ring-slate-800 outline-none"
            >
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} ({loc.code})
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-slate-800">Items to Deliver</h4>
              <Button type="button" variant="outline" size="sm" onClick={handleAddItemRow}>
                + Add Item
              </Button>
            </div>

            <div className="space-y-2">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <select
                    value={item.productId}
                    onChange={(e) => {
                      const updated = [...items];
                      updated[idx].productId = e.target.value;
                      setItems(updated);
                    }}
                    className="flex-1 p-2 border border-slate-300 rounded-xs bg-white focus:ring-1 focus:ring-slate-800 outline-none"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.sku}) [Available: {p.totalStock} {p.unitOfMeasure}]
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => {
                      const updated = [...items];
                      updated[idx].quantity = e.target.value;
                      setItems(updated);
                    }}
                    placeholder="Qty"
                    className="w-24 p-2 border border-slate-300 rounded-xs font-mono focus:ring-1 focus:ring-slate-800 outline-none"
                  />

                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItemRow(idx)}
                      className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xs"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
            <Button type="button" variant="outline" size="md" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Draft Delivery'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
