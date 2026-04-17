import React from 'react';
import { Select } from '../Select';
import { SearchInput } from '../SearchInput';
import { DateRangePicker } from '../DateRangePicker/DateRangePicker';
import type { OptionItem, SearchDateRangeValue } from '../types';

/** Campo inferior: sin borde propio; el contenedor aporta el borde redondeado */
const INNER_FIELD =
  'border-0 rounded-none shadow-none focus:ring-0 focus:ring-offset-0';

const EMBEDDED_DATE_TRIGGER = `${INNER_FIELD} focus:ring-1 focus:ring-inset focus:ring-blue-500/30`;

export interface UnifiedSearchFieldProps {
  criteriaOptions: OptionItem[];
  criteriaValue: string;
  onCriteriaChange: (value: string) => void;
  blockLabel?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  onApplyKeyDown?: () => void;
  dateRangeCriteria?: string;
  dateRangeValue?: SearchDateRangeValue | undefined;
  onDateRangeChange?: (value: SearchDateRangeValue | undefined) => void;
  /**
   * Ancho del bloque completo (etiqueta + select + campo).
   * Ej.: `w-full`, `sm:flex-1 sm:max-w-xl` — misma caja para las dos filas.
   */
  className?: string;
}

export function UnifiedSearchField({
  criteriaOptions,
  criteriaValue,
  onCriteriaChange,
  blockLabel = 'Búsqueda:',
  searchValue,
  onSearchChange,
  placeholder = 'Término de búsqueda...',
  onApplyKeyDown,
  dateRangeCriteria = 'Fecha',
  dateRangeValue,
  onDateRangeChange,
  className = '',
}: UnifiedSearchFieldProps) {
  const showDateRange =
    Boolean(onDateRangeChange) && criteriaValue === dateRangeCriteria;

  const pickerValue =
    dateRangeValue?.start && dateRangeValue.start.length > 0
      ? {
          start: dateRangeValue.start,
          end: dateRangeValue.end || dateRangeValue.start,
        }
      : undefined;

  return (
    <div
      className={`min-w-0 w-full flex flex-col gap-1 ${className}`.trim()}
    >
      <div className="flex flex-row items-center gap-2 min-w-0 w-full">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
          {blockLabel}
        </span>
        <div className="min-w-0 flex-1 w-full">
          <Select
            size="compact"
            value={criteriaValue}
            onChange={(e) => onCriteriaChange(e.target.value)}
            aria-label="Criterio de búsqueda"
          >
            {criteriaOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div className="w-full min-w-0 rounded-md border border-slate-300 bg-white overflow-hidden transition-shadow focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500">
        {showDateRange ? (
          <DateRangePicker
            value={pickerValue}
            onChange={onDateRangeChange!}
            placeholder="Rango de fechas"
            className="w-full"
            triggerClassName={EMBEDDED_DATE_TRIGGER}
          />
        ) : (
          <SearchInput
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onApplyKeyDown?.()}
            placeholder={placeholder}
            inputClassName={INNER_FIELD}
          />
        )}
      </div>
    </div>
  );
}
