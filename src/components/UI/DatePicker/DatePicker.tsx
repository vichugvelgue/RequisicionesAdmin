import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { DayPicker } from 'react-day-picker';
import { es } from 'react-day-picker/locale';
import { Calendar, X } from 'lucide-react';
import 'react-day-picker/style.css';
import '../DateRangePicker/DateRangePicker.css';
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

function parseIsoValue(str: string): Date | undefined {
  if (!str || !str.includes('-')) return undefined;
  const d = new Date(str + 'T12:00:00');
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export interface DatePickerProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLButtonElement>) => void;
}

/**
 * Fecha única con calendario; muestra DD-MMM-YYYY en el disparador y emite ISO yyyy-mm-dd.
 */
export function DatePicker({
  id,
  value,
  onChange,
  placeholder = 'Seleccionar fecha',
  disabled = false,
  className = '',
  triggerClassName = '',
  onKeyDown,
  onBlur,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [popoverRect, setPopoverRect] = useState({ top: 0, left: 0 });

  const selected = parseIsoValue(value);

  const handleSelect = (d: Date | undefined) => {
    if (!d) {
      onChange('');
      return;
    }
    onChange(toInputValue(d));
    setOpen(false);
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

  const displayText = value ? formatDateToDDMMMYYYY(value) : placeholder;
  const hasValue = Boolean(value);
  const showClear = hasValue && !disabled;

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange('');
    setOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`.trim()}>
      <button
        type="button"
        id={id}
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
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
          title="Limpiar fecha"
          aria-label="Limpiar fecha"
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
            aria-label="Seleccionar fecha"
          >
            <div
              className="[&_.rdp-day_button]:!transition-colors [&_.rdp-day_button]:!duration-150
                [&_.rdp-day_button:hover]:!bg-slate-100
                [&_.rdp-selected_.rdp-day_button:hover]:!bg-blue-700"
            >
              <DayPicker
                mode="single"
                selected={selected}
                onSelect={handleSelect}
                defaultMonth={selected ?? new Date()}
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
