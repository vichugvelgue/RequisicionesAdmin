import React, { ReactNode } from 'react';
import type { DisplayLabelVariant, DisplayLabelSize } from '../types';

/** Con fondo: fondo suave + texto */
const VARIANT_WITH_BG: Record<DisplayLabelVariant, string> = {
  primary: 'bg-blue-50 text-blue-700',
  secondary: 'bg-slate-100 text-slate-700',
  success: 'bg-green-50 text-green-700',
  danger: 'bg-red-50 text-red-700',
  outline: 'bg-slate-50 text-slate-600',
  dark: 'bg-slate-200 text-slate-800',
  ghost: 'bg-slate-50 text-slate-600',
};

/** Solo color de texto, sin fondo */
const VARIANT_TEXT_ONLY: Record<DisplayLabelVariant, string> = {
  primary: 'text-blue-700',
  secondary: 'text-slate-700',
  success: 'text-green-700',
  danger: 'text-red-700',
  outline: 'text-slate-600',
  dark: 'text-slate-800',
  ghost: 'text-slate-600',
};

const SIZE_CLASS: Record<DisplayLabelSize, string> = {
  xs: 'px-2 py-0.5 text-[10px]',
  sm: 'px-2.5 py-1 text-[11px]',
  md: 'px-3 py-1.5 text-xs',
  xl: 'px-4 py-2 text-sm',
};

const ALIGN_CLASS = {
  left: 'justify-start text-left',
  right: 'justify-end text-right',
} as const;

export type DisplayLabelAlign = keyof typeof ALIGN_CLASS;

export interface DisplayLabelProps {
  variant?: DisplayLabelVariant;
  size?: DisplayLabelSize;
  /** true = fondo suave + texto; false = solo color de texto */
  withBackground?: boolean;
  /** Alineación del contenido: left (por defecto) o right (p. ej. importes) */
  align?: DisplayLabelAlign;
  /** false = sin padding izquierdo; la primera letra alinea con el borde (p. ej. con la label de abajo) */
  paddingStart?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * Etiqueta/chip de solo lectura para mostrar valores (estado, categoría, etc.).
 * Tamaños estándar: xs, sm, md, xl. Usar className para tamaños o estilos custom.
 */
export function DisplayLabel({
  variant = 'primary',
  size = 'md',
  withBackground = true,
  align = 'left',
  paddingStart = true,
  className = '',
  children,
}: DisplayLabelProps) {
  const base = 'inline-flex items-center font-medium rounded';
  const variantClass = withBackground
    ? VARIANT_WITH_BG[variant]
    : VARIANT_TEXT_ONLY[variant];
  const classes = [
    base,
    variantClass,
    SIZE_CLASS[size],
    ALIGN_CLASS[align],
    paddingStart ? '' : 'pl-0',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return <span className={classes}>{children}</span>;
}
