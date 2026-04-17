import React, { ReactNode, ChangeEvent } from 'react';
import { ChevronDown } from 'lucide-react';

const SIZE_CLASS = {
  default: 'py-1.5 px-2.5 pr-8 rounded font-medium text-xs',
  compact: 'py-1 pl-2 pr-6 rounded text-xs',
  lg: 'py-2 px-2.5 pr-8 rounded font-medium text-sm',
};

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  value?: string | number;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  id?: string;
  size?: 'default' | 'compact' | 'lg';
  className?: string;
  children: ReactNode;
}

export function Select({
  value,
  onChange,
  id,
  size = 'default',
  className = '',
  children,
  ...rest
}: SelectProps) {
  const baseClass =
    'w-full appearance-none bg-brand-white border border-brand-neutral/30 text-brand-neutral outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-shadow';
  const sizeClass =
    size === 'compact'
      ? 'focus:ring-1 focus:ring-brand-primary ' + SIZE_CLASS.compact
      : size === 'lg'
        ? SIZE_CLASS.lg
        : SIZE_CLASS.default;
  const iconRight =
    size === 'compact'
      ? 'right-1.5 w-3 h-3'
      : size === 'lg'
        ? 'right-2 w-3.5 h-3.5'
        : 'right-2 w-3.5 h-3.5';

  return (
    <div className="relative w-full min-w-0">
      <select
        id={id}
        value={value}
        onChange={onChange}
        className={`${baseClass} ${sizeClass} ${className}`.trim()}
        {...rest}
      >
        {children}
      </select>
      <ChevronDown
        className={`absolute ${iconRight} top-1/2 -translate-y-1/2 text-brand-neutral/60 pointer-events-none`}
      />
    </div>
  );
}
