import React, { ReactNode } from 'react';

export interface LabelProps {
  children: ReactNode;
  htmlFor?: string;
  className?: string;
  /** Muestra asterisco de campo obligatorio (alineado al estándar de formularios del ERP). */
  required?: boolean;
}

export function Label({ children, htmlFor, className = '', required = false }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wider ${className}`.trim()}
    >
      {children}
      {required ? (
        <span className="text-red-600 ml-0.5 font-bold" aria-hidden>
          *
        </span>
      ) : null}
    </label>
  );
}
