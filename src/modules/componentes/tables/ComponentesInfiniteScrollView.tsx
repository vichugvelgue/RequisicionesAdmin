import React, { useState, useMemo, useCallback } from "react";
import {
	PageCard,
	ViewHeader,
	Button,
	InfiniteScrollTable,
	Toast,
} from "../../../components/UI";
import type { SortConfig } from "../../../components/UI/types";
import { parseDDMMMYYYY, isDateWithinIsoRange } from "../../../utils/dateFormat";
import type { SimpleTableColumn } from "../../../components/UI/SimpleTable/SimpleTable";
import type { SimpleTableCustomAction } from "../../../components/UI/SimpleTable/SimpleTable";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";

interface DemoRow extends Record<string, unknown> {
	id: string;
	fecha: string;
	obra: string;
	estatus: string;
}

const DEMO_ROWS: DemoRow[] = Array.from({ length: 120 }, (_, i) => {
	const obras = ["Obra Norte", "Obra Sur", "Oficina Central", "Obra Este", "Obra Oeste"];
	const estatuses = ["Activa", "Cancelada", "Borrador", "Cerrada"];
	const day = (i % 28) + 1;
	const month = (i % 12) + 1;
	return {
		id: `REQ-${String(200 + i).padStart(3, "0")}`,
		fecha: `${String(day).padStart(2, "0")}-${String(month).padStart(2, "0")}-2026`,
		obra: obras[i % obras.length],
		estatus: estatuses[i % estatuses.length],
	};
});

const SEARCH_CRITERIA_OPTIONS = [
	{ value: "todo", label: "Todo" },
	{ value: "id", label: "ID" },
	{ value: "obra", label: "Obra" },
	{ value: "estatus", label: "Estatus" },
	{ value: "Fecha", label: "Fecha" },
];

const COLUMNS: SimpleTableColumn<DemoRow>[] = [
	{ key: "id", label: "ID", width: "w-24", sortable: true },
	{ key: "fecha", label: "Fecha", width: "w-28", sortable: true },
	{ key: "obra", label: "Obra", width: "w-40", sortable: true },
	{ key: "estatus", label: "Estatus", width: "w-24", sortable: true },
];

/**
 * Test view: InfiniteScrollTable with global search, inline filters, sort, and actions.
 */
export function ComponentesInfiniteScrollView() {
	const [searchCriteria, setSearchCriteria] = useState(SEARCH_CRITERIA_OPTIONS[0].value);
	const [searchText, setSearchText] = useState("");
	const [rangeStart, setRangeStart] = useState("");
	const [rangeEnd, setRangeEnd] = useState("");
	const [inlineFilters, setInlineFilters] = useState<Record<string, string>>({});
	const [showInlineFilters, setShowInlineFilters] = useState(true);
	const [sortConfig, setSortConfig] = useState<SortConfig>({
		key: "id",
		direction: "asc",
	});
	const [toast, setToast] = useState<string | null>(null);
	const showToast = useCallback((message: string) => {
		setToast(message);
		setTimeout(() => setToast(null), 2500);
	}, []);

	const pageSize = 25;

	const filteredBySearch = useMemo(() => {
		if (searchCriteria === "Fecha" && (rangeStart || rangeEnd)) {
			return DEMO_ROWS.filter((r) => {
				const d = parseDDMMMYYYY(r.fecha);
				return isDateWithinIsoRange(d, rangeStart, rangeEnd);
			});
		}
		if (!searchText.trim()) return DEMO_ROWS;
		const term = searchText.trim().toLowerCase();
		return DEMO_ROWS.filter((r) => {
			if (searchCriteria === "id") return r.id.toLowerCase().includes(term);
			if (searchCriteria === "obra") return r.obra.toLowerCase().includes(term);
			if (searchCriteria === "estatus") return r.estatus.toLowerCase().includes(term);
			return (
				r.id.toLowerCase().includes(term) ||
				r.obra.toLowerCase().includes(term) ||
				r.estatus.toLowerCase().includes(term) ||
				r.fecha.toLowerCase().includes(term)
			);
		});
	}, [searchText, searchCriteria, rangeStart, rangeEnd]);

	const filteredByInline = useMemo(() => {
		const keys = Object.keys(inlineFilters).filter(
			(k) => String(inlineFilters[k] ?? "").trim() !== ""
		);
		if (keys.length === 0) return filteredBySearch;
		return filteredBySearch.filter((row) =>
			keys.every((key) => {
				const cell = String((row as Record<string, unknown>)[key] ?? "").toLowerCase();
				const filter = String(inlineFilters[key] ?? "").trim().toLowerCase();
				return cell.includes(filter);
			})
		);
	}, [filteredBySearch, inlineFilters]);

	const sortedData = useMemo(() => {
		const list = [...filteredByInline];
		const { key, direction } = sortConfig;
		list.sort((a, b) => {
			const va = (a as Record<string, unknown>)[key];
			const vb = (b as Record<string, unknown>)[key];
			const cmp = String(va ?? "").localeCompare(String(vb ?? ""), undefined, {
				numeric: true,
			});
			return direction === "asc" ? cmp : -cmp;
		});
		return list;
	}, [filteredByInline, sortConfig]);

	const resetKey = useMemo(
		() =>
			`${searchText}|${searchCriteria}|${rangeStart}|${rangeEnd}|${sortConfig.key}|${sortConfig.direction}|${JSON.stringify(inlineFilters)}`,
		[
			searchText,
			searchCriteria,
			rangeStart,
			rangeEnd,
			sortConfig.key,
			sortConfig.direction,
			inlineFilters,
		]
	);

	const handleSort = useCallback((key: string) => {
		setSortConfig((prev) => ({
			key,
			direction:
				prev.key === key && prev.direction === "asc" ? "desc" : "asc",
		}));
	}, []);

	const handleInlineFilterChange = useCallback((key: string, value: string) => {
		setInlineFilters((prev) => ({ ...prev, [key]: value }));
	}, []);

	const handleClearInlineFilters = useCallback(() => {
		setInlineFilters({});
	}, []);

	const customActions: SimpleTableCustomAction<DemoRow>[] = useMemo(
		() => [
			{
				icon: <Eye className="w-4 h-4" />,
				title: "Ver",
				onClick: (row) => showToast(`Ver: ${row.id}`),
			},
			{
				icon: <Pencil className="w-4 h-4" />,
				title: "Editar",
				onClick: (row) => showToast(`Editar: ${row.id}`),
			},
			{
				icon: <Trash2 className="w-4 h-4" />,
				title: "Eliminar",
				variant: "iconRed",
				onClick: (row) => showToast(`Eliminar: ${row.id}`),
			},
		],
		[showToast],
	);

	return (
		<div className="flex-1 flex flex-col min-h-0 bg-slate-50 p-4 lg:p-6 overflow-auto">
			<PageCard>
				<ViewHeader
					title="InfiniteScrollTable (prueba)"
					action={
						<Button
							variant="primary"
							leftIcon={<Plus className="w-4 h-4" />}
							onClick={() => showToast("Nuevo registro")}
						>
							Nuevo
						</Button>
					}
				/>
				<div className="border-b border-slate-200" />
				<div className="flex flex-col flex-1 min-h-0 w-full">
					<InfiniteScrollTable<DemoRow>
						data={sortedData}
						pageSize={pageSize}
						resetKey={resetKey}
						searchBar={{
							searchCriteria,
							onSearchCriteriaChange: setSearchCriteria,
							criteriaOptions: SEARCH_CRITERIA_OPTIONS,
							searchText,
							onSearchTextChange: setSearchText,
							onSearch: () => {},
							searchPlaceholder: "Buscar...",
							dateRangeCriteria: "Fecha",
							dateRangeValue: rangeStart
								? { start: rangeStart, end: rangeEnd || rangeStart }
								: undefined,
							onDateRangeChange: (v) => {
								if (!v) {
									setRangeStart("");
									setRangeEnd("");
									return;
								}
								setRangeStart(v.start);
								setRangeEnd(v.end);
							},
						}}
						columns={COLUMNS}
						getRowKey={(row) => row.id}
						sortConfig={sortConfig}
						onSort={handleSort}
						showInlineFilters={showInlineFilters}
						onToggleInlineFilters={() => setShowInlineFilters((b) => !b)}
						inlineFilters={inlineFilters}
						onInlineFilterChange={handleInlineFilterChange}
						onClearInlineFilters={handleClearInlineFilters}
						customActions={customActions}
						actionsColumnLabel=""
						showResultsInfo
					/>
				</div>
				<Toast
					visible={!!toast}
					title={toast ?? ""}
					variant="success"
				/>
			</PageCard>
		</div>
	);
}
