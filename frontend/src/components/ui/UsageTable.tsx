import * as React from 'react';

import { cn } from '../../lib/cn';

interface UsageTableColumn {
  label: string;
  align?: 'left' | 'right';
  className?: string;
}

interface UsageTableRow {
  key?: string | number;
  cells: React.ReactNode[];
}

interface UsageTableProps {
  columns: UsageTableColumn[];
  rows: UsageTableRow[];
  emptyMessage: string;
  minWidthClassName?: string;
}

export function UsageTable({ columns, rows, emptyMessage, minWidthClassName = 'min-w-[720px]' }: UsageTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
      <div className="overflow-x-auto">
        <table className={cn('w-full text-left text-sm text-white/80', minWidthClassName)}>
          <thead className="bg-white/[0.04] text-xs uppercase tracking-wide text-white/50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={`${column.label}-${index}`}
                  className={cn('px-3 py-2', column.align === 'right' ? 'text-right' : 'text-left', column.className)}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-3 py-6 text-center text-sm text-white/60">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row, rowIndex) => (
                <tr key={row.key ?? rowIndex} className={rowIndex % 2 === 1 ? 'bg-white/[0.02]' : undefined}>
                  {row.cells.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className={cn(
                        'px-3 py-3',
                        columns[cellIndex]?.align === 'right' ? 'text-right' : 'text-left',
                        columns[cellIndex]?.className,
                      )}
                    >
                      {cell}
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
