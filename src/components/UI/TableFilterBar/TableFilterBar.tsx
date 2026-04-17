import React, { type ReactNode } from 'react';
import { Search } from 'lucide-react';
import { Label } from '../Label';
import { Select } from '../Select';
import { Input } from '../Input';
import { Button } from '../Button';
import { DateInputWithClear } from '../Input/DateInputWithClear';
import { UnifiedSearchField } from '../UnifiedSearchField';
import type {
  TableFilter,
  TableFilterBarAction,
  TableFilterSearch,
  TableFilterSelect,
  TableFilterDate,
  TableFilterCustom,
} from '../types';

const COL_SPAN_CLASS: Record<number, string> = {
  1: 'col-span-1',
  2: 'col-span-2',
  3: 'col-span-3',
  4: 'col-span-4',
  5: 'col-span-5',
  6: 'col-span-6',
  7: 'col-span-7',
  8: 'col-span-8',
  9: 'col-span-9',
  10: 'col-span-10',
  11: 'col-span-11',
  12: 'col-span-12',
};

function getColSpanClass(cols: number | undefined, defaultCols: number): string {
  const c = cols ?? defaultCols;
  return COL_SPAN_CLASS[c] ?? COL_SPAN_CLASS[defaultCols];
}

export interface TableFilterBarProps {
  filters?: TableFilter[];
  gridCols?: number;
  onApply?: () => void;
  applyLabel?: string;
  actions?: TableFilterBarAction[];
  /** Contenido extra junto a Buscar (p. ej. SplitButton con subopciones de exportación) */
  actionsSlot?: ReactNode;
  className?: string;
}

export function TableFilterBar({
  filters = [],
  gridCols = 12,
  onApply,
  applyLabel = 'Buscar',
  actions = [],
  actionsSlot,
  className = '',
}: TableFilterBarProps) {
  function renderFilter(filter: TableFilter, index: number) {
    const { type, cols } = filter;
    const colClass = getColSpanClass(
      cols,
      type === 'search' ? 6 : type === 'custom' ? 4 : 2
    );

    if (type === 'search') {
      const f = filter as TableFilterSearch;
      const {
        criteriaOptions = [],
        criteriaValue = '',
        onCriteriaChange,
        labelInput = 'Búsqueda:',
        searchValue = '',
        onSearchChange,
        placeholder = 'Término de búsqueda...',
        dateRangeCriteria = 'Fecha',
        dateRangeValue,
        onDateRangeChange,
      } = f;
      return (
        <div key={index} className={`${colClass} min-w-0`}>
          <UnifiedSearchField
            className="w-full"
            criteriaOptions={criteriaOptions}
            criteriaValue={criteriaValue}
            onCriteriaChange={(v) => onCriteriaChange?.(v)}
            blockLabel={labelInput}
            searchValue={searchValue}
            onSearchChange={(v) => onSearchChange?.(v)}
            placeholder={placeholder}
            onApplyKeyDown={() => onApply?.()}
            dateRangeCriteria={dateRangeCriteria}
            dateRangeValue={dateRangeValue}
            onDateRangeChange={onDateRangeChange}
          />
        </div>
      );
    }

    if (type === 'select') {
      const f = filter as TableFilterSelect;
      const { label, options = [], value, onChange } = f;
      return (
        <div key={index} className={colClass}>
          <Label>{label}</Label>
          <Select value={value} onChange={(e) => onChange?.(e.target.value)}>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>
      );
    }

    if (type === 'date') {
      const f = filter as TableFilterDate;
      const { label, value, onChange, clearable } = f;
      return (
        <div key={index} className={colClass}>
          <Label>{label}</Label>
          {clearable ? (
            <DateInputWithClear
              value={value ?? ''}
              onChange={(v) => onChange?.(v)}
              onKeyDown={(e) => e.key === 'Enter' && onApply?.()}
            />
          ) : (
            <Input
              type="date"
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onApply?.()}
            />
          )}
        </div>
      );
    }

    if (type === 'custom') {
      const f = filter as TableFilterCustom;
      const { children } = f;
      return (
        <div key={index} className={colClass}>
          {children}
        </div>
      );
    }

    return null;
  }

  const gridClass = 'grid gap-3 items-end w-full';
  const gridStyle = { gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` };

  return (
    <div
      className={`flex flex-col sm:flex-row items-end justify-between gap-3 w-full ${className}`.trim()}
    >
      <div className="flex-1 min-w-0 w-full" style={{ maxWidth: '100%' }}>
        <div className={gridClass} style={gridStyle}>
          {filters.map((f, i) => renderFilter(f, i))}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0 flex-wrap">
        {onApply && (
          <Button
            variant="primarySm"
            leftIcon={<Search className="w-3.5 h-3.5" />}
            onClick={onApply}
          >
            {applyLabel}
          </Button>
        )}
        {actionsSlot}
        {actions.map((action, idx) => (
          <Button
            key={idx}
            variant={(action.variant as 'secondary') || 'secondary'}
            leftIcon={action.icon}
            onClick={action.onClick}
            title={action.title}
            disabled={action.disabled}
          >
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
