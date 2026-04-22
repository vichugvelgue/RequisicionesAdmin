import { dateToInputValue } from '../../../utils/dateFormat';
import {
	createEmptyDraft,
	type ContratacionServiciosDraft,
	type ContratacionServiciosRow,
} from './types';

function partidaId(rowId: string, n: number): string {
	return `${rowId}-part-${n}`;
}

/**
 * Draft completo para demos: al abrir una fila del listado todas las pestañas tienen datos coherentes con los catálogos mock.
 */
export function createSeedDraftFromContratacionRow(row: ContratacionServiciosRow): ContratacionServiciosDraft {
	const fecha = row.fechaSolicitudIso?.trim() || dateToInputValue(new Date());
	const monto = row.monto.toFixed(2);

	if (row.tipoCompra === 'MENOR') {
		return {
			...createEmptyDraft(),
			monto,
			tipoCompra: 'MENOR',
			menorDatosGenerales: {
				unidadSolicitanteId: 'US-003',
				nombreSolicitante: row.solicitante,
				cargo: 'COORDINADOR DE PROYECTOS',
				fechaSolicitud: fecha,
			},
			menorDatosRequisicion: {
				justificacionGasto:
					'JUSTIFICACIÓN MOCK: CONTRATACIÓN DE SERVICIOS MENOR PARA SOPORTE OPERATIVO DEL ÁREA.',
			},
			menorDetalleServicio: {
				descripcionGeneral: 'SERVICIOS DE MANTENIMIENTO Y SOPORTE TÉCNICO ESPECIALIZADO.',
				descripcionEspecifica:
					'INCLUYE VISITAS PROGRAMADAS, ATENCIÓN DE INCIDENTES Y REPORTES MENSUALES DE AVANCE.',
				lugarEjecucionServicio: 'INSTALACIONES MUNICIPALES Y ÁREAS DESIGNADAS POR CONTRATO.',
				personalRequerido: 'PERSONAL CERTIFICADO CON EXPERIENCIA MÍNIMA DE 24 MESES EN RUBRO.',
				condicionesGeneralesContratacion:
					'SE APLICARÁN LAS BASES DE CONTRATACIÓN Y LAS CLÁUSULAS ADMINISTRATIVAS VIGENTES.',
			},
			menorPartidas: [
				{
					id: partidaId(row.id, 1),
					numeroPartida: 1,
					unidadMedidaId: 'SERV',
					unidadMedidaLabel: 'SERVICIO',
					cantidad: '120.0000',
					defDescripcionGeneral: 'SERVICIO DE SOPORTE OPERATIVO A PROCESOS INTERNOS.',
					defDescripcionEspecifica:
						'ATENCIÓN, SEGUIMIENTO Y DOCUMENTACIÓN DE ACTIVIDADES DE SOPORTE DEL ÁREA SOLICITANTE.',
					defLugarPeriodoEjecucion:
						'INSTALACIONES MUNICIPALES; EJECUCIÓN PROGRAMADA DURANTE EL EJERCICIO ACTUAL.',
					defPersonalRequerido: 'PERSONAL TÉCNICO CON EXPERIENCIA COMPROBABLE EN SERVICIOS SIMILARES.',
					defEntregablesAcreditacion:
						'REPORTES SEMANALES, EVIDENCIAS DE ATENCIÓN Y ACTAS DE CONFORMIDAD.',
					defCondicionesGeneralesContratacion:
						'SUJETO A CONDICIONES ADMINISTRATIVAS Y TÉCNICAS ESTABLECIDAS EN LA REQUISICIÓN.',
				},
				{
					id: partidaId(row.id, 2),
					numeroPartida: 2,
					unidadMedidaId: 'HRS',
					unidadMedidaLabel: 'HORA',
					cantidad: '8.0000',
					defDescripcionGeneral: 'SERVICIO ESPECIALIZADO DE CAPACITACIÓN OPERATIVA.',
					defDescripcionEspecifica:
						'JORNADAS DE CAPACITACIÓN PARA USUARIOS CLAVE SOBRE PROCEDIMIENTOS INTERNOS.',
					defLugarPeriodoEjecucion:
						'SALA DE CAPACITACIÓN DEL ENTE; PERIODO SEGÚN CALENDARIO APROBADO.',
					defPersonalRequerido: 'INSTRUCTOR CERTIFICADO Y PERSONAL DE APOYO LOGÍSTICO.',
					defEntregablesAcreditacion:
						'LISTAS DE ASISTENCIA, MATERIAL DIDÁCTICO Y REPORTE FINAL DE CAPACITACIÓN.',
					defCondicionesGeneralesContratacion:
						'LA PRESTACIÓN DEL SERVICIO DEBE AJUSTARSE A LOS TÉRMINOS DE REFERENCIA DEFINIDOS.',
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
			articuloConformidad: '107',
			tipoProcedimiento: 'LICITACIÓN PÚBLICA NACIONAL',
		},
		mayorDatosPresupuestales: {
			presupuestoAutorizado: (Math.round(row.monto * 1.12 * 100) / 100).toFixed(2),
			clavePresupuestalId: 'CP-2002',
			origenRecursoId: 'OR-2',
			componenteId: 'COMP-2',
			actividadId: 'ACT-1',
			tipoProgramaId: 'TP-2',
		},
		mayorDatosRequisicion: {
			periodoGarantia: '24 MESES',
			descripcionGeneral:
				'DESCRIPCIÓN GENERAL: SERVICIOS ESPECIALIZADOS PARA EL CUMPLIMIENTO DE METAS DEL PROGRAMA.',
			justificacionGasto:
				'JUSTIFICACIÓN DEL GASTO: SE REQUIERE CONTRATACIÓN PARA GARANTIZAR CONTINUIDAD DEL SERVICIO.',
		},
		mayorEjecucion: {
			experienciaLicitante: 'MÍNIMO 5 AÑOS DE EXPERIENCIA EN SERVICIOS SIMILARES A LOS SOLICITADOS.',
			calle: 'BLVD. MUNICIPAL 200',
			colonia: 'ZONA INDUSTRIAL',
			cp: '56604',
			ciudad: 'CUAUTLANCINGO',
			periodoInicio: '',
			periodoFin: '',
			periodoTexto: '01-ENE-2026 AL 31-DIC-2026',
			horario: '09:00 A 18:00 HRS',
		},
		mayorRecursos: {
			personalRequerido:
				'PERSONAL TÉCNICO CERTIFICADO, COORDINADOR DE OBRA Y AUXILIARES SEGÚN ESPECIFICACIONES TÉCNICAS.',
		},
		mayorEntregables: {
			entregables:
				'ENTREGABLES: INFORMES MENSUALES, ACTAS DE SUPERVISIÓN Y EVIDENCIAS FOTOGRÁFICAS DE AVANCE.',
		},
		mayorCondiciones: {
			diasEntrega: '15 DÍAS HÁBILES',
			condicionesGeneralesContratacion:
				'CONDICIONES GENERALES SEGÚN CONVOCATORIA Y NORMATIVIDAD APLICABLE EN MATERIA DE CONTRATACIÓN.',
			pagosSeRealizaran: 'POR ESTIMACIÓN Y PAGO CONTRA ENTREGA CERTIFICADA',
		},
		mayorRepresentantes: {
			nombre: 'LIC. ANA REPRESENTANTE MOCK',
			cargo: 'RESPONSABLE DE CONTRATACIÓN',
			correo: 'representante.servicios.mock@gob.mx',
			telefono: '5533004400',
		},
		mayorAdministradorContrato: {
			nombre: 'MTRO. CARLOS ADMINISTRADOR MOCK',
			cargo: 'ADMINISTRADOR DEL CONTRATO',
			correo: 'admin.contrato.servicios.mock@gob.mx',
			telefono: '5533005500',
		},
		mayorPartidas: [
			{
				id: partidaId(row.id, 1),
				numeroPartida: 1,
				unidadMedidaId: 'HRS',
				unidadMedidaLabel: 'HORA',
				cantidad: '500.0000',
				defDescripcionGeneral: 'SERVICIO DE SOPORTE TÉCNICO EN SITIO',
				defDescripcionEspecifica: 'HORAS HOMBRE PARA DIAGNÓSTICO, CONFIGURACIÓN Y RESOLUCIÓN DE INCIDENTES.',
				defLugarPeriodoEjecucion: 'INSTALACIONES DEL MUNICIPIO; PERIODO SEGÚN CALENDARIO DE ACTIVIDADES.',
				defPersonalRequerido: 'INGENIERO EN SISTEMAS Y TÉCNICOS CERTIFICADOS.',
				defEntregablesAcreditacion: 'BITÁCORAS, REPORTES Y FORMATOS DE CIERRE MENSUAL.',
				defCondicionesGeneralesContratacion: 'CONFORME A BASES DE LICITACIÓN Y ANEXOS TÉCNICOS.',
			},
		],
	};
}
