import type { AuthUser } from '../../../auth/types';

export type ContratacionServiciosEstatus = 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';
export type TipoCompraServicios = 'MAYOR' | 'MENOR';

export type ContratacionServiciosSearchCriteria =
	| 'Coincidencia'
	| 'ID'
	| 'Solicitante'
	| 'Tipo'
	| 'Estatus';

export interface ContratacionServiciosRow extends Record<string, unknown> {
	id: string;
	numero: number;
	monto: number;
	tipoCompra: TipoCompraServicios;
	solicitante: string;
	estatus: ContratacionServiciosEstatus;
	fechaSolicitudIso: string;
}

export interface ServiciosMayorDatosGeneralesValues {
	unidadSolicitanteId: string;
	nombreTitular: string;
	cargoSolicitante: string;
	fechaSolicitud: string;
	caracterProcedimiento: string;
	modalidadContratacion: string;
	articuloConformidad: string;
	tipoProcedimiento: string;
}

export interface ServiciosMayorDatosPresupuestalesValues {
	presupuestoAutorizado: string;
	clavePresupuestalId: string;
	origenRecursoId: string;
	componenteId: string;
	actividadId: string;
	tipoProgramaId: string;
}

export interface ServiciosMayorDatosRequisicionValues {
	descripcionGeneral: string;
	justificacionGasto: string;
	periodoGarantia: string;
}

export interface ServiciosPersonaContactoValues {
	nombre: string;
	cargo: string;
	correo: string;
	telefono: string;
}

/** Partida servicios mayor: campos planos (solicitante / revisor según UI). */
export interface ServiciosPartidaMayor {
	id: string;
	numeroPartida: number;
	unidadMedidaId: string;
	unidadMedidaLabel: string;
	cantidad: string;
	defDescripcionGeneral: string;
	defDescripcionEspecifica: string;
	defLugarPeriodoEjecucion: string;
	defPersonalRequerido: string;
	defEntregablesAcreditacion: string;
	defCondicionesGeneralesContratacion: string;
	execExperienciaLicitante: string;
	execCalle: string;
	execColonia: string;
	execCp: string;
	execCiudad: string;
	execPeriodoInicio: string;
	execPeriodoFin: string;
	execPeriodoTexto: string;
	execHorario: string;
	recPersonalRequerido: string;
	entEntregables: string;
	condDiasEntrega: string;
	condCondicionesGeneralesContratacion: string;
	condPagosSeRealizaran: string;
}

export interface ServiciosPartidaMenor {
	id: string;
	numeroPartida: number;
	tipo: 'SERVICIO';
	cantidad: string;
}

export interface MenorDetalleServicioValues {
	descripcionGeneral: string;
	descripcionEspecifica: string;
	lugarEjecucionServicio: string;
	personalRequerido: string;
	condicionesGeneralesContratacion: string;
}

export interface ContratacionServiciosDraft {
	monto?: string;
	tipoCompra?: TipoCompraServicios;
	mayorDatosGenerales: Partial<ServiciosMayorDatosGeneralesValues>;
	mayorDatosPresupuestales: Partial<ServiciosMayorDatosPresupuestalesValues>;
	mayorDatosRequisicion: Partial<ServiciosMayorDatosRequisicionValues>;
	mayorRepresentantes: Partial<ServiciosPersonaContactoValues>;
	mayorAdministradorContrato: Partial<ServiciosPersonaContactoValues>;
	menorDatosGenerales: Partial<{
		unidadSolicitanteId: string;
		nombreSolicitante: string;
		cargo: string;
		fechaSolicitud: string;
	}>;
	menorDatosRequisicion: Partial<{ justificacionGasto: string }>;
	menorDetalleServicio: Partial<MenorDetalleServicioValues>;
	mayorPartidas: ServiciosPartidaMayor[];
	menorPartidas: ServiciosPartidaMenor[];
}

export function createEmptyDraft(): ContratacionServiciosDraft {
	return {
		mayorDatosGenerales: {},
		mayorDatosPresupuestales: {},
		mayorDatosRequisicion: {},
		mayorRepresentantes: {},
		mayorAdministradorContrato: {},
		menorDatosGenerales: {},
		menorDatosRequisicion: {},
		menorDetalleServicio: {},
		mayorPartidas: [],
		menorPartidas: [],
	};
}

export function userHidesRevisorFields(user: AuthUser | null): boolean {
	const p = user?.tipoPerfil ?? 'SOLICITANTE';
	return p === 'SOLICITANTE';
}

export function createEmptyServiciosPartidaMayor(
	id: string,
	numeroPartida: number
): ServiciosPartidaMayor {
	return {
		id,
		numeroPartida,
		unidadMedidaId: '',
		unidadMedidaLabel: '',
		cantidad: '',
		defDescripcionGeneral: '',
		defDescripcionEspecifica: '',
		defLugarPeriodoEjecucion: '',
		defPersonalRequerido: '',
		defEntregablesAcreditacion: '',
		defCondicionesGeneralesContratacion: '',
		execExperienciaLicitante: '',
		execCalle: '',
		execColonia: '',
		execCp: '',
		execCiudad: '',
		execPeriodoInicio: '',
		execPeriodoFin: '',
		execPeriodoTexto: '',
		execHorario: '',
		recPersonalRequerido: '',
		entEntregables: '',
		condDiasEntrega: '',
		condCondicionesGeneralesContratacion: '',
		condPagosSeRealizaran: '',
	};
}
