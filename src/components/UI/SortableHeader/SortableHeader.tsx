import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import type { SortConfig } from '../types';

export interface SortableHeaderProps {
  columnKey: string;
  label: string;
  width?: string;
  sortConfig: SortConfig;
  onSort: (key: string) => void;
}

export function SortableHeader({
  columnKey,
  label,
  width = '',
  sortConfig,
  onSort,
}: SortableHeaderProps) {
  const isActive = sortConfig.key === columnKey;
  return (
    <th
      className={`px-3 py-2 font-bold border-r border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors whitespace-nowrap ${width} group`.trim()}
      onClick={() => onSort(columnKey)}
    >
      <div className="flex items-center justify-between">
        <span>{label}</span>
        <span className="text-slate-400 flex-shrink-0 ml-1">
          {isActive ? (
            sortConfig.direction === 'asc' ? (
              <ChevronUp className="w-3 h-3 text-blue-600" />
            ) : (
              <ChevronDown className="w-3 h-3 text-blue-600" />
            )
          ) : (
            <ChevronDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </span>
      </div>
    </th>
  );
}
