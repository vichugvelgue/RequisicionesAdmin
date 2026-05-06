import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Check, MailPlus, Plus, Save, Trash2 } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "../../../auth";
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
import type {
	SimpleTableColumn,
	SimpleTableCustomAction,
} from "../../../components/UI/SimpleTable/SimpleTable";
import { UsuarioFormSection } from "./UsuarioFormSection";
import type {
	InvitacionHistorialItem,
	SearchCriteria,
	UsuarioFormValues,
	UsuarioRow,
} from "./types";
import { usuarioApi, type UsuarioView } from "../../../api";

const BASE_PATH = "/usuarios";

const SEARCH_CRITERIA_OPTIONS: OptionItem[] = [
	{ value: "Coincidencia", label: "Coincidencia" },
	{ value: "Nombre", label: "Nombre" },
	{ value: "Correo", label: "Correo" },
	{ value: "Tipo usuario", label: "Tipo usuario" },
];

const TABLE_COLUMNS: SimpleTableColumn<UsuarioView>[] = [
	{ key: "id", label: "ID", sortable: true, width: "w-[8%]" },
	{
		key: "nombreCompleto",
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
];

const EMPTY_VALUES: UsuarioFormValues = {
	nombres: "",
	apellidoPaterno: "",
	apellidoMaterno: "",
	correo: "",
	contrasena: "",
	tipoUsuario: "",
	generarInvitacion: false,
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
	tipoUsuario: yup
		.string()
		.oneOf([
			"",
			"1",
			"2",
			"3",
			"4",
		],
			"*Requerido"
		)
		.required("*Requerido"),
	generarInvitacion: yup.boolean().default(false),
	puesto: yup.string().trim().required("*Requerido"),
	area: yup.string().trim().required("*Requerido"),
});

function normalizeText(value: string) {
	return value.trim().toUpperCase();
}

const TIPO_USUARIO_LABEL_TO_ID: Record<string, UsuarioFormValues["tipoUsuario"]> = {
	Administrador: "1",
	Solicitante: "2",
	Revisor: "3",
	Autorizador: "4",
};

function toFormValues(row?: UsuarioView): UsuarioFormValues {
	if (!row) return EMPTY_VALUES;
	const [nombres = "", apellidoPaterno = "", apellidoMaterno = ""] =
		row.nombre.split(" ");
	return {
		nombres,
		apellidoPaterno,
		apellidoMaterno,
		correo: row.correo,
		contrasena: "",
		tipoUsuario: TIPO_USUARIO_LABEL_TO_ID[row.tipoUsuario] ?? "",
		generarInvitacion: false,
		puesto: row.puesto,
		area: row.area,
	};
}

function matchesByCriteria(
	row: UsuarioView,
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



export function UsuariosListadoFormView() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const { id } = useParams();
	const [rows, setRows] = useState<UsuarioView[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [invitacionesHistorial, setInvitacionesHistorial] = useState<
	Record<string, InvitacionHistorialItem[]>
>({});
	const [sortConfig, setSortConfig] = useState<SortConfig>({
		key: "id",
		direction: "asc",
	});
	const [showInlineFilters, setShowInlineFilters] = useState(false);
	const [inlineFilters, setInlineFilters] = useState<Record<string, string>>({
		id: "",
		nombre: "",
		nombreCompleto: "",
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
	const [pendingDeleteRow, setPendingDeleteRow] = useState<UsuarioView | null>(
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

	const loadUsuarios = async () => {
		try {
			setIsLoading(true);
			setError(null);
			const data = await usuarioApi.listar();
			setRows(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Error al cargar usuarios");
		} finally {
			setIsLoading(false);
		}
	};

	const showToast = ( title: string, message: string, variant: "success" | "error" = "success") => {
	setToastState({
		visible: true,
		title: message,
		variant,
	});
};

	const isCreateMode = location.pathname.endsWith("/nuevo");
	const editingRow = rows.find((row) => row.id === id) ?? null;
	const isEditRoute = Boolean(id) && !isCreateMode;
	const mode: "listado" | "form-alta" | "form-edicion" = isCreateMode
		? "form-alta"
		: isEditRoute
			? "form-edicion"
			: "listado";

	useEffect(() => {
		loadUsuarios();
	}, []);

	useEffect(() => {
		if (mode !== "form-edicion") return;
		if (editingRow) return;
		navigate(BASE_PATH, { replace: true });
	}, [editingRow, mode, navigate]);

	const isEditMode = mode === "form-edicion";
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(usuarioSchema),
		context: { isEditMode },
		defaultValues: EMPTY_VALUES,
	});

	const registrarInvitacion = useCallback(
		(usuarioId: string) => {
			const enviadaPor = (
				user?.displayName?.trim() ||
				user?.email?.trim() ||
				"USUARIO SESIÓN"
			).toUpperCase();
			const item: InvitacionHistorialItem = {
				id: `${usuarioId}-${Date.now()}`,
				fecha: new Date().toISOString(),
				estatus: "ENVIADA",
				enviadaPor,
			};
			setInvitacionesHistorial((prev) => ({
				...prev,
				[usuarioId]: [...(prev[usuarioId] ?? []), item],
			}));
			setToastState({
				visible: true,
				title: "Invitación registrada (prototipo)",
				variant: "success",
			});
		},
		[user]
	);

	const handleEnviarInvitacionDesdeListado = useCallback(
		async (row: UsuarioView) => {
			try {
				await usuarioApi.enviarInvitacion({ id: parseInt(row.id) });
				registrarInvitacion(row.id);
			} catch (err) {
				showToast("Error", err instanceof Error ? err.message : "Error al enviar invitación", "error");
			}
		},
		[registrarInvitacion]
	);

	const listadoCustomActions: SimpleTableCustomAction<UsuarioView>[] = useMemo(
		() => [
			{
				icon: <MailPlus className="w-4 h-4" />,
				title: "Enviar invitación",
				onClick: handleEnviarInvitacionDesdeListado,
			},
		],
		[handleEnviarInvitacionDesdeListado]
	);

	const handleEnviarInvitacionDesdeFormulario = useCallback(async () => {
		if (!id || mode !== "form-edicion") {
			showToast("Error", "Guarde el usuario primero", "error");
			return;
		}

		try {
			await usuarioApi.enviarInvitacion({ id: parseInt(id) });
			registrarInvitacion(id);
		} catch (err) {
			showToast("Error", err instanceof Error ? err.message : "Error al enviar invitación", "error");
		}
	}, [id, mode, registrarInvitacion]);

	const historialFormulario = useMemo(() => {
		if (mode !== "form-edicion" || !id) return [];
		return invitacionesHistorial[id] ?? [];
	}, [mode, id, invitacionesHistorial]);

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
				row.nombreCompleto.toLowerCase().includes(inlineFilters.nombreCompleto.toLowerCase()) &&
				row.correo.toLowerCase().includes(inlineFilters.correo.toLowerCase()) &&
				row.tipoUsuario
					.toLowerCase()
					.includes(inlineFilters.tipoUsuario.toLowerCase())
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
		navigate(BASE_PATH);
	};

	const handleAddClick = () => {
		navigate(`${BASE_PATH}/nuevo`);
	};

	const handleEditClick = (row: UsuarioView) => {
		navigate(`${BASE_PATH}/${row.id}`);
	};

	const handleDeleteConfirm = async () => {
		if (!pendingDeleteRow) return;

		try {
			await usuarioApi.eliminar(parseInt(pendingDeleteRow.id));
			setRows((prev) => prev.filter((row) => row.id !== pendingDeleteRow.id));
			setInvitacionesHistorial((prev) => {
				const next = { ...prev };
				delete next[pendingDeleteRow.id];
				return next;
			});
			setPendingDeleteRow(null);
			showToast("Registro eliminado", "Registro eliminado correctamente.");
		} catch (err) {
			console.error("Error deleting usuario:", err);
			showToast("Error", err instanceof Error ? err.message : "Error al eliminar registro", "error");
			setPendingDeleteRow(null);
		}
	};

	const onSubmit: SubmitHandler<UsuarioFormValues> = async (values) => {
		try {
			if (mode === "form-edicion" && id) {
				// Actualizar usuario existente
				const updatedUsuario = await usuarioApi.actualizar({
					id: parseInt(id),
					nombres: normalizeText(values.nombres),
					apellidoPaterno: normalizeText(values.apellidoPaterno),
					apellidoMaterno: normalizeText(values.apellidoMaterno),
					correo: values.correo.trim().toLowerCase(),
					idTipoUsuario: parseInt(values.tipoUsuario, 10),
					puesto: normalizeText(values.puesto),
					area: normalizeText(values.area),
				});

				setRows((prev) => prev.map((row) => (row.id === id ? updatedUsuario : row)));
				showToast("Registro actualizado", "Registro actualizado correctamente.");
			} else {
				// Crear nuevo usuario
				const nuevoUsuario = await usuarioApi.crear({
					nombres: normalizeText(values.nombres),
					apellidoPaterno: normalizeText(values.apellidoPaterno),
					apellidoMaterno: normalizeText(values.apellidoMaterno),
					correo: values.correo.trim().toLowerCase(),
					contrasena: values.contrasena,
					idTipoUsuario: parseInt(values.tipoUsuario, 10),
					puesto: normalizeText(values.puesto),
					area: normalizeText(values.area),
					generarInvitacion: values.generarInvitacion,
				});

				setRows((prev) => [nuevoUsuario, ...prev]);
				showToast("Registro creado", "Registro creado correctamente.");
			}

			resetToListado();
		} catch (err) {
			showToast("Error", err instanceof Error ? err.message : "Error al guardar registro", "error");
		}
	};

	const onInvalidSubmit = () => {
		setToastState({
			visible: true,
			title: "Faltan campos por capturar",
			variant: "error",
		});
	};

	const handleFormSubmit = handleSubmit(onSubmit, onInvalidSubmit);

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
		<div className="flex flex-col h-full min-h-0 bg-slate-50 p-2 lg:p-3 overflow-auto">
			<div className="w-full min-h-0 flex-1 flex flex-col">
				{mode !== "listado" ? (
					<div className="flex items-center justify-between mb-4">
						<BackLink onClick={resetToListado}>
							Volver a usuarios
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
								<div className="flex flex-wrap items-center gap-2 justify-end">
									{mode === "form-edicion" ? (
										<Button
											type="button"
											variant="outline"
											size="md"
											onClick={handleEnviarInvitacionDesdeFormulario}
										>
											Enviar invitación
										</Button>
									) : null}
									<Button
										type="button"
										variant="success"
										size="md"
										leftIcon={<Save className="w-4 h-4" />}
										onClick={handleFormSubmit}
									>
										{mode === "form-edicion" ? "Guardar cambios" : "Guardar"}
									</Button>
								</div>
							)
						}
					/>

					{mode === "listado" ? (
						<div className="flex-1 min-h-0 flex flex-col">
							{error ? (
								<div className="text-sm text-red-700 p-4">{error}</div>
							) : isLoading ? (
								<div className="text-sm text-slate-500 p-4">Cargando usuarios...</div>
							) : (
								<InfiniteScrollTable
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
									customActions={listadoCustomActions}
									actionsColumnLabel=""
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
											nombreCompleto: "",
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
							)}
						</div>
					) : (
						<UsuarioFormSection
							register={register}
							errors={errors}
							onSubmit={handleFormSubmit}
							historialInvitaciones={historialFormulario}
							showGenerarInvitacion={mode === "form-alta"}
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
