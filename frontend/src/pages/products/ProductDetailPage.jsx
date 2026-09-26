import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productApi } from '../../api/productApi';
import { Button } from '../../components/common/Button';
import { ArrowLeft, Package, MapPin, AlertTriangle, Layers, Calendar } from 'lucide-react';

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetail() {
      try {
        const p = await productApi.getProductById(id);
        setProduct(p);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-white p-12 text-center text-slate-500 border border-slate-200 rounded-sm">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-white p-8 text-center text-slate-600 border border-slate-200 rounded-sm space-y-3">
        <p className="font-semibold text-rose-600">Product not found.</p>
        <Button variant="outline" size="sm" onClick={() => navigate('/products')}>
          Back to Products List
        </Button>
      </div>
    );
  }

  const isLowStock = product.totalStock <= product.minReorderLevel;

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex items-center justify-between bg-white p-4 border border-slate-200 rounded-sm">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            icon={ArrowLeft}
            onClick={() => navigate('/products')}
          >
            Back
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">{product.name}</h2>
              <span className="font-mono text-xs px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-300 rounded-xs">
                {product.sku}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Category: {product.categoryName}</p>
          </div>
        </div>

        {isLowStock && (
          <div className="flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-300 px-3 py-1 rounded-xs text-xs font-semibold">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Low Stock Warning (Current ≤ Min Reorder Level)</span>
          </div>
        )}
      </div>

      {/* Product Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 border border-slate-200 rounded-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Total Inventory Stock
          </span>
          <div className="mt-1 text-2xl font-bold font-mono text-slate-900">
            {product.totalStock} <span className="text-sm font-normal">{product.unitOfMeasure}</span>
          </div>
        </div>

        <div className="bg-white p-4 border border-slate-200 rounded-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Min Reorder Threshold
          </span>
          <div className="mt-1 text-2xl font-bold font-mono text-slate-900">
            {product.minReorderLevel} <span className="text-sm font-normal">{product.unitOfMeasure}</span>
          </div>
        </div>

        <div className="bg-white p-4 border border-slate-200 rounded-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Unit of Measure
          </span>
          <div className="mt-1 text-base font-bold text-slate-800 uppercase font-mono">
            {product.unitOfMeasure}
          </div>
        </div>

        <div className="bg-white p-4 border border-slate-200 rounded-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Locations Stored
          </span>
          <div className="mt-1 text-2xl font-bold font-mono text-slate-900">
            {product.stockByLocation?.length || 0}
          </div>
        </div>
      </div>

      {/* Location-wise Stock Availability Table (PRD Section 8) */}
      <div className="bg-white border border-slate-200 rounded-sm p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-500" />
            Stock Breakdown per Warehouse Location
          </h3>
          <span className="text-xs text-slate-500">Location-aware stock availability</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-semibold uppercase">
                <th className="px-4 py-2">Location Name</th>
                <th className="px-4 py-2">Location Code</th>
                <th className="px-4 py-2 text-right">Available Quantity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {product.stockByLocation && product.stockByLocation.length > 0 ? (
                product.stockByLocation.map((loc, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="px-4 py-2.5 font-medium text-slate-800">{loc.locationName}</td>
                    <td className="px-4 py-2.5 font-mono text-slate-600">{loc.locationCode}</td>
                    <td className="px-4 py-2.5 font-mono font-bold text-slate-900 text-right">
                      {loc.quantity} {product.unitOfMeasure}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-slate-400">
                    No physical stock registered in any location.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
