import React, { ReactNode } from 'react';

export interface DataTableProps {
  children: ReactNode;
  tableClassName?: string;
  wrapperClassName?: string;
  /** 'self' = scroll en este wrapper (default). 'parent' = scroll en el contenedor padre (para infinite scroll). */
  scrollContainer?: 'self' | 'parent';
}

export function DataTable({
  children,
  tableClassName = '',
  wrapperClassName = '',
  scrollContainer = 'self',
}: DataTableProps) {
  const hasOwnScroll = scrollContainer === 'self';
  const wrapperClass = hasOwnScroll
    ? `flex-1 min-h-0 w-full overflow-auto bg-white relative custom-scrollbar ${wrapperClassName}`.trim()
    : `flex-1 min-h-0 w-full bg-white relative ${wrapperClassName}`.trim();

  return (
    <div className={wrapperClass}>
      <table
        className={`w-full text-left text-xs text-slate-600 ${tableClassName}`.trim()}
      >
        {children}
      </table>
    </div>
  );
}
