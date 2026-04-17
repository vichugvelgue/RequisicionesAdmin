import React, { useEffect, useMemo, useState } from "react";
import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
import {
	Button,
	ConfirmModal,
	GlobalSearchBar,
	Input,
	InlineInsertInfiniteTable,
	PageCard,
	Select,
	Toast,
	ViewHeader,
} from "../../../components/UI";
import type { OptionItem } from "../../../components/UI/types";
import type {
	InlineInsertInfiniteColumn,
	SortConfig,
} from "../../../components/UI";

type CatalogStatus = "ACTIVO" | "INACTIVO";

interface CatalogRow {
	id: string;
	valor1: string;
	valor2: string;
	estatus: CatalogStatus;
}

const STATUS_OPTIONS: Array<{ value: CatalogStatus; label: CatalogStatus }> = [
	{ value: "ACTIVO", label: "ACTIVO" },
	{ value: "INACTIVO", label: "INACTIVO" },
];

const INITIAL_ROWS: CatalogRow[] = [
	{ id: "1", valor1: "EJEMPLO A", valor2: "DETALLE A", estatus: "ACTIVO" },
	{ id: "2", valor1: "EJEMPLO B", valor2: "DETALLE B", estatus: "INACTIVO" },
];

const COLUMNS: InlineInsertInfiniteColumn[] = [
	{ key: "id", label: "ID", width: "w-24" },
	{ key: "valor1", label: "VALOR 1" },
	{ key: "valor2", label: "VALOR 2" },
	{ key: "estatus", label: "ESTATUS", width: "w-32" },
	{ key: "_actions", label: "", width: "w-20", sortable: false, filterable: false },
];

const SEARCH_CRITERIA_OPTIONS: OptionItem[] = [
	{ value: "Coincidencia", label: "Coincidencia" },
];

function normalizeText(value: string) {
	return value.trim().toUpperCase();
}

export function CatalogoInlineView() {
	const [rows, setRows] = useState<CatalogRow[]>(INITIAL_ROWS);
	const [draft, setDraft] = useState<CatalogRow>({
		valor1: "",
		valor2: "",
		estatus: "ACTIVO",
		id: "",
	});
	const [sortConfig, setSortConfig] = useState<SortConfig>({
		key: "id",
		direction: "asc",
	});
	const [inlineFilters, setInlineFilters] = useState<Record<string, string>>({
		id: "",
		valor1: "",
		valor2: "",
		estatus: "",
	});
	const [showInlineFilters, setShowInlineFilters] = useState(false);
	const [showInsertRow, setShowInsertRow] = useState(false);
	const [searchCriteria, setSearchCriteria] = useState("Coincidencia");
	const [searchText, setSearchText] = useState("");
	const [appliedSearchText, setAppliedSearchText] = useState("");
	const [pendingDeleteRow, setPendingDeleteRow] = useState<CatalogRow | null>(null);
	const [toastVisible, setToastVisible] = useState(false);
	const [toastMessage, setToastMessage] = useState("");
	const [editingRowId, setEditingRowId] = useState<string | null>(null);
	const [editingDraft, setEditingDraft] = useState<{
		valor1: string;
		valor2: string;
	}>({
		valor1: "",
		valor2: "",
	});

	const filteredAndSortedRows = useMemo(() => {
		const globalTerm = appliedSearchText.trim().toLowerCase();
		const filtered = rows.filter((row) => {
			const matchesGlobalSearch =
				!globalTerm ||
				row.id.toLowerCase().includes(globalTerm) ||
				row.valor1.toLowerCase().includes(globalTerm) ||
				row.valor2.toLowerCase().includes(globalTerm) ||
				row.estatus.toLowerCase().includes(globalTerm);
			return (
				matchesGlobalSearch &&
				row.id.toLowerCase().includes(inlineFilters.id.toLowerCase()) &&
				row.valor1.toLowerCase().includes(inlineFilters.valor1.toLowerCase()) &&
				row.valor2.toLowerCase().includes(inlineFilters.valor2.toLowerCase()) &&
				row.estatus.toLowerCase().includes(inlineFilters.estatus.toLowerCase())
			);
		});

		return [...filtered].sort((a, b) => {
			const key = sortConfig.key as keyof CatalogRow;
			const aValue = String(a[key]);
			const bValue = String(b[key]);
			const direction = sortConfig.direction === "asc" ? 1 : -1;
			return aValue.localeCompare(bValue, "es", { numeric: true }) * direction;
		});
	}, [rows, inlineFilters, sortConfig, appliedSearchText]);

	const resetDraft = () => {
		setDraft({
			valor1: "",
			valor2: "",
			estatus: "ACTIVO",
			id: "",
		});
	};

	const closeInsertRow = () => {
		resetDraft();
		setShowInsertRow(false);
	};

	const handleInsertRowKeyDown: React.KeyboardEventHandler<
		HTMLInputElement | HTMLSelectElement
	> = (event) => {
		if (event.key === "Enter") {
			event.preventDefault();
			handleAddRow();
		}
		if (event.key === "Escape") {
			event.preventDefault();
			closeInsertRow();
		}
	};

	const handleAddRow = () => {
		const nextValor1 = normalizeText(draft.valor1);
		const nextValor2 = normalizeText(draft.valor2);
		if (!nextValor1 || !nextValor2) return;

		const nextId = String(
			rows.reduce((maxId, row) => {
				const parsed = Number.parseInt(row.id, 10);
				return Number.isNaN(parsed) ? maxId : Math.max(maxId, parsed);
			}, 0) + 1
		);

		setRows((prev) => [
			{
				id: nextId,
				valor1: nextValor1,
				valor2: nextValor2,
				estatus: "ACTIVO",
			},
			...prev,
		]);
		closeInsertRow();
	};

	const handleRemoveRow = (id: string) => {
		setRows((prev) => prev.filter((row) => row.id !== id));
	};

	const requestRemoveRow = (row: CatalogRow) => {
		setPendingDeleteRow(row);
	};

	const confirmRemoveRow = () => {
		if (!pendingDeleteRow) return;
		handleRemoveRow(pendingDeleteRow.id);
		setToastMessage(`Registro ${pendingDeleteRow.id} eliminado correctamente.`);
		setToastVisible(true);
		setPendingDeleteRow(null);
	};

	const startEditRow = (row: CatalogRow) => {
		setEditingRowId(row.id);
		setEditingDraft({
			valor1: row.valor1,
			valor2: row.valor2,
		});
	};

	const cancelEditRow = () => {
		setEditingRowId(null);
		setEditingDraft({
			valor1: "",
			valor2: "",
		});
	};

	const saveEditRow = () => {
		if (!editingRowId) return;
		const currentEditingId = editingRowId;
		const nextValor1 = normalizeText(editingDraft.valor1);
		const nextValor2 = normalizeText(editingDraft.valor2);
		if (!nextValor1 || !nextValor2) return;

		setRows((prev) =>
			prev.map((row) =>
				row.id === currentEditingId
					? {
							...row,
							valor1: nextValor1,
							valor2: nextValor2,
						}
					: row
			)
		);
		setToastMessage(`Registro ${currentEditingId} editado correctamente.`);
		setToastVisible(true);
		cancelEditRow();
	};

	useEffect(() => {
		if (!toastVisible) return;
		const timer = setTimeout(() => setToastVisible(false), 3000);
		return () => clearTimeout(timer);
	}, [toastVisible]);

	return (
		<div className="flex flex-col h-full min-h-0 bg-slate-50 p-2 lg:p-3 overflow-hidden">
			<div className="w-full min-h-0 flex-1 flex flex-col">
				<PageCard className="h-full min-h-0 flex-1 flex flex-col">
					<ViewHeader
						title="Catalogo inline"
						action={
							!showInsertRow ? (
								<Button
									variant="primarySm"
									leftIcon={<Plus className="w-4 h-4" />}
									onClick={() => setShowInsertRow(true)}
								>
									Agregar
								</Button>
							) : null
						}
					/>
					<div className="p-4 border-b border-slate-200">
						<div className="space-y-3">
							<p className="text-xs text-slate-600">
								Catalogo de ejemplo para pruebas en desarrollo.
							</p>
							<GlobalSearchBar
								searchCriteria={searchCriteria}
								onSearchCriteriaChange={setSearchCriteria}
								criteriaOptions={SEARCH_CRITERIA_OPTIONS}
								searchText={searchText}
								onSearchTextChange={setSearchText}
								onSearch={() => setAppliedSearchText(searchText)}
							/>
						</div>
					</div>
					<div className="p-4 flex-1 min-h-0">
						<InlineInsertInfiniteTable<CatalogRow>
							columns={COLUMNS}
							data={filteredAndSortedRows}
							pageSize={20}
							sortConfig={sortConfig}
							onSort={(key) =>
								setSortConfig((prev) => ({
									key,
									direction:
										prev.key === key && prev.direction === "asc"
											? "desc"
											: "asc",
								}))
							}
							inlineFilters={inlineFilters}
							onInlineFilterChange={(key, value) =>
								setInlineFilters((prev) => ({ ...prev, [key]: value }))
							}
							onToggleInlineFilters={() =>
								setShowInlineFilters((prev) => !prev)
							}
							showInlineFilters={showInlineFilters}
							onClearInlineFilters={() =>
								setInlineFilters({
									id: "",
									valor1: "",
									valor2: "",
									estatus: "",
								})
							}
							getRowKey={(row) => row.id}
							insertRow={
								showInsertRow ? (
								<tr className="bg-blue-50/40 border-b border-blue-100">
									<td className="px-2 py-2 border-r border-slate-100/70 text-[11px] text-slate-500">
										AUTOGENERADO
									</td>
									<td className="px-2 py-2 border-r border-slate-100/70">
										<Input
											value={draft.valor1}
											onKeyDown={handleInsertRowKeyDown}
											onChange={(e) =>
												setDraft((prev) => ({
													...prev,
													valor1: e.target.value.toUpperCase(),
												}))
											}
											placeholder="VALOR 1"
										/>
									</td>
									<td className="px-2 py-2 border-r border-slate-100/70">
										<Input
											value={draft.valor2}
											onKeyDown={handleInsertRowKeyDown}
											onChange={(e) =>
												setDraft((prev) => ({
													...prev,
													valor2: e.target.value.toUpperCase(),
												}))
											}
											placeholder="VALOR 2"
										/>
									</td>
									<td className="px-2 py-2 border-r border-slate-100/70">
										<span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700">
											ACTIVO
										</span>
									</td>
									<td className="px-2 py-2 text-center text-[11px] text-slate-500">
										ENTER = GUARDAR
									</td>
								</tr>
								) : null
							}
							renderRow={(row, index) => {
								const isEditing = editingRowId === row.id;
								const isActive = row.estatus === "ACTIVO";
								return (
									<tr
										key={row.id}
										className={`border-b border-slate-100/60 ${
											index % 2 === 0 ? "bg-white" : "bg-slate-50/30"
										}`}
									>
										<td className="px-3 py-2 border-r border-slate-100/70 font-medium text-slate-700">
											{row.id}
										</td>
										<td className="px-3 py-2 border-r border-slate-100/70 uppercase">
											{isEditing ? (
												<Input
													value={editingDraft.valor1}
													onChange={(e) =>
														setEditingDraft((prev) => ({
															...prev,
															valor1: e.target.value.toUpperCase(),
														}))
													}
													placeholder="VALOR 1"
												/>
											) : (
												row.valor1
											)}
										</td>
										<td className="px-3 py-2 border-r border-slate-100/70 uppercase">
											{isEditing ? (
												<Input
													value={editingDraft.valor2}
													onChange={(e) =>
														setEditingDraft((prev) => ({
															...prev,
															valor2: e.target.value.toUpperCase(),
														}))
													}
													placeholder="VALOR 2"
												/>
											) : (
												row.valor2
											)}
										</td>
										<td className="px-3 py-2 border-r border-slate-100/70">
											<span
												className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
													isActive
														? "bg-emerald-100 text-emerald-700"
														: "bg-red-100 text-red-700"
												}`}
											>
												{row.estatus}
											</span>
										</td>
										<td className="px-2 py-2">
											<div className="flex items-center justify-center gap-1">
												{isEditing ? (
													<>
														<Button
															variant="iconSuccess"
															title="Guardar"
															onClick={saveEditRow}
														>
															<Check className="w-4 h-4" />
														</Button>
														<Button
															variant="icon"
															title="Cancelar edición"
															onClick={cancelEditRow}
														>
															<X className="w-4 h-4" />
														</Button>
													</>
												) : (
													<>
														<Button
															variant="iconAmber"
															title="Editar"
															onClick={() => startEditRow(row)}
														>
															<Pencil className="w-4 h-4" />
														</Button>
														<Button
															variant="iconRed"
															title="Eliminar"
									onClick={() => requestRemoveRow(row)}
														>
															<Trash2 className="w-4 h-4" />
														</Button>
													</>
												)}
											</div>
										</td>
									</tr>
								);
							}}
						/>
					</div>
				</PageCard>
			</div>
			<ConfirmModal
				open={Boolean(pendingDeleteRow)}
				onClose={() => setPendingDeleteRow(null)}
				onConfirm={confirmRemoveRow}
				title="Confirmar eliminación"
				icon={<Trash2 className="w-5 h-5" />}
				variant="danger"
				confirmLabel="Eliminar"
				cancelLabel="Cancelar"
			>
				<p className="text-sm text-slate-600">
					¿Deseas eliminar el registro{" "}
					<strong>{pendingDeleteRow?.id ?? ""}</strong>?
				</p>
			</ConfirmModal>
			<Toast
				visible={toastVisible}
				title="Registro eliminado"
				description={toastMessage}
				icon={<Check className="w-3.5 h-3.5 text-white" />}
			/>
		</div>
	);
}
