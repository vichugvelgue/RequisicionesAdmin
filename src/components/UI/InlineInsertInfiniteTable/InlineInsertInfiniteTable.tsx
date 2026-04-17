import React, { useMemo, type CSSProperties, type ReactNode } from "react";
import { Filter, X } from "lucide-react";
import { SortableHeader } from "../SortableHeader";
import { Input } from "../Input";
import { Button } from "../Button";
import { TableResultsInfo } from "../TableResultsInfo/TableResultsInfo";
import { EmptyState } from "../EmptyState";
import { useInfiniteScrollSlice } from "../useInfiniteScrollSlice";
import type { SortConfig } from "../types";

const TH_CLASS =
	"px-3 py-2 font-bold border-r border-slate-200 text-[11px] text-slate-500 uppercase tracking-wider";
/** Th sin label ancho (p. ej. checkbox): menos padding horizontal. */
const TH_CLASS_COMPACT =
	"px-1 py-2 font-bold border-r border-slate-200 text-[11px] text-slate-500 uppercase tracking-wider";
const TH_FILTER = "px-2 py-1.5 border-r border-b border-slate-200 font-normal";
const TH_FILTER_NARROW =
	"w-px whitespace-nowrap px-0 py-1.5 border-r border-b border-slate-200 font-normal";
const TH_FILTER_ACTIONS =
	"w-[5.5rem] min-w-[5.5rem] max-w-[5.5rem] px-2 py-1.5 border-b border-slate-200 sticky right-0 bg-slate-100 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)] z-20";
/** Default ancho `<col>` acciones con `narrowActionsColumn` (vistas RH clásicas). */
const DEFAULT_NARROW_ACTIONS_COL_W =
	"w-[10rem] min-w-[10rem] max-w-[10rem] box-border";
const TH_ACTIONS =
	"w-[5.5rem] min-w-[5.5rem] max-w-[5.5rem] px-3 py-2 font-bold text-center border-b border-slate-200 sticky right-0 bg-slate-50 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)] z-20 text-[11px] text-slate-500";

const TH_ACTIONS_NARROW_NO_W =
	"whitespace-nowrap px-1 py-2 font-bold text-center border-b border-slate-200 sticky right-0 bg-slate-50 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)] z-20 text-[11px] text-slate-500";
const TH_FILTER_ACTIONS_NARROW_NO_W =
	"whitespace-nowrap px-1 py-1.5 border-b border-slate-200 sticky right-0 bg-slate-100 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)] z-20";

function colWidthRemStyle(rem: number): CSSProperties {
	return {
		width: `${rem}rem`,
		minWidth: `${rem}rem`,
		maxWidth: `${rem}rem`,
		boxSizing: "border-box",
	};
}

/** Atributo `width` en `<col>` (px); refuerza el layout cuando `border-collapse` ignora estilos. */
function colWidthAttrFromRem(rem: number): number {
	return Math.max(1, Math.round(rem * 16));
}

export interface InlineInsertInfiniteColumn {
	key: string;
	label: string;
	width?: string;
	sortable?: boolean;
	filterable?: boolean;
	/** Menos padding en encabezado (columna muy estrecha). */
	compactHeader?: boolean;
}

export interface InlineInsertInfiniteTableProps<T> {
	columns: InlineInsertInfiniteColumn[];
	data: T[];
	pageSize: number;
	resetKey?: string;
	sortConfig: SortConfig;
	onSort: (key: string) => void;
	inlineFilters: Record<string, string>;
	onInlineFilterChange: (key: string, value: string) => void;
	/** Si se define, la fila de filtros se muestra/oculta con el botón (recomendado). */
	onToggleInlineFilters?: () => void;
	/** Por defecto ocultos; solo aplica si hay `onToggleInlineFilters`. */
	showInlineFilters?: boolean;
	onClearInlineFilters?: () => void;
	getRowKey: (row: T) => string | number;
	/** Fila(s) de alta en línea: se renderiza en el `tbody` justo debajo de encabezados y filtros */
	insertRow?: ReactNode;
	/**
	 * Si es true, cuando no hay filas visibles se muestra `EmptyState` aunque exista `insertRow`.
	 * Útil para catálogos con alta siempre visible (p. ej. Áreas) y listado vacío por filtros.
	 * Por defecto false: mismo comportamiento que antes (con `insertRow` no se muestra vacío).
	 */
	showEmptyStateWithInsertRow?: boolean;
	/** Anchos por columna (data + columna de acciones si aplica), p. ej. `["10%", "40%", "5.5rem"]` */
	columnWidths?: string[];
	/**
	 * Si true, la columna `_actions` no fuerza 5.5rem: se encoge al contenido
	 * (`w-px` + `whitespace-nowrap`). Omitir el ancho de acciones en `columnWidths`.
	 */
	narrowActionsColumn?: boolean;
	/**
	 * Clases del `<col>` (y th de acciones) cuando `narrowActionsColumn`.
	 * Por defecto {@link DEFAULT_NARROW_ACTIONS_COL_W}.
	 */
	narrowActionsColClass?: string;
	/**
	 * Ancho fijo en `rem` para columna `_actions` (estilo inline en `<col>` y `th`).
	 * Prioridad sobre `narrowActionsColClass`; útil cuando las clases en `<col>` no aplican bien.
	 */
	narrowActionsColWidthRem?: number;
	/**
	 * Ancho fijo en `rem` para columna `_seleccion` (checkbox), vía estilo inline en `<col>` y `th`.
	 */
	selectionColWidthRem?: number;
	/** Filas del listado (típicamente cada una `<tr>…</tr>`) */
	renderRow: (row: T, index: number) => ReactNode;
	emptyTitle?: string;
	emptyDescription?: string;
	showResultsInfo?: boolean;
	tableClassName?: string;
}

export function InlineInsertInfiniteTable<T>({
	columns,
	data,
	pageSize,
	resetKey,
	sortConfig,
	onSort,
	inlineFilters,
	onInlineFilterChange,
	onToggleInlineFilters,
	showInlineFilters = false,
	onClearInlineFilters,
	getRowKey,
	insertRow,
	showEmptyStateWithInsertRow = false,
	columnWidths,
	narrowActionsColumn = false,
	narrowActionsColClass,
	narrowActionsColWidthRem,
	selectionColWidthRem,
	renderRow,
	emptyTitle = "No se encontraron registros",
	emptyDescription,
	showResultsInfo = true,
	tableClassName = "",
}: InlineInsertInfiniteTableProps<T>) {
	const totalItems = data.length;
	const { scrollContainerRef, sentinelRef, visibleCount } =
		useInfiniteScrollSlice({
			dataLength: totalItems,
			pageSize,
			resetKey,
		});

	const visibleData = useMemo(
		() => data.slice(0, visibleCount),
		[data, visibleCount]
	);

	const hasSort = Boolean(sortConfig && onSort);
	const lastCol = columns[columns.length - 1];
	const hasActionsColumn = lastCol?.key === "_actions";
	const dataColumns = hasActionsColumn ? columns.slice(0, -1) : columns;
	const hasAnyInlineFilterValue = dataColumns.some((col) => {
		if (col.filterable === false) return false;
		return String(inlineFilters[col.key] ?? "").trim() !== "";
	});

	const supportsFilterToggle = typeof onToggleInlineFilters === "function";
	const showFilterRow = supportsFilterToggle ? showInlineFilters : true;

	const showEmptyState =
		visibleData.length === 0 &&
		(!insertRow || showEmptyStateWithInsertRow);

	const actionsColWidth =
		!narrowActionsColumn &&
		hasActionsColumn &&
		columnWidths &&
		columnWidths.length > dataColumns.length
			? columnWidths[dataColumns.length]
			: "";

	const narrowActionsW =
		(narrowActionsColClass && narrowActionsColClass.trim()) ||
		DEFAULT_NARROW_ACTIONS_COL_W;
	const actionsWidthRem =
		narrowActionsColWidthRem != null && Number.isFinite(narrowActionsColWidthRem)
			? narrowActionsColWidthRem
			: null;
	const actionsColFixedStyle: CSSProperties | undefined =
		narrowActionsColumn && actionsWidthRem != null
			? colWidthRemStyle(actionsWidthRem)
			: undefined;
	const thActionsNarrowClass = actionsColFixedStyle
		? TH_ACTIONS_NARROW_NO_W
		: `${narrowActionsW} whitespace-nowrap px-1 py-2 font-bold text-center border-b border-slate-200 sticky right-0 bg-slate-50 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)] z-20 text-[11px] text-slate-500`.trim();
	const thFilterActionsNarrowClass = actionsColFixedStyle
		? TH_FILTER_ACTIONS_NARROW_NO_W
		: `${narrowActionsW} whitespace-nowrap px-1 py-1.5 border-b border-slate-200 sticky right-0 bg-slate-100 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)] z-20`.trim();

	const thActionsClass = narrowActionsColumn ? thActionsNarrowClass : TH_ACTIONS;
	const thFilterActionsClass = narrowActionsColumn
		? thFilterActionsNarrowClass
		: TH_FILTER_ACTIONS;

	const selectionWidthRem =
		selectionColWidthRem != null && Number.isFinite(selectionColWidthRem)
			? selectionColWidthRem
			: null;
	const selectionColFixedStyle: CSSProperties | undefined =
		selectionWidthRem != null ? colWidthRemStyle(selectionWidthRem) : undefined;

	const tableLayoutClass = narrowActionsColumn ? "table-fixed" : "";
	/**
	 * `border-collapse: collapse` hace que varios motores ignoren anchos de `<col>`/`<colgroup>`.
	 * Con anchos fijos en rem (Puestos), usar `separate` + spacing 0 respeta columnas.
	 */
	const useSeparatedBordersForColWidths =
		narrowActionsColumn &&
		hasActionsColumn &&
		(actionsColFixedStyle != null || selectionColFixedStyle != null);
	const tableBorderClass = useSeparatedBordersForColWidths
		? "border-separate border-spacing-0"
		: "border-collapse";

	return (
		<div className="flex flex-col flex-1 min-h-0 min-w-0 w-full">
			<div
				ref={scrollContainerRef}
				className="flex flex-col flex-1 min-h-0 min-w-0 overflow-auto bg-white relative custom-scrollbar"
			>
				<table
					className={`w-full text-left text-xs text-slate-700 ${tableBorderClass} ${tableLayoutClass} ${tableClassName}`.trim()}
				>
					{narrowActionsColumn && hasActionsColumn ? (
						<colgroup>
							{dataColumns.map((col, idx) => {
								const isSelection = col.key === "_seleccion";
								const selStyle =
									isSelection && selectionColFixedStyle
										? selectionColFixedStyle
										: undefined;
								const selW =
									selStyle && selectionWidthRem != null
										? colWidthAttrFromRem(selectionWidthRem)
										: undefined;
								return (
									<col
										key={col.key}
										className={selStyle ? "" : columnWidths?.[idx] ?? ""}
										style={selStyle}
										width={selW}
									/>
								);
							})}
							<col
								className={actionsColFixedStyle ? "" : narrowActionsW}
								style={actionsColFixedStyle}
								width={
									actionsColFixedStyle && actionsWidthRem != null
										? colWidthAttrFromRem(actionsWidthRem)
										: undefined
								}
							/>
						</colgroup>
					) : null}
					<thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-30 shadow-sm">
						<tr>
							{dataColumns.map((col, colIdx) => {
								const width =
									col.width ?? columnWidths?.[colIdx] ?? "";
								const selThStyle =
									col.key === "_seleccion" && selectionColFixedStyle
										? selectionColFixedStyle
										: undefined;
								return hasSort && col.sortable !== false ? (
									<SortableHeader
										key={col.key}
										columnKey={col.key}
										label={col.label}
										width={width}
										sortConfig={sortConfig}
										onSort={onSort}
									/>
								) : (
									<th
										key={col.key}
										className={`${
											col.compactHeader ? TH_CLASS_COMPACT : TH_CLASS
										} ${selThStyle ? "" : width}`.trim()}
										style={selThStyle}
									>
										{col.label}
									</th>
								);
							})}
							{hasActionsColumn && (
								<th
									className={`${thActionsClass} ${actionsColWidth}`.trim()}
									style={actionsColFixedStyle}
								>
									{supportsFilterToggle ? (
										<div className="flex items-center justify-center">
											<Button
												variant="filterToggle"
												active={showInlineFilters}
												onClick={onToggleInlineFilters}
												title="Alternar filtros por columna"
											>
												<Filter className="w-3.5 h-3.5" />
											</Button>
										</div>
									) : null}
								</th>
							)}
						</tr>
						{showFilterRow ? (
							<tr className="bg-slate-100/50">
								{dataColumns.map((col) => {
									const selFilterStyle =
										col.key === "_seleccion" && selectionColFixedStyle
											? selectionColFixedStyle
											: undefined;
									return (
										<th
											key={col.key}
											className={
												col.filterable === false
													? TH_FILTER_NARROW
													: TH_FILTER
											}
											style={selFilterStyle}
										>
											{col.filterable !== false ? (
												<Input
													variant="filter"
													value={inlineFilters[col.key] ?? ""}
													onChange={(e) =>
														onInlineFilterChange(col.key, e.target.value)
													}
													placeholder="Filtrar..."
												/>
											) : null}
										</th>
									);
								})}
								{hasActionsColumn && (
									<th
										className={thFilterActionsClass}
										style={actionsColFixedStyle}
									>
										{hasAnyInlineFilterValue && onClearInlineFilters ? (
											<button
												type="button"
												onClick={onClearInlineFilters}
												className={`flex items-center justify-center p-1 text-red-500 hover:bg-red-50 rounded transition-colors ${
													narrowActionsColumn ? "w-auto mx-auto" : "w-full"
												}`.trim()}
												title="Limpiar filtros"
											>
												<X className="w-3.5 h-3.5" />
											</button>
										) : null}
									</th>
								)}
							</tr>
						) : null}
					</thead>
					<tbody className="text-xs text-slate-700">
						{insertRow}
						{showEmptyState ? (
							<tr>
								<td
									colSpan={columns.length}
									className="py-8 border-b border-slate-100/60"
								>
									<div className="flex items-center justify-center">
										<EmptyState
											title={emptyTitle}
											description={emptyDescription}
										/>
									</div>
								</td>
							</tr>
						) : (
							visibleData.map((row, index) => (
								<React.Fragment key={String(getRowKey(row))}>
									{renderRow(row, index)}
								</React.Fragment>
							))
						)}
					</tbody>
				</table>
				<div
					ref={sentinelRef}
					className="h-1 w-full shrink-0"
					aria-hidden
				/>
			</div>

			{showResultsInfo && (
				<TableResultsInfo
					visibleCount={visibleData.length}
					totalCount={totalItems}
				/>
			)}
		</div>
	);
}
