import React, { useEffect, useMemo, useState } from "react";
import { Download, Filter, RefreshCw, Check } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "../../auth";
import {
	Button,
	PageCard,
	ViewHeader,
	Toast,
	SimpleTable,
	Input,
} from "../../components/UI";
import type { SimpleTableColumn } from "../../components/UI/SimpleTable/SimpleTable";
import { SearchableSelect } from "../../components/common/SearchableSelect";
import { requisicionApi, type RequisicionView } from "../../api";
import type { OptionItem } from "../../components/UI/types";
import type { Resolver } from "react-hook-form";

interface FilterValues {
  fechaInicio: string;
  fechaFin: string;
  tipoRequisicion: string;
  responsable: string;
}

interface RequisicionReport extends RequisicionView {
	tipoCompra?: string;
	responsable?: string;
	numeroRequisicion?: string;
	estado?: string;
}

const filterSchema: yup.ObjectSchema<FilterValues> = yup
  .object({
    fechaInicio: yup.string().default("").defined(),
    fechaFin: yup.string().default("").defined(),
    tipoRequisicion: yup.string().default("").defined(),
    responsable: yup.string().default("").defined(),
  })
  .required();

const TABLE_COLUMNS: SimpleTableColumn<RequisicionReport>[] = [
	{ key: "id", label: "ID", sortable: true, width: "w-[8%]" },
	{
		key: "numeroRequisicion",
		label: "NÚMERO",
		sortable: true,
		width: "w-[12%]",
	},
	{
		key: "tipoCompra",
		label: "TIPO",
		sortable: true,
		width: "w-[10%]",
	},
	{
		key: "fechaSolicitud",
		label: "FECHA",
		sortable: true,
		width: "w-[12%]",
	},
	{
		key: "responsable",
		label: "RESPONSABLE",
		sortable: true,
		width: "w-[20%]",
	},
	{
		key: "monto",
		label: "MONTO",
		sortable: true,
		width: "w-[12%]",
		cellClassName: "text-right",
	},
	{
		key: "estatus",
		label: "ESTADO",
		sortable: true,
		width: "w-[12%]",
	},
];

const TIPO_REQUISICION_OPTIONS: OptionItem[] = [
	{ value: "", label: "Todos" },
	{ value: "MAYOR", label: "Mayor" },
	{ value: "MENOR", label: "Menor" },
];

export function ReporteRequisicionesView() {
	const { user } = useAuth();
	const [requisiciones, setRequisiciones] = useState<RequisicionReport[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [responsables, setResponsables] = useState<OptionItem[]>([]);
    const [toastState, setToastState] = useState<{
            visible: boolean;
            title: string;
            variant: 'success' | 'error';
        }>({ visible: false, title: '', variant: 'success' });

	console.log("Usuario actual:", user);
	console.log("Tipo de perfil:", user?.tipoPerfil);

	const {
        control,
        handleSubmit,
        reset,
        watch,
        } = useForm<FilterValues>({
        resolver: yupResolver(filterSchema) as Resolver<FilterValues>,
        defaultValues: {
            fechaInicio: "",
            fechaFin: "",
            tipoRequisicion: "",
            responsable: "",
        },
    });

	const watchedFilters = watch();

	// Cargar requisiciones al montar el componente
	useEffect(() => {
		console.log("Cargando requisiciones...");
		loadRequisiciones();
	}, []);

	// Cargar responsables únicos de las requisiciones
	useEffect(() => {
		const responsablesUnicos = Array.from(
			new Set(requisiciones.map((r) => r.responsable || r.solicitante).filter(Boolean))
		).map((responsable) => ({
			value: responsable,
			label: responsable,
		}));
		setResponsables(responsablesUnicos);
	}, [requisiciones]);

	const loadRequisiciones = async () => {
		setLoading(true);
		setError(null);
		try {
			console.log("Llamando a requisicionApi.listarPorSolicitante()");
			const data = await requisicionApi.listarPorSolicitante();
			console.log("Datos recibidos:", data);
			const requisicionesConDatos: RequisicionReport[] = data.map((req) => ({
				...req,
				numeroRequisicion: `REQ-${req.id}`,
				tipoCompra: req.tipo === "1" ? "Mayor" : "Menor",
				responsable: req.solicitante,
				estado: req.estatus,
			}));
			console.log("Requisiciones procesadas:", requisicionesConDatos);
			setRequisiciones(requisicionesConDatos);
		} catch (err) {
			console.error("Error al cargar requisiciones:", err);
			setError("Error al cargar las requisiciones");
		} finally {
			setLoading(false);
		}
	};

	// Filtrar requisiciones basándose en los valores del formulario
	const filteredRequisiciones = useMemo(() => {
		return requisiciones.filter((requisicion) => {
			// Filtrar por fecha inicio
			if (
				watchedFilters.fechaInicio &&
				new Date(requisicion.fechaSolicitud) < new Date(watchedFilters.fechaInicio)
			) {
				return false;
			}

			// Filtrar por fecha fin
			if (
				watchedFilters.fechaFin &&
				new Date(requisicion.fechaSolicitud) > new Date(watchedFilters.fechaFin)
			) {
				return false;
			}

			// Filtrar por tipo de requisición
			if (watchedFilters.tipoRequisicion) {
				const tipoRequisicion =
					requisicion.tipo === "1" ? "MAYOR" : requisicion.tipo === "2" ? "MENOR" : "";
				if (tipoRequisicion !== watchedFilters.tipoRequisicion) {
					return false;
				}
			}

			// Filtrar por responsable
			if (
				watchedFilters.responsable &&
				(requisicion.responsable || requisicion.solicitante) !== watchedFilters.responsable
			) {
				return false;
			}

			return true;
		});
	}, [requisiciones, watchedFilters]);

	const onSubmit = (data: FilterValues) => {
		console.log("Filtros aplicados:", data);
	};

	const handleExport = () => {
		console.log("Exportando datos...");
		const headers = ["ID", "Número", "Tipo", "Fecha", "Responsable", "Monto", "Estado"];
		const rows = filteredRequisiciones.map((r) => [
			r.id,
			r.numeroRequisicion,
			r.tipoCompra,
			r.fechaSolicitud,
			r.responsable || r.solicitante,
			r.monto,
			r.estado,
		]);

		const csvContent = [
			headers.join(","),
			...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
		].join("\n");

		const blob = new Blob([csvContent], { type: "text/csv" });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `reporte-requisiciones-${new Date().toISOString().split("T")[0]}.csv`;
		document.body.appendChild(a);
		a.click();
		window.URL.revokeObjectURL(url);
		document.body.removeChild(a);
	};

	const handleResetFilters = () => {
		reset({
			fechaInicio: "",
			fechaFin: "",
			tipoRequisicion: "",
			responsable: "",
		});
	};

	if (user?.tipoPerfil !== "ADMINISTRADOR GENERAL") {
		console.log("Usuario no tiene permisos de administrador general");
		return (
			<PageCard>
				<div className="flex items-center justify-center h-96">
					<p className="text-red-600">
						No tienes permisos para acceder a este reporte. Tu perfil: {user?.tipoPerfil || "No definido"}
					</p>
				</div>
			</PageCard>
		);
	}

	console.log("Renderizando componente completo");

	return (
		<PageCard>
			<ViewHeader title="Reporte de Requisiciones" />

			{error && (
				<Toast
					visible={toastState.visible}
					title={toastState.title}
					variant={toastState.variant}
					icon={<Check className="w-3.5 h-3.5 text-white" />}
				/>
			)}

			{/* Filtros */}
			<div className="bg-white rounded-lg shadow p-6 mb-6">
				<h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
					<Filter size={20} />
					Filtros
				</h3>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						{/* Fecha Inicio */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Fecha Inicio
							</label>
							<Controller
								name="fechaInicio"
								control={control}
								render={({ field }) => (
									<Input
										{...field}
										type="date"
										placeholder="Fecha inicio"
									/>
								)}
							/>
						</div>

						{/* Fecha Fin */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Fecha Fin
							</label>
							<Controller
								name="fechaFin"
								control={control}
								render={({ field }) => (
									<Input
										{...field}
										type="date"
										placeholder="Fecha fin"
									/>
								)}
							/>
						</div>

						{/* Tipo Requisición */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Tipo de Requisición
							</label>
							<Controller
								name="tipoRequisicion"
								control={control}
								render={({ field }) => (
									<SearchableSelect
										options={TIPO_REQUISICION_OPTIONS}
										value={field.value}
										onChange={field.onChange}
										placeholder="Selecciona tipo..."
									/>
								)}
							/>
						</div>

						{/* Responsable */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Responsable
							</label>
							<Controller
								name="responsable"
								control={control}
								render={({ field }) => (
									<SearchableSelect
										options={[
											{ value: "", label: "Todos" },
											...responsables,
										]}
										value={field.value}
										onChange={field.onChange}
										placeholder="Selecciona responsable..."
									/>
								)}
							/>
						</div>
					</div>

					{/* Botones */}
					<div className="flex gap-3 justify-end mt-6">
						<Button
							type="button"
							variant="secondary"							
							onClick={handleResetFilters}
						>
							Limpiar Filtros
						</Button>
						<Button
							type="button"
							variant="secondary"							
							onClick={handleExport}
						>
							Exportar
						</Button>
						<Button
							type="submit"
							variant="primary"
						>
							Aplicar Filtros
						</Button>
					</div>
				</form>
			</div>

			{/* Tabla de Resultados */}
			<div className="bg-white rounded-lg shadow">
				<div className="p-4 border-b border-gray-200">
					<p className="text-sm text-gray-600">
						Se encontraron {filteredRequisiciones.length} requisiciones
					</p>
				</div>

				{loading ? (
					<div className="flex items-center justify-center h-96">
						<p>Cargando requisiciones...</p>
					</div>
				) : filteredRequisiciones.length === 0 ? (
					<div className="flex items-center justify-center h-96">
						<p className="text-gray-500">
							No se encontraron requisiciones con los filtros seleccionados
						</p>
					</div>
				) : (
					<SimpleTable
						columns={TABLE_COLUMNS}
						data={filteredRequisiciones}
						getRowKey={(row) => row.id.toString()}
					/>
				)}
			</div>
		</PageCard>
	);
}
