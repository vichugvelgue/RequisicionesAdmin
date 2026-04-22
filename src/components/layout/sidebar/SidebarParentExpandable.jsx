import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

/**
 * Opción padre expandible con submenú (ej. Componentes, Compras).
 * @param {{
 *   icon: React.ReactNode,
 *   label: string,
 *   open: boolean,
 *   onToggle: () => void,
 *   isActive: boolean,
 *   children: React.ReactNode
 * }} props
 */
export function SidebarParentExpandable({ icon, label, open, onToggle, isActive, children }) {
  const isExpanded = open || isActive;
  return (
    <div className="flex flex-col mb-0.5">
      <button
        type="button"
        onClick={onToggle}
        className={`flex items-center gap-2.5 px-3 py-2 rounded font-medium transition-colors text-sm ${
          isExpanded ? 'bg-brand-secondary/30 text-brand-neutral' : 'text-brand-neutral/80 hover:bg-brand-secondary/20 hover:text-brand-neutral'
        }`}
      >
        <div className={isExpanded ? 'text-brand-primary' : 'text-brand-neutral/60'}>
          {icon}
        </div>
        <span className="flex-1 text-left">{label}</span>
        {isExpanded ? (
          <ChevronDown className="w-3.5 h-3.5 text-brand-neutral/60" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-brand-neutral/60" />
        )}
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ease-in-out ${
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="ml-5 pl-3 border-l-2 border-brand-secondary/60 flex flex-col gap-0.5 py-1">
          {children}
        </div>
      </div>
    </div>
  );
}
