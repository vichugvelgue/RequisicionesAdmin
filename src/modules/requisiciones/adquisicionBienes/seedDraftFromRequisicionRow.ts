import { dateToInputValue } from '../../../utils/dateFormat';
import { createEmptyDraft, type AdquisicionDraft, type RequisicionRow } from './types';

function partidaId(rowId: string, n: number): string {
	return `${rowId}-part-${n}`;
}

/**
 * Draft completo para demos: al abrir una fila del listado todas las pestañas tienen datos coherentes con los catálogos mock.
 */
export function createSeedDraftFromRequisicionRow(row: RequisicionRow): AdquisicionDraft {
	const fecha = row.fechaSolicitudIso?.trim() || dateToInputValue(new Date());
	const monto = row.monto.toFixed(2);

	if (row.tipoCompra === 'MENOR') {
		return {
			...createEmptyDraft(),
			monto,
			tipoCompra: 'MENOR',
			menorDatosGenerales: {
				unidadSolicitanteId: 'US-002',
				nombreSolicitante: row.solicitante,
				cargo: 'SUBDIRECTOR OPERATIVO',
				fechaSolicitud: fecha,
			},
			menorDatosRequisicion: {
				justificacionGasto:
					'JUSTIFICACIÓN MOCK: COMPRA MENOR ALINEADA A LAS NECESIDADES DEL ÁREA SOLICITANTE Y AL PRESUPUESTO AUTORIZADO.',
			},
			menorPartidas: [
				{
					id: partidaId(row.id, 1),
					numeroPartida: 1,
					cantidad: '10.0000',
					unidadMedidaId: 'PZA',
					unidadMedidaLabel: 'PIEZA',
					descripcion: 'MATERIAL DE OFICINA Y CONSUMIBLES DIVERSOS',
				},
				{
					id: partidaId(row.id, 2),
					numeroPartida: 2,
					cantidad: '2.5000',
					unidadMedidaId: 'KG',
					unidadMedidaLabel: 'KILOGRAMO',
					descripcion: 'INSUMOS VARIOS PARA MANTENIMIENTO PREVENTIVO',
				},
			],
		};
	}

	return {
		...createEmptyDraft(),
		monto,
		tipoCompra: 'MAYOR',
		mayorDatosGenerales: {
			unidadSolicitanteId: 'US-001',
			nombreTitular: row.solicitante,
			cargoSolicitante: 'DIRECTOR DE ÁREA',
			fechaSolicitud: fecha,
			caracterProcedimiento: 'NACIONAL',
			modalidadContratacion: 'FIJA',
			tipoProcedimiento: 'LICITACIÓN PÚBLICA NACIONAL',
		},
		mayorDatosPresupuestales: {
			presupuestoAutorizado: (Math.round(row.monto * 1.15 * 100) / 100).toFixed(2),
			clavePresupuestalId: 'CP-1001',
			origenRecursoId: 'OR-1',
			componenteId: 'COMP-1',
			actividadId: 'ACT-2',
			tipoProgramaId: 'TP-1',
		},
		mayorDatosRequisicion: {
			periodoGarantia: '12 MESES',
			descripcionGeneral:
				'DESCRIPCIÓN GENERAL: ADQUISICIÓN DE BIENES PARA EL CUMPLIMIENTO DE OBJETIVOS DEL EJERCICIO FISCAL.',
			justificacionGasto:
				'JUSTIFICACIÓN DEL GASTO: SE REQUIEREN BIENES PARA CONTINUIDAD OPERATIVA DEL PROGRAMA INSTITUCIONAL.',
		},
		mayorDatosAdministrativos: {
			aniosExperienciaLicitante: '5',
			pagosSeRealizaran: 'CONFORME A ENTREGABLES CERTIFICADOS',
			adquisicionMedianteContrato: 'FIJO',
			articuloConformidad: '107',
			lugarEntregaCalle: 'AV. PRINCIPAL 100',
			lugarEntregaColonia: 'CENTRO',
			lugarEntregaCp: '56600',
			lugarEntregaCiudad: 'CUAUTLANCINGO',
			diasEntrega: '30 DÍAS NATURALES',
		},
		mayorRepresentantes: {
			nombre: 'LIC. MARÍA REPRESENTANTE MOCK',
			cargo: 'ENLACE ADMINISTRATIVO',
			correo: 'representante.mock@gob.mx',
			telefono: '5522001100',
		},
		mayorAdministradorContrato: {
			nombre: 'ING. JUAN ADMINISTRADOR MOCK',
			cargo: 'ADMINISTRADOR DEL CONTRATO',
			correo: 'admin.contrato.mock@gob.mx',
			telefono: '5522002200',
		},
		mayorPartidas: [
			{
				id: partidaId(row.id, 1),
				numeroPartida: 1,
				cantidad: '25.0000',
				unidadMedidaId: 'PZA',
				unidadMedidaLabel: 'PIEZA',
				descripcion: 'EQUIPAMIENTO Y REFACCIONES PARA ÁREA OPERATIVA',
			},
		],
	};
}
