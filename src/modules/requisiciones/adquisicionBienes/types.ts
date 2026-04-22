import type { AuthUser } from '../../../auth/types';

export type RequisicionEstatus = 'PENDIENTE' | 'APROBADA' | 'RECHAZADA' | 'CAMBIOS_SOLICITADOS';
export type TipoCompra = 'MAYOR' | 'MENOR';

export type SearchCriteria =
	| 'Coincidencia'
	| 'ID'
	| 'Solicitante'
	| 'Tipo'
	| 'Estatus';

export interface RequisicionRow extends Record<string, unknown> {
	id: string;
	numero: number;
	monto: number;
	tipoCompra: TipoCompra;
	solicitante: string;
	estatus: RequisicionEstatus;
	/** yyyy-mm-dd para filtros */
	fechaSolicitudIso: string;
	/** Último comentario del revisor (mock local). */
	notaRevision?: string;
}

export interface MayorDatosGeneralesValues {
	unidadSolicitanteId: string;
	nombreTitular: string;
	cargoSolicitante: string;
	fechaSolicitud: string;
	caracterProcedimiento: string;
	modalidadContratacion: string;
	tipoProcedimiento: string;
}

export interface MayorDatosPresupuestalesValues {
	presupuestoAutorizado: string;
	clavePresupuestalId: string;
	origenRecursoId: string;
	componenteId: string;
	actividadId: string;
	tipoProgramaId: string;
}

export interface MayorDatosRequisicionValues {
	descripcionGeneral: string;
	justificacionGasto: string;
	periodoGarantia: string;
}

export interface MayorDatosAdministrativosValues {
	aniosExperienciaLicitante: string;
	pagosSeRealizaran: string;
	adquisicionMedianteContrato: string;
	articuloConformidad: string;
	lugarEntregaCalle: string;
	lugarEntregaColonia: string;
	lugarEntregaCp: string;
	lugarEntregaCiudad: string;
	diasEntrega: string;
}

export interface PersonaContactoValues {
	nombre: string;
	cargo: string;
	correo: string;
	telefono: string;
}

export interface AdquisicionPartidaBase {
	id: string;
	cantidad: string;
	unidadMedidaId: string;
	unidadMedidaLabel: string;
	descripcion: string;
}

export interface AdquisicionPartidaMayor extends AdquisicionPartidaBase {
	numeroPartida: number;
}

export interface AdquisicionPartidaMenor extends AdquisicionPartidaBase {
	numeroPartida: number;
}

export interface AdquisicionDraft {
	monto?: string;
	tipoCompra?: TipoCompra;
	mayorDatosGenerales: Partial<MayorDatosGeneralesValues>;
	mayorDatosPresupuestales: Partial<MayorDatosPresupuestalesValues>;
	mayorDatosRequisicion: Partial<MayorDatosRequisicionValues>;
	mayorDatosAdministrativos: Partial<MayorDatosAdministrativosValues>;
	mayorRepresentantes: Partial<PersonaContactoValues>;
	mayorAdministradorContrato: Partial<PersonaContactoValues>;
	menorDatosGenerales: Partial<{
		unidadSolicitanteId: string;
		nombreSolicitante: string;
		cargo: string;
		fechaSolicitud: string;
	}>;
	menorDatosRequisicion: Partial<{ justificacionGasto: string }>;
	mayorPartidas: AdquisicionPartidaMayor[];
	menorPartidas: AdquisicionPartidaMenor[];
}

export function createEmptyDraft(): AdquisicionDraft {
	return {
		mayorDatosGenerales: {},
		mayorDatosPresupuestales: {},
		mayorDatosRequisicion: {},
		mayorDatosAdministrativos: {},
		mayorRepresentantes: {},
		mayorAdministradorContrato: {},
		menorDatosGenerales: {},
		menorDatosRequisicion: {},
		mayorPartidas: [],
		menorPartidas: [],
	};
}

export function userHidesRevisorFields(user: AuthUser | null): boolean {
	const p = user?.tipoPerfil ?? 'SOLICITANTE';
	return p === 'SOLICITANTE';
}
