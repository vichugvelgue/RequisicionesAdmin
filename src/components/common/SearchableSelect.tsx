import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Search, Check, X } from 'lucide-react';

export interface SearchableSelectOption {
  value: string;
  label: string;
}

export interface SearchableSelectProps {
  options: SearchableSelectOption[];
  /** Opciones fijas al inicio del listado; no se filtran con el buscador del dropdown. */
  leadingOptions?: SearchableSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  isClearable?: boolean;
  className?: string;
}

interface DropdownRect {
  top: number;
  left: number;
  width: number;
}

export function SearchableSelect({
  options,
  leadingOptions = [],
  value,
  onChange,
  placeholder,
  disabled,
  className = '',
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownRect, setDropdownRect] = useState<DropdownRect | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);

  const allForSelection = useMemo(
    () => [...leadingOptions, ...options],
    [leadingOptions, options]
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const inTrigger = wrapperRef.current && wrapperRef.current.contains(event.target as Node);
      const inDropdown = (event.target as Element).closest('[data-searchable-select-dropdown]');
      if (!inTrigger && !inDropdown) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && !disabled && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownRect({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    } else {
      setDropdownRect(null);
    }
  }, [isOpen, disabled]);

  const filteredRest = options.filter(
    (option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (option.value && option.value.toString().toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const selectedOption = allForSelection.find((opt) => opt.value === value);

  const renderOptionRow = (option: SearchableSelectOption, keyPrefix: string) => (
    <div
      key={`${keyPrefix}-${option.value}`}
      className={`px-3 py-2 text-xs cursor-pointer rounded-md flex justify-between items-center transition-colors ${
        option.value === value
          ? 'bg-blue-50 text-blue-700 font-bold'
          : 'text-slate-700 hover:bg-slate-100'
      }`}
      onClick={() => {
        onChange(option.value);
        setIsOpen(false);
        setSearchTerm('');
      }}
    >
      <span className="truncate pr-4">{option.label}</span>
      {option.value === value && (
        <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
      )}
    </div>
  );

  const listEmpty = leadingOptions.length === 0 && filteredRest.length === 0;

  const dropdownContent = dropdownRect && (
    <div
      data-searchable-select-dropdown
      className="fixed z-[9999] rounded-lg shadow-xl overflow-hidden animate-fade-in border border-slate-200 bg-white"
      style={{
        top: dropdownRect.top,
        left: dropdownRect.left,
        width: dropdownRect.width,
      }}
    >
      <div className="p-2 border-b border-slate-100 relative bg-white">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          className="w-full pl-7 pr-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded outline-none focus:border-blue-500 focus:bg-white transition-colors"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          autoFocus
        />
      </div>
      <div className="max-h-48 overflow-y-auto custom-scrollbar p-1 bg-white">
        {listEmpty ? (
          <div className="px-3 py-4 text-center text-xs text-slate-500">
            No se encontraron coincidencias
          </div>
        ) : (
          <>
            {leadingOptions.map((opt) => renderOptionRow(opt, 'leading'))}
            {leadingOptions.length > 0 && filteredRest.length > 0 ? (
              <div className="my-1 border-t border-slate-100" role="separator" />
            ) : null}
            {filteredRest.map((opt) => renderOptionRow(opt, 'opt'))}
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div
        ref={triggerRef}
        className={`w-full bg-white border ${
          isOpen ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-300'
        } text-slate-700 py-1.5 px-2.5 rounded font-medium outline-none transition-shadow text-xs flex justify-between items-center cursor-pointer ${
          disabled ? 'opacity-50 cursor-not-allowed bg-slate-50' : 'hover:border-slate-400'
        } ${className}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span
          className={`block truncate ${!selectedOption ? 'text-slate-400 font-normal' : ''}`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <div className="flex items-center gap-1 ml-2 shrink-0">
          {value && !disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
                setSearchTerm('');
              }}
              className="text-slate-300 hover:text-slate-500 hover:bg-slate-100 rounded-full p-0.5 transition-colors"
              title="Limpiar selección"
            >
              <X className="w-3 h-3" />
            </button>
          )}
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </div>

      {isOpen &&
        !disabled &&
        dropdownRect &&
        typeof document !== 'undefined' &&
        createPortal(dropdownContent, document.body)}
    </div>
  );
}
