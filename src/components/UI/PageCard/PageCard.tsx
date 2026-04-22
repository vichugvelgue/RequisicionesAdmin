import React, { ReactNode } from 'react';

export interface PageCardProps {
  children: ReactNode;
  className?: string;
}

export function PageCard({ children, className = '' }: PageCardProps) {
  return (
    <div
      className={`flex flex-col h-full bg-brand-white rounded-xl shadow-sm border border-brand-neutral/20 overflow-hidden z-10 ${className}`.trim()}
    >
      {children}
    </div>
  );
}
