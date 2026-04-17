import React, { ReactNode, ButtonHTMLAttributes } from 'react';
import type { ButtonVariant, ButtonSize } from '../types';

const VARIANT_BASE: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-primary hover:bg-brand-primary/90 disabled:hover:bg-brand-primary text-brand-white shadow-sm shadow-brand-primary/30 transition-colors disabled:opacity-50',
  primarySm:
    'bg-brand-primary hover:brightness-95 disabled:hover:brightness-100 text-brand-white shadow-sm shadow-brand-primary/25 transition-colors disabled:opacity-50',
  secondary:
    'bg-brand-secondary/20 hover:bg-brand-secondary/35 disabled:hover:bg-brand-secondary/20 text-brand-neutral border border-brand-secondary/50 transition-colors disabled:opacity-50',
  outline:
    'bg-brand-white border border-brand-neutral/30 text-brand-neutral disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-secondary/15 transition-colors',
  outlinePage:
    'min-w-[24px] sm:min-w-[28px] h-6 sm:h-7 px-1 rounded flex items-center justify-center text-[10px] sm:text-[11px] font-bold transition-colors bg-brand-white border border-brand-neutral/30 text-brand-neutral hover:bg-brand-secondary/15',
  outlinePageActive:
    'min-w-[24px] sm:min-w-[28px] h-6 sm:h-7 px-1 rounded flex items-center justify-center text-[10px] sm:text-[11px] font-bold transition-colors bg-brand-primary text-brand-white border-brand-primary',
  dark:
    'bg-slate-800 hover:bg-slate-900 disabled:hover:bg-slate-800 text-white transition-colors shadow-sm disabled:opacity-50',
  ghost:
    'text-brand-neutral hover:bg-brand-secondary/15 transition-colors',
  danger:
    'bg-red-600 hover:bg-red-700 disabled:hover:bg-red-600 text-white transition-colors shadow-sm disabled:opacity-50',
  success:
    'bg-green-500 hover:bg-green-600 disabled:hover:bg-green-500 text-white transition-colors shadow-sm disabled:opacity-50',
  icon:
    'text-brand-neutral/60 hover:text-brand-primary hover:bg-brand-secondary/20 p-1.5 rounded transition-colors',
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

const VARIANT_SIZE_CLASS: Partial<Record<ButtonVariant, string>> = {
  primarySm: SIZE_CLASS.xs,
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
  const variantSizeClass = VARIANT_SIZE_CLASS[variant] ?? '';
  const wantsSize = !SIZELESS_VARIANTS.includes(variant) && !variantSizeClass;
  const sizeClass = variantSizeClass || (wantsSize ? SIZE_CLASS[size] : '');

  const baseClass = `${variantClass} ${sizeClass}`.trim();
  const isFilterActive = variant === 'filterToggle' && active;
  const finalClass = isFilterActive
    ? `${baseClass} bg-brand-secondary/30 text-brand-primary`
    : variant === 'filterToggle'
      ? `${baseClass} hover:bg-brand-secondary/25 text-brand-neutral/60 hover:text-brand-neutral`
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
