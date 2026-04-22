import React, { useEffect, useMemo, useState } from "react";
import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
import {
	Button,
	ConfirmModal,
	GlobalSearchBar,
	Input,
	InlineInsertInfiniteTable,
	PageCard,
	Toast,
	ViewHeader,
} from "../../components/UI";
import type { OptionItem } from "../../components/UI/types";
import type { InlineInsertInfiniteColumn, SortConfig } from "../../components/UI";

type CatalogStatus = "ACTIVO" | "INACTIVO";

interface CatalogRow {
	id: string;
	descripcion: string;
	estatus: CatalogStatus;
}

const SEARCH_CRITERIA_OPTIONS: OptionItem[] = [
	{ value: "Coincidencia", label: "Coincidencia" },
];

const COLUMNS: InlineInsertInfiniteColumn[] = [
	{ key: "id", label: "ID", width: "w-24" },
	{ key: "descripcion", label: "DESCRIPCION" },
	{ key: "estatus", label: "ESTATUS", width: "w-32" },
	{ key: "_actions", label: "", width: "w-20", sortable: false, filterable: false },
];

function normalizeText(value: string) {
	return value.trim().toUpperCase();
}

const INITIAL_ROWS: CatalogRow[] = [
	{ id: "1", descripcion: "FEDERAL", estatus: "ACTIVO" },
	{ id: "2", descripcion: "ESTATAL", estatus: "ACTIVO" },
	{ id: "3", descripcion: "MUNICIPAL", estatus: "INACTIVO" },
];

export function OrigenRecursoView() {
	const [rows, setRows] = useState<CatalogRow[]>(INITIAL_ROWS);
	const [draftDescripcion, setDraftDescripcion] = useState("");
	const [editingRowId, setEditingRowId] = useState<string | null>(null);
	const [editingDescripcion, setEditingDescripcion] = useState("");
	const [pendingDeleteRow, setPendingDeleteRow] = useState<CatalogRow | null>(null);
	const [sortConfig, setSortConfig] = useState<SortConfig>({ key: "id", direction: "asc" });
	const [inlineFilters, setInlineFilters] = useState<Record<string, string>>({
		id: "",
		descripcion: "",
		estatus: "",
	});
	const [showInlineFilters, setShowInlineFilters] = useState(false);
	const [showInsertRow, setShowInsertRow] = useState(false);
	const [searchCriteria, setSearchCriteria] = useState("Coincidencia");
	const [searchText, setSearchText] = useState("");
	const [appliedSearchText, setAppliedSearchText] = useState("");
	const [toastVisible, setToastVisible] = useState(false);
	const [toastTitle, setToastTitle] = useState("Registro");
	const [toastMessage, setToastMessage] = useState("");

	const filteredAndSortedRows = useMemo(() => {
		const globalTerm = appliedSearchText.trim().toLowerCase();
		const filtered = rows.filter((row) => {
			const matchesGlobalSearch =
				!globalTerm ||
				row.id.toLowerCase().includes(globalTerm) ||
				row.descripcion.toLowerCase().includes(globalTerm) ||
				row.estatus.toLowerCase().includes(globalTerm);
			return (
				matchesGlobalSearch &&
				row.id.toLowerCase().includes(inlineFilters.id.toLowerCase()) &&
				row.descripcion.toLowerCase().includes(inlineFilters.descripcion.toLowerCase()) &&
				row.estatus.toLowerCase().includes(inlineFilters.estatus.toLowerCase())
			);
		});

		return [...filtered].sort((a, b) => {
			const key = sortConfig.key as keyof CatalogRow;
			const direction = sortConfig.direction === "asc" ? 1 : -1;
			return (
				String(a[key]).localeCompare(String(b[key]), "es", { numeric: true }) * direction
			);
		});
	}, [appliedSearchText, inlineFilters, rows, sortConfig]);

	const closeInsertRow = () => {
		setDraftDescripcion("");
		setShowInsertRow(false);
	};

	const showToast = (titleText: string, descriptionText: string) => {
		setToastTitle(titleText);
		setToastMessage(descriptionText);
		setToastVisible(true);
	};

	const handleAddRow = () => {
		const descripcion = normalizeText(draftDescripcion);
		if (!descripcion) return;

		const nextId = String(
			rows.reduce((maxId, row) => {
				const parsed = Number.parseInt(row.id, 10);
				return Number.isNaN(parsed) ? maxId : Math.max(maxId, parsed);
			}, 0) + 1
		);

		setRows((prev) => [{ id: nextId, descripcion, estatus: "ACTIVO" }, ...prev]);
		closeInsertRow();
		showToast("Registro creado", `Registro ${nextId} creado correctamente.`);
	};

	const handleInsertRowKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
		if (event.key === "Enter") {
			event.preventDefault();
			handleAddRow();
		}
		if (event.key === "Escape") {
			event.preventDefault();
			closeInsertRow();
		}
	};

	const startEditRow = (row: CatalogRow) => {
		setEditingRowId(row.id);
		setEditingDescripcion(row.descripcion);
	};

	const cancelEditRow = () => {
		setEditingRowId(null);
		setEditingDescripcion("");
	};

	const saveEditRow = () => {
		if (!editingRowId) return;
		const descripcion = normalizeText(editingDescripcion);
		if (!descripcion) return;

		const currentEditingId = editingRowId;
		setRows((prev) =>
			prev.map((row) => (row.id === currentEditingId ? { ...row, descripcion } : row))
		);
		cancelEditRow();
		showToast("Registro actualizado", `Registro ${currentEditingId} editado correctamente.`);
	};

	const confirmRemoveRow = () => {
		if (!pendingDeleteRow) return;
		const deletingId = pendingDeleteRow.id;
		setRows((prev) => prev.filter((row) => row.id !== deletingId));
		setPendingDeleteRow(null);
		showToast("Registro eliminado", `Registro ${deletingId} eliminado correctamente.`);
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
						title="Origen del recurso"
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
						<GlobalSearchBar
							searchCriteria={searchCriteria}
							onSearchCriteriaChange={setSearchCriteria}
							criteriaOptions={SEARCH_CRITERIA_OPTIONS}
							searchText={searchText}
							onSearchTextChange={setSearchText}
							onSearch={() => setAppliedSearchText(searchText)}
						/>
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
									direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
								}))
							}
							inlineFilters={inlineFilters}
							onInlineFilterChange={(key, value) =>
								setInlineFilters((prev) => ({ ...prev, [key]: value }))
							}
							onToggleInlineFilters={() => setShowInlineFilters((prev) => !prev)}
							showInlineFilters={showInlineFilters}
							onClearInlineFilters={() =>
								setInlineFilters({ id: "", descripcion: "", estatus: "" })
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
												autoFocus
												value={draftDescripcion}
												onKeyDown={handleInsertRowKeyDown}
												onChange={(e) => setDraftDescripcion(e.target.value.toUpperCase())}
												placeholder="DESCRIPCION"
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
								return (
									<tr
										key={row.id}
										className={`border-b border-slate-100/60 ${index % 2 === 0 ? "bg-white" : "bg-slate-50/30"}`}
									>
										<td className="px-3 py-2 border-r border-slate-100/70 font-medium text-slate-700">
											{row.id}
										</td>
										<td className="px-3 py-2 border-r border-slate-100/70 uppercase">
											{isEditing ? (
												<Input
													value={editingDescripcion}
													onChange={(e) => setEditingDescripcion(e.target.value.toUpperCase())}
													placeholder="DESCRIPCION"
												/>
											) : (
												row.descripcion
											)}
										</td>
										<td className="px-3 py-2 border-r border-slate-100/70">
											<span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700">
												{row.estatus}
											</span>
										</td>
										<td className="px-2 py-2">
											<div className="flex items-center justify-center gap-1">
												{isEditing ? (
													<>
														<Button variant="iconSuccess" title="Guardar" onClick={saveEditRow}>
															<Check className="w-4 h-4" />
														</Button>
														<Button variant="icon" title="Cancelar edición" onClick={cancelEditRow}>
															<X className="w-4 h-4" />
														</Button>
													</>
												) : (
													<>
														<Button variant="iconAmber" title="Editar" onClick={() => startEditRow(row)}>
															<Pencil className="w-4 h-4" />
														</Button>
														<Button variant="iconRed" title="Eliminar" onClick={() => setPendingDeleteRow(row)}>
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
					¿Deseas eliminar el registro <strong>{pendingDeleteRow?.id ?? ""}</strong>?
				</p>
			</ConfirmModal>
			<Toast
				visible={toastVisible}
				title={toastTitle}
				description={toastMessage}
				icon={<Check className="w-3.5 h-3.5 text-white" />}
			/>
		</div>
	);
}
