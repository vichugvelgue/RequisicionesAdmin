import React, { ComponentType } from 'react';
import { Search } from 'lucide-react';

export type EmptyStateVariant = 'card' | 'minimal';

export interface EmptyStateProps {
  icon?: ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  className?: string;
  /** 'card' = borde, fondo gris y padding (por defecto). 'minimal' = solo icono y texto. */
  variant?: EmptyStateVariant;
  /** Clases aplicadas al contenedor del card (solo cuando variant="card"). Ej: "w-full", "max-w-md", "w-96". */
  wrapperClassName?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  className = '',
  variant = 'card',
  wrapperClassName = '',
}: EmptyStateProps) {
  const Icon = icon ?? Search;
  const content = (
    <div
      className={`flex flex-col items-center justify-center gap-2 ${className}`.trim()}
    >
      <Icon className="w-8 h-8 text-slate-300 mb-2" />
      <p className="text-sm font-medium">{title}</p>
      {description && <p className="text-xs">{description}</p>}
    </div>
  );

  if (variant === 'minimal') {
    return content;
  }

  const cardClass = `border border-slate-200 rounded-lg p-8 bg-slate-50 w-full mx-3 ${wrapperClassName}`.trim();
  return <div className={cardClass}>{content}</div>;
}
