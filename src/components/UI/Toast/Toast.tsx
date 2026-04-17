import React, { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import type { ToastVariant } from '../types';

export interface ToastProps {
  visible: boolean;
  title: string;
  description?: string;
  icon?: ReactNode;
  variant?: ToastVariant;
  /** Controla el ancho máximo del toast. 'short' es más angosto, 'long' permite textos más largos. */
  size?: 'short' | 'long';
}

export function Toast({
  visible,
  title,
  description,
  icon,
  variant = 'success',
  size = 'short',
}: ToastProps) {
  if (!visible) return null;

  const bgClass = variant === 'error' ? 'bg-red-600' : 'bg-green-600';
   const widthClass = size === 'long' ? 'max-w-lg' : 'max-w-sm';
  const content = (
    <div
      className={`fixed top-6 right-6 ${bgClass} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-up z-50 ${widthClass}`}
    >
      {icon && (
        <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          {icon}
        </div>
      )}
      <div>
        <p className="text-sm font-bold">{title}</p>
        {description && (
          <p className="text-[11px] opacity-90">{description}</p>
        )}
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
