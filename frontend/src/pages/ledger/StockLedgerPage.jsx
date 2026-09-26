import React, { useState, useEffect } from 'react';
import { ledgerApi } from '../../api/ledgerApi';
import { warehouseApi } from '../../api/warehouseApi';
import { DataTable } from '../../components/common/DataTable';
import { Search, History, Filter, ArrowDownLeft, ArrowUpRight, ArrowRightLeft, SlidersHorizontal } from 'lucide-react';

export function StockLedgerPage() {
  const [entries, setEntries] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [movementType, setMovementType] = useState('');
  const [locationId, setLocationId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const loadLedger = async () => {
    setLoading(true);
    try {
      const data = await ledgerApi.getLedgerEntries({
        movementType,
        locationId,
        search: searchQuery
      });
      const locs = await warehouseApi.getLocations();
      setEntries(data);
      setLocations(locs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLedger();
  }, [movementType, locationId, searchQuery]);

  const getMovementBadge = (type) => {
    switch (type) {
      case 'RECEIPT':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <ArrowDownLeft className="w-3 h-3 text-emerald-600" />
            RECEIPT (+)
          </span>
        );
      case 'DELIVERY':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <ArrowUpRight className="w-3 h-3 text-rose-600" />
            DELIVERY (-)
          </span>
        );
      case 'TRANSFER_OUT':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs text-[10px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-300">
            <ArrowRightLeft className="w-3 h-3 text-indigo-600" />
            TRANSFER OUT (-)
          </span>
        );
      case 'TRANSFER_IN':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs text-[10px] font-bold bg-indigo-100 text-indigo-900 border border-indigo-300">
            <ArrowRightLeft className="w-3 h-3 text-indigo-600" />
            TRANSFER IN (+)
          </span>
        );
      case 'ADJUSTMENT':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <SlidersHorizontal className="w-3 h-3 text-amber-600" />
            ADJUSTMENT
          </span>
        );
      default:
        return <span className="text-slate-700">{type}</span>;
    }
  };

  const columns = [
    {
      header: 'Timestamp',
      accessorKey: 'createdAt',
      cell: (row) => (
        <span className="font-mono text-slate-500 text-[11px]">
          {new Date(row.createdAt).toLocaleDateString()}{' '}
          {new Date(row.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      )
    },
    {
      header: 'Doc Reference',
      accessorKey: 'referenceNumber',
      cell: (row) => (
        <span className="font-mono font-bold text-slate-900">{row.referenceNumber}</span>
      )
    },
    {
      header: 'Movement Type',
      accessorKey: 'movementType',
      cell: (row) => getMovementBadge(row.movementType)
    },
    {
      header: 'Product Name & SKU',
      accessorKey: 'productName',
      cell: (row) => (
        <div>
          <span className="font-bold text-slate-900 block">{row.productName}</span>
          <span className="text-[10px] font-mono text-slate-500">{row.sku}</span>
        </div>
      )
    },
    {
      header: 'Location Stored',
      accessorKey: 'locationName',
      cell: (row) => <span className="font-medium text-slate-700">{row.locationName}</span>
    },
    {
      header: 'Quantity Delta',
      accessorKey: 'quantityDelta',
      cell: (row) => (
        <span
          className={`font-mono font-bold text-sm ${
            row.quantityDelta > 0 ? 'text-emerald-700' : 'text-rose-700'
          }`}
        >
          {row.quantityDelta > 0 ? `+${row.quantityDelta}` : row.quantityDelta}
        </span>
      )
    },
    {
      header: 'Recorded By',
      accessorKey: 'createdBy',
      cell: (row) => <span className="text-slate-600">{row.createdBy}</span>
    }
  ];

  return (
    <div className="space-y-5">
      {/* Header bar */}
      <div className="bg-white p-4 border border-slate-200 rounded-sm">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <History className="w-5 h-5 text-slate-700" />
          Stock Ledger & Move History
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Auditable record of every stock-changing event across all locations and operations
        </p>
      </div>

      {/* Filter and Search controls */}
      <div className="bg-white p-3 border border-slate-200 rounded-sm flex flex-col md:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="flex-1 relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ledger by product, SKU, reference or location..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-xs focus:ring-1 focus:ring-slate-800 outline-none"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={movementType}
            onChange={(e) => setMovementType(e.target.value)}
            className="p-1.5 text-xs border border-slate-300 rounded-xs bg-white text-slate-800 focus:ring-1 focus:ring-slate-800 outline-none flex-1 md:w-44"
          >
            <option value="">All Movement Types</option>
            <option value="RECEIPT">RECEIPT (+)</option>
            <option value="DELIVERY">DELIVERY (-)</option>
            <option value="TRANSFER_OUT">TRANSFER OUT (-)</option>
            <option value="TRANSFER_IN">TRANSFER IN (+)</option>
            <option value="ADJUSTMENT">ADJUSTMENT</option>
          </select>

          <select
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
            className="p-1.5 text-xs border border-slate-300 rounded-xs bg-white text-slate-800 focus:ring-1 focus:ring-slate-800 outline-none flex-1 md:w-44"
          >
            <option value="">All Locations</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ledger Table */}
      <DataTable
        columns={columns}
        data={entries}
        loading={loading}
        emptyMessage="No stock ledger movements match the current filter criteria."
      />
    </div>
  );
}
