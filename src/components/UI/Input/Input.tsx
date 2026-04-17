import React, { useState, useCallback, useEffect } from 'react';
import type { InputVariant } from '../types';

const DISABLED_BASE =
  'w-full bg-brand-secondary/15 border border-brand-neutral/15 text-brand-neutral/60 rounded font-medium outline-none text-xs cursor-not-allowed';

const VARIANTS: Record<InputVariant, string> = {
  default:
    'w-full bg-brand-white border border-brand-neutral/30 text-brand-neutral py-1.5 px-2.5 rounded font-medium outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-shadow text-xs',
  search:
    'w-full bg-brand-white border border-brand-neutral/30 text-brand-neutral py-1.5 pl-8 pr-2.5 rounded outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-shadow text-xs',
  filter:
    'w-full px-1.5 py-1 text-[10px] rounded border border-brand-neutral/20 outline-none focus:border-brand-primary bg-brand-white',
  disabled: `${DISABLED_BASE} py-1.5 px-2.5`,
  numberCell:
    'w-full px-2 py-1 text-xs font-semibold text-brand-neutral bg-brand-white border border-brand-neutral/30 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary rounded shadow-sm outline-none transition-all text-right',
  quantity:
    'w-full bg-brand-white border border-brand-neutral/30 text-brand-neutral py-1.5 px-2.5 rounded font-medium outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-shadow text-xs text-right tabular-nums',
  searchLarge:
    'w-full pl-10 pr-4 py-2 bg-brand-white border border-brand-neutral/30 text-brand-neutral rounded placeholder:text-brand-neutral/55 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all text-sm font-medium',
  gridFilter: 'flex-1 text-xs border-none outline-none text-brand-neutral placeholder:text-brand-neutral/55',
};

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: InputVariant;
  type?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
  min?: number | string;
  max?: number | string;
  step?: string;
  maxLength?: number;
}

export function Input({
  variant = 'default',
  type = 'text',
  value,
  onChange,
  onKeyDown,
  onBlur,
  onFocus,
  placeholder,
  className = '',
  disabled,
  id,
  min,
  max,
  step,
  maxLength,
  ...rest
}: InputProps) {
  const [numberEditValue, setNumberEditValue] = useState<string | null>(null);
  const isEditingNumber = type === 'number' && numberEditValue !== null;

  const displayValue =
    isEditingNumber
      ? numberEditValue
      : (value === undefined || value === null ? '' : String(value));
  const hasExternalValue = value !== undefined && value !== null;

  useEffect(() => {
    if (type !== 'number') {
      setNumberEditValue(null);
    }
  }, [type]);

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (type === 'number' && !disabled) {
        setNumberEditValue(value === undefined || value === null ? '' : String(value));
      }
      onFocus?.(e);
    },
    [type, disabled, value, onFocus]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (type === 'number' && numberEditValue !== null) {
        setNumberEditValue(e.target.value);
      }
      onChange?.(e);
    },
    [type, numberEditValue, onChange]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (type === 'number') {
        setNumberEditValue(null);
      }
      onBlur?.(e);
    },
    [type, onBlur]
  );

  let baseClass: string;
  if (disabled && variant !== 'disabled') {
    if (variant === 'search') {
      baseClass = `${DISABLED_BASE} py-1.5 pl-8 pr-2.5`;
    } else if (variant === 'searchLarge') {
      baseClass = `${DISABLED_BASE} pl-10 pr-4 py-2 text-sm placeholder:text-slate-400`;
    } else if (variant === 'quantity') {
      baseClass = `${DISABLED_BASE} py-1.5 px-2.5 text-right tabular-nums`;
    } else {
      baseClass = VARIANTS.disabled;
    }
  } else {
    baseClass = VARIANTS[variant] || VARIANTS.default;
  }

  return (
    <input
      {...rest}
      id={id}
      type={type}
      {...(isEditingNumber || hasExternalValue ? { value: displayValue } : {})}
      onChange={handleChange}
      onFocus={handleFocus}
      onKeyDown={onKeyDown}
      onBlur={handleBlur}
      placeholder={placeholder}
      disabled={disabled}
      min={min}
      max={max}
      step={step}
      maxLength={maxLength}
      className={`${baseClass} ${className}`.trim()}
    />
  );
}
