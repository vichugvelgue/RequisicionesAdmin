import React, { ReactNode } from 'react';
import { Button } from '../Button';
import type { ConfirmModalVariant } from '../types';

export interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmModalVariant;
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  icon,
  children,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'neutral',
}: ConfirmModalProps) {
  if (!open) return null;

  const isDanger = variant === 'danger';
  const headerClass = isDanger
    ? 'p-5 border-b border-slate-200 bg-red-50'
    : 'p-5 border-b border-slate-200 bg-slate-50';
  const titleClass = isDanger
    ? 'text-lg font-bold text-red-800 flex items-center gap-2'
    : 'text-lg font-bold text-slate-800 flex items-center gap-2';
  const iconClass = isDanger ? 'w-5 h-5 text-red-600' : 'w-5 h-5 text-blue-600';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-zoom-in">
        <div className={headerClass}>
          <h3 className={titleClass}>
            {icon && <span className={iconClass}>{icon}</span>}
            {title}
          </h3>
        </div>
        <div className="p-5">{children}</div>
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button variant={isDanger ? 'danger' : 'primary'} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
