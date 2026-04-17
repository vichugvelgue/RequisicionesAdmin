import React from 'react';
import { Search, Download } from 'lucide-react';
import { Button } from '../Button';
import { UnifiedSearchField } from '../UnifiedSearchField';
import type { OptionItem, SearchDateRangeValue } from '../types';

export interface GlobalSearchBarProps {
  searchCriteria: string;
  onSearchCriteriaChange: (value: string) => void;
  criteriaOptions: OptionItem[];
  searchText: string;
  onSearchTextChange: (value: string) => void;
  onSearch: () => void;
  searchPlaceholder?: string;
  onExport?: () => void;
  exportTitle?: string;
  /** Si true, oculta "Buscar": el padre filtra en vivo (coincide con PRD catálogos RH). */
  instantSearch?: boolean;
  blockLabel?: string;
  dateRangeCriteria?: string;
  dateRangeValue?: SearchDateRangeValue | undefined;
  onDateRangeChange?: (value: SearchDateRangeValue | undefined) => void;
}

export function GlobalSearchBar({
  searchCriteria,
  onSearchCriteriaChange,
  criteriaOptions,
  searchText,
  onSearchTextChange,
  onSearch,
  searchPlaceholder = 'Término de búsqueda...',
  onExport,
  exportTitle = 'Exportar a Excel',
  instantSearch = false,
  blockLabel = 'Búsqueda:',
  dateRangeCriteria = 'Fecha',
  dateRangeValue,
  onDateRangeChange,
}: GlobalSearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-end justify-between gap-3 w-full">
      <div className="flex-1 min-w-0 w-full">
        <div
          className="grid w-full gap-3 items-end"
          style={{ gridTemplateColumns: 'repeat(12, minmax(0, 1fr))' }}
        >
          <div className="col-span-12 sm:col-span-4 min-w-0">
            <UnifiedSearchField
              className="w-full min-w-0"
              criteriaOptions={criteriaOptions}
              criteriaValue={searchCriteria}
              onCriteriaChange={onSearchCriteriaChange}
              blockLabel={blockLabel}
              searchValue={searchText}
              onSearchChange={onSearchTextChange}
              placeholder={searchPlaceholder}
              onApplyKeyDown={instantSearch ? undefined : onSearch}
              dateRangeCriteria={dateRangeCriteria}
              dateRangeValue={dateRangeValue}
              onDateRangeChange={onDateRangeChange}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0 flex-wrap w-full sm:w-auto justify-end">
        {!instantSearch ? (
          <Button
            variant="primarySm"
            leftIcon={<Search className="w-3.5 h-3.5" />}
            onClick={onSearch}
          >
            Buscar
          </Button>
        ) : null}
        {onExport ? (
          <Button
            variant="secondary"
            leftIcon={<Download className="w-3.5 h-3.5" />}
            onClick={onExport}
            title={exportTitle}
          >
            Exportar
          </Button>
        ) : null}
      </div>
    </div>
  );
}
