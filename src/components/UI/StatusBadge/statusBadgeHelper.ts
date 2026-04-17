import type { StatusBadgeVariant } from '../types';

export interface ResolvedStatusBadge {
  label: string;
  variant: StatusBadgeVariant;
  isMapped: boolean;
}

const STATUS_MAP: Record<string, { label: string; variant: StatusBadgeVariant }> = {
  ACTIVA: { label: 'Activa', variant: 'Activa' },
  ACTIVO: { label: 'Activo', variant: 'Activa' },
  CANCELADA: { label: 'Cancelada', variant: 'Cancelada' },
  CANCELADO: { label: 'Cancelado', variant: 'Cancelada' },
  CERRADA: { label: 'Cerrada', variant: 'Cerrada' },
  CERRADO: { label: 'Cerrado', variant: 'Cerrada' },
  INACTIVA: { label: 'Inactiva', variant: 'Cerrada' },
  INACTIVO: { label: 'Inactivo', variant: 'Cerrada' },
  BORRADOR: { label: 'Borrador', variant: 'Borrador' },
  SOLICITADO: { label: 'Solicitado', variant: 'Solicitado' },
  ORDENADO: { label: 'Ordenado', variant: 'Activa' },
  TRANSITO: { label: 'Tránsito', variant: 'Transito' },
  'TRÁNSITO': { label: 'Tránsito', variant: 'Transito' },
  RECIBIDO: { label: 'Recibido', variant: 'Recibido' },
  PENDIENTE: { label: 'Pendiente', variant: 'Borrador' },
  APROBADA: { label: 'Aprobada', variant: 'Activa' },
  VIGENTE: { label: 'Vigente', variant: 'Activa' },
  APLICADO: { label: 'Aplicado', variant: 'Recibido' },
  LIQUIDADO: { label: 'Liquidado', variant: 'Recibido' },
  PAGADO: { label: 'Pagado', variant: 'Activa' },
};

const warnedUnknownStatuses = new Set<string>();

function normalizeStatusKey(raw: unknown): string {
  if (raw === null || raw === undefined) return '';
  return String(raw).trim().toUpperCase();
}

function toTitleCase(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function resolveStatusBadge(rawStatus: unknown): ResolvedStatusBadge {
  const normalized = normalizeStatusKey(rawStatus);
  const mapped = STATUS_MAP[normalized];

  if (mapped) {
    return {
      label: mapped.label,
      variant: mapped.variant,
      isMapped: true,
    };
  }

  if (normalized && import.meta.env.DEV && !warnedUnknownStatuses.has(normalized)) {
    warnedUnknownStatuses.add(normalized);
    // eslint-disable-next-line no-console
    console.warn(`[status-badge] Estatus no mapeado: "${normalized}"`);
  }

  return {
    label: normalized ? toTitleCase(normalized) : 'Sin estatus',
    variant: 'Cerrada',
    isMapped: false,
  };
}
