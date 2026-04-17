import React, { ReactNode } from 'react';

export interface FormSectionProps {
  title?: string;
  subtitle?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function FormSection({
  title,
  subtitle,
  children,
  className = '',
}: FormSectionProps) {
  const showHeading = Boolean(title?.trim()) || subtitle != null;
  return (
    <section className={`relative z-50 shrink-0 ${className}`.trim()}>
      {showHeading ? (
        <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
          {title?.trim() ? title : null}
          {subtitle && (
            <span className="text-slate-400 font-normal text-xs">{subtitle}</span>
          )}
        </h3>
      ) : null}
      {children}
    </section>
  );
}
