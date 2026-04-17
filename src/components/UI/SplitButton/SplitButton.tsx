import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { ButtonVariant } from '../types';

export interface SplitButtonMenuItem {
  id: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export interface SplitButtonProps {
  label: string;
  onPrimaryClick: () => void;
  items: SplitButtonMenuItem[];
  leftIcon?: ReactNode;
  variant?: Extract<ButtonVariant, 'secondary' | 'primary' | 'outline'>;
  title?: string;
  disabled?: boolean;
}

const SPLIT_VARIANTS: Record<NonNullable<SplitButtonProps['variant']>, string> = {
  secondary:
    'bg-green-50 hover:bg-green-100 text-green-700 border border-green-200',
  primary:
    'bg-blue-600 hover:bg-blue-700 text-white border border-blue-600',
  outline:
    'bg-white hover:bg-slate-50 text-slate-600 border border-slate-300',
};

export function SplitButton({
  label,
  onPrimaryClick,
  items,
  leftIcon,
  variant = 'secondary',
  title,
  disabled = false,
}: SplitButtonProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (!rootRef.current) return;
      if (rootRef.current.contains(event.target as Node)) return;
      setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const variantClass = useMemo(
    () => SPLIT_VARIANTS[variant] ?? SPLIT_VARIANTS.secondary,
    [variant]
  );

  const buttonBase =
    `${variantClass} text-xs font-semibold transition-colors h-[32px] inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed`;

  return (
    <div className="relative inline-flex items-center" ref={rootRef}>
      <button
        type="button"
        onClick={onPrimaryClick}
        disabled={disabled}
        title={title}
        className={`${buttonBase} rounded-l px-3 gap-1.5`}
      >
        {leftIcon}
        {label}
      </button>
      <button
        type="button"
        disabled={disabled || items.length === 0}
        onClick={() => setOpen((prev) => !prev)}
        className={`${buttonBase} rounded-r px-2 border-l-0`}
        aria-haspopup="menu"
        aria-expanded={open}
        title="Más opciones"
      >
        <ChevronDown className="w-3.5 h-3.5" />
      </button>

      {open && items.length > 0 && (
        <div
          className="absolute right-0 top-[calc(100%+4px)] min-w-[180px] rounded-md border border-slate-200 bg-white shadow-lg z-40 py-1"
          role="menu"
        >
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              disabled={item.disabled}
              className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => {
                item.onClick();
                setOpen(false);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
