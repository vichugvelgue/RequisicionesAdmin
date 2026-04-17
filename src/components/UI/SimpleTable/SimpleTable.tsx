import React, { ReactNode, useEffect, useRef } from 'react';
import { Eye, Pencil, Trash2, Printer, Ban, Filter, X } from 'lucide-react';
import { DataTable } from '../DataTable';
import { ActionCell } from '../ActionCell';
import { SortableHeader } from '../SortableHeader';
import { Button } from '../Button';
import { Input } from '../Input';
import { EmptyState } from '../EmptyState';
import type { SortConfig } from '../types';
import type { ActionItem } from '../types';
import { formatMoney } from '../../../utils/formatMoney';

const TH_CLASS =
  'px-3 py-2 font-bold border-r border-slate-200 text-[11px] text-slate-500';
const TH_ACTIONS =
  'w-24 min-w-24 max-w-24 px-3 py-2 font-bold text-center border-b border-slate-200 sticky right-0 bg-slate-50 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)] z-20 text-[11px] text-slate-500';
const TD_CLASS = 'px-3 py-2 border-r border-slate-100/60';
const ROW_BASE = 'border-b border-slate-100/60 hover:bg-blue-50/50';
const TH_FILTER = 'px-2 py-1.5 border-r border-b border-slate-200 font-normal';
const TH_FILTER_ACTIONS =
  'w-24 min-w-24 max-w-24 px-2 py-1.5 border-b border-slate-200 sticky right-0 bg-slate-100 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)] z-20';

/** Columna solo checkboxes, pegada a la izquierda de la columna de acciones (sticky; ancho alineado con ActionCell w-32). */
const TH_SELECTION_SPLIT =
  'w-14 min-w-14 max-w-14 px-2 py-2 font-bold text-center border-b border-r border-slate-200 text-[11px] text-slate-500 bg-slate-50 sticky right-32 z-[19] shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.08)]';
const TD_SELECTION_SPLIT =
  'w-14 min-w-14 max-w-14 px-2 py-2 text-center align-middle border-r border-slate-100/60 sticky right-32 z-10 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.08)]';
const TH_FILTER_SELECTION_SPLIT =
  'w-14 min-w-14 max-w-14 px-2 py-1.5 border-b border-r border-slate-200 sticky right-32 bg-slate-100 z-[19] shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.08)]';

/** Tipo de celda: 'text' (por defecto) o 'money' (formato $1,250.55). */
export type SimpleTableCellType = 'text' | 'money';

export interface SimpleTableColumn<T = Record<string, unknown>> {
  key: string;
  label: string;
  width?: string;
  cellClassName?: string;
  /** Si es 'money', el valor se muestra como $1,250.55 (se ignora si hay render). */
  cellType?: SimpleTableCellType;
  render?: (value: unknown, row: T) => ReactNode;
  sortable?: boolean;
}

export type SimpleTableRowActionVariant =
  | 'icon'
  | 'iconAmber'
  | 'iconRed'
  | 'iconSuccess';

export interface SimpleTableCustomAction<T = Record<string, unknown>> {
  icon: ReactNode;
  onClick: (row: T) => void;
  title: string;
  variant?:
    | SimpleTableRowActionVariant
    | ((row: T) => SimpleTableRowActionVariant);
  /** Si se define, el botón solo se muestra cuando devuelve true. */
  visible?: (row: T) => boolean;
}

export interface SimpleTableProps<T = Record<string, unknown>> {
  columns: SimpleTableColumn<T>[];
  data: T[];
  getRowKey?: (row: T) => string | number;
  sortConfig?: SortConfig | null;
  onSort?: (key: string) => void;
  showInlineFilters?: boolean;
  onToggleInlineFilters?: () => void;
  inlineFilters?: Record<string, string>;
  onInlineFilterChange?: (key: string, value: string) => void;
  onClearInlineFilters?: () => void;
  onView?: (row: T) => void;
  onPrint?: (row: T) => void;
  onEdit?: (row: T) => void;
  onCancel?: (row: T) => void;
  onDelete?: (row: T) => void;
  customActions?: SimpleTableCustomAction<T>[];
  actionsColumnLabel?: string;
  wrapperClassName?: string;
  tableClassName?: string;
  /** 'self' = scroll en DataTable. 'parent' = scroll en contenedor padre (infinite scroll). */
  scrollContainer?: 'self' | 'parent';
  /** Mensaje cuando no hay datos (por defecto: \"No se encontraron registros\"). */
  emptyTitle?: string;
  /** Descripción opcional cuando no hay datos. */
  emptyDescription?: string;

  /** Soporte opcional de multiselección por checkbox (solo afecta a SimpleTable). */
  selection?: {
    enabled: boolean;
    selectedIds: Array<string | number>;
    onSelectedIdsChange: (nextIds: Array<string | number>) => void;
    headerLabel?: string;
    allLabel?: string;
    /**
     * Si es true y hay columna de acciones, los checks van en una columna propia
     * y los botones en otra (sticky a la derecha).
     */
    separateFromActions?: boolean;
  };
}

export function SimpleTable<T extends object>({
  columns,
  data,
  getRowKey = (row) => (row as { id?: string }).id ?? '',
  sortConfig,
  onSort,
  showInlineFilters = true,
  onToggleInlineFilters,
  inlineFilters = {},
  onInlineFilterChange,
  onClearInlineFilters,
  onView,
  onPrint,
  onEdit,
  onCancel,
  onDelete,
  customActions = [],
  actionsColumnLabel = 'Acciones',
  wrapperClassName = '',
  tableClassName = '',
  scrollContainer = 'self',
  emptyTitle = 'No se encontraron registros',
  emptyDescription,
  selection,
}: SimpleTableProps<T>) {
  const hasActions =
    onView || onPrint || onEdit || onCancel || onDelete || customActions.length > 0;
  const hasSelection = Boolean(selection?.enabled);
  const splitSelectionAndActions =
    hasSelection &&
    hasActions &&
    Boolean(selection?.separateFromActions);
  const hasSort = sortConfig != null && typeof onSort === 'function';
  const supportsInlineFilters =
    typeof onToggleInlineFilters === 'function' &&
    typeof onInlineFilterChange === 'function';
  const hasInlineFilters = supportsInlineFilters;
  const showFinalActionsColumn = hasActions || hasInlineFilters || hasSelection;
  const trailingColumnCount = splitSelectionAndActions
    ? 2
    : showFinalActionsColumn
      ? 1
      : 0;
  const hasAnyInlineFilterValue = Object.values(inlineFilters ?? {}).some(
    (v) => String(v).trim() !== ''
  );
  const showFilterRow = supportsInlineFilters && showInlineFilters;

  const allIds = hasSelection
    ? data.map((row) => getRowKey(row))
    : [];
  const allIdsAsStrings = allIds.map((id) => String(id));
  const selectedIdStrings = new Set(
    hasSelection ? selection.selectedIds.map((id) => String(id)) : [],
  );
  const someIdsSelected =
    hasSelection && allIdsAsStrings.some((id) => selectedIdStrings.has(id));
  const allIdsSelected =
    hasSelection &&
    allIdsAsStrings.length > 0 &&
    allIdsAsStrings.every((id) => selectedIdStrings.has(id));

  const headerCheckboxRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (!hasSelection) return;
    if (!headerCheckboxRef.current) return;
    headerCheckboxRef.current.indeterminate =
      someIdsSelected && !allIdsSelected;
  }, [hasSelection, someIdsSelected, allIdsSelected]);

  function toggleRowSelection(row: T) {
    if (!hasSelection) return;
    const rowId = getRowKey(row);
    const rowIdStr = String(rowId);
    const isSelected = selectedIdStrings.has(rowIdStr);

    if (isSelected) {
      const allIdSet = new Set([rowIdStr]);
      const next = selection.selectedIds.filter((id) => !allIdSet.has(String(id)));
      selection.onSelectedIdsChange(next);
      return;
    }

    const nextMap = new Map<string, string | number>();
    selection.selectedIds.forEach((id) => nextMap.set(String(id), id));
    nextMap.set(rowIdStr, rowId);
    selection.onSelectedIdsChange(Array.from(nextMap.values()));
  }

  function toggleAllSelection() {
    if (!hasSelection) return;
    const allIdStringSet = new Set(allIdsAsStrings);

    // Si ya está marcado (checked), deseleccionar SOLO ids visibles/rendered (allIds).
    if (allIdsSelected) {
      const next = selection.selectedIds.filter(
        (id) => !allIdStringSet.has(String(id)),
      );
      selection.onSelectedIdsChange(next);
      return;
    }

    // Si está unchecked o indeterminate: seleccionar TODOS los ids visibles y unir con la selección actual.
    const nextMap = new Map<string, string | number>();
    selection.selectedIds.forEach((id) => nextMap.set(String(id), id));
    allIds.forEach((id) => {
      const key = String(id);
      if (!nextMap.has(key)) nextMap.set(key, id);
    });
    selection.onSelectedIdsChange(Array.from(nextMap.values()));
  }

  function buildRowActions(row: T, _idx: number): ActionItem[] {
    const actions: ActionItem[] = [];
    if (onPrint) {
      actions.push({
        icon: <Printer className="w-4 h-4" />,
        onClick: () => onPrint(row),
        title: 'Imprimir',
        variant: 'icon',
      });
    }
    if (onView) {
      actions.push({
        icon: <Eye className="w-4 h-4" />,
        onClick: () => onView(row),
        title: 'Ver',
        variant: 'icon',
      });
    }
    if (onEdit) {
      actions.push({
        icon: <Pencil className="w-4 h-4" />,
        onClick: () => onEdit(row),
        title: 'Editar',
        variant: 'iconAmber',
      });
    }
    if (onCancel) {
      actions.push({
        icon: <Ban className="w-4 h-4" />,
        onClick: () => onCancel(row),
        title: 'Cancelar',
        variant: 'iconRed',
      });
    }
    if (onDelete) {
      actions.push({
        icon: <Trash2 className="w-4 h-4" />,
        onClick: () => onDelete(row),
        title: 'Eliminar',
        variant: 'iconRed',
      });
    }
    customActions.forEach((a) => {
      if (a.visible && !a.visible(row)) return;
      const variant =
        typeof a.variant === 'function'
          ? a.variant(row)
          : (a.variant ?? 'icon');
      actions.push({
        icon: a.icon,
        onClick: () => a.onClick(row),
        title: a.title,
        variant,
      });
    });
    return actions;
  }

  return (
    <DataTable
      wrapperClassName={wrapperClassName}
      tableClassName={tableClassName}
      scrollContainer={scrollContainer}
    >
      <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <tr>
          {columns.map((col) =>
            hasSort && col.sortable !== false ? (
              <SortableHeader
                key={col.key}
                columnKey={col.key}
                label={col.label}
                width={col.width}
                sortConfig={sortConfig!}
                onSort={onSort!}
              />
            ) : (
              <th
                key={col.key}
                className={`${TH_CLASS} ${col.width ?? ''}`.trim()}
              >
                {col.label}
              </th>
            )
          )}
          {splitSelectionAndActions ? (
            <>
              <th className={TH_SELECTION_SPLIT}>
                <div className="flex flex-col items-center justify-center gap-1">
                  <input
                    ref={headerCheckboxRef}
                    type="checkbox"
                    aria-label={selection?.headerLabel ?? 'Seleccionar'}
                    checked={allIdsSelected}
                    onChange={toggleAllSelection}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                  />
                  {selection?.headerLabel ? (
                    <span className="font-normal text-[9px] text-slate-500 leading-tight text-center max-w-[4.5rem]">
                      {selection.headerLabel}
                    </span>
                  ) : null}
                </div>
              </th>
              <th className={TH_ACTIONS}>
                <div className="flex flex-col items-center justify-center gap-1">
                  {hasInlineFilters && (
                    <Button
                      variant="filterToggle"
                      active={showInlineFilters}
                      onClick={onToggleInlineFilters}
                      title="Alternar filtros por columna"
                    >
                      <Filter className="w-3.5 h-3.5" />
                    </Button>
                  )}
                  <span className="text-[11px] font-bold text-slate-500">
                    {actionsColumnLabel || 'Acciones'}
                  </span>
                </div>
              </th>
            </>
          ) : (
            showFinalActionsColumn && (
              <th className={TH_ACTIONS}>
                <div className="flex items-center justify-center gap-1">
                  {hasSelection && (
                    <input
                      ref={headerCheckboxRef}
                      type="checkbox"
                      aria-label={selection?.headerLabel ?? 'Seleccionar'}
                      checked={allIdsSelected}
                      onChange={toggleAllSelection}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    />
                  )}
                  {hasInlineFilters && (
                    <Button
                      variant="filterToggle"
                      active={showInlineFilters}
                      onClick={onToggleInlineFilters}
                      title="Alternar filtros por columna"
                    >
                      <Filter className="w-3.5 h-3.5" />
                    </Button>
                  )}
                  {hasActions && !hasInlineFilters && (
                    <span className="text-[11px] font-bold text-slate-500">
                      {actionsColumnLabel}
                    </span>
                  )}
                </div>
              </th>
            )
          )}
        </tr>
        {showFilterRow && (
          <tr className="bg-slate-100/50">
            {columns.map((col) => (
              <th key={col.key} className={TH_FILTER}>
                <Input
                  variant="filter"
                  value={inlineFilters[col.key] ?? ''}
                  onChange={(e) =>
                    onInlineFilterChange?.(col.key, e.target.value)
                  }
                  placeholder="Filtrar..."
                />
              </th>
            ))}
            {splitSelectionAndActions ? (
              <>
                <th className={TH_FILTER_SELECTION_SPLIT} />
                <th className={TH_FILTER_ACTIONS}>
                  {hasAnyInlineFilterValue && onClearInlineFilters && (
                    <button
                      type="button"
                      onClick={onClearInlineFilters}
                      className="w-full flex items-center justify-center p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                      title="Limpiar filtros"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </th>
              </>
            ) : (
              <th className={TH_FILTER_ACTIONS}>
                {hasAnyInlineFilterValue && onClearInlineFilters && (
                  <button
                    type="button"
                    onClick={onClearInlineFilters}
                    className="w-full flex items-center justify-center p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                    title="Limpiar filtros"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </th>
            )}
          </tr>
        )}
      </thead>
      <tbody className="text-xs text-slate-600">
        {data.length === 0 ? (
          <tr>
            <td
              colSpan={columns.length + trailingColumnCount}
              className="py-8"
            >
              <div className="flex items-center justify-center">
                <EmptyState title={emptyTitle} description={emptyDescription} />
              </div>
            </td>
          </tr>
        ) : (
          data.map((row, idx) => (
            <tr
              key={String(getRowKey(row))}
              className={`${ROW_BASE} ${
                idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
              }`}
            >
              {columns.map((col) => {
                const value = (row as Record<string, unknown>)[col.key];
                const cellClass = col.cellClassName
                  ? `${TD_CLASS} ${col.cellClassName}`
                  : TD_CLASS;
                let content: ReactNode;
                if (col.render) {
                  content = col.render(value, row);
                } else if (col.cellType === 'money') {
                  content = formatMoney(value);
                } else {
                  content = String(value ?? '');
                }
                return (
                  <td key={col.key} className={cellClass}>
                    {content}
                  </td>
                );
              })}
              {splitSelectionAndActions ? (
                <>
                  <td
                    className={`${TD_SELECTION_SPLIT} ${
                      idx % 2 !== 0 ? 'bg-slate-50' : 'bg-white'
                    }`}
                  >
                    <input
                      type="checkbox"
                      aria-label="Seleccionar fila"
                      checked={selectedIdStrings.has(String(getRowKey(row)))}
                      onChange={() => toggleRowSelection(row)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    />
                  </td>
                  <ActionCell
                    zebra={idx % 2 !== 0}
                    actions={buildRowActions(row, idx)}
                    cellClassName="w-32 min-w-32 max-w-32"
                  />
                </>
              ) : (
                showFinalActionsColumn &&
                (hasActions ? (
                  <ActionCell
                    zebra={idx % 2 !== 0}
                    actions={buildRowActions(row, idx)}
                    cellClassName="w-32 min-w-32 max-w-32"
                    extra={
                      hasSelection ? (
                        <span className="order-last">
                          <input
                            type="checkbox"
                            aria-label="Seleccionar fila"
                            checked={selectedIdStrings.has(
                              String(getRowKey(row)),
                            )}
                            onChange={() => toggleRowSelection(row)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                          />
                        </span>
                      ) : undefined
                    }
                  />
                ) : (
                  <td
                    className={`w-32 min-w-32 max-w-32 px-2 py-2 sticky right-0 z-10 ${
                      idx % 2 !== 0 ? 'bg-slate-50' : 'bg-white'
                    }`}
                    style={{
                      boxShadow: '-2px 0 5px -2px rgba(0,0,0,0.1)',
                    }}
                  >
                    {hasSelection ? (
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          aria-label="Seleccionar fila"
                          checked={selectedIdStrings.has(String(getRowKey(row)))}
                          onChange={() => toggleRowSelection(row)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                        />
                      </div>
                    ) : null}
                  </td>
                ))
              )}
            </tr>
          ))
        )}
      </tbody>
    </DataTable>
  );
}
