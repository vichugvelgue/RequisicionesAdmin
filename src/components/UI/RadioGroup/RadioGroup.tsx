import React, { ChangeEvent } from 'react';
import { Label } from '../Label';
import type { OptionItem } from '../types';

export interface RadioGroupProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  options: OptionItem[];
  className?: string;
  disabled?: boolean;
}

export function RadioGroup({
  label,
  name,
  value,
  onChange,
  options,
  className = '',
  disabled = false,
}: RadioGroupProps) {
  const wrapperClass =
    className ||
    'col-span-1 lg:col-span-4 md:col-span-2 mb-2 p-3 bg-blue-50/50 border border-blue-100 rounded-lg';

  return (
    <div className={wrapperClass}>
      <Label className="text-blue-800 mb-1.5">{label}</Label>
      <div className="flex gap-4">
        {options.map((opt) => (
          <label
            key={opt.value}
            className={`flex items-center gap-2 text-sm font-medium text-slate-700 ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={onChange}
              disabled={disabled}
              className="text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
            {opt.label}
          </label>
        ))}
      </div>
    </div>
  );
}
