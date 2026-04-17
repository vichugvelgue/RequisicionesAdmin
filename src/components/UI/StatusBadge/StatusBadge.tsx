import React, { ReactNode } from 'react';
import type { StatusBadgeVariant } from '../types';

const VARIANT_CLASS: Record<StatusBadgeVariant | 'default', string> = {
  Activa: 'bg-green-100 text-green-700',
  Cancelada: 'bg-red-100 text-red-700',
  Cerrada: 'bg-slate-100 text-slate-600',
  Borrador: 'bg-blue-100 text-blue-700',
  Transito: 'bg-orange-100 text-orange-800',
  Recibido: 'bg-green-100 text-green-700',
  Solicitado: 'bg-yellow-100 text-yellow-800',
  default: 'bg-slate-100 text-slate-600',
};

export interface StatusBadgeProps {
  children: ReactNode;
  variant?: StatusBadgeVariant;
}

export function StatusBadge({ children, variant }: StatusBadgeProps) {
  const baseClass =
    'px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider';
  const colorClass = variant ? VARIANT_CLASS[variant] ?? VARIANT_CLASS.default : VARIANT_CLASS.default;
  return <span className={`${baseClass} ${colorClass}`}>{children}</span>;
}
