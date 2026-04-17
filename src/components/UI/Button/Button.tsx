import React, { ReactNode, ButtonHTMLAttributes } from 'react';
import type { ButtonVariant, ButtonSize } from '../types';

const VARIANT_BASE: Record<ButtonVariant, string> = {
  primary:
    'bg-blue-600 hover:bg-blue-700 disabled:hover:bg-blue-600 text-white shadow-sm shadow-blue-500/30 transition-colors disabled:opacity-50',
  secondary:
    'bg-green-50 hover:bg-green-100 disabled:hover:bg-green-50 text-green-700 border border-green-200 transition-colors disabled:opacity-50',
  outline:
    'bg-white border border-slate-300 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors',
  outlinePage:
    'min-w-[24px] sm:min-w-[28px] h-6 sm:h-7 px-1 rounded flex items-center justify-center text-[10px] sm:text-[11px] font-bold transition-colors bg-white border border-slate-300 text-slate-600 hover:bg-slate-50',
  outlinePageActive:
    'min-w-[24px] sm:min-w-[28px] h-6 sm:h-7 px-1 rounded flex items-center justify-center text-[10px] sm:text-[11px] font-bold transition-colors bg-blue-600 text-white border-blue-600',
  dark:
    'bg-slate-800 hover:bg-slate-900 disabled:hover:bg-slate-800 text-white transition-colors shadow-sm disabled:opacity-50',
  ghost:
    'text-slate-600 hover:bg-slate-100 transition-colors',
  danger:
    'bg-red-600 hover:bg-red-700 disabled:hover:bg-red-600 text-white transition-colors shadow-sm disabled:opacity-50',
  success:
    'bg-green-500 hover:bg-green-600 disabled:hover:bg-green-500 text-white transition-colors shadow-sm disabled:opacity-50',
  icon:
    'text-slate-400 hover:text-blue-600 hover:bg-blue-50 p-1.5 rounded transition-colors',
  iconAmber:
    'text-slate-400 hover:text-amber-600 hover:bg-amber-50 p-1.5 rounded transition-colors',
  iconRed:
    'text-slate-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors',
  iconSuccess:
    'text-slate-400 hover:text-green-600 hover:bg-green-50 p-1.5 rounded transition-colors',
  filterToggle: 'p-1 rounded transition-colors',
};

const SIZE_CLASS: Record<ButtonSize, string> = {
  xs: 'px-2.5 py-1 text-[10px] font-bold rounded inline-flex items-center justify-center gap-1.5 h-[28px]',
  md: 'px-4 py-2 text-xs font-semibold rounded flex items-center justify-center gap-1.5',
  xl: 'px-5 py-2.5 text-sm font-semibold rounded flex items-center justify-center gap-2',
};

const SIZELESS_VARIANTS: ButtonVariant[] = [
  'icon',
  'iconAmber',
  'iconRed',
  'iconSuccess',
  'filterToggle',
  'outlinePage',
  'outlinePageActive',
];

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children?: ReactNode;
  active?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  title?: string;
}

export function Button({
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  children,
  onClick,
  disabled,
  type = 'button',
  className = '',
  title,
  active,
  ...rest
}: ButtonProps) {
  const variantClass = VARIANT_BASE[variant] ?? VARIANT_BASE.primary;
  const wantsSize = !SIZELESS_VARIANTS.includes(variant);
  const sizeClass = wantsSize ? SIZE_CLASS[size] : '';

  const baseClass = `${variantClass} ${sizeClass}`.trim();
  const isFilterActive = variant === 'filterToggle' && active;
  const finalClass = isFilterActive
    ? `${baseClass} bg-blue-100 text-blue-600`
    : variant === 'filterToggle'
      ? `${baseClass} hover:bg-slate-200 text-slate-400 hover:text-slate-600`
      : baseClass;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`${finalClass} ${className} cursor-pointer disabled:cursor-not-allowed`.trim()}
      {...rest}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
}
