import React, { useState, useEffect } from 'react';
import { warehouseApi } from '../../api/warehouseApi';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Building2, MapPin, Plus } from 'lucide-react';

export function WarehousesPage() {
  const [warehouses, setWarehouses] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isWhModalOpen, setIsWhModalOpen] = useState(false);
  const [isLocModalOpen, setIsLocModalOpen] = useState(false);

  // Form states
  const [whForm, setWhForm] = useState({ name: '', code: '', address: '' });
  const [locForm, setLocForm] = useState({ name: '', code: '', warehouseId: '' });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const whList = await warehouseApi.getWarehouses();
      const locList = await warehouseApi.getLocations();
      setWarehouses(whList);
      setLocations(locList);
      if (whList.length > 0 && !locForm.warehouseId) {
        setLocForm((prev) => ({ ...prev, warehouseId: whList[0].id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateWarehouse = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      await warehouseApi.createWarehouse(whForm);
      setIsWhModalOpen(false);
      setWhForm({ name: '', code: '', address: '' });
      loadData();
    } catch (err) {
      setFormError(err.message || 'Failed to create warehouse.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateLocation = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      await warehouseApi.createLocation(locForm);
      setIsLocModalOpen(false);
      setLocForm({ name: '', code: '', warehouseId: warehouses[0]?.id || '' });
      loadData();
    } catch (err) {
      setFormError(err.message || 'Failed to create location.');
    } finally {
      setSubmitting(false);
    }
  };

  const whColumns = [
    {
      header: 'Warehouse Name',
      accessorKey: 'name',
      cell: (row) => (
        <div>
          <span className="font-bold text-slate-900 block">{row.name}</span>
          <span className="text-[11px] text-slate-500">{row.address || 'No physical address configured'}</span>
        </div>
      )
    },
    {
      header: 'Code',
      accessorKey: 'code',
      cell: (row) => (
        <span className="font-mono font-bold text-xs px-2 py-0.5 bg-slate-100 border border-slate-200 rounded-xs text-slate-800">
          {row.code}
        </span>
      )
    },
    {
      header: 'Locations Count',
      cell: (row) => {
        const count = locations.filter((l) => l.warehouseId === row.id).length;
        return <span className="font-mono text-slate-700">{count} sub-locations</span>;
      }
    }
  ];

  const locColumns = [
    {
      header: 'Location Name',
      accessorKey: 'name',
      cell: (row) => <span className="font-bold text-slate-900">{row.name}</span>
    },
    {
      header: 'Location Code',
      accessorKey: 'code',
      cell: (row) => (
        <span className="font-mono text-xs text-slate-700 px-2 py-0.5 bg-slate-100 border border-slate-200 rounded-xs">
          {row.code}
        </span>
      )
    },
    {
      header: 'Belongs to Warehouse',
      accessorKey: 'warehouseName',
      cell: (row) => <span className="font-medium text-slate-700">{row.warehouseName}</span>
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 border border-slate-200 rounded-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-5 h-5 text-slate-700" />
            Warehouses & Location Configuration
          </h2>
          <p className="text-xs text-slate-500">
            Define multi-warehouse structures and location racks for location-aware inventory
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={Plus} onClick={() => setIsLocModalOpen(true)}>
            Add Location
          </Button>
          <Button variant="primary" size="sm" icon={Plus} onClick={() => setIsWhModalOpen(true)}>
            Add Warehouse
          </Button>
        </div>
      </div>

      {/* Warehouses Table */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
          <Building2 className="w-4 h-4 text-slate-500" />
          Configured Warehouses ({warehouses.length})
        </h3>
        <DataTable
          columns={whColumns}
          data={warehouses}
          loading={loading}
          emptyMessage="No warehouses configured."
        />
      </div>

      {/* Locations Table */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
          <MapPin className="w-4 h-4 text-slate-500" />
          Configured Storage Locations & Racks ({locations.length})
        </h3>
        <DataTable
          columns={locColumns}
          data={locations}
          loading={loading}
          emptyMessage="No sub-locations configured."
        />
      </div>

      {/* Modal Add Warehouse */}
      <Modal
        isOpen={isWhModalOpen}
        onClose={() => setIsWhModalOpen(false)}
        title="Add New Warehouse Facility"
      >
        {formError && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xs text-xs text-rose-700">
            {formError}
          </div>
        )}

        <form onSubmit={handleCreateWarehouse} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Warehouse Name *</label>
            <input
              type="text"
              required
              value={whForm.name}
              onChange={(e) => setWhForm({ ...whForm, name: e.target.value })}
              placeholder="e.g. South Logistics Depot"
              className="w-full p-2 border border-slate-300 rounded-xs focus:ring-1 focus:ring-slate-800 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Warehouse Code *</label>
            <input
              type="text"
              required
              value={whForm.code}
              onChange={(e) => setWhForm({ ...whForm, code: e.target.value })}
              placeholder="e.g. WH-SOUTH"
              className="w-full p-2 border border-slate-300 rounded-xs font-mono uppercase focus:ring-1 focus:ring-slate-800 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Physical Address</label>
            <input
              type="text"
              value={whForm.address}
              onChange={(e) => setWhForm({ ...whForm, address: e.target.value })}
              placeholder="e.g. 88 Logistics Way"
              className="w-full p-2 border border-slate-300 rounded-xs focus:ring-1 focus:ring-slate-800 outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
            <Button type="button" variant="outline" size="md" onClick={() => setIsWhModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Warehouse'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Add Location */}
      <Modal
        isOpen={isLocModalOpen}
        onClose={() => setIsLocModalOpen(false)}
        title="Add Storage Location / Rack"
      >
        {formError && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xs text-xs text-rose-700">
            {formError}
          </div>
        )}

        <form onSubmit={handleCreateLocation} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Parent Warehouse *</label>
            <select
              value={locForm.warehouseId}
              onChange={(e) => setLocForm({ ...locForm, warehouseId: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded-xs bg-white focus:ring-1 focus:ring-slate-800 outline-none"
            >
              {warehouses.map((wh) => (
                <option key={wh.id} value={wh.id}>
                  {wh.name} ({wh.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Location Name *</label>
            <input
              type="text"
              required
              value={locForm.name}
              onChange={(e) => setLocForm({ ...locForm, name: e.target.value })}
              placeholder="e.g. Rack C - Shelf 2"
              className="w-full p-2 border border-slate-300 rounded-xs focus:ring-1 focus:ring-slate-800 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Location Code *</label>
            <input
              type="text"
              required
              value={locForm.code}
              onChange={(e) => setLocForm({ ...locForm, code: e.target.value })}
              placeholder="e.g. LOC-RACK-C2"
              className="w-full p-2 border border-slate-300 rounded-xs font-mono uppercase focus:ring-1 focus:ring-slate-800 outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
            <Button type="button" variant="outline" size="md" onClick={() => setIsLocModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Location'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
