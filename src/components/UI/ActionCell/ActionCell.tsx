import React, { ReactNode } from 'react';
import { Button } from '../Button';
import type { ActionItem } from '../types';

export interface ActionCellProps {
  sticky?: boolean;
  zebra?: boolean;
  actions: ActionItem[];
  extra?: ReactNode;
  /** Clases adicionales para la celda <td> (ej. ancho fijo w-24). */
  cellClassName?: string;
}

export function ActionCell({
  sticky = true,
  zebra,
  actions,
  extra,
  cellClassName = '',
}: ActionCellProps) {
  const cellClass = [
    'px-2 py-2 whitespace-nowrap',
    sticky && 'sticky right-0 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)] z-10',
    zebra ? 'bg-slate-50' : 'bg-white',
    cellClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  return (
    <td className={cellClass}>
      <div className="flex items-center gap-2 justify-center">
        {extra}
        {actions.map((action, idx) => (
          <Button
            key={idx}
            variant={action.variant ?? 'icon'}
            onClick={action.onClick}
            title={action.title}
          >
            {action.icon}
          </Button>
        ))}
      </div>
    </td>
  );
}
