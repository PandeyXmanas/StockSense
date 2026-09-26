import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardApi } from '../../api/dashboardApi';
import { warehouseApi } from '../../api/warehouseApi';
import { productApi } from '../../api/productApi';
import { StatCard } from '../../components/common/StatCard';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import {
  Package,
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowRightLeft,
  Filter,
  RefreshCw,
  Plus
} from 'lucide-react';

export function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [warehouses, setWarehouses] = useState([]);
  const [categories, setCategories] = useState([]);

  // Dashboard Filters (PRD Section 6)
  const [selectedDocType, setSelectedDocType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedWarehouse, setSelectedWarehouse] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const navigate = useNavigate();

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const summary = await dashboardApi.getSummary();
      const whList = await warehouseApi.getWarehouses();
      const catList = await productApi.getCategories();
      setData(summary);
      setWarehouses(whList);
      setCategories(catList);
    } catch (err) {
      console.error('Error loading dashboard summary', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleResetFilters = () => {
    setSelectedDocType('All');
    setSelectedStatus('All');
    setSelectedWarehouse('All');
    setSelectedCategory('All');
  };

  // Filter operations based on controls
  const filteredOperations = data?.recentOperations
    ? data.recentOperations.filter((op) => {
        if (selectedDocType !== 'All' && op.docType.toLowerCase() !== selectedDocType.toLowerCase()) {
          return false;
        }
        if (selectedStatus !== 'All' && op.status.toLowerCase() !== selectedStatus.toLowerCase()) {
          return false;
        }
        return true;
      })
    : [];

  const columns = [
    {
      header: 'Doc Reference',
      accessorKey: 'referenceNumber',
      cell: (row) => (
        <span className="font-mono font-bold text-slate-900 hover:underline">
          {row.referenceNumber}
        </span>
      )
    },
    {
      header: 'Operation Type',
      accessorKey: 'docType',
      cell: (row) => <span className="font-semibold text-slate-700">{row.docType}</span>
    },
    {
      header: 'Party / Locations',
      accessorKey: 'party',
      cell: (row) => <span className="text-slate-600 truncate max-w-xs">{row.party}</span>
    },
    {
      header: 'Line Items',
      accessorKey: 'itemCount',
      cell: (row) => <span className="font-mono text-slate-600">{row.itemCount} items</span>
    },
    {
      header: 'Created Date',
      accessorKey: 'date',
      cell: (row) => (
        <span className="text-slate-500 font-mono text-[11px]">
          {new Date(row.date).toLocaleDateString()}{' '}
          {new Date(row.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      )
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => <StatusBadge status={row.status} />
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 border border-slate-200 rounded-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Stock Operations Overview</h2>
          <p className="text-xs text-slate-500">Real-time inventory status snapshot & operations tracking</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={RefreshCw} onClick={loadDashboard}>
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => navigate('/operations/receipts')}
          >
            New Receipt
          </Button>
        </div>
      </div>

      {/* KPIs Grid (PRD Section 6) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Products in Stock"
          value={data?.kpis.totalProducts ?? 0}
          icon={Package}
          subtitle="Catalog active SKUs"
          onClick={() => navigate('/products')}
        />
        <StatCard
          title="Low / Out of Stock"
          value={data?.kpis.lowStockItems ?? 0}
          icon={AlertTriangle}
          badge={{ label: 'Action Required', colorClass: 'bg-amber-100 text-amber-800' }}
          subtitle="At or below reorder limit"
          onClick={() => navigate('/products?filter=low-stock')}
        />
        <StatCard
          title="Pending Receipts"
          value={data?.kpis.pendingReceipts ?? 0}
          icon={ArrowDownLeft}
          subtitle="Incoming vendor stock"
          onClick={() => navigate('/operations/receipts')}
        />
        <StatCard
          title="Pending Deliveries"
          value={data?.kpis.pendingDeliveries ?? 0}
          icon={ArrowUpRight}
          subtitle="Outgoing customer orders"
          onClick={() => navigate('/operations/deliveries')}
        />
        <StatCard
          title="Transfers Scheduled"
          value={data?.kpis.scheduledTransfers ?? 0}
          icon={ArrowRightLeft}
          subtitle="Internal movement queues"
          onClick={() => navigate('/operations/transfers')}
        />
      </div>

      {/* Operation Filters Toolbar (PRD Section 6) */}
      <div className="bg-white border border-slate-200 rounded-sm p-4 space-y-3 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wide">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Operations Filter Controls</span>
          </div>
          <button
            onClick={handleResetFilters}
            className="text-xs text-slate-500 hover:text-slate-900 underline font-medium"
          >
            Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Filter 1: Document Type */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Document Type
            </label>
            <select
              value={selectedDocType}
              onChange={(e) => setSelectedDocType(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-xs bg-white text-slate-800 focus:ring-1 focus:ring-slate-800 outline-none"
            >
              <option value="All">All Documents</option>
              <option value="Receipt">Receipts (Incoming)</option>
              <option value="Delivery">Delivery Orders (Outgoing)</option>
              <option value="Internal Transfer">Internal Transfers</option>
              <option value="Adjustment">Adjustments</option>
            </select>
          </div>

          {/* Filter 2: Status */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-xs bg-white text-slate-800 focus:ring-1 focus:ring-slate-800 outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Waiting">Waiting</option>
              <option value="Ready">Ready</option>
              <option value="Done">Done</option>
              <option value="Canceled">Canceled</option>
            </select>
          </div>

          {/* Filter 3: Warehouse */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Warehouse / Location
            </label>
            <select
              value={selectedWarehouse}
              onChange={(e) => setSelectedWarehouse(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-xs bg-white text-slate-800 focus:ring-1 focus:ring-slate-800 outline-none"
            >
              <option value="All">All Warehouses</option>
              {warehouses.map((wh) => (
                <option key={wh.id} value={wh.id}>
                  {wh.name} ({wh.code})
                </option>
              ))}
            </select>
          </div>

          {/* Filter 4: Category */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Product Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-xs bg-white text-slate-800 focus:ring-1 focus:ring-slate-800 outline-none"
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Operations Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
            Recent Inventory Operations ({filteredOperations.length})
          </h3>
        </div>

        <DataTable
          columns={columns}
          data={filteredOperations}
          loading={loading}
          emptyMessage="No inventory operations match the selected filter criteria."
          onRowClick={(row) => {
            if (row.docType === 'Receipt') navigate(`/operations/receipts/${row.id}`);
            else if (row.docType === 'Delivery') navigate(`/operations/deliveries/${row.id}`);
            else if (row.docType === 'Internal Transfer') navigate(`/operations/transfers/${row.id}`);
            else if (row.docType === 'Adjustment') navigate(`/operations/adjustments/${row.id}`);
          }}
        />
      </div>
    </div>
  );
}
