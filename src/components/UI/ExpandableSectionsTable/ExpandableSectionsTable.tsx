import React, { useEffect, useMemo, useRef, useState, useCallback, ReactNode } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { DataTable } from "../DataTable";
import { formatMoney } from "../../../utils/formatMoney";
import type { SimpleTableColumn } from "../SimpleTable/SimpleTable";

const TH_CLASS =
  "px-3 py-2 font-bold border-r border-slate-200 text-[11px] text-slate-500 bg-slate-50";
const TD_CLASS = "px-3 py-2 border-r border-slate-100/60";
const ROW_BASE = "border-b border-slate-100/60 hover:bg-blue-50/50";
const SECTION_ROW_CLASS =
  "border-b border-slate-200 bg-slate-100/80 font-semibold text-slate-700 cursor-pointer hover:bg-slate-200/80 transition-colors";

export interface ExpandableSection<T = Record<string, unknown>> {
  id: string;
  title: string;
  /** Valores por key de columna para la fila de resumen (ej. { importe: 848190.71, percent: 0.85 }). */
  summary?: Record<string, unknown>;
  rows: T[];
}

export interface ExpandableSectionsTableProps<T = Record<string, unknown>> {
  sections: ExpandableSection<T>[];
  columns: SimpleTableColumn<T>[];
  getRowKey?: (row: T) => string | number;
  /** Si true, todas las secciones empiezan abiertas. */
  defaultExpanded?: boolean;
  /** Controla visibilidad del summary en el encabezado de sección. */
  summaryDisplay?: "always" | "collapsedOnly";
  wrapperClassName?: string;
  tableClassName?: string;
  scrollContainer?: "self" | "parent";

  selection?: {
    enabled: boolean;
    selectedIds: Array<string | number>;
    onSelectedIdsChange: (nextIds: Array<string | number>) => void;
    /**
     * Define en qué columna se renderiza el checkbox.
     * - 'first' (default): checkbox en la 1ra columna (comportamiento actual)
     * - 'last': checkbox en la última columna
     */
    position?: "first" | "last";
  };
}

function getCellContent<T>(
  col: SimpleTableColumn<T>,
  value: unknown,
  row: T
): ReactNode {
  if (col.render) return col.render(value, row);
  if (col.cellType === "money") return formatMoney(value);
  return String(value ?? "");
}

function IndeterminateCheckbox({
  checked,
  indeterminate,
  onChange,
  "aria-label": ariaLabel,
}: {
  checked: boolean;
  indeterminate: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  "aria-label"?: string;
}) {
  const ref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.indeterminate = indeterminate && !checked;
  }, [indeterminate, checked]);

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      aria-label={ariaLabel}
      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
    />
  );
}

export function ExpandableSectionsTable<T extends object>({
  sections,
  columns,
  getRowKey = (row) => (row as { id?: string }).id ?? "",
  defaultExpanded = true,
  summaryDisplay = "always",
  wrapperClassName = "",
  tableClassName = "",
  scrollContainer = "self",
  selection,
}: ExpandableSectionsTableProps<T>) {
  const [expanded, setExpanded] = useState<Set<string>>(() =>
    defaultExpanded ? new Set(sections.map((s) => s.id)) : new Set()
  );

  const sectionIdsKey = useMemo(() => sections.map((s) => s.id).join('|'), [sections]);

  useEffect(() => {
    setExpanded(
      defaultExpanded ? new Set(sections.map((s) => s.id)) : new Set()
    );
  }, [defaultExpanded, sectionIdsKey, sections]);

  const toggle = useCallback((sectionId: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  }, []);

  const hasSelection = Boolean(selection?.enabled);
  const checkboxPosition = selection?.position ?? "first";
  const checkboxColIndex = checkboxPosition === "last" ? Math.max(columns.length - 1, 0) : 0;
  const selectedIdStrings = useMemo(
    () => new Set((selection?.selectedIds ?? []).map((id) => String(id))),
    [selection?.selectedIds],
  );

  const allIds = useMemo(() => {
    if (!hasSelection) return [];
    return sections.flatMap((s) => s.rows.map((r) => getRowKey(r)));
  }, [hasSelection, sections, getRowKey]);

  const allIdsStrings = useMemo(
    () => allIds.map((id) => String(id)),
    [allIds],
  );

  const someAllSelected =
    hasSelection && allIdsStrings.some((id) => selectedIdStrings.has(id));
  const allSelected =
    hasSelection &&
    allIdsStrings.length > 0 &&
    allIdsStrings.every((id) => selectedIdStrings.has(id));

  const toggleAllSelection = useCallback(
    (checked: boolean) => {
      if (!hasSelection) return;
      const allIdSet = new Set(allIdsStrings);

      if (checked) {
        // checked => deselect SOLO ids de allIds
        const next = (selection?.selectedIds ?? []).filter(
          (id) => !allIdSet.has(String(id)),
        );
        selection?.onSelectedIdsChange(next);
        return;
      }

      // unchecked/indeterminate => select all visible allIds (union)
      const nextMap = new Map<string, string | number>();
      (selection?.selectedIds ?? []).forEach((id) =>
        nextMap.set(String(id), id),
      );
      allIds.forEach((id, idx) => {
        const key = String(id);
        if (!nextMap.has(key)) nextMap.set(key, id);
      });
      selection?.onSelectedIdsChange(Array.from(nextMap.values()));
    },
    [hasSelection, allIds, allIdsStrings, selection],
  );

  const toggleSectionSelection = useCallback(
    (sectionId: string, checked: boolean) => {
      if (!hasSelection) return;
      const section = sections.find((s) => s.id === sectionId);
      if (!section) return;
      const sectionIds = section.rows.map((r) => getRowKey(r));
      const sectionIdsStrings = sectionIds.map((id) => String(id));
      const sectionSet = new Set(sectionIdsStrings);

      if (checked) {
        // checked => deselect SOLO sectionIds
        const next = (selection?.selectedIds ?? []).filter(
          (id) => !sectionSet.has(String(id)),
        );
        selection?.onSelectedIdsChange(next);
        return;
      }

      // unchecked/indeterminate => select all sectionIds (union)
      const nextMap = new Map<string, string | number>();
      (selection?.selectedIds ?? []).forEach((id) =>
        nextMap.set(String(id), id),
      );
      sectionIds.forEach((id) => {
        const key = String(id);
        if (!nextMap.has(key)) nextMap.set(key, id);
      });
      selection?.onSelectedIdsChange(Array.from(nextMap.values()));
    },
    [hasSelection, selection, sections, getRowKey],
  );

  return (
    <DataTable
      wrapperClassName={wrapperClassName}
      tableClassName={tableClassName}
      scrollContainer={scrollContainer}
    >
      <thead className="border-b border-slate-200 sticky top-0 z-10 bg-slate-50 shadow-sm">
        <tr>
          {columns.map((col, colIdx) => (
            <th
              key={col.key}
              className={`${TH_CLASS} ${col.width ?? ""} ${
                colIdx === checkboxColIndex && hasSelection ? "text-center" : ""
              }`.trim()}
            >
              {colIdx === checkboxColIndex && hasSelection ? (
                <div className="w-full flex items-center justify-center gap-2">
                  <IndeterminateCheckbox
                    checked={allSelected}
                    indeterminate={someAllSelected && !allSelected}
                    onChange={(e) => {
                      // Evitar cualquier click que dispare toggle de sección.
                      e.stopPropagation();
                      toggleAllSelection(e.target.checked);
                    }}
                    aria-label="Seleccionar todos"
                  />
                  {col.label ? <span>{col.label}</span> : null}
                </div>
              ) : (
                col.label
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="text-xs text-slate-600">
        {sections.map((section) => {
          const isOpen = expanded.has(section.id);

          const sectionIds = hasSelection
            ? section.rows.map((r) => getRowKey(r))
            : [];
          const sectionIdStrings = sectionIds.map((id) => String(id));
          const someSectionSelected =
            hasSelection &&
            sectionIdStrings.some((id) => selectedIdStrings.has(id));
          const allSectionSelected =
            hasSelection &&
            sectionIdStrings.length > 0 &&
            sectionIdStrings.every((id) => selectedIdStrings.has(id));

          return (
            <React.Fragment key={section.id}>
              <tr
                className={SECTION_ROW_CLASS}
                onClick={() => toggle(section.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggle(section.id);
                  }
                }}
                aria-expanded={isOpen}
              >
                {columns.map((col, colIdx) => {
                  if (colIdx === 0) {
                    return (
                      <td
                        key={col.key}
                        className={`${TD_CLASS} align-middle whitespace-nowrap min-w-[7rem] ${col.width ?? ""}`.trim()}
                      >
                        <span className="inline-flex items-center gap-1.5">
                          {isOpen ? (
                            <ChevronDown className="w-4 h-4 shrink-0" />
                          ) : (
                            <ChevronRight className="w-4 h-4 shrink-0" />
                          )}
                          <span>{section.title}</span>
                        </span>
                      </td>
                    );
                  }
                  const shouldShowSummary = summaryDisplay === "always" || !isOpen;
                  const value = shouldShowSummary ? section.summary?.[col.key] : undefined;
                  const content =
                    value !== undefined && value !== null
                      ? getCellContent(col, value, {} as T)
                      : "";

                  if (hasSelection && colIdx === checkboxColIndex) {
                    return (
                      <td
                        key={col.key}
                        className={`${TD_CLASS} ${col.width ?? ""} ${col.cellClassName ?? ""} text-center`.trim()}
                      >
                        <div className="w-full flex items-center justify-center gap-2">
                          <IndeterminateCheckbox
                            checked={allSectionSelected}
                            indeterminate={someSectionSelected && !allSectionSelected}
                            aria-label={`Seleccionar sección ${section.title}`}
                            onChange={(e) => {
                              // Evita que el click del checkbox expanda/colapse la sección.
                              e.stopPropagation();
                              e.preventDefault();
                              toggleSectionSelection(section.id, e.target.checked);
                            }}
                          />
                          {typeof content === "string" ? (content.trim() ? <span>{content}</span> : null) : content ? <span>{content}</span> : null}
                        </div>
                      </td>
                    );
                  }
                  return (
                    <td
                      key={col.key}
                      className={`${TD_CLASS} ${col.width ?? ""} ${col.cellClassName ?? ""}`.trim()}
                    >
                      {content}
                    </td>
                  );
                })}
              </tr>
              {isOpen &&
                section.rows.map((row, idx) => (
                  <tr
                    key={String(getRowKey(row))}
                    className={`${ROW_BASE} ${
                      idx % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                    }`}
                  >
                    {columns.map((col, colIdx) => {
                      const value = (row as Record<string, unknown>)[col.key];
                      const cellClass = col.cellClassName
                        ? `${TD_CLASS} ${col.cellClassName}`
                        : TD_CLASS;
                      const shouldRenderRowCheckbox =
                        hasSelection && colIdx === checkboxColIndex;
                      return (
                        <td
                          key={col.key}
                          className={`${cellClass} ${col.width ?? ""}`.trim()}
                        >
                          {shouldRenderRowCheckbox ? (
                            <div className="w-full flex items-center justify-center gap-2">
                              <input
                                type="checkbox"
                                checked={selectedIdStrings.has(String(getRowKey(row)))}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  const rowId = getRowKey(row);
                                  const rowIdStr = String(rowId);
                                  const isSelected =
                                    selectedIdStrings.has(rowIdStr);

                                  if (isSelected) {
                                    const next = (selection?.selectedIds ?? []).filter(
                                      (id) => String(id) !== rowIdStr,
                                    );
                                    selection?.onSelectedIdsChange(next);
                                  } else {
                                    const next = [
                                      ...(selection?.selectedIds ?? []),
                                      rowId,
                                    ];
                                    selection?.onSelectedIdsChange(next);
                                  }
                                }}
                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                              />
                              {getCellContent(col, value, row)}
                            </div>
                          ) : (
                            getCellContent(col, value, row)
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
            </React.Fragment>
          );
        })}
      </tbody>
    </DataTable>
  );
}
