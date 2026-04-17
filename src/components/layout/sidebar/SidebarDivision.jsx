import React from 'react';

/**
 * Etiqueta/división del sidebar (ej. "Módulos"). Solo texto, sin navegación.
 * @param {{ text: string }} props
 */
export function SidebarDivision({ text }) {
  return (
    <div className="mt-3 mb-1 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
      {text}
    </div>
  );
}
