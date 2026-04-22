import React, { useEffect, useMemo, useState } from "react";
import { Check, Plus, Save, Trash2 } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
	BackLink,
	Button,
	ConfirmModal,
	InfiniteScrollTable,
	PageCard,
	Toast,
	ViewHeader,
} from "../../../components/UI";
import type { OptionItem, SortConfig } from "../../../components/UI/types";
import type { SimpleTableColumn } from "../../../components/UI/SimpleTable/SimpleTable";
import { UsuarioFormSection } from "./UsuarioFormSection";
import type {
	SearchCriteria,
	UsuarioFormValues,
	UsuarioRow,
} from "./types";

const INITIAL_ROWS: UsuarioRow[] = [
	{
		id: "1",
		nombre: "JUAN PEREZ LOPEZ",
		correo: "juan.perez@nexerp.com",
		tipoUsuario: "ADMINISTRADOR",
		puesto: "JEFE DE AREA",
		area: "SISTEMAS",
	},
	{
		id: "2",
		nombre: "MARIA GARCIA RAMOS",
		correo: "maria.garcia@nexerp.com",
		tipoUsuario: "OPERATIVO",
		puesto: "ANALISTA",
		area: "FINANZAS",
	},
];

const SEARCH_CRITERIA_OPTIONS: OptionItem[] = [
	{ value: "Coincidencia", label: "Coincidencia" },
	{ value: "Nombre", label: "Nombre" },
	{ value: "Correo", label: "Correo" },
	{ value: "Tipo usuario", label: "Tipo usuario" },
	{ value: "Puesto", label: "Puesto" },
	{ value: "Area", label: "Area" },
];

const TABLE_COLUMNS: SimpleTableColumn<UsuarioRow>[] = [
	{ key: "id", label: "ID", sortable: true, width: "w-[8%]" },
	{
		key: "nombre",
		label: "NOMBRE",
		sortable: true,
		width: "w-[20%]",
		cellClassName: "uppercase",
	},
	{
		key: "correo",
		label: "CORREO",
		sortable: true,
		width: "w-[20%]",
		cellClassName: "uppercase",
	},
	{
		key: "tipoUsuario",
		label: "TIPO USUARIO",
		sortable: true,
		width: "w-[14%]",
		cellClassName: "uppercase",
	},
	{
		key: "puesto",
		label: "PUESTO",
		sortable: true,
		width: "w-[16%]",
		cellClassName: "uppercase",
	},
	{
		key: "area",
		label: "AREA",
		sortable: true,
		width: "w-[14%]",
		cellClassName: "uppercase",
	},
];

const EMPTY_VALUES: UsuarioFormValues = {
	nombres: "",
	apellidoPaterno: "",
	apellidoMaterno: "",
	correo: "",
	contrasena: "",
	tipoUsuario: "",
	puesto: "",
	area: "",
};

const usuarioSchema = yup.object({
	nombres: yup.string().trim().required("*Requerido"),
	apellidoPaterno: yup.string().trim().required("*Requerido"),
	apellidoMaterno: yup.string().trim().required("*Requerido"),
	correo: yup.string().trim().email("*Requerido").required("*Requerido"),
	contrasena: yup.string().when("$isEditMode", {
		is: true,
		then: (schema) => schema.trim(),
		otherwise: (schema) => schema.trim().required("*Requerido"),
	}),
	tipoUsuario: yup.string().trim().required("*Requerido"),
	puesto: yup.string().trim().required("*Requerido"),
	area: yup.string().trim().required("*Requerido"),
});

function normalizeText(value: string) {
	return value.trim().toUpperCase();
}

function toFormValues(row?: UsuarioRow): UsuarioFormValues {
	if (!row) return EMPTY_VALUES;
	const [nombres = "", apellidoPaterno = "", apellidoMaterno = ""] =
		row.nombre.split(" ");
	return {
		nombres,
		apellidoPaterno,
		apellidoMaterno,
		correo: row.correo,
		contrasena: "",
		tipoUsuario: row.tipoUsuario,
		puesto: row.puesto,
		area: row.area,
	};
}

function matchesByCriteria(
	row: UsuarioRow,
	criteria: SearchCriteria,
	searchTerm: string
) {
	const term = searchTerm.trim().toLowerCase();
	if (!term) return true;
	if (criteria === "Coincidencia") {
		return (
			row.id.toLowerCase().includes(term) ||
			row.nombre.toLowerCase().includes(term) ||
			row.correo.toLowerCase().includes(term) ||
			row.tipoUsuario.toLowerCase().includes(term) ||
			row.puesto.toLowerCase().includes(term) ||
			row.area.toLowerCase().includes(term)
		);
	}
	if (criteria === "Nombre") return row.nombre.toLowerCase().includes(term);
	if (criteria === "Correo") return row.correo.toLowerCase().includes(term);
	if (criteria === "Tipo usuario")
		return row.tipoUsuario.toLowerCase().includes(term);
	if (criteria === "Puesto") return row.puesto.toLowerCase().includes(term);
	return row.area.toLowerCase().includes(term);
}

export function EjemplosListadoFormView() {
	const navigate = useNavigate();
	const location = useLocation();
	const { id } = useParams();
	const [rows, setRows] = useState<UsuarioRow[]>(INITIAL_ROWS);
	const [sortConfig, setSortConfig] = useState<SortConfig>({
		key: "id",
		direction: "asc",
	});
	const [showInlineFilters, setShowInlineFilters] = useState(false);
	const [inlineFilters, setInlineFilters] = useState<Record<string, string>>({
		id: "",
		nombre: "",
		correo: "",
		tipoUsuario: "",
		puesto: "",
		area: "",
	});
	const [searchCriteria, setSearchCriteria] =
		useState<SearchCriteria>("Coincidencia");
	const [searchText, setSearchText] = useState("");
	const [appliedSearch, setAppliedSearch] = useState({
		criteria: "Coincidencia" as SearchCriteria,
		text: "",
	});
	const [pendingDeleteRow, setPendingDeleteRow] = useState<UsuarioRow | null>(
		null
	);
	const [toastState, setToastState] = useState<{
		visible: boolean;
		title: string;
		variant: "success" | "error";
	}>({
		visible: false,
		title: "",
		variant: "success",
	});

	const isCreateMode = location.pathname.endsWith("/nuevo");
	const editingRow = rows.find((row) => row.id === id) ?? null;
	const isEditRoute = Boolean(id) && !isCreateMode;
	const mode: "listado" | "form-alta" | "form-edicion" = isCreateMode
		? "form-alta"
		: isEditRoute
			? "form-edicion"
			: "listado";

	useEffect(() => {
		if (mode !== "form-edicion") return;
		if (editingRow) return;
		navigate("/ejemplos/listado-form", { replace: true });
	}, [editingRow, mode, navigate]);

	const isEditMode = mode === "form-edicion";
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<UsuarioFormValues>({
		resolver: yupResolver(usuarioSchema),
		context: { isEditMode },
		defaultValues: EMPTY_VALUES,
	});

	const filteredAndSortedRows = useMemo(() => {
		const filtered = rows.filter((row) => {
			const matchesGlobal = matchesByCriteria(
				row,
				appliedSearch.criteria,
				appliedSearch.text
			);
			return (
				matchesGlobal &&
				row.id.toLowerCase().includes(inlineFilters.id.toLowerCase()) &&
				row.nombre.toLowerCase().includes(inlineFilters.nombre.toLowerCase()) &&
				row.correo.toLowerCase().includes(inlineFilters.correo.toLowerCase()) &&
				row.tipoUsuario
					.toLowerCase()
					.includes(inlineFilters.tipoUsuario.toLowerCase()) &&
				row.puesto.toLowerCase().includes(inlineFilters.puesto.toLowerCase()) &&
				row.area.toLowerCase().includes(inlineFilters.area.toLowerCase())
			);
		});

		return [...filtered].sort((a, b) => {
			const key = sortConfig.key as keyof UsuarioRow;
			const direction = sortConfig.direction === "asc" ? 1 : -1;
			return (
				String(a[key]).localeCompare(String(b[key]), "es", { numeric: true }) *
				direction
			);
		});
	}, [rows, sortConfig, inlineFilters, appliedSearch]);

	const resetToListado = () => {
		reset(EMPTY_VALUES);
		navigate("/ejemplos/listado-form");
	};

	const handleAddClick = () => {
		navigate("/ejemplos/listado-form/nuevo");
	};

	const handleEditClick = (row: UsuarioRow) => {
		navigate(`/ejemplos/listado-form/${row.id}`);
	};

	const handleDeleteConfirm = () => {
		if (!pendingDeleteRow) return;
		setRows((prev) => prev.filter((row) => row.id !== pendingDeleteRow.id));
		setPendingDeleteRow(null);
		setToastState({
			visible: true,
			title: "Registro eliminado correctamente",
			variant: "success",
		});
	};

	const onSubmit = (values: UsuarioFormValues) => {
		const nombreCompleto = normalizeText(
			`${values.nombres} ${values.apellidoPaterno} ${values.apellidoMaterno}`
		);
		const payload: UsuarioRow = {
			id:
				id ??
				String(
					rows.reduce((maxId, row) => Math.max(maxId, Number(row.id) || 0), 0) + 1
				),
			nombre: nombreCompleto,
			correo: values.correo.trim().toLowerCase(),
			tipoUsuario: normalizeText(values.tipoUsuario),
			puesto: normalizeText(values.puesto),
			area: normalizeText(values.area),
		};

		if (mode === "form-edicion" && id) {
			setRows((prev) => prev.map((row) => (row.id === id ? payload : row)));
		} else {
			setRows((prev) => [payload, ...prev]);
		}

		setToastState({
			visible: true,
			title: "Guardado correctamente",
			variant: "success",
		});
		resetToListado();
	};

	const onInvalidSubmit = () => {
		setToastState({
			visible: true,
			title: "Faltan campos por capturar",
			variant: "error",
		});
	};

	useEffect(() => {
		if (!toastState.visible) return;
		const timer = setTimeout(() => {
			setToastState((prev) => ({ ...prev, visible: false }));
		}, 3000);
		return () => clearTimeout(timer);
	}, [toastState.visible]);

	useEffect(() => {
		if (mode === "form-edicion" && editingRow) {
			reset(toFormValues(editingRow));
			return;
		}
		if (mode === "form-alta") {
			reset(EMPTY_VALUES);
		}
	}, [mode, editingRow, reset]);

	return (
		<div className="flex flex-col h-full min-h-0 bg-slate-50 p-2 lg:p-3 overflow-hidden">
			<div className="w-full min-h-0 flex-1 flex flex-col">
				{mode !== "listado" ? (
					<div className="flex items-center justify-between mb-4">
						<BackLink onClick={resetToListado}>
							Volver a Listado + Form
						</BackLink>
					</div>
				) : null}
				<PageCard className="h-full min-h-0 flex-1 flex flex-col">
					<ViewHeader
						title={
							mode === "listado"
								? "Usuarios"
								: mode === "form-alta"
									? "Nuevo usuario"
									: `Usuario ${id ?? ""}`
						}
						action={
							mode === "listado" ? (
								<Button
									variant="primary"
									size="md"
									leftIcon={<Plus className="w-4 h-4" />}
									onClick={handleAddClick}
								>
									Agregar
								</Button>
							) : (
								<Button
									type="button"
									variant="success"
									size="md"
									leftIcon={<Save className="w-4 h-4" />}
									onClick={handleSubmit(onSubmit, onInvalidSubmit)}
								>
									{mode === "form-edicion" ? "Guardar cambios" : "Guardar"}
								</Button>
							)
						}
					/>

					{mode === "listado" ? (
						<div className="flex-1 min-h-0">
							<InfiniteScrollTable<UsuarioRow>
								data={filteredAndSortedRows}
								pageSize={30}
								resetKey={JSON.stringify({
									search: appliedSearch,
									inlineFilters,
									sortConfig,
								})}
								columns={TABLE_COLUMNS}
								getRowKey={(row) => row.id}
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
								searchBar={{
									searchCriteria,
									onSearchCriteriaChange: (value) =>
										setSearchCriteria(value as SearchCriteria),
									criteriaOptions: SEARCH_CRITERIA_OPTIONS,
									searchText,
									onSearchTextChange: setSearchText,
									onSearch: () =>
										setAppliedSearch({
											criteria: searchCriteria,
											text: searchText,
										}),
								}}
								showInlineFilters={showInlineFilters}
								onToggleInlineFilters={() =>
									setShowInlineFilters((prev) => !prev)
								}
								inlineFilters={inlineFilters}
								onInlineFilterChange={(key, value) =>
									setInlineFilters((prev) => ({ ...prev, [key]: value }))
								}
								onClearInlineFilters={() =>
									setInlineFilters({
										id: "",
										nombre: "",
										correo: "",
										tipoUsuario: "",
										puesto: "",
										area: "",
									})
								}
								onEdit={handleEditClick}
								onDelete={(row) => setPendingDeleteRow(row)}
								showResultsInfo
							/>
						</div>
					) : (
						<UsuarioFormSection
							register={register}
							errors={errors}
							onSubmit={handleSubmit(onSubmit, onInvalidSubmit)}
						/>
					)}
				</PageCard>
			</div>

			<ConfirmModal
				open={Boolean(pendingDeleteRow)}
				onClose={() => setPendingDeleteRow(null)}
				onConfirm={handleDeleteConfirm}
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
				visible={toastState.visible}
				title={toastState.title}
				variant={toastState.variant}
				icon={<Check className="w-3.5 h-3.5 text-white" />}
			/>
		</div>
	);
}
