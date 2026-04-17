import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { formatMoney } from "../../../utils/formatMoney";
import type { SimpleTableColumn } from "../SimpleTable/SimpleTable";
import type { ExpandableSection } from "../ExpandableSectionsTable";
import { TableResultsInfo } from "../TableResultsInfo/TableResultsInfo";

const TH_CLASS =
  "px-3 py-2 font-bold border-r border-slate-200 text-[11px] text-slate-500 bg-slate-50";
const TD_CLASS = "px-3 py-2 border-r border-slate-100/60";
const ROW_BASE = "border-b border-slate-100/60 hover:bg-blue-50/50";
const SECTION_ROW_CLASS =
  "border-b border-slate-200 bg-slate-100/80 font-semibold text-slate-700 cursor-pointer hover:bg-slate-200/80 transition-colors";

const IO_THROTTLE_MS = 400;

function getCellContent<T>(
  col: SimpleTableColumn<T>,
  value: unknown,
  row: T
): ReactNode {
  if (col.render) return col.render(value, row);
  if (col.cellType === "money") return formatMoney(value);
  return String(value ?? "");
}

export interface ExpandableSectionsInfiniteTableProps<T extends object> {
  sections: ExpandableSection<T>[];
  columns: SimpleTableColumn<T>[];
  getRowKey?: (row: T) => string | number;
  defaultExpanded?: boolean;
  wrapperClassName?: string;
  tableClassName?: string;
  pageSize?: number;
  resetKey?: string;
  showResultsInfo?: boolean;
  onSectionExpand?: (sectionId: string, isOpen: boolean) => void;
  /**
   * Si es true y hay filas pero ningún grupo expandido, el pie explica que debe expandirse
   * (evita "Mostrando 0 de N" poco claro).
   */
  resultsHintWhenAllCollapsed?: boolean;
}

function SectionSlicedRowsWithReport<T extends object>({
  section,
  columns,
  getRowKey,
  pageSize,
  resetKey,
  scrollRootRef,
  isOpen,
  colSpan,
  onVisibleChange,
}: {
  section: ExpandableSection<T>;
  columns: SimpleTableColumn<T>[];
  getRowKey: (row: T) => string | number;
  pageSize: number;
  resetKey: string | undefined;
  scrollRootRef: React.RefObject<HTMLDivElement | null>;
  isOpen: boolean;
  colSpan: number;
  onVisibleChange: (sectionId: string, visible: number) => void;
}) {
  const rowCount = section.rows.length;
  const [visibleCount, setVisibleCount] = useState(() =>
    Math.min(pageSize, rowCount)
  );

  useEffect(() => {
    setVisibleCount(Math.min(pageSize, rowCount));
  }, [resetKey, pageSize, rowCount, section.id]);

  useEffect(() => {
    if (isOpen) {
      onVisibleChange(section.id, visibleCount);
    }
  }, [isOpen, visibleCount, section.id, onVisibleChange]);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const lastLoadRef = useRef(0);
  const needsMore = visibleCount < rowCount;

  /** Sin `visibleCount` en deps: evita desconectar el observer en cada página (puede romper la intersección). */
  useLayoutEffect(() => {
    if (!isOpen || !needsMore) return;
    const root = scrollRootRef.current;
    const target = sentinelRef.current;
    if (!root || !target) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        const now = Date.now();
        if (now - lastLoadRef.current < IO_THROTTLE_MS) return;
        lastLoadRef.current = now;
        setVisibleCount((prev) => {
          if (prev >= rowCount) return prev;
          return Math.min(prev + pageSize, rowCount);
        });
      },
      { root, rootMargin: "48px", threshold: 0 }
    );
    obs.observe(target);
    return () => obs.disconnect();
  }, [isOpen, needsMore, rowCount, pageSize, scrollRootRef]);

  if (!isOpen) return null;

  const slice = section.rows.slice(0, visibleCount);

  return (
    <>
      {slice.map((row, idx) => (
        <tr
          key={String(getRowKey(row))}
          className={`${ROW_BASE} ${
            idx % 2 === 0 ? "bg-white" : "bg-slate-50/30"
          }`}
        >
          {columns.map((col) => {
            const value = (row as Record<string, unknown>)[col.key];
            const cellClass = col.cellClassName
              ? `${TD_CLASS} ${col.cellClassName}`
              : TD_CLASS;
            return (
              <td
                key={col.key}
                className={`${cellClass} ${col.width ?? ""}`.trim()}
              >
                {getCellContent(col, value, row)}
              </td>
            );
          })}
        </tr>
      ))}
      {visibleCount < rowCount ? (
        <tr aria-hidden>
          <td colSpan={colSpan} className="p-0 border-none h-1">
            <div ref={sentinelRef} className="h-1 w-full" />
          </td>
        </tr>
      ) : null}
    </>
  );
}

export function ExpandableSectionsInfiniteTable<T extends object>({
  sections,
  columns,
  getRowKey = (row) => (row as { id?: string }).id ?? "",
  defaultExpanded = true,
  wrapperClassName = "",
  tableClassName = "",
  pageSize = 30,
  resetKey,
  showResultsInfo = true,
  onSectionExpand,
  resultsHintWhenAllCollapsed = false,
}: ExpandableSectionsInfiniteTableProps<T>) {
  const scrollRootRef = useRef<HTMLDivElement | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(() =>
    defaultExpanded ? new Set(sections.map((s) => s.id)) : new Set()
  );

  const sectionIdsKey = sections.map((s) => s.id).join("|");

  useEffect(() => {
    setExpanded(
      defaultExpanded ? new Set(sections.map((s) => s.id)) : new Set()
    );
  }, [sectionIdsKey, defaultExpanded]);

  const toggle = useCallback(
    (sectionId: string) => {
      setExpanded((prev) => {
        const next = new Set(prev);
        const wasOpen = next.has(sectionId);
        if (wasOpen) next.delete(sectionId);
        else next.add(sectionId);
        onSectionExpand?.(sectionId, !wasOpen);
        return next;
      });
    },
    [onSectionExpand]
  );

  const colSpan = columns.length;

  /** Total de filas de la consulta (todos los grupos), para el pie "Mostrando X de Y". */
  const grandTotalRows = useMemo(
    () => sections.reduce((acc, s) => acc + s.rows.length, 0),
    [sections]
  );

  const [countsBySection, setCountsBySection] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    setCountsBySection({});
  }, [resetKey]);

  const handleVisibleCountSnapshot = useCallback(
    (sectionId: string, visible: number) => {
      setCountsBySection((prev) => ({ ...prev, [sectionId]: visible }));
    },
    []
  );

  const displayedVisible = useMemo(() => {
    let sum = 0;
    for (const s of sections) {
      if (!expanded.has(s.id)) continue;
      const c = countsBySection[s.id];
      sum += c !== undefined ? c : Math.min(pageSize, s.rows.length);
    }
    return sum;
  }, [sections, expanded, countsBySection, pageSize]);

  return (
    <div className="flex flex-col flex-1 min-h-0 min-w-0 w-full">
      <div
        ref={scrollRootRef}
        className={`min-h-0 min-w-0 w-full max-w-full overflow-auto bg-white relative custom-scrollbar ${wrapperClassName}`.trim()}
      >
        <table
          className={`w-full text-left text-xs text-slate-600 ${tableClassName}`.trim()}
        >
          <thead className="border-b border-slate-200 sticky top-0 z-10 bg-slate-50 shadow-sm">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`${TH_CLASS} ${col.width ?? ""}`.trim()}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          {sections.map((section) => {
            const isOpen = expanded.has(section.id);
            return (
              <tbody key={section.id} className="text-xs text-slate-600">
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
                    const value = section.summary?.[col.key];
                    const content =
                      value !== undefined && value !== null
                        ? getCellContent(col, value, {} as T)
                        : "";
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
                <SectionSlicedRowsWithReport
                  section={section}
                  columns={columns}
                  getRowKey={getRowKey}
                  pageSize={pageSize}
                  resetKey={resetKey}
                  scrollRootRef={scrollRootRef}
                  isOpen={isOpen}
                  colSpan={colSpan}
                  onVisibleChange={handleVisibleCountSnapshot}
                />
              </tbody>
            );
          })}
        </table>
      </div>
      {showResultsInfo ? (
        resultsHintWhenAllCollapsed &&
        grandTotalRows > 0 &&
        expanded.size === 0 ? (
          <p
            className="mt-auto shrink-0 px-5 py-2 text-sm text-slate-500 border-t border-slate-200 bg-white rounded-b-lg"
          >
            {grandTotalRows} resultados en {sections.length}{" "}
            {sections.length === 1 ? "almacén" : "almacenes"}. Expanda un
            almacén para ver el listado; en cada uno se muestran hasta{" "}
            {pageSize} filas y el resto al desplazarse.
          </p>
        ) : (
          <TableResultsInfo
            visibleCount={displayedVisible}
            totalCount={grandTotalRows}
          />
        )
      ) : null}
    </div>
  );
}
