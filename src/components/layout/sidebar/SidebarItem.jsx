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
  const activeClass = isActive ? 'bg-brand-secondary/30 text-brand-primary shadow-sm' : 'text-brand-neutral/80 hover:bg-brand-secondary/20 hover:text-brand-neutral';
  const withNav = typeof onClick === 'function';

  if (withNav) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${baseClass} ${activeClass}`}
      >
        <div className={isActive ? 'text-brand-primary' : 'text-brand-neutral/60'}>
          {React.isValidElement(icon) ? React.cloneElement(icon, { className: 'w-4 h-4' }) : icon}
        </div>
        {label}
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`${baseClass} group text-brand-neutral/80 hover:bg-brand-secondary/20 hover:text-brand-neutral`}
    >
      <div className="text-brand-neutral/60 group-hover:text-brand-primary transition-colors">
        {React.isValidElement(icon) ? React.cloneElement(icon, { className: 'w-4 h-4' }) : icon}
      </div>
      {label}
    </button>
  );
}
