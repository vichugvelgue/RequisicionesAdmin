import React, { useEffect, useMemo, useState } from 'react';
import { Tabs, TabsList, TabsTab, TabsPanel } from '../../../components/UI';
import { StepperTabLabel } from './stepperTabLabel';
import type { AdquisicionDraft, TipoCompra } from './types';
import { MayorDatosGeneralesTab } from './tabs/mayor/MayorDatosGeneralesTab';
import { MayorDatosPresupuestalesTab } from './tabs/mayor/MayorDatosPresupuestalesTab';
import { MayorDatosRequisicionTab } from './tabs/mayor/MayorDatosRequisicionTab';
import { MayorPartidasTab } from './tabs/mayor/MayorPartidasTab';
import { MayorDatosAdministrativosTab } from './tabs/mayor/MayorDatosAdministrativosTab';
import { MayorRepresentantesTab } from './tabs/mayor/MayorRepresentantesTab';
import { MayorAdministradorContratoTab } from './tabs/mayor/MayorAdministradorContratoTab';
import { MayorDocumentoTab } from './tabs/mayor/MayorDocumentoTab';
import { MenorDatosGeneralesTab } from './tabs/menor/MenorDatosGeneralesTab';
import { MenorDatosRequisicionTab } from './tabs/menor/MenorDatosRequisicionTab';
import { MenorPartidasTab } from './tabs/menor/MenorPartidasTab';
import { MenorDocumentoTab } from './tabs/menor/MenorDocumentoTab';
import { BienesMayorDocumentoWordPreview } from './documento/BienesMayorDocumentoWordPreview';
import BienesMenorDocumentoPreview from "./documento/BienesMenorDocumentoPreview";
import type { RequisicionRow } from './types';
import { requisicionApi, RequisicionDetalle } from '../../../api/requisicionBienesAPI';

/** Id de la pestaña "Documento" (última) en el flujo MAYOR. */
export const ADQUISICION_BIENES_TAB_DOCUMENTO_MAYOR = 'g8';
/** Id de la pestaña "Documento" (última) en el flujo MENOR. */
export const ADQUISICION_BIENES_TAB_DOCUMENTO_MENOR = 'm4';

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

export function AdquisicionBienesFormShell({
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
	tipoCompra: TipoCompra;
	hideRevisorFields: boolean;
	/** Solo consulta (p. ej. perfil administrador general). */
	readOnly?: boolean;
	draft: AdquisicionDraft;
	onDraftChange: (next: AdquisicionDraft) => void;
	editingRow: RequisicionRow;
	onPatchRow: (patch: Partial<RequisicionRow>) => void;
	isNewRecord: boolean;
	onActiveTabChange?: (tabId: string) => void;
}) {
	const [tab, setTab] = useState(() => (tipoCompra === 'MAYOR' ? 'g1' : 'm1'));

	useEffect(() => {
		onActiveTabChange?.(tab);
	}, [tab, onActiveTabChange]);
	const AUTO_ADVANCE_DELAY_MS = 900;
	const idRequisicion = Number(editingRow.id);
	const [requisicionDetalle, setRequisicionDetalle] = useState<RequisicionDetalle | null>(null);
	const [isLoadingDetalle, setIsLoadingDetalle] = useState(false);
	const [documentoBienes, setDocumentoBienes] = useState<any>(null);
	const [loadingDocumento, setLoadingDocumento] = useState(false);
	const [documentoBienesCargado, setDocumentoBienesCargado] = useState(false);

	const [activeStep, setActiveStep] = useState('g1');
	const goToNextTab = (currentTabId: string, orderedTabIds: string[]) => {
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


	const cargarDocumentoBienes = async () => {
		console.log('Cargando documento de bienes...');
		if (documentoBienesCargado) return;

		try {
			const data = await requisicionApi.obtenerInformacionBienesDocumento(
				requisicionDetalle.id
			);
			
			setDocumentoBienes(data);
			setDocumentoBienesCargado(true);
		} catch (error) {
			console.error('Error al cargar documento de bienes:', error);
		}
	};

	useEffect(() => {		
		if (activeStep === 'g8' && !documentoBienesCargado) {
			cargarDocumentoBienes();
		}
	}, [activeStep, documentoBienesCargado]);


	const numeroLabel = useMemo(
		() => String(editingRow.numero).padStart(7, '0'),
		[editingRow.numero]
	);

	const solicitantePreview =
		tipoCompra === 'MENOR'
			? (draft.menorDatosGenerales.nombreSolicitante ?? editingRow.solicitante)
			: (draft.mayorDatosGenerales.nombreTitular ?? editingRow.solicitante);

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

	if (tipoCompra === 'MAYOR') {
		let step = 0;
		const tabsList: { id: string; label: React.ReactNode; panel: React.ReactNode }[] = [
			{
				id: 'g1',
				label: <StepperTabLabel step={++step} title="Datos generales" />,
				panel: (
					<MayorDatosGeneralesTab
						idRequisicion={Number(editingRow.id)}	
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

							caracterProcedimiento: requisicionDetalle?.caracterProcedimiento
								? String(requisicionDetalle.caracterProcedimiento)
								: '',

							modalidadContratacion: requisicionDetalle?.modalidadContratacion
								? String(requisicionDetalle.modalidadContratacion)
								: '',

							/*articulo: requisicionDetalle?.articulo
								? String(requisicionDetalle.articulo)
								: '',*/

							tipoProcedimiento: requisicionDetalle?.tipoProcedimiento ?? '',
						}}
						onSave={(data) => {
							setRequisicionDetalle((prev) =>
								prev
									? {
											...prev,
											idUnidadSolicitante: Number(data.unidadSolicitanteId),
											nombreSolicitante: data.nombreTitular,
											cargoSolicitante: data.cargoSolicitante,
											fechaSolicitud: data.fechaSolicitud,

											caracterProcedimiento: data.caracterProcedimiento
												? Number(data.caracterProcedimiento)
												: null,

											modalidadContratacion: data.modalidadContratacion
												? Number(data.modalidadContratacion)
												: null,

											/*articulo: data.articulo
												? Number(data.articulo)
												: null,*/

											tipoProcedimiento: data.tipoProcedimiento,
									}
									: prev
							);

							onDraftChange({
								...draft,
								mayorDatosGenerales: {
									...draft.mayorDatosGenerales,
									...data,
								},
							});

							onPatchRow({ solicitante: data.nombreTitular });
						}}
					/>
				),
			},
			{
				id: 'g2',
				label: <StepperTabLabel step={++step} title="Datos presupuestales" />,
				panel: (
					<MayorDatosPresupuestalesTab
	idRequisicion={Number(editingRow.id)}
	idUsuario={Number(editingRow.idUsuario ?? 0)}
	initialValues={{
		presupuestoAutorizado: requisicionDetalle?.presupuestoAutorizado ?? '',

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
						idClavePresupuestal: data.clavePresupuestalId
							? Number(data.clavePresupuestalId)
							: null,
						idOrigenRecurso: data.origenRecursoId
							? Number(data.origenRecursoId)
							: null,
						idComponente: data.componenteId
							? Number(data.componenteId)
							: null,
						idActividad: data.actividadId
							? Number(data.actividadId)
							: null,
						idTipoPrograma: data.tipoProgramaId
							? Number(data.tipoProgramaId)
							: null,
				  }
				: prev
		);

		onDraftChange({
			...draft,
			mayorDatosPresupuestales: {
				...draft.mayorDatosPresupuestales,
				...data,
			},
		});

		goToNextTab('g2', orderedTabIds);
	}}
/>
				),
			},
			{
				id: 'g3',
				label: <StepperTabLabel step={++step} title="Datos requisición" />,
				panel: (
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
								mayorDatosRequisicion: {
									...draft.mayorDatosRequisicion,
									...data,
								},
							});

							goToNextTab('g3', orderedTabIds);
						}}
					/>
				),
			},
			{
				id: 'g4',
				label: <StepperTabLabel step={++step} title="Partidas" />,
				panel: (
					<MayorPartidasTab
						idRequisicion={Number(editingRow.id)}
						idUsuario={Number(editingRow.idUsuario ?? 0)}
						partidas={
							requisicionDetalle?.partidas?.map((p) => ({
								id: crypto.randomUUID(),
								numeroPartida: p.numeroPartida,
								cantidad: String(p.cantidad ?? ''),
								unidadMedidaId: String(p.idUnidadMedida ?? ''),
								unidadMedidaLabel: p.unidadMedidaLabel ?? '',
								descripcion: p.descripcion ?? '',
							})) ?? []
						}
						canEditSolicitanteFields={hideRevisorFields}
						onChange={(partidas) => {
							onDraftChange({
								...draft,
								menorPartidas: partidas,
							});

							setRequisicionDetalle((prev) => ({
							...prev,
							partidas: partidas.map((p) => ({
								id: Number(p.id ?? 0),
								numeroPartida: Number(p.numeroPartida ?? 0),
								cantidad: Number(p.cantidad ?? 0),
								idUnidadMedida: Number(p.unidadMedidaId ?? 0),
								unidadMedidaLabel: p.unidadMedidaLabel ?? '',
								descripcion: p.descripcion ?? '',
								idRequisicion: Number(editingRow.id),
							})),
						}));
					}}
					/>
				),
			},
		];

		if (!hideRevisorFields) {
	tabsList.push({
		id: 'g5',
		label: <StepperTabLabel step={++step} title="Datos administrativos" />,
		panel: (
			<MayorDatosAdministrativosTab
				idRequisicion={Number(editingRow.id)}
				idUsuario={Number(editingRow.idUsuario ?? 0)}
				initialValues={{
					aniosExperienciaLicitante:
						requisicionDetalle?.bienDetalle?.aniosExperienciaLicitante ?? '',

					pagosSeRealizaran:
						requisicionDetalle?.bienDetalle?.pagosSeRealizaran ?? '',

					adquisicionMedianteContrato:
						requisicionDetalle?.bienDetalle?.adquisicionMedianteContrato === 2
							? 'ABIERTO'
							: 'FIJO',

					articuloConformidad:
						requisicionDetalle?.bienDetalle?.conformidadArticulo === 1 ? '107' : '108',

					lugarEntregaCalle:
						requisicionDetalle?.bienDetalle?.calle ?? '',

					lugarEntregaColonia:
						requisicionDetalle?.bienDetalle?.colonia ?? '',

					lugarEntregaCp:
						requisicionDetalle?.bienDetalle?.codigoPostal ?? '',

					lugarEntregaCiudad:
						requisicionDetalle?.bienDetalle?.ciudad ?? '',
					
					nombreDependenciaEntrega: requisicionDetalle?.bienDetalle?.nombreDependenciaEntrega ?? '',
					telefonoEntrega: requisicionDetalle?.bienDetalle?.telefonoEntrega ?? '',
					extencionTelefonoEntrega: requisicionDetalle?.bienDetalle?.extencionTelefonoEntrega ?? '',

					diasEntrega:
						requisicionDetalle?.bienDetalle?.diasEntrega ?? '',
				}}
				onSave={(data) => {
					setRequisicionDetalle((prev) =>
						prev
							? {
									...prev,
									bienDetalle: {
										...prev.bienDetalle,

										aniosExperienciaLicitante: data.aniosExperienciaLicitante,
										pagosSeRealizaran: data.pagosSeRealizaran,

										adquisicionMedianteContrato:
											data.adquisicionMedianteContrato === 'FIJO' ? 1 : 2,

										conformidadArticulo: 
											data.articuloConformidad === '107' ? 1 : 2,

										lugarEntrega: [
											data.lugarEntregaCalle,
											data.lugarEntregaColonia,
											data.lugarEntregaCiudad,
											data.lugarEntregaCp,
										]
											.filter(Boolean)
											.join(', '),

										calle: data.lugarEntregaCalle,
										colonia: data.lugarEntregaColonia,
										ciudad: data.lugarEntregaCiudad,
										codigoPostal: data.lugarEntregaCp,
										diasEntrega: data.diasEntrega,
									},
								}
							: prev
					);

					onDraftChange({
						...draft,
						mayorDatosAdministrativos: {
							...draft.mayorDatosAdministrativos,
							...data,
						},
					});
				}}
			/>
		),
	});
}

		tabsList.push(
			{
				id: 'g6',
				label: <StepperTabLabel step={++step} title="Representantes" />,
				panel: (
					<MayorRepresentantesTab
						idRequisicion={Number(editingRow.id)}
						idUsuario={Number(editingRow.idUsuario ?? 0)}
						initialValues={{
							nombre: requisicionDetalle?.bienDetalle?.nombreRepresentante ?? '',
						cargo: requisicionDetalle?.bienDetalle?.cargoRepresentante ?? '',
						correo: requisicionDetalle?.bienDetalle?.correoRepresentante ?? '',
						telefono: requisicionDetalle?.bienDetalle?.telefonoRepresentante ?? '',
	}}
	onSave={(data) => {
		setRequisicionDetalle((prev) =>
			prev
				? {
						...prev,
						bienDetalle: {
							...prev.bienDetalle,
							nombreRepresentante: data.nombre,
							cargoRepresentante: data.cargo,
							correoRepresentante: data.correo,
							telefonoRepresentante: data.telefono,
						}
				  }
				: prev
		);
	}}
/>
				),
			},
			{
				id: 'g7',
				label: <StepperTabLabel step={++step} title="Administrador contrato" />,
				panel: (
					<MayorAdministradorContratoTab
						idRequisicion={Number(editingRow.id)}
						idUsuario={Number(editingRow.idUsuario ?? 0)}
						initialValues={{
							nombre: requisicionDetalle?.bienDetalle?.nombreAdministradorContrato ?? '',
							cargo: requisicionDetalle?.bienDetalle?.cargoAdministradorContrato ?? '',
							correo: requisicionDetalle?.bienDetalle?.correoAdministradorContrato ?? '',
							telefono: requisicionDetalle?.bienDetalle?.telefonoAdministradorContrato ?? '',
						}}
						onSave={(data) => {
							setRequisicionDetalle((prev) =>
								prev
									? {
											...prev,
											bienDetalle: {
												...(prev.bienDetalle),
												nombreAdministradorContrato: data.nombre,
												cargoAdministradorContrato: data.cargo,
												correoAdministradorContrato: data.correo,
												telefonoAdministradorContrato: data.telefono,
											},
									}
									: prev
							);
						}}
					/>
				),
			},
			{
				id: 'g8',
				label: (
					<div onClick={cargarDocumentoBienes}>
						<StepperTabLabel step={++step} title="Documento" />
					</div>
				),
				panel: (
					<>
						{loadingDocumento ? (
							<div>Cargando documento...</div>
						) : (
							<BienesMayorDocumentoWordPreview
								requisicionDetalle={documentoBienes}
								bienDetalle={documentoBienes?.bienDetalle}
								partidas={documentoBienes?.partidas ?? []}
							/>
						)}
					</>
				),
			}
		);
		const orderedTabIds = tabsList.map((t) => t.id);
		tabsList[0].panel = (
			<MayorDatosGeneralesTab
						idRequisicion={Number(editingRow.id)}	
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

							caracterProcedimiento: requisicionDetalle?.caracterProcedimiento
								? String(requisicionDetalle.caracterProcedimiento)
								: '',

							modalidadContratacion: requisicionDetalle?.modalidadContratacion
								? String(requisicionDetalle.modalidadContratacion)
								: '',

							/*articulo: requisicionDetalle?.articulo
								? String(requisicionDetalle.articulo)
								: '',*/

							tipoProcedimiento: requisicionDetalle?.tipoProcedimiento ?? '',
						}}
						onSave={(data) => {
							setRequisicionDetalle((prev) =>
								prev
									? {
											...prev,
											idUnidadSolicitante: Number(data.unidadSolicitanteId),
											nombreSolicitante: data.nombreTitular,
											cargoSolicitante: data.cargoSolicitante,
											fechaSolicitud: data.fechaSolicitud,

											caracterProcedimiento: data.caracterProcedimiento
												? Number(data.caracterProcedimiento)
												: null,

											modalidadContratacion: data.modalidadContratacion
												? Number(data.modalidadContratacion)
												: null,

											/*articulo: data.articulo
												? Number(data.articulo)
												: null,*/

											tipoProcedimiento: data.tipoProcedimiento,
									}
									: prev
							);

							onDraftChange({
								...draft,
								mayorDatosGenerales: {
									...draft.mayorDatosGenerales,
									...data,
								},
							});

							onPatchRow({ solicitante: data.nombreTitular });
						}}
					/>
		);
		tabsList[1].panel = (
			<MayorDatosPresupuestalesTab
	idRequisicion={Number(editingRow.id)}
	idUsuario={Number(editingRow.idUsuario ?? 0)}
	initialValues={{
		presupuestoAutorizado: requisicionDetalle?.presupuestoAutorizado ?? '',

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
						idClavePresupuestal: data.clavePresupuestalId
							? Number(data.clavePresupuestalId)
							: null,
						idOrigenRecurso: data.origenRecursoId
							? Number(data.origenRecursoId)
							: null,
						idComponente: data.componenteId
							? Number(data.componenteId)
							: null,
						idActividad: data.actividadId
							? Number(data.actividadId)
							: null,
						idTipoPrograma: data.tipoProgramaId
							? Number(data.tipoProgramaId)
							: null,
				  }
				: prev
		);

		onDraftChange({
			...draft,
			mayorDatosPresupuestales: {
				...draft.mayorDatosPresupuestales,
				...data,
			},
		});

		goToNextTab('g2', orderedTabIds);
	}}
/>
		);
		tabsList[2].panel = (
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
						mayorDatosRequisicion: {
							...draft.mayorDatosRequisicion,
							...data,
						},
					});

					goToNextTab('g3', orderedTabIds);
				}}
			/>
		);
		if (!hideRevisorFields) {
			const administrativosIdx = orderedTabIds.indexOf('g5');
			if (administrativosIdx >= 0) {
				tabsList[administrativosIdx].panel = (
					<MayorDatosAdministrativosTab
				idRequisicion={Number(editingRow.id)}
				idUsuario={Number(editingRow.idUsuario ?? 0)}
				initialValues={{
					aniosExperienciaLicitante:
						requisicionDetalle?.bienDetalle?.aniosExperienciaLicitante ?? '',

					pagosSeRealizaran:
						requisicionDetalle?.bienDetalle?.pagosSeRealizaran ?? '',

					adquisicionMedianteContrato:
						requisicionDetalle?.bienDetalle?.adquisicionMedianteContrato === 2
							? 'ABIERTO'
							: 'FIJO',

					articuloConformidad:
						requisicionDetalle?.bienDetalle?.conformidadArticulo === 1 ? '107' :
						'108',

					lugarEntregaCalle:
						requisicionDetalle?.bienDetalle?.calle ?? '',

					lugarEntregaColonia:
						requisicionDetalle?.bienDetalle?.colonia ?? '',

					lugarEntregaCp:
						requisicionDetalle?.bienDetalle?.codigoPostal ?? '',

					lugarEntregaCiudad:
						requisicionDetalle?.bienDetalle?.ciudad ?? '',

					diasEntrega:
						requisicionDetalle?.bienDetalle?.diasEntrega ?? '',
					
						nombreDependenciaEntrega: requisicionDetalle?.bienDetalle?.nombreDependenciaEntrega ?? '',
						telefonoEntrega: requisicionDetalle?.bienDetalle?.telefonoEntrega ?? '',
						extencionTelefonoEntrega: requisicionDetalle?.bienDetalle?.extencionTelefonoEntrega ?? '',
				}}
				onSave={(data) => {
					setRequisicionDetalle((prev) =>
						prev
							? {
									...prev,
									bienDetalle: {
										...prev.bienDetalle,

										aniosExperienciaLicitante: data.aniosExperienciaLicitante,
										pagosSeRealizaran: data.pagosSeRealizaran,
										adquisicionMedianteContrato:
											data.adquisicionMedianteContrato === 'FIJO' ? 1 : 2,
										conformidadArticulo: data.articuloConformidad == '107' ? 1 : 2,

										lugarEntrega: [
											data.lugarEntregaCalle,
											data.lugarEntregaColonia,
											data.lugarEntregaCiudad,
											data.lugarEntregaCp,
										]
											.filter(Boolean)
											.join(', '),

										calle: data.lugarEntregaCalle,
										colonia: data.lugarEntregaColonia,
										ciudad: data.lugarEntregaCiudad,
										codigoPostal: data.lugarEntregaCp,
										diasEntrega: data.diasEntrega,
									},
								}
							: prev
		);

		onDraftChange({
			...draft,
			mayorDatosAdministrativos: {
				...draft.mayorDatosAdministrativos,
				...data,
			},
		});

		goToNextTab('g5', orderedTabIds);
	}}
/>
				);
			}
		}
		const representantesIdx = orderedTabIds.indexOf('g6');
		if (representantesIdx >= 0) {
			tabsList[representantesIdx].panel = (
				<MayorRepresentantesTab
					idRequisicion={Number(editingRow.id)}
					idUsuario={Number(editingRow.idUsuario ?? 0)}
					initialValues={{
						nombre: requisicionDetalle?.bienDetalle?.nombreRepresentante ?? '',
						cargo: requisicionDetalle?.bienDetalle?.cargoRepresentante ?? '',
						correo: requisicionDetalle?.bienDetalle?.correoRepresentante ?? '',
						telefono: requisicionDetalle?.bienDetalle?.telefonoRepresentante ?? '',
					}}
					onSave={(data) => {
						setRequisicionDetalle((prev) =>
							prev
								? {
										...prev,
										bienDetalle: {
										...prev.bienDetalle,
										nombreRepresentante: data.nombre,
										cargoRepresentante: data.cargo,
										correoRepresentante: data.correo,
										telefonoRepresentante: data.telefono,
									}
								}
								: prev
						);
					}}
				/>
			);
		}
		const administradorIdx = orderedTabIds.indexOf('g7');
		if (administradorIdx >= 0) {
			tabsList[administradorIdx].panel = (
				<MayorAdministradorContratoTab
					idRequisicion={Number(editingRow.id)}
					idUsuario={Number(editingRow.idUsuario ?? 0)}
					initialValues={{
						nombre: requisicionDetalle?.bienDetalle?.nombreAdministradorContrato ?? '',
						cargo: requisicionDetalle?.bienDetalle?.cargoAdministradorContrato ?? '',
						correo: requisicionDetalle?.bienDetalle?.correoAdministradorContrato ?? '',
						telefono: requisicionDetalle?.bienDetalle?.telefonoAdministradorContrato ?? '',
					}}
					onSave={(data) => {
						setRequisicionDetalle((prev) =>
							prev
								? {
										...prev,
										bienDetalle: {
											...(prev.bienDetalle),
											nombreAdministradorContrato: data.nombre,
											cargoAdministradorContrato: data.cargo,
											correoAdministradorContrato: data.correo,
											telefonoAdministradorContrato: data.telefono,
										},
								}
								: prev
						);
					}}
				/>
			);
		}

		return (
			<Tabs value={tab} onChange={setTab} className="flex flex-col flex-1 min-h-0">
				<TabsList className="shrink-0 bg-white border-b border-slate-200">
					{tabsList.map((t) => (
						<TabsTab key={t.id} value={t.id} label={t.label} />
					))}
				</TabsList>
				{tabsList.map((t) => (
					<TabsPanel key={t.id} value={t.id} className="flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-50">
						<RequisicionTabPanelFieldset readOnly={readOnly}>{t.panel}</RequisicionTabPanelFieldset>
					</TabsPanel>
				))}
			</Tabs>
		);
	}

	/* MENOR */	
	const menorTabs = [
		{
			id: 'm1',
			label: <StepperTabLabel step={1} title="Datos generales" />,
			panel: (
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
					readOnly={readOnly}
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
			),
		},
		{
			id: 'm2',
			label: <StepperTabLabel step={2} title="Datos requisición" />,
			panel: (
				<MenorDatosRequisicionTab
					idRequisicion={Number(editingRow.id)}
					idUsuario={Number(editingRow.idUsuario ?? 0)}
					initialValues={{
						justificacionGasto: requisicionDetalle?.justificacionGasto ?? '',
					}}
					readOnly={readOnly}
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
			),
		},
		{
			id: 'm3',
			label: <StepperTabLabel step={3} title="Partidas" />,
			panel: (
				<MenorPartidasTab
					idRequisicion={Number(editingRow.id)}
					idUsuario={Number(editingRow.idUsuario ?? 0)}
					partidas={
						requisicionDetalle?.partidas?.map((p) => ({
							id: crypto.randomUUID(),
							numeroPartida: p.numeroPartida,
							cantidad: String(p.cantidad ?? ''),
							unidadMedidaId: String(p.idUnidadMedida ?? ''),
							unidadMedidaLabel: p.unidadMedidaLabel ?? '',
							descripcion: p.descripcion ?? '',
						})) ?? []
					}
					canEditSolicitanteFields={hideRevisorFields}
					onChange={(partidas) => {
						onDraftChange({
							...draft,
							menorPartidas: partidas,
						});

						setRequisicionDetalle((prev) => ({
						...prev,
						partidas: partidas.map((p) => ({
							id: Number(p.id ?? 0),
							numeroPartida: Number(p.numeroPartida ?? 0),
							cantidad: Number(p.cantidad ?? 0),
							idUnidadMedida: Number(p.unidadMedidaId ?? 0),
							unidadMedidaLabel: p.unidadMedidaLabel ?? '',
							descripcion: p.descripcion ?? '',
							idRequisicion: Number(editingRow.id),
						})),
					}));
					}}
				/>
			),
		},
		{
			id: 'm4',
			label: (
				<div onClick={cargarDocumentoBienes}>
					<StepperTabLabel step={4} title="Documento" />
				</div>
			),
			panel: (
				<>
					{loadingDocumento ? (
						<div>Cargando documento...</div>
					) : (
						<BienesMenorDocumentoPreview
							requisicionDetalle={documentoBienes}
						/>
					)}
				</>
			),
		},
	];
	const menorTabIds = menorTabs.map((t) => t.id);
	menorTabs[0].panel = (
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
				readOnly={readOnly}
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
	);
	menorTabs[1].panel = (
		<MenorDatosRequisicionTab
				idRequisicion={Number(editingRow.id)}
				idUsuario={Number(editingRow.idUsuario ?? 0)}
				initialValues={{
					justificacionGasto: requisicionDetalle?.justificacionGasto ?? '',
				}}
				readOnly={readOnly}
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
	);

	return (
		<Tabs value={tab} onChange={setTab} className="flex flex-col flex-1 min-h-0">
			<TabsList className="shrink-0 bg-white border-b border-slate-200">
				{menorTabs.map((t) => (
					<TabsTab key={t.id} value={t.id} label={t.label} />
				))}
			</TabsList>
			{menorTabs.map((t) => (
				<TabsPanel key={t.id} value={t.id} className="flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-50">
					<RequisicionTabPanelFieldset readOnly={readOnly}>{t.panel}</RequisicionTabPanelFieldset>
				</TabsPanel>
			))}
		</Tabs>
	);
}
