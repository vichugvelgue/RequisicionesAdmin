import React from 'react';

/**
 * Ítem de primer nivel: icono + label. Con o sin navegación.
 * @param {{
 *   icon: React.ReactNode,
 *   label: string,
 *   onClick?: () => void,
 *   isActive?: boolean
 * }} props
 */
export function SidebarItem({ icon, label, onClick, isActive }) {
  const baseClass = 'flex items-center gap-2.5 px-3 py-2 rounded font-medium transition-colors text-sm mb-0.5';
  const activeClass = isActive ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900';
  const withNav = typeof onClick === 'function';

  if (withNav) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${baseClass} ${activeClass}`}
      >
        <div className={isActive ? 'text-blue-600' : 'text-slate-400'}>
          {React.isValidElement(icon) ? React.cloneElement(icon, { className: 'w-4 h-4' }) : icon}
        </div>
        {label}
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`${baseClass} group text-slate-600 hover:bg-slate-100 hover:text-slate-900`}
    >
      <div className="text-slate-400 group-hover:text-blue-500 transition-colors">
        {React.isValidElement(icon) ? React.cloneElement(icon, { className: 'w-4 h-4' }) : icon}
      </div>
      {label}
    </button>
  );
}
