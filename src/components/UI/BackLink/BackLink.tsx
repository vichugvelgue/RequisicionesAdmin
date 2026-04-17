import React, { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';

export interface BackLinkProps {
  children: ReactNode;
  onClick: () => void;
  className?: string;
}

export function BackLink({ children, onClick, className = '' }: BackLinkProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 text-slate-500 hover:text-blue-600 font-medium text-sm transition-colors ${className}`.trim()}
    >
      <ArrowLeft className="w-4 h-4" />
      {children}
    </button>
  );
}
