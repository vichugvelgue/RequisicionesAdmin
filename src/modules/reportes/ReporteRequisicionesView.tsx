import React, { useEffect, useMemo, useState } from "react";
import { Filter, Check } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { Resolver } from "react-hook-form";
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

interface FilterValues {
	fechaInicio: string;
	fechaFin: string;
	tipoMonto: string;
	tipoObjeto: string;
	solicitante: string;
}

interface RequisicionReport extends RequisicionView {
	numeroRequisicion: string;
	tipoObjetoLabel: string;
	tipoMontoLabel: string;
	solicitanteLabel: string;
	estatusLabel: string;
	fechaSolicitudLabel: string;
	montoLabel: string;
}

const filterSchema = yup.object({
	fechaInicio: yup.string().required("*La fecha inicio es requerida").defined(),
	fechaFin: yup.string().required("*La fecha fin es requerida").defined(),
	tipoMonto: yup.string().default("").defined(),
	tipoObjeto: yup.string().default("").defined(),
	solicitante: yup.string().default("").defined(),
}) as yup.ObjectSchema<FilterValues>;

const TABLE_COLUMNS: SimpleTableColumn<RequisicionReport>[] = [
	{ key: "id", label: "ID", sortable: true, width: "w-[7%]" },
	{
		key: "numeroRequisicion",
		label: "NÚMERO",
		sortable: true,
		width: "w-[12%]",
	},
	{
		key: "montoLabel",
		label: "MONTO",
		sortable: true,
		width: "w-[12%]",
		cellClassName: "text-right",
	},
	{
		key: "tipoObjetoLabel",
		label: "TIPO",
		sortable: true,
		width: "w-[12%]",
	},
	{
		key: "tipoMontoLabel",
		label: "MONTO TIPO",
		sortable: true,
		width: "w-[12%]",
	},
	{
		key: "solicitanteLabel",
		label: "SOLICITANTE",
		sortable: true,
		width: "w-[20%]",
	},
	{
		key: "estatusLabel",
		label: "ESTATUS",
		sortable: true,
		width: "w-[13%]",
	},
	{
		key: "fechaSolicitudLabel",
		label: "FECHA SOLICITUD",
		sortable: true,
		width: "w-[12%]",
	},
];

const TIPO_MONTO_OPTIONS: OptionItem[] = [
	{ value: "", label: "Todos" },
	{ value: "MAYOR", label: "Mayor" },
	{ value: "MENOR", label: "Menor" },
];

const TIPO_OBJETO_OPTIONS: OptionItem[] = [
	{ value: "", label: "Todos" },
	{ value: "BIEN", label: "Bien" },
	{ value: "SERVICIO", label: "Servicio" },
];

export function ReporteRequisicionesView() {
	const { user } = useAuth();

	const [requisiciones, setRequisiciones] = useState<RequisicionReport[]>([]);
	const [loading, setLoading] = useState(false);

	const [toastState, setToastState] = useState<{
		visible: boolean;
		title: string;
		variant: "success" | "error";
	}>({
		visible: false,
		title: "",
		variant: "success",
	});

	const { control,
		handleSubmit,
		reset,
		watch,
		formState: { errors },
	} = useForm<FilterValues>({
		resolver: yupResolver(filterSchema) as Resolver<FilterValues>,
		defaultValues: {
			fechaInicio: "",
			fechaFin: "",
			tipoMonto: "",
			tipoObjeto: "",
		},
	});

	const watchedFilters = watch();


	useEffect(() => {
		if (!toastState.visible) return;

		const t = setTimeout(
			() => setToastState((s) => ({ ...s, visible: false })),
			2800
		);

		return () => clearTimeout(t);
	}, [toastState.visible]);

	const formatCurrency = (value: unknown) => {
		const numberValue = Number(value ?? 0);

		return numberValue.toLocaleString("es-MX", {
			style: "currency",
			currency: "MXN",
		});
	};

	const formatDate = (value: unknown) => {
		if (!value) return "";

		const date = new Date(String(value));

		if (Number.isNaN(date.getTime())) {
			return String(value);
		}

		return date.toLocaleDateString("es-MX");
	};

	const getTipoObjetoLabel = (value: unknown) => {
		const tipo = Number(value);

		if (tipo === 1) return "Bien";
		if (tipo === 2) return "Servicio";

		const text = String(value ?? "").toLowerCase();

		if (text.includes("bien")) return "Bien";
		if (text.includes("servicio")) return "Servicio";

		return "";
	};

	const getTipoMontoLabel = (value: unknown) => {
		const tipo = Number(value);

		if (tipo === 1) return "Mayor";
		if (tipo === 2) return "Menor";

		const text = String(value ?? "").toLowerCase();

		if (text.includes("mayor")) return "Mayor";
		if (text.includes("menor")) return "Menor";

		return "";
	};

	const loadRequisiciones = async () => {
		setLoading(true);

		try {
			console.log("Filtros aplicados:", {
				tipoMonto: watchedFilters.tipoMonto,
				tipoObjeto: watchedFilters.tipoObjeto
			});
			const data = await requisicionApi.obtenerReporteRequisiciones({
				fechaInicio: watchedFilters.fechaInicio,
				fechaFin: watchedFilters.fechaFin,
				tipoMonto: watchedFilters.tipoMonto ? watchedFilters.tipoMonto : null,
				tipoObjeto: watchedFilters.tipoObjeto ? watchedFilters.tipoObjeto : null,
				//estatus: watchedFilters.estatus ? Number(watchedFilters.estatus) : null,
			});

			const requisicionesConDatos: RequisicionReport[] = data.map((req) => ({
				...req,

				numeroRequisicion: `REQ-${req.id}`,

				montoLabel: formatCurrency(req.monto),

				tipoObjetoLabel: getTipoObjetoLabel(
					req.tipoObjetoRequisicion ?? req.tipoObjeto ?? req.tipoRequisicion
				),

				tipoMontoLabel: getTipoMontoLabel(
					req.tipoMontoRequisicion ?? req.tipo
				),

				solicitanteLabel: req.solicitante ?? "",

				estatusLabel: req.estatus ?? req.estado ?? "",

				fechaSolicitudLabel: formatDate(req.fechaSolicitud),
			}));

			setRequisiciones(requisicionesConDatos);
		} catch (err) {
			console.error("Error al cargar requisiciones:", err);

			setToastState({
				visible: true,
				title: "Error al cargar las requisiciones",
				variant: "error",
			});
		} finally {
			setLoading(false);
		}
	};

	const filteredRequisiciones = requisiciones;

	const onSubmit = () => {
		setToastState({
			visible: true,
			title: "Filtros aplicados",
			variant: "success",
		});
	};

	const handleExport = () => {
		const headers = [
			"ID",
			"Número",
			"Monto",
			"Tipo",
			"Mayor/Menor",
			"Solicitante",
			"Estatus",
			"Fecha de solicitud",
		];

		const rows = filteredRequisiciones.map((r) => [
			r.id,
			r.numeroRequisicion,
			r.monto,
			r.tipoObjetoLabel,
			r.tipoMontoLabel,
			r.solicitanteLabel,
			r.estatusLabel,
			r.fechaSolicitudLabel,
		]);

		const csvContent = [
			headers.join(","),
			...rows.map((row) =>
				row
					.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
					.join(",")
			),
		].join("\n");

		const blob = new Blob(["\uFEFF" + csvContent], {
			type: "text/csv;charset=utf-8;",
		});

		const url = window.URL.createObjectURL(blob);
		const a = document.createElement("a");

		a.href = url;
		a.download = `reporte-requisiciones-${new Date().toISOString().split("T")[0]
			}.csv`;

		document.body.appendChild(a);
		a.click();

		window.URL.revokeObjectURL(url);
		document.body.removeChild(a);
	};

	const handleResetFilters = () => {
		reset({
			fechaInicio: "",
			fechaFin: "",
			tipoMonto: "",
			tipoObjeto: "",
			solicitante: "",
		});

		setRequisiciones([]);
	};

	if (user?.tipoPerfil !== "ADMINISTRADOR GENERAL") {
		return (
			<PageCard>
				<div className="flex items-center justify-center h-96">
					<p className="text-red-600">
						No tienes permisos para acceder a este reporte. Tu perfil:{" "}
						{user?.tipoPerfil || "No definido"}
					</p>
				</div>
			</PageCard>
		);
	}

	return (
		<div className="p-4">
			<PageCard>
				<ViewHeader title="Reporte de Requisiciones" />

				<Toast
					visible={toastState.visible}
					title={toastState.title}
					variant={toastState.variant}
					icon={<Check className="w-3.5 h-3.5 text-white" />}
				/>

				<div className="bg-white rounded-lg shadow p-6 mb-6">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-semibold flex items-center gap-2">
							<Filter size={20} />
							Filtros
						</h3>

						<div className="flex gap-3">

						</div>
					</div>

					<form className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Fecha inicio
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

								{errors.fechaInicio?.message ? (
									<p className="text-[11px] mt-1 text-red-600">
										{errors.fechaInicio.message}
									</p>
								) : null}
								<p className="text-[11px] text-slate-500 mt-1">
									El reporte se filtra por el periodo de fecha de solicitud de la requisición.
								</p>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Fecha fin
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

								{errors.fechaFin?.message ? (
									<p className="text-[11px] mt-1 text-red-600">
										{errors.fechaFin.message}
									</p>
								) : null}
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Mayor/Menor
								</label>

								<Controller
									name="tipoMonto"
									control={control}
									render={({ field }) => (
										<SearchableSelect
											options={TIPO_MONTO_OPTIONS}
											value={field.value}
											onChange={field.onChange}
											placeholder="Selecciona tipo..."
										/>
									)}
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Tipo
								</label>

								<Controller
									name="tipoObjeto"
									control={control}
									render={({ field }) => (
										<SearchableSelect
											options={TIPO_OBJETO_OPTIONS}
											value={field.value}
											onChange={field.onChange}
											placeholder="Selecciona tipo..."
										/>
									)}
								/>
							</div>
						</div>

						<div className="flex justify-end gap-2 mt-6">
							<Button
								type="button"
								variant="primary"
								onClick={handleSubmit(loadRequisiciones)}>
								Buscar Requisiciones
							</Button>

							<Button
								type="button"
								variant="secondary"
								onClick={handleResetFilters}>
								Limpiar filtros
							</Button>

							<Button
								type="button"
								variant="secondary"
								onClick={handleExport}
							>
								Exportar
							</Button>
						</div>
					</form>
				</div>

				<div className="bg-white rounded-lg shadow">
					<div className="p-4 border-b border-gray-200 flex items-center justify-between">
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
							getRowKey={(row) => String(row.id)}
						/>
					)}
				</div>
			</PageCard>
		</div>
	);
}