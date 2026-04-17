import React from 'react';
import { Select } from '../Select';
import { Button } from '../Button';

export interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  maxVisiblePages?: number;
  itemsPerPageOptions?: number[];
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (n: number) => void;
  itemsPerPageLabelId?: string;
}

export function PaginationBar({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  maxVisiblePages = 5,
  itemsPerPageOptions = [15, 30, 50, 100],
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageLabelId = 'itemsPerPage',
}: PaginationBarProps) {
  const start = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  const pageNumbers: number[] = [];
  for (let i = 0; i < maxVisiblePages; i++) {
    let pageNum: number;
    if (currentPage <= 3) pageNum = i + 1;
    else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
    else pageNum = currentPage - 2 + i;
    if (pageNum > 0 && pageNum <= totalPages) pageNumbers.push(pageNum);
  }

  return (
    <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex flex-col md:flex-row items-center justify-between shrink-0 gap-3 md:gap-4 overflow-hidden">
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs font-medium text-slate-500 w-full md:w-auto justify-between sm:justify-center">
        <span className="text-center sm:text-left">
          Mostrando <span className="font-bold text-slate-700">{start}</span> a{' '}
          <span className="font-bold text-slate-700">{end}</span> de{' '}
          <span className="font-bold text-slate-700">{totalItems}</span>{' '}
          resultados
        </span>
        <div className="flex items-center gap-2 sm:border-l sm:border-slate-300 sm:pl-4">
          <label htmlFor={itemsPerPageLabelId}>Mostrar:</label>
          <div className="w-20">
            <Select
              id={itemsPerPageLabelId}
              size="compact"
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            >
              {itemsPerPageOptions.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1.5 w-full md:w-auto justify-center overflow-x-auto pb-1 md:pb-0 custom-scrollbar shrink-0">
        <Button
          variant="outline"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          Ant
        </Button>
        <div className="flex items-center gap-1 shrink-0">
          {pageNumbers.map((pageNum) => (
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? 'outlinePageActive' : 'outlinePage'}
              onClick={() => onPageChange(pageNum)}
              className="shrink-0"
            >
              {pageNum}
            </Button>
          ))}
        </div>
        <Button
          variant="outline"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Sig
        </Button>
      </div>
    </div>
  );
}
