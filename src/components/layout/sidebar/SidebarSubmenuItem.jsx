import React from 'react';

/**
 * Ítem hijo dentro de un padre expandible (submenú).
 * @param {{ label: string, isActive: boolean, onClick: () => void }} props
 */
export function SidebarSubmenuItem({ label, isActive, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left px-2 py-1.5 text-[13px] rounded transition-colors ${
        isActive ? 'text-brand-primary bg-brand-secondary/30 font-semibold' : 'text-brand-neutral/70 hover:text-brand-primary hover:bg-brand-secondary/20'
      }`}
    >
      {label}
    </button>
  );
}
