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
        isActive ? 'text-blue-700 bg-blue-50 font-semibold' : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50/50'
      }`}
    >
      {label}
    </button>
  );
}
