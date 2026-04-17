import React, { ReactNode } from 'react';

export interface ViewHeaderProps {
  title: string;
  badge?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function ViewHeader({
  title,
  badge,
  action,
  className = '',
}: ViewHeaderProps) {
  return (
    <div
      className={`px-5 py-4 border-b border-brand-neutral/20 shrink-0 bg-brand-white ${className}`.trim()}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-brand-neutral text-center sm:text-left leading-none">
          {title}
        </h2>
        {action}
      </div>
      {badge && <div className="flex items-center gap-2">{badge}</div>}
    </div>
  );
}
