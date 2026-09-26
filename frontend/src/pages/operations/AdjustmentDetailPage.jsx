import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { operationApi } from '../../api/operationApi';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export function AdjustmentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [adjustment, setAdjustment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchAdjustment = async () => {
    try {
      const data = await operationApi.getAdjustmentById(id);
      setAdjustment(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdjustment();
  }, [id]);

  const handleValidate = async () => {
    setError('');
    setSuccessMsg('');
    setValidating(true);
    try {
      const updated = await operationApi.validateAdjustment(id);
      setAdjustment(updated);
      setSuccessMsg('Adjustment validated! Post-adjustment inventory now equals the physical count entered.');
    } catch (err) {
      setError(err.message || 'Validation failed.');
    } finally {
      setValidating(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-12 text-center text-slate-500 border border-slate-200 rounded-sm">
        Loading adjustment record details...
      </div>
    );
  }

  if (!adjustment) {
    return (
      <div className="bg-white p-8 text-center text-slate-600 border border-slate-200 rounded-sm space-y-3">
        <p className="font-semibold text-rose-600">Adjustment document not found.</p>
        <Button variant="outline" size="sm" onClick={() => navigate('/operations/adjustments')}>
          Back to Adjustments List
        </Button>
      </div>
    );
  }

  const isDone = adjustment.status === 'Done';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 border border-slate-200 rounded-sm">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            icon={ArrowLeft}
            onClick={() => navigate('/operations/adjustments')}
          >
            Back
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-mono font-bold text-slate-900 tracking-tight">
                {adjustment.referenceNumber}
              </h2>
              <StatusBadge status={adjustment.status} />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Location: {adjustment.locationName}</p>
          </div>
        </div>

        {!isDone && (
          <Button
            variant="success"
            size="md"
            icon={CheckCircle}
            disabled={validating}
            onClick={handleValidate}
          >
            {validating ? 'Validating Adjustment...' : 'Validate Adjustment'}
          </Button>
        )}
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-xs text-rose-700 rounded-xs">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 rounded-xs font-medium flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 border border-slate-200 rounded-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Audited Location
          </span>
          <span className="text-sm font-bold text-slate-900 mt-1 block">
            {adjustment.locationName}
          </span>
        </div>

        <div className="bg-white p-4 border border-slate-200 rounded-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Audit Reason
          </span>
          <span className="text-sm font-semibold text-slate-800 mt-1 block">
            {adjustment.reason}
          </span>
        </div>

        <div className="bg-white p-4 border border-slate-200 rounded-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Created By & Date
          </span>
          <span className="text-sm font-semibold text-slate-800 mt-1 block font-mono">
            {adjustment.createdBy} on {new Date(adjustment.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-sm p-4 space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
          Reconciled Line Items
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-semibold uppercase">
                <th className="px-4 py-2">Product Name</th>
                <th className="px-4 py-2">SKU Code</th>
                <th className="px-4 py-2 text-right">Recorded Qty</th>
                <th className="px-4 py-2 text-right">Counted Physical Qty</th>
                <th className="px-4 py-2 text-right">Adjustment Delta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {adjustment.items?.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-4 py-2.5 font-bold text-slate-900">{item.productName}</td>
                  <td className="px-4 py-2.5 font-mono text-slate-600">{item.sku}</td>
                  <td className="px-4 py-2.5 font-mono text-slate-600 text-right">
                    {item.previousQuantity} {item.unitOfMeasure}
                  </td>
                  <td className="px-4 py-2.5 font-mono font-bold text-slate-900 text-right">
                    {item.countedQuantity} {item.unitOfMeasure}
                  </td>
                  <td
                    className={`px-4 py-2.5 font-mono font-bold text-right ${
                      item.deltaQuantity >= 0 ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {item.deltaQuantity > 0 ? `+${item.deltaQuantity}` : item.deltaQuantity}{' '}
                    {item.unitOfMeasure}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
