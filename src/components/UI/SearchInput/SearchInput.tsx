import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../Input';

export interface SearchInputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  /** Clases del <input> interno (p. ej. borde 0 dentro de un contenedor unificado) */
  inputClassName?: string;
  size?: 'default' | 'large';
  id?: string;
  disabled?: boolean;
}

export function SearchInput({
  value,
  onChange,
  onKeyDown,
  placeholder = 'Término de búsqueda...',
  className = '',
  inputClassName = '',
  size = 'default',
  id,
  disabled,
  ...rest
}: SearchInputProps) {
  const isLarge = size === 'large';
  const inputVariant = isLarge ? 'searchLarge' : 'search';
  const iconClass = isLarge
    ? 'left-3 top-1/2 -translate-y-1/2 w-4 h-4'
    : 'left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5';

  return (
    <div className={`relative ${className}`.trim()}>
      <Input
        id={id}
        type="text"
        variant={inputVariant}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className={inputClassName}
        {...rest}
      />
      <Search
        className={`absolute ${iconClass} text-slate-400 pointer-events-none`}
      />
    </div>
  );
}
