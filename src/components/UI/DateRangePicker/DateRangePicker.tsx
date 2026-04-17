import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { DayPicker } from 'react-day-picker';
import type { DateRange } from 'react-day-picker';
import { es } from 'react-day-picker/locale';
import { Calendar, X } from 'lucide-react';
import 'react-day-picker/style.css';
import './DateRangePicker.css';
import {
  formatDateToDDMMMYYYY,
  formatMonthYearCaption,
} from '../../../utils/dateFormat';

function toInputValue(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parseInputValue(str: string): Date | null {
  if (!str || !str.includes('-')) return null;
  const d = new Date(str + 'T12:00:00');
  return Number.isNaN(d.getTime()) ? null : d;
}

export interface DateRangeValue {
  start: string;
  end: string;
}

export interface DateRangePickerProps {
  id?: string;
  value?: DateRangeValue | undefined;
  onChange: (value: DateRangeValue | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  /** Clases extra para el botón disparador (p. ej. embebido sin borde propio) */
  triggerClassName?: string;
}

export function DateRangePicker({
  id,
  value,
  onChange,
  placeholder = 'Seleccionar rango de fechas',
  disabled = false,
  className = '',
  triggerClassName = '',
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [popoverRect, setPopoverRect] = useState({ top: 0, left: 0 });

  const selectedRange: DateRange | undefined = value?.start
    ? {
        from: parseInputValue(value.start) ?? undefined,
        to: value.end ? (parseInputValue(value.end) ?? undefined) : undefined,
      }
    : undefined;

  const handleSelect = (range: DateRange | undefined) => {
    if (!range?.from) {
      onChange(undefined);
      return;
    }
    const start = toInputValue(range.from);
    const end = range.to ? toInputValue(range.to) : start;
    onChange({ start, end });
  };

  useEffect(() => {
    if (!open || !containerRef.current) return;
    const el = containerRef.current;
    const rect = el.getBoundingClientRect();
    setPopoverRect({
      top: rect.bottom + 4,
      left: rect.left,
    });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        containerRef.current?.contains(target) ||
        popoverRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const displayText = value?.start
    ? value.end && value.end !== value.start
      ? `${formatDateToDDMMMYYYY(value.start)} – ${formatDateToDDMMMYYYY(value.end)}`
      : formatDateToDDMMMYYYY(value.start)
    : placeholder;

  const hasValue = Boolean(value?.start);
  const showClear = hasValue && !disabled;

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(undefined);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`.trim()}>
      <button
        type="button"
        id={id}
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        className={`w-full flex items-center gap-2 bg-white border border-slate-300 text-slate-700 py-1.5 px-2.5 rounded font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-shadow text-xs text-left ${
          disabled ? 'bg-slate-100 cursor-not-allowed text-slate-500' : ''
        } ${!hasValue ? 'text-slate-400' : ''} ${showClear ? 'pr-8' : ''} ${triggerClassName}`.trim()}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <Calendar className="w-4 h-4 shrink-0 text-slate-500" />
        <span className="flex-1 min-w-0 truncate text-left">{displayText}</span>
      </button>
      {showClear && (
        <button
          type="button"
          onClick={handleClear}
          onMouseDown={(e) => e.preventDefault()}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors z-[1]"
          title="Limpiar rango"
          aria-label="Limpiar rango de fechas"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}

      {open &&
        createPortal(
          <div
            ref={popoverRef}
            className="date-range-picker-popover fixed z-[9999] w-max max-w-[95vw] p-2 bg-white border border-slate-200 rounded-lg shadow-xl"
            style={{
              top: popoverRect.top,
              left: popoverRect.left,
            }}
            role="dialog"
            aria-label="Seleccionar rango de fechas"
          >
            <div
              className="rdp-date-range-compact
                [&_.rdp-months]:!flex [&_.rdp-months]:!flex-nowrap
                [&_.rdp-day_button]:!transition-colors [&_.rdp-day_button]:!duration-150
                [&_.rdp-day_button:hover]:!bg-slate-100
                [&_.rdp-selected_.rdp-day_button:hover]:!bg-blue-700
                [&_.rdp-range_middle_.rdp-day_button:hover]:!bg-blue-200
                [&_.rdp-range_start_.rdp-day_button:hover]:!bg-blue-700
                [&_.rdp-range_end_.rdp-day_button:hover]:!bg-blue-700"
            >
              <DayPicker
                mode="range"
                numberOfMonths={2}
                selected={selectedRange}
                onSelect={handleSelect}
                defaultMonth={selectedRange?.from ?? new Date()}
                locale={es}
                formatters={{
                  formatCaption: (month) => formatMonthYearCaption(month),
                }}
              />
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
