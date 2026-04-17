import React from 'react';

export interface TableResultsInfoProps {
  visibleCount: number;
  totalCount: number;
  className?: string;
}

export function TableResultsInfo({
  visibleCount,
  totalCount,
  className = '',
}: TableResultsInfoProps) {
  return (
    <p
      className={`mt-auto shrink-0 px-5 py-2 text-sm text-slate-500 border-t border-slate-200 bg-white rounded-b-lg ${className}`.trim()}
    >
      Mostrando {visibleCount} de {totalCount} resultados.
    </p>
  );
}

