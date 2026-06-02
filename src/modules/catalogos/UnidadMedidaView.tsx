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
import type { OptionItem, SortConfig } from "../../components/UI/types";
import type { InlineInsertInfiniteColumn } from "../../components/UI";
import { unidadMedidaApi, type UnidadMedidaView } from "../../api";

interface CatalogRow extends UnidadMedidaView {}

const SEARCH_CRITERIA_OPTIONS: OptionItem[] = [
	{ value: "Coincidencia", label: "Coincidencia" },
];

const COLUMNS: InlineInsertInfiniteColumn[] = [
	{ key: "id", label: "ID", width: "w-24" },
	{ key: "nombre", label: "NOMBRE" },
	{ key: "estatus", label: "ESTATUS", width: "w-32" },
	{ key: "_actions", label: "", width: "w-20", sortable: false, filterable: false },
];

const normalizeText = (value: string) => value.trim().toUpperCase();

export function UnidadMedidaView() {
	const [rows, setRows] = useState<CatalogRow[]>([]);
	const [draftNombre, setDraftNombre] = useState("");
	const [editingRowId, setEditingRowId] = useState<number | null>(null);
	const [editingNombre, setEditingNombre] = useState("");
	const [pendingDeleteRow, setPendingDeleteRow] = useState<CatalogRow | null>(null);
	const [sortConfig, setSortConfig] = useState<SortConfig>({ key: "id", direction: "asc" });
	const [inlineFilters, setInlineFilters] = useState<Record<string, string>>({
		id: "",
		nombre: "",
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
	const [toastVariant, setToastVariant] = useState<"success" | "error">("success");
	const [isLoading, setIsLoading] = useState(true);
	const [loadError, setLoadError] = useState<string | null>(null);

	const loadRows = async () => {
		setIsLoading(true);
		setLoadError(null);

		try {
			const data = await unidadMedidaApi.listar();
			setRows(data);
		} catch (error) {
			console.error(error);
			setLoadError("No se pudo cargar la unidad de medida.");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		loadRows();
	}, []);

	const filteredAndSortedRows = useMemo(() => {
		const globalTerm = appliedSearchText.trim().toLowerCase();

		const filtered = rows.filter((row) => {
			const matchesGlobalSearch =
				!globalTerm ||
				String(row.id).toLowerCase().includes(globalTerm) ||
				row.nombre.toLowerCase().includes(globalTerm) ||
				row.estatus.toLowerCase().includes(globalTerm);

			return (
				matchesGlobalSearch &&
				String(row.id).toLowerCase().includes(inlineFilters.id.toLowerCase()) &&
				row.nombre.toLowerCase().includes(inlineFilters.nombre.toLowerCase()) &&
				row.estatus.toLowerCase().includes(inlineFilters.estatus.toLowerCase())
			);
		});

		return [...filtered].sort((a, b) => {
			const key = sortConfig.key as keyof CatalogRow;
			const direction = sortConfig.direction === "asc" ? 1 : -1;

			return String(a[key]).localeCompare(String(b[key]), "es", { numeric: true }) * direction;
		});
	}, [appliedSearchText, inlineFilters, rows, sortConfig]);

	const closeInsertRow = () => {
		setDraftNombre("");
		setShowInsertRow(false);
	};

	const showToast = (titleText: string, descriptionText: string, variant: "success" | "error" = "success") => {
		setToastTitle(titleText);
		setToastMessage(descriptionText);
		setToastVariant(variant);
		setToastVisible(true);
	};

	const handleAddRow = async () => {
		const nombre = normalizeText(draftNombre);
		if (!nombre) return;

		try {
			const created = await unidadMedidaApi.crear({ nombre });
			setRows((prev) => [created, ...prev]);
			closeInsertRow();
			showToast("Registro creado", `Registro ${created.id} creado correctamente.`);
		} catch (error) {
			console.error(error);
			showToast(
				"Error",
				error instanceof Error ? error.message : "No se pudo crear la unidad de medida.",
				"error"
			);
		}
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
		setEditingNombre(row.nombre);
	};

	const cancelEditRow = () => {
		setEditingRowId(null);
		setEditingNombre("");
	};

	const saveEditRow = async () => {
		if (editingRowId === null) return;

		const nombre = normalizeText(editingNombre);
		if (!nombre) return;

		try {
			const updated = await unidadMedidaApi.actualizar({
				id: editingRowId,
				nombre,
			});

			setRows((prev) => prev.map((row) => (row.id === updated.id ? updated : row)));
			cancelEditRow();
			showToast("Registro actualizado", `Registro ${updated.id} editado correctamente.`);
		} catch (error) {
			console.error(error);
			showToast(
				"Error",
				error instanceof Error ? error.message : "No se pudo actualizar la unidad de medida.",
				"error"
			);
		}
	};

	const confirmRemoveRow = async () => {
		if (!pendingDeleteRow) return;

		try {
			await unidadMedidaApi.eliminar(pendingDeleteRow.id);
			setRows((prev) => prev.filter((row) => row.id !== pendingDeleteRow.id));
			showToast("Registro eliminado", `Registro ${pendingDeleteRow.id} eliminado correctamente.`);
			setPendingDeleteRow(null);
		} catch (error) {
			console.error(error);
			showToast(
				"Error",
				error instanceof Error ? error.message : "No se pudo eliminar la unidad de medida.",
				"error"
			);
		}
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
						title="Unidad de medida"
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

					<div className="p-4 flex-1 min-h-0 overflow-hidden flex flex-col">
						{loadError ? (
							<div className="text-sm text-red-700">{loadError}</div>
						) : isLoading ? (
							<div className="text-sm text-slate-500">Cargando registros...</div>
						) : (
							<div className="flex-1 min-h-0 overflow-y-auto">
							<InlineInsertInfiniteTable<CatalogRow>
								columns={COLUMNS}
								data={filteredAndSortedRows}
								pageSize={20}
								sortConfig={sortConfig}
								onSort={(key) =>
									setSortConfig((prev) => ({
										key,
										direction:
											prev.key === key && prev.direction === "asc" ? "desc" : "asc",
									}))
								}
								inlineFilters={inlineFilters}
								onInlineFilterChange={(key, value) =>
									setInlineFilters((prev) => ({ ...prev, [key]: value }))
								}
								onToggleInlineFilters={() => setShowInlineFilters((prev) => !prev)}
								showInlineFilters={showInlineFilters}
								onClearInlineFilters={() =>
									setInlineFilters({ id: "", nombre: "", estatus: "" })
								}
								getRowKey={(row) => row.id.toString()}
								insertRow={
									showInsertRow ? (
										<tr className="bg-blue-50/40 border-b border-blue-100">
											<td className="px-2 py-2 border-r border-slate-100/70 text-[11px] text-slate-500">
												AUTOGENERADO
											</td>
											<td className="px-2 py-2 border-r border-slate-100/70">
												<Input
													autoFocus
													value={draftNombre}
													onKeyDown={handleInsertRowKeyDown}
													onChange={(e) => setDraftNombre(e.target.value.toUpperCase())}
													placeholder="NOMBRE"
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
														value={editingNombre}
														onChange={(e) =>
															setEditingNombre(e.target.value.toUpperCase())
														}
														placeholder="NOMBRE"
													/>
												) : (
													row.nombre
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
																onClick={() => setPendingDeleteRow(row)}
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
						)}
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
					<strong>{pendingDeleteRow?.nombre ?? ""}</strong>?
				</p>
			</ConfirmModal>

			<Toast
				visible={toastVisible}
				title={toastTitle}
				description={toastMessage}
				icon={<Check className="w-3.5 h-3.5 text-white" />}
				variant={toastVariant}
			/>
		</div>
	);
}