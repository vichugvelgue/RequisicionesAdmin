import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Ban, Check, CheckCircle, History, MessageSquare, Plus, Save, Trash2 } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth, isRequisicionReadOnlyProfile } from '../../../auth';
import {
	BackLink,
	Button,
	ConfirmModal,
	PageCard,
	TextArea,
	Toast,
	ViewHeader,
	StatusBadge,
	resolveStatusBadge,
	SimpleTable,
	Input,
	Modal,
} from '../../../components/UI';
import type { OptionItem, SortConfig } from '../../../components/UI/types';
import type { SimpleTableColumn, SimpleTableCustomAction } from '../../../components/UI/SimpleTable/SimpleTable';
import { MontoInicialStep } from './MontoInicialStep';
import {
	AdquisicionBienesFormShell,
	ADQUISICION_BIENES_TAB_DOCUMENTO_MAYOR,
	ADQUISICION_BIENES_TAB_DOCUMENTO_MENOR,
} from './AdquisicionBienesFormShell';
import {
	createEmptyDraft,
	isSolicitanteProfile,
	isRevisorProfileUser,
	type AdquisicionDraft,
	type RequisicionRow,
	type SearchCriteria,
	type TipoCompra,
	EnumRequisicionEstatusId,
	isAutorizadorProfileUser,
	EnumRequisicionEstatus,
} from './types';

import { GuardarRequisicionDTO, requisicionApi, CancelarRequest, type RequisicionView, EnviarObservacionRequest, ObservacionRequisicionView, HistorialRequisicionView, IndicadoresSolicitante } from '../../../api/requisicionBienesAPI';
import { ContratacionServiciosRow } from '../contratacionServicios/types';
import { FieldRoleLabel } from './fieldRoleLabel';



const BASE_PATH = '/requisiciones/adquisicion-bienes';

const TABLE_COLUMNS: SimpleTableColumn<RequisicionRow>[] = [
	{
		key: 'numero',
		label: 'ID',
		sortable: true,
		width: 'w-[10%]',
		render: (_v, row) => String(row.numero).padStart(7, '0'),
	},
	{
		key: 'monto',
		label: 'MONTO',
		sortable: true,
		width: 'w-[14%]',
		cellType: 'money',
	},
	{
		key: 'tipoCompra',
		label: 'TIPO',
		sortable: true,
		width: 'w-[12%]',
		cellClassName: 'uppercase',
	},
	{
		key: 'solicitante',
		label: 'SOLICITANTE',
		sortable: true,
		width: 'w-[26%]',
		cellClassName: 'uppercase',
	},
	{
		key: 'revisor',
		label: 'REVISOR',
		sortable: true,
		width: 'w-[26%]',
		cellClassName: 'uppercase',
	},
	{
		key: 'estatus',
		label: 'ESTATUS',
		sortable: true,
		width: 'w-[14%]',
		render: (_v, row) => {
			const r = resolveStatusBadge(row.estatus.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/_/g, " "));
			return <StatusBadge variant={r.variant}>{r.label}</StatusBadge>;
		},
	},
	{
		key: 'fechaSolicitudIso',
		label: 'FECHA SOL.',
		sortable: true,
		width: 'w-[14%]',
	},
];



const mapRequisicionViewToRow = (item: RequisicionView): RequisicionRow => ({
	id: String(item.id),
	numero: item.id,
	monto: Number(item.monto ?? 0),
	tipoCompra: item.tipo?.toUpperCase() as TipoCompra,
	solicitante: item.solicitante ?? "",
	revisor: item.revisor ?? "N/A",
	estatus: item.estatus ?? "",
	fechaSolicitudIso: item.fechaSolicitud ?? "",
});

export function AdquisicionBienesListadoFormView() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const { id } = useParams();

	const [rows, setRows] = useState<RequisicionRow[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [loadError, setLoadError] = useState<string | null>(null);
	const [draftById, setDraftById] = useState<Record<string, AdquisicionDraft>>({});
	const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'numero', direction: 'desc' });
	const [showInlineFilters, setShowInlineFilters] = useState(false);
	const [inlineFilters, setInlineFilters] = useState<Record<string, string>>({
		numero: '',
		monto: '',
		tipoCompra: '',
		solicitante: '',
		estatus: '',
		fechaSolicitudIso: '',
	});

	const [pendingCriteria, setPendingCriteria] = useState<string>('Coincidencia');
	const [pendingSearchText, setPendingSearchText] = useState('');
	const [pendingTipo, setPendingTipo] = useState('');
	const [pendingEstatus, setPendingEstatus] = useState('');
	const [fechaInicio, setFechaInicio] = useState('');
	const [fechaFin, setFechaFin] = useState('');
	const [indicadores, setIndicadores] = useState<IndicadoresSolicitante | null>(null);

	const [appliedSearch, setAppliedSearch] = useState({
		criteria: 'Coincidencia' as SearchCriteria,
		text: '',
	});
	const [appliedTipo, setAppliedTipo] = useState('');
	const [appliedEstatus, setAppliedEstatus] = useState('');

	const [motivo, setMotivo] = useState('');
	const [pendingDeleteRow, setPendingDeleteRow] = useState<RequisicionRow | null>(null);
	const [pendingRevisionRow, setPendingRevisionRow] = useState<RequisicionRow | null>(null);
	const [pendingObservationRow, setPendingObservationRow] = useState<RequisicionRow | null>(null);
	const [pendingAutorizacionRow, setPendingAutorizacionRow] = useState<RequisicionRow | null>(null);
	const [pendingHistoryRow, setPendingHistoryRow] = useState<ContratacionServiciosRow | null>(null);
	const [observacionesRows, setObservacionesRows] = useState<ObservacionRequisicionView[]>([]);
	const [historysRows, setHistoryRows] = useState<HistorialRequisicionView[]>([]);
	const [newlyCreatedIds, setNewlyCreatedIds] = useState<string[]>([]);
	const [activeFormTabId, setActiveFormTabId] = useState('');
	const [toastState, setToastState] = useState<{
		visible: boolean;
		title: string;
		variant: 'success' | 'error';
	}>({ visible: false, title: '', variant: 'success' });

	const [revisorModal, setRevisorModal] = useState<'solicitar-cambios' | 'cancelar' | null>(null);
	const [revisorModalText, setRevisorModalText] = useState('');

	const isCreateMode = location.pathname.endsWith('/nuevo');
	const editingRow = rows.find((row) => row.id === id) ?? null;
	const isEditRoute = Boolean(id) && !isCreateMode;
	const mode: 'listado' | 'form-alta' | 'form-edicion' = isCreateMode
		? 'form-alta'
		: isEditRoute
			? 'form-edicion'
			: 'listado';

	const isNewRecord = Boolean(editingRow && newlyCreatedIds.includes(editingRow.id));
	//const isRevisorProfile = user?.tipoPerfil === 'REVISOR';
	//const isRequisicionReadOnly = isRequisicionReadOnlyProfile(user?.tipoPerfil);
	/** Solo el solicitante oculta bloques de revisor; `isNewRecord` no debe acortar el formulario al revisor al consultar. */
	//const hideRevisorFields = userHidesRevisorFields(user) || (isNewRecord && !isRevisorProfile);

	const perfil = (user?.tipoPerfil ?? '').trim().toUpperCase();

	const isSolicitante = isSolicitanteProfile(user);
	const isRevisorProfile = isRevisorProfileUser(user);
	const isAutorizadorProfile = isAutorizadorProfileUser(user);
	const isRequisicionReadOnly = isRequisicionReadOnlyProfile(user?.tipoPerfil);
	const isAdministradorGeneralProfile = perfil === 'ADMINISTRADOR_GENERAL';

	const canEditSolicitanteFields = isSolicitante;
	const canEditRevisorFields = isRevisorProfile;
		const isSolicitantePermisoRegistro = (row: RequisicionRow) => isSolicitante && [EnumRequisicionEstatus.En_Captura, EnumRequisicionEstatus.En_Revision].includes(EnumRequisicionEstatus[row.estatus]);
		const isRevisorPermisoRegistro = (row: RequisicionRow) => isRevisorProfile && EnumRequisicionEstatus[row.estatus] == EnumRequisicionEstatus.Pendiente;
		const isAutorizadorPermisoRegistro = (row: RequisicionRow) => isAutorizadorProfile && EnumRequisicionEstatus[row.estatus] == EnumRequisicionEstatus.Validado;
	const canDelete = (row: RequisicionRow) => {
		if (EnumRequisicionEstatus[row.estatus] == EnumRequisicionEstatus.Rechazada) return false
		if (isAutorizadorPermisoRegistro(row)) return true;
		return isSolicitantePermisoRegistro(row) || isRevisorPermisoRegistro(row) || isAutorizadorPermisoRegistro(row);
	}
	const canActions = (row: RequisicionRow) => {
		if (isSolicitante || isAdministradorGeneralProfile) return false;
		return isRevisorPermisoRegistro(row) || isAutorizadorPermisoRegistro(row);
	}

	useEffect(() => {
		if (!isSolicitante) return;

		const cargarIndicadores = async () => {
			const data = await requisicionApi.obtenerIndicadoresSolicitante(1);

			setIndicadores(data);
		};

		cargarIndicadores();
	}, [isSolicitante]);

	const isReadOnly = (row: RequisicionRow) => {
		if (isAdministradorGeneralProfile) return true;
		if (row.tipoCompra === 'MENOR' && !isSolicitante) return true;
		return !(isSolicitantePermisoRegistro(row) || isRevisorPermisoRegistro(row));
	}
	useEffect(() => {
		if (!isCreateMode) return;

		if (isRevisorProfile) {
			navigate(BASE_PATH, { replace: true });
			setToastState({
				visible: true,
				title: 'Los revisores no crean requisiciones nuevas.',
				variant: 'error',
			});
			return;
		}

		if (isRequisicionReadOnly) {
			navigate(BASE_PATH, { replace: true });
			setToastState({
				visible: true,
				title: 'El administrador general solo puede consultar requisiciones.',
				variant: 'error',
			});
		}
	}, [isCreateMode, isRevisorProfile, isRequisicionReadOnly, navigate]);

	useEffect(() => {
		if (mode !== 'form-edicion') return;

		if (!editingRow) {
			navigate(BASE_PATH, { replace: true });
		}
	}, [editingRow, mode, navigate]);


	useEffect(() => {
		loadRequisiciones();
	}, []);

	const loadHistory = async (row: ContratacionServiciosRow) => {
		try {
			setHistoryRows([]);
			setPendingHistoryRow(row);
			setIsLoading(true);

			let data = await requisicionApi.ObtenerHistorial(row.id)

			setHistoryRows(data);
		} catch (error) {
			setLoadError(
				error instanceof Error
					? error.message
					: 'Error al cargar observaciones del servicio'
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleEnviarRevision: SimpleTableCustomAction<ContratacionServiciosRow> = {
		icon: <CheckCircle className="w-4 h-4" />,
		onClick: (row) => {
			setPendingRevisionRow(row);
		},
		title: 'Enviar a revisión',
		variant: 'icon',
		visible: (row: ContratacionServiciosRow) => isSolicitantePermisoRegistro(row),
	};
	const handleHistoryView: SimpleTableCustomAction<ContratacionServiciosRow> = {
		icon: <History className="w-4 h-4" />,
		onClick: (row) => { loadHistory(row); },
		title: 'Ver historial',
		variant: 'icon',
		visible: (row: ContratacionServiciosRow) => true,
	};

	const loadRequisiciones = useCallback(async (fechaInicio?: string, fechaFin?: string, tipoMonto?: string, estatus?: string) => {
		try {
			setIsLoading(true);
			setLoadError(null);

			let data: RequisicionView[] = [];

			const tipoMontoValue =
				tipoMonto !== undefined && tipoMonto !== null && tipoMonto !== ''
					? (isNaN(Number(tipoMonto)) ? null : Number(tipoMonto))
					: null;

			const estatusValue =
				estatus !== undefined && estatus !== null && estatus !== ''
					? (isNaN(Number(estatus)) ? null : Number(estatus))
					: null;

			if (isRequisicionReadOnly) {
				data = await requisicionApi.listaTodo({
					tipoObjeto: 1,
					tipoMonto: tipoMontoValue,
					estatus: estatusValue,
					fechaInicio,
					fechaFin,
				});
			} else if (isRevisorProfile) {
				data = await requisicionApi.listarPorRevisor({
					tipoObjeto: 1,
					tipoMonto: tipoMontoValue,
					estatus: estatusValue,
					fechaInicio,
					fechaFin,
				});
			} else if (isAutorizadorProfile) {
				data = await requisicionApi.listaTodo({
					tipoObjeto: 1,
					tipoMonto: tipoMontoValue,
					estatus: estatusValue,
					fechaInicio,
					fechaFin,
				});
			}
			else {
				data = await requisicionApi.listarPorSolicitante({
					tipoObjeto: 1,
					tipoMonto: tipoMontoValue,
					estatus: estatusValue,
					fechaInicio,
					fechaFin,

				});
			}

			const rowsBienes = data
				.filter((x) => Number(x.tipoObjetoRequisicion ?? 0) === 1)
				.map(mapRequisicionViewToRow);

			setRows(rowsBienes);
		} catch (error) {
			setLoadError(
				error instanceof Error
					? error.message
					: 'Error al cargar requisiciones de bienes'
			);
		} finally {
			setIsLoading(false);
		}
	}, [isRequisicionReadOnly, isRevisorProfile]);

	const applyFilters = useCallback(() => {
		console.log('Applying filters with fechaInicio:', fechaInicio, 'fechaFin:', fechaFin, 'pendingTipo:', pendingTipo, 'pendingEstatus:', pendingEstatus);
		if (!fechaInicio || !fechaFin) {
			setLoadError('Selecciona fecha inicio y fecha fin para buscar.');
			return;
		}

		setLoadError(null);

		setAppliedSearch({
			criteria: pendingCriteria as SearchCriteria,
			text: pendingSearchText,
		});

		setAppliedTipo(pendingTipo);
		setAppliedEstatus(pendingEstatus);

		loadRequisiciones(
			fechaInicio,
			fechaFin,
			pendingTipo,
			pendingEstatus
		);
	}, [
		fechaInicio,
		fechaFin,
		pendingCriteria,
		pendingSearchText,
		pendingTipo,
		pendingEstatus,
		loadRequisiciones,
	]);

	const resetToListado = () => {
		navigate(BASE_PATH);
		loadRequisiciones();
	};

	const handleGuardarRequisicion = () => {
		if (!editingRow) return;
		const d = draftById[editingRow.id];
		if (d?.monto?.trim()) {
			const n = parseFloat(d.monto);
			if (!Number.isNaN(n)) patchRow(editingRow.id, { monto: n });
		}
		setNewlyCreatedIds((prev) => prev.filter((x) => x !== editingRow.id));
		resetToListado();
		setToastState({
			visible: true,
			title: 'Requisición guardada correctamente.',
			variant: 'success',
		});
	};

	const isDocumentoTab =
		editingRow &&
		((editingRow.tipoCompra === 'MAYOR' && activeFormTabId === ADQUISICION_BIENES_TAB_DOCUMENTO_MAYOR) ||
			(editingRow.tipoCompra === 'MENOR' && activeFormTabId === ADQUISICION_BIENES_TAB_DOCUMENTO_MENOR));

	const showGuardarRequisicionEnHeader =
		mode === 'form-edicion' &&
		editingRow &&
		newlyCreatedIds.includes(editingRow.id) &&
		Boolean(isDocumentoTab) &&
		!isRequisicionReadOnly;

	const handleAddClick = () => {
		navigate(`${BASE_PATH}/nuevo`);
	};

	const handleEditClick = (row: RequisicionRow) => {
		navigate(`${BASE_PATH}/${row.id}`);
	};


	const handleMontoContinue = ({
		idRequisicion,
		montoStr,
		tipoCompra,
	}: {
		idRequisicion: number;
		montoStr: string;
		tipoCompra: TipoCompra;
	}) => {
		const monto = parseFloat(montoStr) || 0;
		const nextNum = idRequisicion;
		const newId = String(idRequisicion);
		const solicitante = (
			user?.displayName?.trim() ||
			user?.email?.trim() ||
			'SOLICITANTE'
		).toUpperCase();
		const newRow: RequisicionRow = {
			id: newId,
			numero: nextNum,
			monto,
			tipoCompra,
			solicitante,
			revisor: "N/A",
			estatus: 'En_Captura',
			fechaSolicitudIso: new Date().toLocaleDateString("es", { month: "2-digit", day: "2-digit", year: "numeric" }),
		};
		setRows((prev) => [newRow, ...prev]);
		setDraftById((prev) => ({
			...prev,
			[newId]: {
				...createEmptyDraft(),
				monto: monto.toFixed(2),
				tipoCompra,
			},
		}));
		setNewlyCreatedIds((prev) => (prev.includes(newId) ? prev : [...prev, newId]));
		navigate(`${BASE_PATH}/${newId}`, { replace: true });
		setToastState({
			visible: true,
			title: 'Requisición creada. Complete las pestañas.',
			variant: 'success',
		});
	};

	const handleRevisionConfirm = async () => {
		if (!pendingRevisionRow) return;

		try {
			setIsLoading(true)
			const revId = pendingRevisionRow.id;
			const data: GuardarRequisicionDTO = {
				idRequisicion: Number(revId),
				idUsuario: Number(user?.id ?? 0),
			};
			await requisicionApi.EnviarRevision(data);

			setToastState({
				visible: true,
				title: 'Requisición enviada a revisión',
				variant: 'success',
			});
			resetToListado();
		} catch (error) {
			setToastState({
				visible: true,
				title:
					error instanceof Error
						? error.message
						: 'No se pudieron guardar los datos generales',
				variant: 'error',
			});
		} finally {
			setPendingRevisionRow(null);
		}
	};
	const handleDeleteConfirm = async () => {
		if (!pendingDeleteRow) return;

		try {
			if (isRequisicionReadOnly) {
				throw new Error('El administrador general solo puede consultar requisiciones.');
			}

			if (!canDelete) {
				throw new Error('La requisición no puede eliminarse porque ya se encuentra en un nivel superior de autorización.');
			}

			if (!motivo) {
				throw new Error('Escribe el motivo antes de eliminar.');
			}

			const delId = pendingDeleteRow.id;

			const data: CancelarRequest = {
				idRequisicion: Number(delId),
				idUsuario: Number(user?.id ?? 0),
				motivo: motivo?.trim() ?? ''
			};
			await requisicionApi.Cancelar(data); 1

			setRows((prev) => prev.map((r) => (r.id === delId ? { ...r, estatus: 'Cancelada' } : r)));
			setDraftById((prev) => {
				const n = { ...prev };
				delete n[delId];
				return n;
			});
			setToastState({
				visible: true,
				title: 'Registro eliminado correctamente',
				variant: 'success',
			});
			resetToListado();
		} catch (error) {
			setToastState({
				visible: true,
				title:
					error instanceof Error
						? error.message
						: 'No se pudieron guardar los datos generales',
				variant: 'error',
			});
		} finally {
			setPendingDeleteRow(null);
			setMotivo('');
			setIsLoading(false)
		}
	};
	const handleObservationConfirm = async () => {
		if (!pendingObservationRow) return;

		try {
			if (isRequisicionReadOnly) {
				throw new Error('El administrador general solo puede consultar requisiciones.');
			}

			if (!motivo) {
				throw new Error('Escribe un comentario antes de confirmar.');
			}

			const id = pendingObservationRow.id;

			const data: EnviarObservacionRequest = {
				idRequisicion: Number(id),
				idUsuario: Number(user?.id ?? 0),
				observacion: motivo?.trim() ?? ''
			};
			await requisicionApi.EnviarObservacion(data); 1

			setToastState({
				visible: true,
				title: 'Observaciones solicitadas correctamente',
				variant: 'success',
			});
			resetToListado();
		} catch (error) {
			setToastState({
				visible: true,
				title:
					error instanceof Error
						? error.message
						: 'No se pudieron guardar los datos generales',
				variant: 'error',
			});
		} finally {
			setPendingObservationRow(null);
			setMotivo('');
			setIsLoading(false)
		}
	};
	const handleAutorizationConfirm = async () => {
		if (!pendingAutorizacionRow) return;

		try {
			setIsLoading(true)
			const authId = pendingAutorizacionRow.id;
			const data: GuardarRequisicionDTO = {
				idRequisicion: Number(authId),
				idUsuario: Number(user?.id ?? 0),
			};
			let mensaje = ""
			if (isRevisorProfile) {
				await requisicionApi.EnviarAutorizacion(data);
				mensaje = "Requisición enviada a autorización correctamente"
			} else {
				await requisicionApi.Autorizar(data);
				mensaje = "Requisición autorizada correctamente"
			}

			loadRequisiciones();
			setToastState({
				visible: true,
				title: mensaje,
				variant: 'success',
			});
		} catch (error) {
			setToastState({
				visible: true,
				title:
					error instanceof Error
						? error.message
						: 'No se pudieron guardar los datos generales',
				variant: 'error',
			});
		} finally {
			setPendingAutorizacionRow(null);
			setIsLoading(false)
			loadRequisiciones()
		}
	};

	const patchRow = useCallback(
		(rowId: string, patch: Partial<RequisicionRow>) => {
			setRows((prev) => prev.map((r) => (r.id === rowId ? { ...r, ...patch } : r)));
		},
		[]
	);

	useEffect(() => {
		if (mode === 'form-edicion') return;
		setRevisorModal(null);
		setRevisorModalText('');
	}, [mode]);

	const draftForEdit = editingRow
		? draftById[editingRow.id] ?? createEmptyDraft()
		: createEmptyDraft();

	useEffect(() => {
		if (mode !== 'form-edicion') {
			setActiveFormTabId('');
		}
	}, [mode]);

	const setDraftForId = useCallback((rowId: string, next: AdquisicionDraft) => {
		setDraftById((prev) => ({ ...prev, [rowId]: next }));
	}, []);

	useEffect(() => {
		if (!toastState.visible) return;
		const t = setTimeout(() => setToastState((s) => ({ ...s, visible: false })), 3000);
		return () => clearTimeout(t);
	}, [toastState.visible]);

	const formatDate = (date: string) => {
		if (!date) return

		const [fecha, hora] = date.split("T")
		const [año, mes, dia] = fecha.split("-")
		const [horas, minutos] = hora.split(":")

		return `${dia}/${mes}/${año} ${horas}:${minutos}`
	}
	const formatStatus = (status: string) => {
		return status.replace(/([a-z])([A-Z])/g, "$1 $2")
			.replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
	}

	return (
		<div className="flex flex-col h-full min-h-0 bg-slate-50 p-2 lg:p-3 overflow-hidden">
			<div className="w-full min-h-0 flex-1 flex flex-col">
				{mode !== 'listado' ? (
					<div className="flex items-center justify-between mb-4 shrink-0">
						<BackLink onClick={resetToListado}>Volver a adquisición de bienes</BackLink>
					</div>
				) : null}
				<PageCard className="h-full min-h-0 flex-1 flex flex-col">
					<ViewHeader
						title={
							mode === 'listado'
								? 'Adquisición de bienes'
								: mode === 'form-alta'
									? 'Nueva requisición'
									: `Requisición ${editingRow ? String(editingRow.numero).padStart(7, '0') : ''}`
						}
						action={
							mode === 'listado' && isSolicitante ? (
								<Button
									variant="primary"
									size="md"
									leftIcon={<Plus className="w-4 h-4" />}
									onClick={handleAddClick}
									disabled={isRevisorProfile || isRequisicionReadOnly}
									title={
										isRevisorProfile
											? 'Los revisores no crean requisiciones nuevas.'
											: isRequisicionReadOnly
												? 'El administrador general solo puede consultar requisiciones.'
												: undefined
									}
								>
									Agregar
								</Button>
							) : mode === 'form-edicion' && editingRow && canActions(editingRow) ? (
								<div className="flex flex-wrap items-center justify-end gap-2 shrink-0">
									{isRevisorProfile &&
										<Button
											hidden={!isRevisorProfile}
											type="button"
											variant="outline"
											size="md"
											onClick={() => {
												setPendingObservationRow(editingRow);
												setRevisorModalText('');
											}} >
											Solicitar cambios
										</Button>}
									<Button
										type="button"
										variant="success"
										size="md"
										onClick={() => {
											setPendingAutorizacionRow(editingRow);
										}}
									>
										Autorizar
									</Button>
									<Button
										type="button"
										variant="danger"
										size="md"
										onClick={() => {
											setPendingDeleteRow(editingRow);
										}}
									>
										Rechazar
									</Button>
								</div>
							) : null
						}
					/>


					{mode === 'listado' ? (
						<div className="flex-1 min-h-0 flex flex-col px-5 pt-4 pb-2 gap-3">
							{isSolicitante && indicadores ? (
								<div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 shrink-0">
									<IndicadorCard
										titulo="Total"
										valor={indicadores.total}
										color="bg-slate-50 border-slate-200 text-slate-700"
									/>

									<IndicadorCard
										titulo="En captura"
										valor={indicadores.en_captura}
										color="bg-blue-50 border-blue-200 text-blue-700"
									/>

									<IndicadorCard
										titulo="Pendientes"
										valor={indicadores.pendiente}
										color="bg-amber-50 border-amber-200 text-amber-700"
									/>

									<IndicadorCard
										titulo="En revisión"
										valor={indicadores.en_revision}
										color="bg-red-50 border-red-200 text-red-700"
									/>

									<IndicadorCard
										titulo="Validadas"
										valor={indicadores.validada}
										color="bg-purple-50 border-purple-200 text-purple-700"
									/>

									<IndicadorCard
										titulo="Definitivas"
										valor={indicadores.definitivo}
										color="bg-green-50 border-green-200 text-green-700"
									/>
								</div>
							) : null}
							<div className="shrink-0 rounded-xl border border-slate-200 bg-white p-3">
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[160px_160px_160px_180px_110px] items-end gap-3">
									<div className="flex flex-col gap-1">
										<label className="text-xs font-medium text-slate-600">Fecha inicio *</label>
										<input
											type="date"
											value={fechaInicio}
											onChange={(e) => setFechaInicio(e.target.value)}
											className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm"
										/>
									</div>

									<div className="flex flex-col gap-1">
										<label className="text-xs font-medium text-slate-600">Fecha fin *</label>
										<input
											type="date"
											value={fechaFin}
											onChange={(e) => setFechaFin(e.target.value)}
											className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm"
										/>
									</div>

									<div className="flex flex-col gap-1">
										<label className="text-xs font-medium text-slate-600">Tipo</label>
										<select
											value={pendingTipo}
											onChange={(e) => setPendingTipo(e.target.value)}
											className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm"
										>
											<option value="">Todos</option>
											<option value="1">Mayor</option>
											<option value="2">Menor</option>
										</select>
									</div>

									<div className="flex flex-col gap-1">
										<label className="text-xs font-medium text-slate-600">Estatus</label>
										<select
											value={pendingEstatus}
											onChange={(e) => setPendingEstatus(e.target.value)}
											className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm"
										>
											<option value="">Todos</option>
											<option value="1">Registrada</option>
											<option value="2">En revisión</option>
											<option value="3">Observada</option>
											<option value="4">En autorización</option>
											<option value="5">Autorizada</option>
											<option value="6">Cancelada</option>
										</select>
									</div>

									<Button
										variant="primary"
										size="md"
										onClick={applyFilters}
										className="h-10"
									>
										Buscar
									</Button>
								</div>
							</div>

							{loadError ? (
								<div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
									{loadError}
								</div>
							) : null}
							<SimpleTable<RequisicionRow>
								data={rows}
								columns={TABLE_COLUMNS}
								getRowKey={(row) => row.id}
								sortConfig={sortConfig}
								onSort={(key) =>
									setSortConfig((prev) => ({
										key,
										direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
									}))
								}
								onEdit={handleEditClick}
								onDelete={isSolicitante ? setPendingDeleteRow : undefined}
								customActions={[handleEnviarRevision, handleHistoryView]}
								showInlineFilters={showInlineFilters}
								onToggleInlineFilters={() => setShowInlineFilters((v) => !v)}
								inlineFilters={inlineFilters}
								onInlineFilterChange={(key, value) =>
									setInlineFilters((prev) => ({ ...prev, [key]: value }))
								}
								onClearInlineFilters={() =>
									setInlineFilters({
										numero: '',
										monto: '',
										tipoCompra: '',
										solicitante: '',
										estatus: '',
										fechaSolicitudIso: '',
									})
								}
							/>
						</div>
					) : mode === 'form-alta' ? (
						<MontoInicialStep onContinue={handleMontoContinue} />
					) : editingRow ? (
						<div className="flex-1 min-h-0 flex flex-col overflow-hidden">
							<AdquisicionBienesFormShell
								key={editingRow.id}
								tipoCompra={editingRow.tipoCompra}
								hideRevisorFields={canEditSolicitanteFields}
								readOnly={isReadOnly(editingRow)}
								draft={draftForEdit}
								onDraftChange={(next) => setDraftForId(editingRow.id, next)}
								editingRow={editingRow}
								onPatchRow={(patch) => patchRow(editingRow.id, patch)}
								isNewRecord={isNewRecord}
								onActiveTabChange={setActiveFormTabId}
							/>
						</div>
					) : null}
				</PageCard>

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
						¿Deseas eliminar la requisición{' '}
						<strong>
							{pendingDeleteRow ? String(pendingDeleteRow.numero).padStart(7, '0') : ''}
						</strong>
						?
					</p>
					<br />
					<div>
						<FieldRoleLabel htmlFor="motivo">Motivo de cancelación</FieldRoleLabel>
						<TextArea id="motivo" value={motivo} onChange={(e) => setMotivo(e.target.value)}
							placeholder="Escribe aquí…"></TextArea>
					</div>
				</ConfirmModal>
				<ConfirmModal
					open={Boolean(pendingRevisionRow)}
					onClose={() => setPendingRevisionRow(null)}
					onConfirm={handleRevisionConfirm}
					title="Confirmar revisión"
					icon={<CheckCircle className="w-5 h-5" />}
					variant="neutral"
					confirmLabel="Revisar"
					cancelLabel="Cancelar"
				>
					<p className="text-sm text-slate-600">
						¿Deseas enviar a revisión la requisición{' '}
						<strong>
							{pendingRevisionRow ? String(pendingRevisionRow.numero).padStart(7, '0') : ''}
						</strong>
						?
					</p>
				</ConfirmModal>
				<ConfirmModal
					open={Boolean(pendingObservationRow)}
					onClose={() => setPendingObservationRow(null)}
					onConfirm={handleObservationConfirm}
					title="Solicitar cambios"
					icon={<Trash2 className="w-5 h-5" />}
					variant="neutral"
					confirmLabel="Solicitar"
					cancelLabel="Cancelar"
				>
					<div>
						<FieldRoleLabel htmlFor="motivo">Cambios solicitados</FieldRoleLabel>
						<TextArea id="motivo" value={motivo} onChange={(e) => setMotivo(e.target.value)}
							placeholder="Escribe aquí…"></TextArea>
					</div>
				</ConfirmModal>

				<ConfirmModal
					open={Boolean(pendingRevisionRow)}
					onClose={() => setPendingRevisionRow(null)}
					onConfirm={handleRevisionConfirm}
					title="Confirmar revisión"
					icon={<CheckCircle className="w-5 h-5" />}
					variant="neutral"
					confirmLabel="Enviar"
					cancelLabel="Cancelar"
				>
					<p className="text-sm text-slate-600">
						¿Deseas enviar a revisión la requisición{' '}
						<strong>
							{pendingRevisionRow ? String(pendingRevisionRow.numero).padStart(7, '0') : ''}
						</strong>
						?
					</p>
				</ConfirmModal>

				<ConfirmModal
					open={Boolean(pendingAutorizacionRow)}
					onClose={() => setPendingAutorizacionRow(null)}
					onConfirm={handleAutorizationConfirm}
					title={isRevisorProfile ? "Enviar a autorización" : "Autorizar"}
					icon={<CheckCircle className="w-5 h-5" />}
					variant="neutral"
					confirmLabel="Enviar"
					cancelLabel="Cancelar"
				>
					<p className="text-sm text-slate-600">
						¿{isRevisorProfile ? "Deseas enviar a autorización la requisición" : "Deseas autorizar la requisición"}{' '}
						<strong>
							{pendingAutorizacionRow ? String(pendingAutorizacionRow.numero).padStart(7, '0') : ''}
						</strong>
						?
					</p>
				</ConfirmModal>

				<Modal
					title="Historial de requisición"
					open={Boolean(pendingHistoryRow)}
					onClose={() => setPendingHistoryRow(null)}
					icon={<History className="w-5 h-5" />}
				>
					<div className="max-h-[70dvh] overflow-y-auto pr-2">
						<div className="space-y-3">
							{historysRows.map((item, index) => (
								<div
									key={index}
									className="relative rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
								>
									<div className="flex items-start justify-between gap-4">
										<div>
											<p className="text-sm font-bold uppercase text-slate-800">
												{formatStatus(item.accion)}
											</p>

											<p className="mt-1 text-xs text-slate-500">
												{item.nombreUsuario} · {formatDate(item.fechaRegistro)}
											</p>
										</div>

										<span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase text-blue-700">
											#{historysRows.length - index}
										</span>
									</div>

									{item.comentario ? (
										<div className="mt-3 rounded-lg border-l-4 border-blue-500 pl-4 py-1">
											<p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-blue-700">
												Comentario
											</p>

											<p className="text-sm leading-relaxed text-slate-700">
												{item.comentario}
											</p>
										</div>
									) : (
										<p className="mt-3 text-xs italic text-slate-400">
											Sin comentario registrado
										</p>
									)}
								</div>
							))}
						</div>
					</div>
				</Modal>
				<Toast
					visible={toastState.visible}
					title={toastState.title}
					variant={toastState.variant}
					icon={<Check className="w-3.5 h-3.5 text-white" />}
				/>
			</div>
		</div>
	);
}



function IndicadorCard({ titulo, valor, color }: { titulo: string; valor: number; color: string }) {
	return (
		<div className={`rounded-xl border p-3 ${color}`}>
			<p className="text-xs font-medium opacity-80">{titulo}</p>
			<p className="mt-1 text-3xl font-bold">{valor}</p>
		</div>
	);
}