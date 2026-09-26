import React from 'react';

export function DataTable({ columns, data, loading, emptyMessage = 'No records found', onRowClick }) {
  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-sm p-12 text-center text-slate-500">
        <div className="inline-block animate-spin w-6 h-6 border-2 border-slate-300 border-t-slate-800 rounded-full mb-3" />
        <p className="text-xs font-medium">Loading inventory data...</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              {columns.map((col, idx) => (
                <th key={idx} className={`px-4 py-3 ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {data && data.length > 0 ? (
              data.map((row, rowIdx) => (
                <tr
                  key={row.id || rowIdx}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`transition-colors ${
                    onRowClick ? 'cursor-pointer hover:bg-slate-50' : 'hover:bg-slate-50/50'
                  }`}
                >
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className={`px-4 py-3 text-slate-700 ${col.className || ''}`}>
                      {col.cell ? col.cell(row) : row[col.accessorKey]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-slate-400">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
