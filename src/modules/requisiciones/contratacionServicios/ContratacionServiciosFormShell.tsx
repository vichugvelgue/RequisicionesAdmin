import React, { useEffect, useMemo, useState } from 'react';
import { Tabs, TabsList, TabsTab, TabsPanel } from '../../../components/UI';
import { StepperTabLabel } from './stepperTabLabel';
import type { ContratacionServiciosDraft, ContratacionServiciosRow, TipoCompraServicios } from './types';
import { MayorDatosGeneralesTab } from './tabs/mayor/MayorDatosGeneralesTab';
import { MayorDatosPresupuestalesTab } from './tabs/mayor/MayorDatosPresupuestalesTab';
import { MayorDatosRequisicionTab } from './tabs/mayor/MayorDatosRequisicionTab';
import { MayorPartidasTab } from './tabs/mayor/MayorPartidasTab';
import { MayorEjecucionTab } from './tabs/mayor/MayorEjecucionTab';
import { MayorCondicionesTab } from './tabs/mayor/MayorCondicionesTab';
import { MayorRepresentantesTab } from './tabs/mayor/MayorRepresentantesTab';
import { MayorAdministradorContratoTab } from './tabs/mayor/MayorAdministradorContratoTab';
import { ServicioMayorDocumentoWordPreview } from './documento/ServicioMayorDocumentoWordPreview';
import { ServicioMenorDocumentoWordPreview } from './documento/ServicioMenorDocumentoWordPreview';
import { MenorDatosGeneralesTab } from './tabs/menor/MenorDatosGeneralesTab';
import { MenorDatosRequisicionTab } from './tabs/menor/MenorDatosRequisicionTab';
import { MenorPartidasTab } from './tabs/menor/MenorPartidasTab';
import { MenorDocumentoTab } from './tabs/menor/MenorDocumentoTab';

import { requisicionApi, RequisicionDetalle } from '../../../api/requisicionBienesAPI';
import { isSolicitanteProfile } from '../adquisicionBienes/types';
import { useAuth, isRequisicionReadOnlyProfile } from '../../../auth';

export const CONTRATACION_SERVICIOS_TAB_DOCUMENTO_MAYOR = 'cs-g11';
export const CONTRATACION_SERVICIOS_TAB_DOCUMENTO_MENOR = 'cs-m4';

const REQUISICION_TAB_FIELDSET_CLASS =
	'border-0 p-0 m-0 min-h-0 min-w-0 flex flex-1 flex-col overflow-auto bg-transparent';

function RequisicionTabPanelFieldset({
	readOnly,
	children,
}: {
	readOnly: boolean;
	children: React.ReactNode;
}) {
	return (
		<fieldset disabled={readOnly} className={REQUISICION_TAB_FIELDSET_CLASS}>
			{children}
		</fieldset>
	);
}

export function ContratacionServiciosFormShell({
	tipoCompra,
	hideRevisorFields,
	readOnly = false,
	draft,
	onDraftChange,
	editingRow,
	onPatchRow,
	isNewRecord,
	onActiveTabChange,
}: {
	tipoCompra: TipoCompraServicios;
	hideRevisorFields: boolean;
	/** Solo consulta (p. ej. perfil administrador general). */
	readOnly?: boolean;
	draft: ContratacionServiciosDraft;
	onDraftChange: (next: ContratacionServiciosDraft) => void;
	editingRow: ContratacionServiciosRow;
	onPatchRow: (patch: Partial<ContratacionServiciosRow>) => void;
	isNewRecord: boolean;
	onActiveTabChange?: (tabId: string) => void;
}) {
	useEffect(() => {
		if (!editingRow?.id) return;

		const loadDetalle = async () => {
			setIsLoadingDetalle(true);

			try {
				const data = await requisicionApi.obtenerPorId(Number(editingRow.id));
				setRequisicionDetalle(data);
			} finally {
				setIsLoadingDetalle(false);
			}
		};

		loadDetalle();
	}, [editingRow?.id]);

	const [tab, setTab] = useState(() => (tipoCompra === 'MAYOR' ? 'cs-g1' : 'cs-m1'));

	useEffect(() => {
		onActiveTabChange?.(tab);
	}, [tab, onActiveTabChange]);


	const { user } = useAuth();
	const AUTO_ADVANCE_DELAY_MS = 900;
	const idRequisicion = Number(editingRow.id);
	const [requisicionDetalle, setRequisicionDetalle] = useState<RequisicionDetalle | null>(null);
	const [isLoadingDetalle, setIsLoadingDetalle] = useState(false);
	const isSolicitante = isSolicitanteProfile(user)
	const [documentoServicios, setDocumentoServicios] = useState<any | null>(null);
	const [loadingDocumento, setLoadingDocumento] = useState(false);

	const cargarDocumentoServicios = async () => {
		if (!idRequisicion || loadingDocumento) return;

		setLoadingDocumento(true);

		try {
			const data = await requisicionApi.obtenerDocumentoServicios(idRequisicion);
			setDocumentoServicios(data);
		} finally {
			setLoadingDocumento(false);
		}
	};

	useEffect(() => {
		if (!requisicionDetalle) return;

		const shouldFillMayores = tipoCompra === 'MAYOR';
		const draftIsEmpty =
			Object.keys(draft.mayorDatosGenerales).length === 0 &&
			Object.keys(draft.mayorDatosPresupuestales).length === 0 &&
			Object.keys(draft.mayorDatosRequisicion).length === 0 &&
			draft.mayorPartidas.length === 0;
		const draftIsEmptyMenor =
			Object.keys(draft.menorDatosGenerales).length === 0 &&
			Object.keys(draft.menorDatosRequisicion).length === 0 &&
			draft.menorPartidas.length === 0;

		if (shouldFillMayores && !draftIsEmpty) return;
		if (!shouldFillMayores && !draftIsEmptyMenor) return;

		const nextDraft = { ...draft };

		if (tipoCompra === 'MAYOR') {
			nextDraft.mayorDatosGenerales = {
				unidadSolicitanteId: requisicionDetalle.idUnidadSolicitante
					? String(requisicionDetalle.idUnidadSolicitante)
					: '',
				nombreTitular: requisicionDetalle.nombreSolicitante ?? '',
				cargoSolicitante: requisicionDetalle.cargoSolicitante ?? '',
				fechaSolicitud: requisicionDetalle.fechaSolicitud
					? requisicionDetalle.fechaSolicitud.substring(0, 10)
					: '',
				caracterProcedimiento: requisicionDetalle.caracterProcedimiento
					? String(requisicionDetalle.caracterProcedimiento)
					: '',
				modalidadContratacion: requisicionDetalle.modalidadContratacion
					? String(requisicionDetalle.modalidadContratacion)
					: '',
				articuloConformidad: requisicionDetalle.articulo
					? String(requisicionDetalle.articulo)
					: '',
				tipoProcedimiento: requisicionDetalle.tipoProcedimiento ?? '',
			};
			nextDraft.mayorDatosPresupuestales = {
				presupuestoAutorizado: requisicionDetalle.presupuestoAutorizado ?? '',
				clavePresupuestalId: requisicionDetalle.idClavePresupuestal ? String(requisicionDetalle.idClavePresupuestal) : '',
				origenRecursoId: requisicionDetalle.idOrigenRecurso ? String(requisicionDetalle.idOrigenRecurso) : '',
				componenteId: requisicionDetalle.idComponente ? String(requisicionDetalle.idComponente) : '',
				actividadId: requisicionDetalle.idActividad ? String(requisicionDetalle.idActividad) : '',
				tipoProgramaId: requisicionDetalle.idTipoPrograma ? String(requisicionDetalle.idTipoPrograma) : '',
			};
			nextDraft.mayorDatosRequisicion = {
				descripcionGeneral: requisicionDetalle.descripcionGeneral ?? '',
				justificacionGasto: requisicionDetalle.justificacionGasto ?? '',
				periodoGarantia: requisicionDetalle.periodoGarantia ?? '',
			};
			nextDraft.mayorEjecucion = {
				experienciaLicitante: requisicionDetalle.servicioDetalle?.experienciaLicitante ?? '',
				ciudad: requisicionDetalle.servicioDetalle?.ciudad ?? '',
				calle: requisicionDetalle.servicioDetalle?.calle ?? '',
				cp: requisicionDetalle.servicioDetalle?.cp ?? '',
				colonia: requisicionDetalle.servicioDetalle?.colonia ?? '',
			};
			nextDraft.mayorCondiciones = {
				diasEntrega: requisicionDetalle.servicioDetalle?.diasEntrega ?? '',
				condicionesGeneralesContratacion: requisicionDetalle.servicioDetalle?.condicionesGeneralesContratacion ?? '',
				pagosSeRealizaran: requisicionDetalle.servicioDetalle?.pagosSeRealizaran ?? '',
			};
			nextDraft.mayorRepresentantes = {
				nombre: requisicionDetalle.servicioDetalle?.nombreRepresentante ?? '',
				correo: requisicionDetalle.servicioDetalle?.correoRepresentante ?? '',
				telefono: requisicionDetalle.servicioDetalle?.telefonoRepresentante ?? '',
				cargo: requisicionDetalle.servicioDetalle?.cargoRepresentante ?? '',
			};
			nextDraft.mayorAdministradorContrato = {
				nombre: requisicionDetalle.servicioDetalle?.nombreAdministradorContrato ?? '',
				correo: requisicionDetalle.servicioDetalle?.correoAdministradorContrato ?? '',
				telefono: requisicionDetalle.servicioDetalle?.telefonoAdministradorContrato ?? '',
				cargo: requisicionDetalle.servicioDetalle?.cargoAdministradorContrato ?? '',
			};
			if (requisicionDetalle.partidas?.length) {
				nextDraft.mayorPartidas = requisicionDetalle.partidas.map((partida, index) => ({
					id: partida.id ? String(partida.id) : `api-part-${index}`,
					numeroPartida: index + 1,
					unidadMedidaId: String(partida.idUnidadMedida),
					unidadMedidaLabel: partida.unidadMedidaLabel ?? '',
					cantidad: String(partida.cantidad),
					defDescripcionGeneral: partida.descripcionGeneral ?? partida.descripcion ?? '',
					defDescripcionEspecifica: partida.descripcionEspecifica ?? '',
					defLugarPeriodoEjecucion: partida.lugarPeriodoEjecucionServicio ?? '',
					defPersonalRequerido: partida.personalRequerido ?? '',
					defEntregablesAcreditacion: partida.entregablesNecesarios ?? '',
					defCondicionesGeneralesContratacion:
						partida.condicionesGeneralesContratacion ?? '',
				}));
			}
		} else {
			nextDraft.menorDatosGenerales = {
				unidadSolicitanteId: requisicionDetalle.idUnidadSolicitante
					? String(requisicionDetalle.idUnidadSolicitante)
					: '',
				nombreSolicitante: requisicionDetalle.nombreSolicitante ?? '',
				cargo: requisicionDetalle.cargoSolicitante ?? '',
				fechaSolicitud: requisicionDetalle.fechaSolicitud
					? requisicionDetalle.fechaSolicitud.substring(0, 10)
					: '',
			};
			nextDraft.menorDatosRequisicion = {
				justificacionGasto: requisicionDetalle.justificacionGasto ?? '',
			};
			if (requisicionDetalle.partidas?.length) {
				nextDraft.menorPartidas = requisicionDetalle.partidas.map((partida, index) => ({
					id: partida.id ? String(partida.id) : `api-part-${index}`,
					numeroPartida: index + 1,
					unidadMedidaId: String(partida.idUnidadMedida),
					unidadMedidaLabel: partida.unidadMedidaLabel ?? '',
					cantidad: String(partida.cantidad),
					defDescripcionGeneral: partida.descripcionGeneral ?? partida.descripcion ?? '',
					defDescripcionEspecifica: partida.descripcionEspecifica ?? '',
					defLugarPeriodoEjecucion: partida.lugarPeriodoEjecucionServicio ?? '',
					defPersonalRequerido: partida.personalRequerido ?? '',
					defEntregablesAcreditacion: partida.entregablesNecesarios ?? '',
					defCondicionesGeneralesContratacion:
						partida.condicionesGeneralesContratacion ?? '',
				}));
			}
		}

		onDraftChange(nextDraft);
	}, [requisicionDetalle, draft, onDraftChange, tipoCompra]); const goToNextTab = (currentTabId: string, orderedTabIds: string[]) => {
		if (!isNewRecord) return;
		const currentIndex = orderedTabIds.indexOf(currentTabId);
		if (currentIndex < 0) return;
		const nextTabId = orderedTabIds[currentIndex + 1];
		if (nextTabId) {
			window.setTimeout(() => {
				setTab(nextTabId);
			}, AUTO_ADVANCE_DELAY_MS);
		}
	};

	const numeroLabel = useMemo(
		() => String(editingRow.numero).padStart(7, '0'),
		[editingRow.numero]
	);

	const solicitantePreview =
		tipoCompra === 'MENOR'
			? (draft.menorDatosGenerales.nombreSolicitante ?? editingRow.solicitante)
			: (draft.mayorDatosGenerales.nombreTitular ?? editingRow.solicitante);

	const canEditSolicitanteFields = hideRevisorFields;

	if (tipoCompra === 'MAYOR') {
		let step = 0;
		const orderedTabIds = [
			'cs-g1',
			'cs-g2',
			'cs-g3',
			'cs-g4',
			'cs-g5',
			'cs-g6',
			'cs-g7',
			'cs-g8',
			'cs-g9',
			'cs-g10',
			'cs-g11',
		];

		return (
			<Tabs value={tab} onChange={setTab} className="flex flex-col flex-1 min-h-0">
				<TabsList className="shrink-0 bg-white border-b border-slate-200">
					<TabsTab value="cs-g1" label={<StepperTabLabel step={++step} title="Datos generales" />} />
					<TabsTab value="cs-g2" label={<StepperTabLabel step={++step} title="Datos presupuestales" />} />
					<TabsTab value="cs-g3" label={<StepperTabLabel step={++step} title="Datos requisición" />} />
					<TabsTab value="cs-g4" label={<StepperTabLabel step={++step} title="Partidas de servicio" />} />
					{!isSolicitante && <TabsTab value="cs-g5" label={<StepperTabLabel step={++step} title="Ejecución" />} />}
					{!isSolicitante && <TabsTab value="cs-g8" label={<StepperTabLabel step={++step} title="Condiciones" />} />}
					<TabsTab value="cs-g9" label={<StepperTabLabel step={++step} title="Representantes" />} />
					<TabsTab value="cs-g10" label={<StepperTabLabel step={++step} title="Administrador contrato" />} />
					<TabsTab
						value="cs-g11"
						label={
							<div onClick={cargarDocumentoServicios}>
								<StepperTabLabel step={++step} title="Documento" />
							</div>
						}
					/>
				</TabsList>
				<TabsPanel value="cs-g1" className="flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-50">
					<RequisicionTabPanelFieldset readOnly={readOnly}>
						<MayorDatosGeneralesTab
							idRequisicion={Number(editingRow.id)}
							idUsuario={Number(editingRow.idUsuario ?? 0)}
							hideRevisorFields={hideRevisorFields}
							initialValues={{
								unidadSolicitanteId: requisicionDetalle?.idUnidadSolicitante
									? String(requisicionDetalle.idUnidadSolicitante)
									: '',

								nombreTitular: requisicionDetalle?.nombreSolicitante ?? '',

								cargoSolicitante: requisicionDetalle?.cargoSolicitante ?? '',

								fechaSolicitud: requisicionDetalle?.fechaSolicitud
									? requisicionDetalle.fechaSolicitud.substring(0, 10)
									: '',

								caracterProcedimiento:
									requisicionDetalle?.caracterProcedimiento === 0
										? 'NACIONAL'
										: requisicionDetalle?.caracterProcedimiento === 1
											? 'INTERNACIONAL'
											: 'NACIONAL',

								modalidadContratacion: requisicionDetalle?.modalidadContratacion
									? String(requisicionDetalle.modalidadContratacion)
									: '',

								articuloConformidad: requisicionDetalle?.articulo
									? String(requisicionDetalle.articulo)
									: '',

								tipoProcedimiento: requisicionDetalle?.tipoProcedimiento ?? '',
							}}
							onSave={(data) => {
								// setRequisicionDetalle((prev) =>
								// 	prev
								// 		? {
								// 			...prev,
								// 			idUnidadSolicitante: Number(data.unidadSolicitanteId),
								// 			nombreSolicitante: data.nombreTitular,
								// 			cargoSolicitante: data.cargoSolicitante,
								// 			fechaSolicitud: data.fechaSolicitud,
								// 			caracterProcedimiento: data.caracterProcedimiento
								// 				? Number(data.caracterProcedimiento)
								// 				: null,
								// 			modalidadContratacion: data.modalidadContratacion
								// 				? Number(data.modalidadContratacion)
								// 				: null,
								// 			articulo: data.articuloConformidad
								// 				? Number(data.articuloConformidad)
								// 				: null,
								// 			tipoProcedimiento: data.tipoProcedimiento,
								// 		}
								// 		: prev
								// );

								onDraftChange({
									...draft,
									mayorDatosGenerales: {
										...draft.mayorDatosGenerales,
										...data,
									},
								});

								onPatchRow({ solicitante: data.nombreTitular });
								goToNextTab('cs-g1', orderedTabIds);
							}}
						/>
					</RequisicionTabPanelFieldset>
				</TabsPanel>
				<TabsPanel value="cs-g2" className="flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-50">
					<RequisicionTabPanelFieldset readOnly={readOnly}>
						<MayorDatosPresupuestalesTab
							idRequisicion={Number(editingRow.id)}
							idUsuario={Number(editingRow.idUsuario ?? 0)}
							initialValues={{
								presupuestoAutorizado:
									requisicionDetalle?.presupuestoAutorizado != null
										? String(requisicionDetalle.presupuestoAutorizado)
										: '',
								clavePresupuestalId: requisicionDetalle?.idClavePresupuestal
									? String(requisicionDetalle.idClavePresupuestal)
									: '',
								origenRecursoId: requisicionDetalle?.idOrigenRecurso
									? String(requisicionDetalle.idOrigenRecurso)
									: '',
								componenteId: requisicionDetalle?.idComponente
									? String(requisicionDetalle.idComponente)
									: '',
								actividadId: requisicionDetalle?.idActividad
									? String(requisicionDetalle.idActividad)
									: '',
								tipoProgramaId: requisicionDetalle?.idTipoPrograma
									? String(requisicionDetalle.idTipoPrograma)
									: '',
							}}
							onSave={(data) => {
								setRequisicionDetalle((prev) =>
									prev
										? {
											...prev,
											presupuestoAutorizado: data.presupuestoAutorizado,
											idClavePresupuestal: Number(data.clavePresupuestalId),
											idOrigenRecurso: Number(data.origenRecursoId),
											idComponente: Number(data.componenteId),
											idActividad: Number(data.actividadId),
											idTipoPrograma: Number(data.tipoProgramaId),
										}
										: prev
								);

								onDraftChange({
									...draft,
									mayorDatosPresupuestales: data,
								});

								goToNextTab('cs-g2', orderedTabIds);
							}}
						/>
					</RequisicionTabPanelFieldset>
				</TabsPanel>
				<TabsPanel value="cs-g3" className="flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-50">
					<RequisicionTabPanelFieldset readOnly={readOnly}>
						<MayorDatosRequisicionTab
							idRequisicion={Number(editingRow.id)}
							idUsuario={Number(editingRow.idUsuario ?? 0)}
							initialValues={{
								descripcionGeneral: requisicionDetalle?.descripcionGeneral ?? '',
								justificacionGasto: requisicionDetalle?.justificacionGasto ?? '',
								periodoGarantia: requisicionDetalle?.periodoGarantia ?? '',
							}}
							onSave={(data) => {
								setRequisicionDetalle((prev) =>
									prev
										? {
											...prev,
											descripcionGeneral: data.descripcionGeneral,
											justificacionGasto: data.justificacionGasto,
											periodoGarantia: data.periodoGarantia,
										}
										: prev
								);

								onDraftChange({
									...draft,
									mayorDatosRequisicion: data,
								});

								goToNextTab('cs-g3', orderedTabIds);
							}}
						/>
					</RequisicionTabPanelFieldset>
				</TabsPanel>
				<TabsPanel value="cs-g4" className="flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-50">
					<RequisicionTabPanelFieldset readOnly={readOnly}>
						<MayorPartidasTab
							partidas={draft.mayorPartidas}
							hideRevisorFields={hideRevisorFields}
							canEditSolicitanteFields={canEditSolicitanteFields}
							onChange={(partidas) => {
								onDraftChange({ ...draft, mayorPartidas: partidas });
							}} idRequisicion={Number(editingRow.id)}
							idUsuario={Number(editingRow.idUsuario ?? 0)} />
					</RequisicionTabPanelFieldset>
				</TabsPanel>
				<TabsPanel value="cs-g5" className="flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-50">
					<RequisicionTabPanelFieldset readOnly={readOnly}>
						<MayorEjecucionTab
								idRequisicion={Number(editingRow.id)}
								idUsuario={Number(editingRow.idUsuario ?? 0)}
								hideRevisorFields={hideRevisorFields}
								initialValues={{
									experienciaLicitante:
										requisicionDetalle?.servicioDetalle?.experienciaLicitante ?? '',

									calle:
										requisicionDetalle?.servicioDetalle?.calle ?? '',

									colonia:
										requisicionDetalle?.servicioDetalle?.colonia ?? '',

									cp:
										requisicionDetalle?.servicioDetalle?.cp ??
										requisicionDetalle?.servicioDetalle?.cp ??
										'',

									ciudad:
										requisicionDetalle?.servicioDetalle?.ciudad ?? '',

									nombreDependenciaEntrega:
										requisicionDetalle?.servicioDetalle?.nombreDependenciaEntrega ?? '',

									telefonoEntrega:
										requisicionDetalle?.servicioDetalle?.telefonoEntrega ?? '',

									extencionTelefonoEntrega:
										requisicionDetalle?.servicioDetalle?.extencionTelefonoEntrega ?? '',
								}}
								onSave={(data) => {
									onDraftChange({
										...draft,
										mayorEjecucion: {
											...draft.mayorEjecucion,
											...data,
										},
									});

									goToNextTab('cs-g5', orderedTabIds);
								}}
							/>
					</RequisicionTabPanelFieldset>
				</TabsPanel>
				<TabsPanel value="cs-g8" className="flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-50">
					<RequisicionTabPanelFieldset readOnly={readOnly}>
						<MayorCondicionesTab
							idRequisicion={Number(editingRow.id)}
							idUsuario={Number(editingRow.idUsuario ?? 0)}
							hideRevisorFields={hideRevisorFields}
							initialValues={draft.mayorCondiciones}
							onSave={(data) => {
								onDraftChange({
									...draft,
									mayorCondiciones: { ...draft.mayorCondiciones, ...data },
								});
								goToNextTab('cs-g8', orderedTabIds);
							}}
						/>
					</RequisicionTabPanelFieldset>
				</TabsPanel>
				<TabsPanel value="cs-g9" className="flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-50">
					<RequisicionTabPanelFieldset readOnly={readOnly}>
						<MayorRepresentantesTab
							idRequisicion={Number(editingRow.id)}
							idUsuario={Number(editingRow.idUsuario ?? 0)}
							initialValues={draft.mayorRepresentantes}
							onSave={(data) => {
								onDraftChange({
									...draft,
									mayorRepresentantes: { ...draft.mayorRepresentantes, ...data },
								});
								goToNextTab('cs-g9', orderedTabIds);
							}}
						/>
					</RequisicionTabPanelFieldset>
				</TabsPanel>
				<TabsPanel value="cs-g10" className="flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-50">
					<RequisicionTabPanelFieldset readOnly={readOnly}>
						<MayorAdministradorContratoTab
							idRequisicion={Number(editingRow.id)}
							idUsuario={Number(editingRow.idUsuario ?? 0)}
							initialValues={draft.mayorAdministradorContrato}
							onSave={(data) => {
								onDraftChange({
									...draft,
									mayorAdministradorContrato: { ...draft.mayorAdministradorContrato, ...data },
								});
								goToNextTab('cs-g10', orderedTabIds);
							}}
						/>
					</RequisicionTabPanelFieldset>
				</TabsPanel>
				<TabsPanel value="cs-g11" className="flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-50">
					<RequisicionTabPanelFieldset readOnly={readOnly}>
						{loadingDocumento ? (
							<div className="p-6 text-sm text-slate-500">
								Cargando documento...
							</div>
						) : (
							<ServicioMayorDocumentoWordPreview
								requisicionDetalle={documentoServicios}			
								servicioDetalle={documentoServicios?.servicioDetalle}					
								partidas={documentoServicios?.partidas ?? []}
							/>
						)}
					</RequisicionTabPanelFieldset>
				</TabsPanel>
			</Tabs>
		);
	}

	const menorTabIds = ['cs-m1', 'cs-m2', 'cs-m3', 'cs-m4'];
	let mStep = 0;

	return (
		<Tabs value={tab} onChange={setTab} className="flex flex-col flex-1 min-h-0">
			<TabsList className="shrink-0 bg-white border-b border-slate-200">
				<TabsTab value="cs-m1" label={<StepperTabLabel step={++mStep} title="Datos generales" />} />
				<TabsTab value="cs-m2" label={<StepperTabLabel step={++mStep} title="Datos requisición" />} />
				<TabsTab value="cs-m3" label={<StepperTabLabel step={++mStep} title="Partidas" />} />				
				<TabsTab
						value="cs-m4"
						label={
							<div onClick={cargarDocumentoServicios}>
								<StepperTabLabel step={++mStep} title="Documento" />
							</div>
						}
					/>
			</TabsList>
			<TabsPanel value="cs-m1" className="flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-50">
				<RequisicionTabPanelFieldset readOnly={readOnly}>
					<MenorDatosGeneralesTab
						idRequisicion={Number(editingRow.id)}
						idUsuario={Number(editingRow.idUsuario ?? 0)}
						initialValues={{
							unidadSolicitanteId: requisicionDetalle?.idUnidadSolicitante
								? String(requisicionDetalle.idUnidadSolicitante)
								: '',
							nombreSolicitante: requisicionDetalle?.nombreSolicitante ?? '',
							cargo: requisicionDetalle?.cargoSolicitante ?? '',
							fechaSolicitud: requisicionDetalle?.fechaSolicitud
								? requisicionDetalle.fechaSolicitud.substring(0, 10)
								: '',
						}}
						onSave={(data) => {
							setRequisicionDetalle((prev) =>
								prev
									? {
										...prev,
										idUnidadSolicitante: Number(data.unidadSolicitanteId),
										nombreSolicitante: data.nombreSolicitante,
										cargoSolicitante: data.cargo,
										fechaSolicitud: data.fechaSolicitud,
									}
									: prev
							);
						}}
					/>
				</RequisicionTabPanelFieldset>
			</TabsPanel>
			<TabsPanel value="cs-m2" className="flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-50">
				<RequisicionTabPanelFieldset readOnly={readOnly}>
					<MenorDatosRequisicionTab
						idRequisicion={Number(editingRow.id)}
						idUsuario={Number(editingRow.idUsuario ?? 0)}
						initialValues={{
							justificacionGasto: requisicionDetalle?.justificacionGasto ?? '',
						}}
						onSave={(data) => {
							setRequisicionDetalle((prev) =>
								prev
									? { ...prev, justificacionGasto: data.justificacionGasto }
									: prev
							);
							onDraftChange({
								...draft,
								menorDatosRequisicion: {
									...draft.menorDatosRequisicion,
									...data,
								},
							});
						}}
					/>
				</RequisicionTabPanelFieldset>
			</TabsPanel>
			<TabsPanel value="cs-m3" className="flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-50">
				<RequisicionTabPanelFieldset readOnly={readOnly}>
					<MenorPartidasTab
						partidas={draft.menorPartidas}
						canEditSolicitanteFields={canEditSolicitanteFields}
						onChange={(partidas) => {
							onDraftChange({ ...draft, menorPartidas: partidas });
						}}
						idRequisicion={Number(editingRow.id)}
						idUsuario={Number(editingRow.idUsuario ?? 0)}
					/>
				</RequisicionTabPanelFieldset>
			</TabsPanel>
			<TabsPanel value="cs-m4" className="flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-50">
				<RequisicionTabPanelFieldset readOnly={readOnly}>
					{loadingDocumento ? (
							<div className="p-6 text-sm text-slate-500">
								Cargando documento...
							</div>
						) : (
							<ServicioMenorDocumentoWordPreview
								requisicionDetalle={documentoServicios}			
								servicioDetalle={documentoServicios?.servicioDetalle}					
								partidas={documentoServicios?.partidas ?? []}
							/>
						)}
				</RequisicionTabPanelFieldset>
			</TabsPanel>
		</Tabs>
	);
}
