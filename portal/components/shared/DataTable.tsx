'use client';

import { Inbox } from 'lucide-react';
import React from 'react';

export interface DataTableProps<T> {
  columns: {
    key: string;
    label: string;
    render?: (row: T) => React.ReactNode;
    width?: string;
  }[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

export default function DataTable<T extends Record<string, any>>({ 
  columns, 
  data, 
  loading, 
  emptyMessage = 'No items found', 
  onRowClick 
}: DataTableProps<T>) {
  return (
    <div className="w-full border border-[#222222] rounded-xl overflow-hidden bg-[#0a0a0a]">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-[#111111] border-b border-[#222222] sticky top-0 z-10">
            <tr>
              {columns.map((col) => (
                <th 
                  key={col.key} 
                  className="px-6 py-4 font-medium text-[#a1a1aa]" 
                  style={{ width: col.width }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#222222]">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((col, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 bg-[#1a1a1a] rounded w-3/4"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-16 text-center text-[#71717a]">
                  <div className="flex flex-col items-center justify-center">
                    <Inbox className="w-10 h-10 mb-3 opacity-30" />
                    <p>{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr 
                  key={i} 
                  onClick={() => onRowClick?.(row)}
                  className={`hover:bg-[#1a1a1a] transition-colors ${
                    i % 2 === 0 ? 'bg-[#0a0a0a]' : 'bg-[#0d0d0d]'
                  } ${onRowClick ? 'cursor-pointer' : ''}`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 text-[#e4e4e7]">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

