import { authorizedFetch } from "./httpClient";

//Se utiliza para el listado
export interface Requisicion {
	id: number;
	monto: number;
	tipo: string;
	solicitante: string;
	estatus: string;
	revisor: string;
	unidadSolicitante: string;
	tipoObjetoRequisicion: number;
	fechaSolicitud: string;
	fechaSolicitudCadena: string;
}

export interface GuardarRequisicionDTO {
	idRequisicion: number;
	idUsuario: number;
}
export interface CancelarRequest extends GuardarRequisicionDTO {
	motivo: string;
}
export interface EnviarObservacionRequest extends GuardarRequisicionDTO {
	observacion: string;
}
//Se utiliza para el listado
export interface RequisicionView {
	id: number;
	monto: number;
	tipo: string;
	solicitante: string;
	revisor: string;
	estatus: string;
	fechaSolicitud: string;
	fechaSolicitudCadena: string;
	tipoObjetoRequisicion: number;
	tipoMontoRequisicion?: number | string;
	tipoObjeto?: number | string;
	tipoRequisicion?: number | string;
	unidadSolicitante?: string;
	estado?: string;
}
//Se utiliza para el listado
export interface ObservacionRequisicionView extends GuardarRequisicionDTO {
	tipoObservacion: string;
	observacion: string;
	fechaRegistro: string;
}
//Se utiliza para el listado
export interface HistorialRequisicionView extends GuardarRequisicionDTO {
	nombreUsuario: string;
	accion: string;
	comentario: string;
	fechaRegistro: string;
}

//Se utiiliza para crear requisición al inicio del proceso, antes de guardar datos generales
export interface CrearRequisicionRequest {
	idUsuarioSolicitante: number;
	tipoObjetoRequisicion: number;
	tipoMontoRequisicion: number;
	monto: number;
}

//Se utiliza para guardar datos generales en el paso 1 del formulario
export interface GuardarDatosGeneralesRequest {
	idRequisicion: number;
	idUsuario: number;
	idUnidadSolicitante: number;
	nombreSolicitante: string;
	cargoSolicitante: string;
	fechaSolicitud: string;

	caracterProcedimiento?: number | null;
	modalidadContratacion?: number | null;
	articulo?: number | null;
	tipoProcedimiento?: string;
}

export interface RequisicionDetalle {
	id: number;
	monto: number;
	estatusRequisicion: number | string;
	tipoObjetoRequisicion: number | string;
	tipoMontoRequisicion: number | string;

	idUnidadSolicitante?: number;
	idUsuarioSolicitante?: number;
	nombreSolicitante?: string;
	cargoSolicitante?: string;
	fechaSolicitud?: string;

	caracterProcedimiento?: number | null;
	modalidadContratacion?: number | null;
	articulo?: number | null;
	tipoProcedimiento?: string;

	presupuestoAutorizado?: string;
	idClavePresupuestal?: number;
	idOrigenRecurso?: number;
	idComponente?: number;
	idActividad?: number;
	idTipoPrograma?: number;
	partidas?: PartidaRequest[];

	descripcionGeneral?: string;
	justificacionGasto?: string;
	periodoGarantia?: string;

	bienDetalle?: BienDetalle | null;
	servicioDetalle?: ServicioDetalle | null;
}

export interface DatosAdministrativosBienDTO {
	idRequisicion: number;
	idUsuario: number;

	aniosExperienciaLicitante: string;
	pagosSeRealizaran: string;
	adquisicionMedianteContrato?: number | null;
	conformidadArticulo?: number | null;
	lugarEntrega: string;
	diasEntrega: string;

	calle: string;
	colonia: string;
	ciudad: string;
	codigoPostal: string;
	nombreDependenciaEntrega: string;
	telefonoEntrega: string;
	extencionTelefonoEntrega: string;
}

export interface BienDetalle {
	id: number;
	idRequisicion: number;

	aniosExperienciaLicitante?: string;
	pagosSeRealizaran?: string;

	adquisicionMedianteContrato?: number | null;
	conformidadArticulo?: number | null;

	lugarEntrega?: string;
	diasEntrega?: string;

	calle?: string;
	colonia?: string;
	ciudad?: string;
	codigoPostal?: string;
	nombreDependenciaEntrega?: string;
	telefonoEntrega?: string;
	extencionTelefonoEntrega?: string;

	nombreRepresentante?: string;
	cargoRepresentante?: string;
	correoRepresentante?: string;
	telefonoRepresentante?: string;

	nombreAdministradorContrato?: string;
	cargoAdministradorContrato?: string;
	correoAdministradorContrato?: string;
	telefonoAdministradorContrato?: string;
}
export interface ServicioDetalle {
	id: number;
	idRequisicion: number;

	experienciaLicitante?: string;
	lugarEjecucion?: string;
	ciudad?: string;
	colonia?: string;
	calle?: string;
	cp?: string;
	nombreDependenciaEntrega?: string;
	telefonoEntrega?: string;
	extencionTelefonoEntrega?: string;
	personalRequerido?: string;
	entregables?: string;
	diasEntrega?: string;
	condicionesGeneralesContratacion?: string;
	pagosSeRealizaran?: string;

	nombreRepresentante?: string;
	cargoRepresentante?: string;
	correoRepresentante?: string;
	telefonoRepresentante?: string;

	nombreAdministradorContrato?: string;
	cargoAdministradorContrato?: string;
	correoAdministradorContrato?: string;
	telefonoAdministradorContrato?: string;
}

export interface GuardarDatosRequisicionRequest {
	idRequisicion: number;
	idUsuario: number;
	descripcionGeneral?: string;
	justificacionGasto: string;
	periodoGarantia?: string;
}

export interface PartidaRequest {
	descripcion: string;
	descripcionGeneral?: string;
	descripcionEspecifica?: string;
	lugarPeriodoEjecucionServicio?: string;
	personalRequerido?: string;
	entregablesNecesarios?: string;
	condicionesGeneralesContratacion?: string;
	idUnidadMedida: number;
	idRequisicion: number;
	cantidad: number;
	numeroPartida?: number;
	unidadMedidaLabel?: string;
	id?: number;

}

export interface GuardarPartidasRequest {
	idRequisicion: number;
	idUsuario: number;
	listaPartidas: PartidaRequest[];
}

export interface GuardarDatosPresupuestalesRequest {
	idRequisicion: number;
	idUsuario: number;
	presupuestoAutorizado: string;
	idClavePresupuestal?: number | null;
	idOrigenRecurso?: number | null;
	idComponente?: number | null;
	idActividad?: number | null;
	idTipoPrograma?: number | null;
}

export interface GuardarRepresentanteRequest {
	idRequisicion: number;
	idUsuario: number;
	nombre: string;
	cargo: string;
	correoElectronico: string;
	telefono: string;
}

export interface GuardarAdministradorContratoRequest {
	idRequisicion: number;
	idUsuario: number;
	nombre: string;
	cargo: string;
	correoElectronico: string;
	telefono: string;
}

export interface guardarDatosEjecucionRequest extends GuardarRequisicionDTO {
	experienciaLicitante: string;
	calle: string;
	colonia: string;
	cp: string;
	ciudad: string;
	nombreDependenciaEntrega: string;
	telefonoEntrega: string;
	extencionTelefonoEntrega: string;
}
export interface guardarDatosCondicionesRequest extends GuardarRequisicionDTO {
	diasEntrega: string;
	condicionesGeneralesContratacion: string;
	pagosSeRealizaran: string;
}

export interface DocumentoBienesPartida {
	numeroPartida: number;
	descripcion: string;
	unidadMedida: string;
	cantidad: number;
}

export interface RequisicionBienDocumento {
	idRequisicion: number;
	unidadSolicitante: string;
	nombreSolicitante: string;
	cargoSolicitante: string;
	fechaSolicitud: string;
	fechaSolicitudCadena: string;
	caracterProcedimiento: string;
	modalidadContratacion: string;
	presupuestoAutorizado: number;
	clavePresupuestal: string;
	origenRecurso: string;
	componente: string;
	actividad: string;
	tipoPrograma: string;
	tipoProcedimiento: string;
	descripcionGeneral: string;
	periodoGarantia: string;
	justificacionGasto: string;
	partidas: DocumentoBienesPartida[];
	aniosExperienciaLicitante: string;
	diasEntrega: string;
	pagosSeRealizaran: string;
	lugarEntrega: string;
	adquisicionMedianteContrato: string;
	articulo: string;
	nombreRepresentante: string;
	cargoRepresentante: string;
	correoRepresentante: string;
	telefonoRepresentante: string;
	nombreAdministradorContrato: string;
	cargoAdministradorContrato: string;
	correoAdministradorContrato: string;
	telefonoAdministradorContrato: string;
	nombreDependenciaEntrega: string;
	telefonoEntrega: string;
	extencionTelefonoEntrega: string;
}

export interface IndicadoresSolicitante {
	total: number;
	en_captura: number;
	pendiente: number;
	en_revision: number;
	validada: number;
	definitivo: number;
	rechazada: number;
	bienes: number;
	servicios: number;
	mayores: number;
	menores: number;
}

const getUsuarioId = (): number => {
	try {
		const session = JSON.parse(
			localStorage.getItem("requisiciones_admin_auth_v1") || "null"
		);

		return Number(session?.user?.id ?? 0);
	} catch {
		return 0;
	}
};

const formatFecha = (fecha?: string) => {
	if (!fecha) return "";

	const d = new Date(fecha);

	return d.toLocaleDateString("es-MX"); // 👉 05/05/2026
};

const mapRequisicionToView = (item: Requisicion): RequisicionView => ({
	id: item.id,
	monto: item.monto ?? 0,
	tipo: item.tipo ?? "",
	solicitante: item.solicitante ?? "",
	estatus: item.estatus ?? "",
	revisor: item.revisor ?? "N/A",
	unidadSolicitante: item.unidadSolicitante ?? "N/A",
	fechaSolicitud: formatFecha(item.fechaSolicitud),
	fechaSolicitudCadena: item.fechaSolicitudCadena,
	tipoObjetoRequisicion: item.tipoObjetoRequisicion,
});
const handleApiError = async (response: Response, fallback: string): Promise<never> => {
	try {
		const data = await response.json();
		throw new Error(data?.mensaje || fallback);
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
		throw new Error(fallback);
	}
};

export const requisicionApi = {
	// Obtener el listado de requisiciones para el usuario autenticado
	/*async listarPorSolicitanteOld(): Promise<RequisicionView[]> {
		const idUsuario = getUsuarioId();
		const response = await authorizedFetch(`/ControladorRequisicion/ListarPorSolicitante/${idUsuario}`, { method: "GET" });
		if (!response.ok) await handleApiError(response, "Error al listar requisiciones por solicitante");
		const data = await response.json();
		const requisiciones: Requisicion[] = data.dataList || [];
		return requisiciones.filter((item) => item && typeof item === "object" && item.id).map(mapRequisicionToView);
	},*/

	async listarPorSolicitante(params?: {
		tipoObjeto?: number | null;
		tipoMonto?: number | null;
		estatus?: number | null;
		fechaInicio?: string | null;
		fechaFin?: string | null;
	}): Promise<RequisicionView[]> {
		const idUsuario = getUsuarioId();

		const query = new URLSearchParams();

		if (params?.tipoMonto != null) {
			query.append('tipoMonto', String(params.tipoMonto));
		}

		if (params?.estatus != null) {
			query.append('estatus', String(params.estatus));
		}

		if (params?.tipoObjeto != null) {
			query.append('tipoObjeto', String(params.tipoObjeto));
		}

		if (params?.fechaInicio) {
			query.append('fechaInicio', params.fechaInicio);
		}

		if (params?.fechaFin) {
			query.append('fechaFin', params.fechaFin);
		}

		const queryString = query.toString();

		const response = await authorizedFetch(
			`/ControladorRequisicion/ListarPorSolicitante/${idUsuario}${queryString ? `?${queryString}` : ''
			}`,
			{
				method: 'GET',
			}
		);

		if (!response.ok) {
			await handleApiError(response, 'Error al listar requisiciones por solicitante');
		}

		const data = await response.json();
		const requisiciones: Requisicion[] = data.dataList || [];

		return requisiciones
			.filter((item) => item && typeof item === 'object' && item.id)
			.map(mapRequisicionToView);
	},

	async listarPorRevisor(params?: {
		tipoMonto?: number | null;
		estatus?: number | null;
		tipoObjeto?: number | null;
		fechaInicio?: string | null;
		fechaFin?: string | null;
	}): Promise<RequisicionView[]> {
		const idUsuario = getUsuarioId();

		const query = new URLSearchParams();

		if (params?.tipoMonto != null) {
			query.append('tipoMonto', String(params.tipoMonto));
		}

		if (params?.estatus != null) {
			query.append('estatus', String(params.estatus));
		}

		if (params?.tipoObjeto != null) {
			query.append('tipoObjeto', String(params.tipoObjeto));
		}

		if (params?.fechaInicio) {
			query.append('fechaInicio', params.fechaInicio);
		}

		if (params?.fechaFin) {
			query.append('fechaFin', params.fechaFin);
		}

		const queryString = query.toString();

		const response = await authorizedFetch(
			`/ControladorRequisicion/ListarPorRevisor/${idUsuario}${queryString ? `?${queryString}` : ''}`,
			{
				method: 'GET',
			}
		);

		if (!response.ok) {
			await handleApiError(response, 'Error al listar requisiciones por revisor');
		}

		const data = await response.json();
		const requisiciones: Requisicion[] = data.dataList || [];

		return requisiciones
			.filter((item) => item && typeof item === 'object' && item.id)
			.map(mapRequisicionToView);
	},

	async listaTodo(params?: {
		tipoObjeto?: number | null;
		tipoMonto?: number | null;
		estatus?: number | null;
		fechaInicio?: string | null;
		fechaFin?: string | null;
	}): Promise<RequisicionView[]> {

		const query = new URLSearchParams();

		if (params?.tipoMonto != null) {
			query.append('tipoMonto', String(params.tipoMonto));
		}

		if (params?.estatus != null) {
			query.append('estatus', String(params.estatus));
		}

		if (params?.tipoObjeto != null) {
			query.append('tipoObjeto', String(params.tipoObjeto));
		}

		if (params?.fechaInicio) {
			query.append('fechaInicio', params.fechaInicio);
		}

		if (params?.fechaFin) {
			query.append('fechaFin', params.fechaFin);
		}

		const queryString = query.toString();

		const response = await authorizedFetch(
			`/ControladorRequisicion/ListarTodas${queryString ? `?${queryString}` : ''}`,
			{
				method: 'GET',
			}
		);

		if (!response.ok) {
			await handleApiError(response, 'Error al listar requisiciones');
		}

		const data = await response.json();
		const requisiciones: Requisicion[] = data.dataList || [];

		return requisiciones
			.filter((item) => item && typeof item === 'object' && item.id)
			.map(mapRequisicionToView);
	},

	// Crear una nueva requisición al inicio del proceso, antes de guardar datos generales
	async crear(data: CrearRequisicionRequest) {

		const response = await authorizedFetch(
			`/ControladorRequisicion/CrearRequisicion`,
			{
				method: "POST",
				body: JSON.stringify(data),
			}
		);

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(
				errorData?.mensaje || "Error al crear la requisición"
			);
		}

		const result = await response.json();

		// normalmente regresa { data: ... }
		return result.data;
	},

	async EnviarObservacion(data: EnviarObservacionRequest): Promise<void> {
		const response = await authorizedFetch(
			`/ControladorRequisicion/RegistrarObservacionRevision`,
			{
				method: "POST",
				body: JSON.stringify(data),
			}
		);

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(
				errorData?.mensaje || "Error al guardar datos generales"
			);
		}
	},

	async EnviarRevision(data: GuardarRequisicionDTO): Promise<void> {
		const response = await authorizedFetch(
			`/ControladorRequisicion/EnviarRevision`,
			{
				method: "POST",
				body: JSON.stringify(data),
			}
		);

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(
				errorData?.mensaje || "Error al guardar datos generales"
			);
		}
	},

	async Cancelar(data: GuardarRequisicionDTO): Promise<void> {
		const response = await authorizedFetch(
			`/ControladorRequisicion/Cancelar`,
			{
				method: "POST",
				body: JSON.stringify(data),
			}
		);

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(
				errorData?.mensaje || "Error al guardar datos generales"
			);
		}
	},

	async EnviarAutorizacion(data: GuardarRequisicionDTO): Promise<void> {
		const response = await authorizedFetch(
			`/ControladorRequisicion/EnviarAutorizacion`,
			{
				method: "POST",
				body: JSON.stringify(data),
			}
		);

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(
				errorData?.mensaje || "Error al guardar datos generales"
			);
		}
	},

	async Autorizar(data: GuardarRequisicionDTO): Promise<void> {
		const response = await authorizedFetch(
			`/ControladorRequisicion/Autorizar`,
			{
				method: "POST",
				body: JSON.stringify(data),
			}
		);

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(
				errorData?.mensaje || "Error al guardar datos generales"
			);
		}
	},

	async ObtenerObservaciones(idRequisicion: string): Promise<ObservacionRequisicionView[]> {
		const response = await authorizedFetch(
			`/ControladorRequisicion/ObtenerObservaciones/${idRequisicion}`,
			{
				method: "GET",
			}
		);

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(
				errorData?.mensaje || "Error al guardar datos generales"
			);
		}

		const result = await response.json();

		// normalmente regresa { data: ... }
		return result.dataList;
	},

	async ObtenerHistorial(idRequisicion: string): Promise<HistorialRequisicionView[]> {
		const response = await authorizedFetch(
			`/ControladorRequisicion/ObtenerHistorial/${idRequisicion}`,
			{
				method: "GET",
			}
		);

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(
				errorData?.mensaje || "Error al guardar datos generales"
			);
		}

		const result = await response.json();

		// normalmente regresa { data: ... }
		return result.dataList;
	},


	//Guardar datos generales en el paso 1 del formulario
	async guardarDatosGenerales(data: GuardarDatosGeneralesRequest): Promise<void> {

		const response = await authorizedFetch(
			`/ControladorRequisicion/GuardarDatosGenerales`,
			{
				method: "POST",
				body: JSON.stringify(data),
			}
		);

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(
				errorData?.mensaje || "Error al guardar datos generales"
			);
		}
	},

	// Obtener detalles de una requisición por su ID
	async obtenerPorId(idRequisicion: number): Promise<RequisicionDetalle> {

		const response = await authorizedFetch(
			`/ControladorRequisicion/ObtenerRequisicionPorID?idRequisicion=${idRequisicion}`,
			{
				method: "GET",
			}
		);
		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(
				errorData?.mensaje || "Error al obtener la requisición"
			);
		}

		const result = await response.json();
		return result.data;
	},

	//Registrar Justificación de gasto bien menor y los otros para bien mayor
	async guardarDatosRequisicion(data: GuardarDatosRequisicionRequest): Promise<void> {

		const response = await authorizedFetch(
			`/ControladorRequisicion/GuardarDatosRequisicion`,
			{
				method: "POST",
				body: JSON.stringify({
					idRequisicion: data.idRequisicion,
					idUsuario: data.idUsuario,
					descripcionGeneral: data.descripcionGeneral ?? "",
					justificacionGasto: data.justificacionGasto,
					periodoGarantia: data.periodoGarantia ?? "",
				}),
			}
		);

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(
				errorData?.mensaje || "Error al guardar datos de requisición"
			);
		}
	},

	async guardarPartidas(data: GuardarPartidasRequest): Promise<void> {
		const idUsuario = getUsuarioId();
		const response = await authorizedFetch(
			`/ControladorRequisicion/GuardarPartidas`,
			{
				method: "POST",
				body: JSON.stringify({
					idRequisicion: data.idRequisicion,
					idUsuario: idUsuario,
					listaPartidas: data.listaPartidas.map((partida) => ({
						id: partida.id,
						descripcion: partida.descripcion,
						descripcionGeneral: partida.descripcionGeneral ?? "",
						descripcionEspecifica: partida.descripcionEspecifica ?? "",
						lugarPeriodoEjecucionServicio: partida.lugarPeriodoEjecucionServicio ?? "",
						personalRequerido: partida.personalRequerido ?? "",
						entregablesNecesarios: partida.entregablesNecesarios ?? "",
						condicionesGeneralesContratacion: partida.condicionesGeneralesContratacion ?? "",
						idUnidadMedida: partida.idUnidadMedida,
						idRequisicion: partida.idRequisicion,
						cantidad: partida.cantidad,
						unidadMedidaLabel: partida.unidadMedidaLabel ?? ""
					})),
				}),
			}
		);

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData?.mensaje || "Error al guardar partidas");
		}
	},

	// Guardar datos presupuestales en el paso 2 del formulario
	async guardarDatosPresupuestales(
		data: GuardarDatosPresupuestalesRequest
	): Promise<void> {

		const response = await authorizedFetch(
			`/ControladorRequisicion/GuardarDatosPresupuestales`,
			{
				method: "POST",
				body: JSON.stringify(data),
			}
		);

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(
				errorData?.mensaje || "Error al guardar datos presupuestales"
			);
		}
	},

	async guardarDatosEjecucion(
		data: guardarDatosEjecucionRequest
	): Promise<void> {

		const response = await authorizedFetch(
			`/ControladorRequisicion/GuardarServicioEjecucion`,
			{
				method: "POST",
				body: JSON.stringify(data),
			}
		);

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(
				errorData?.mensaje || "Error al guardar datos presupuestales"
			);
		}
	},

	async guardarDatosCondiciones(
		data: guardarDatosCondicionesRequest
	): Promise<void> {

		const response = await authorizedFetch(
			`/ControladorRequisicion/GuardarServicioCondiciones`,
			{
				method: "POST",
				body: JSON.stringify(data),
			}
		);

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(
				errorData?.mensaje || "Error al guardar datos presupuestales"
			);
		}
	},

	// Guardar representante
	async guardarRepresentante(data: GuardarRepresentanteRequest): Promise<void> {

		const response = await authorizedFetch(
			`/ControladorRequisicion/GuardarRepresentante`,
			{
				method: 'POST',
				body: JSON.stringify(data),
			}
		);

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(
				errorData?.mensaje || 'Error al guardar representante'
			);
		}
	},

	// Guardar administrador del contrato
	async guardarAdministradorContrato(
		data: GuardarAdministradorContratoRequest
	): Promise<void> {

		const response = await authorizedFetch(
			`/ControladorRequisicion/GuardarAdministradorContrato`,
			{
				method: 'POST',
				body: JSON.stringify(data),
			}
		);

		if (!response.ok) {
			const errorData = await response.json();

			throw new Error(
				errorData?.mensaje ||
				'Error al guardar administrador del contrato'
			);
		}
	},

	// Obtener información completa de bienes para documento
	async obtenerInformacionBienesDocumento(idRequisicion: number): Promise<RequisicionBienDocumento> {

		const response = await authorizedFetch(
			`/ControladorRequisicion/ObtenerDocumentoBienes?idRequisicion=${idRequisicion}`,
			{
				method: "GET",
			}
		);

		if (!response.ok) {
			const errorData = await response.json();

			throw new Error(
				errorData?.mensaje || "Error al obtener la información del documento"
			);
		}

		const result = await response.json();
		return result.data;
	},

	// obtenerDocumentoServicios
	async obtenerDocumentoServicios(idRequisicion: number): Promise<RequisicionBienDocumento> {

		const response = await authorizedFetch(
			`/ControladorRequisicion/ObtenerDocumentoServicios?idRequisicion=${idRequisicion}`,
			{
				method: "GET",
			}
		);

		if (!response.ok) {
			const errorData = await response.json();

			throw new Error(
				errorData?.mensaje || "Error al obtener la información del documento"
			);
		}

		const result = await response.json();

		return result.data;
	},

	async guardarDatosAdministrativosBien(data: DatosAdministrativosBienDTO) {
		const response = await authorizedFetch(
			`/ControladorRequisicion/GuardarDatosAdministrativosBien`,
			{
				method: "POST",
				body: JSON.stringify(data),
			}
		);

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(
				errorData?.mensaje || "Error al guardar los datos administrativos del bien"
			);
		}

		const result = await response.json();
		return result.data;
	},

	async obtenerReporteRequisiciones(params: {
		fechaInicio: string;
		fechaFin: string;
		tipoMonto?: string;
		tipoObjeto?: string;
		unidadSolicitante?: string;
	}): Promise<RequisicionView[]> {
		const query = new URLSearchParams();

		query.append('FechaInicio', params.fechaInicio);
		query.append('FechaFin', params.fechaFin);

		if (params.tipoMonto != null) {
			const tipoMonto =
				params.tipoMonto === 'MAYOR'
					? 1
					: params.tipoMonto === 'MENOR'
						? 2
						: params.tipoMonto;

			query.append('tipoMonto', String(tipoMonto));
		}
		if (params.tipoObjeto != null) {
			const tipoObjeto =
				params.tipoObjeto === 'BIEN'
					? 1
					: params.tipoObjeto === 'SERVICIO'
						? 2
						: params.tipoObjeto;

			query.append('tipoObjeto', String(tipoObjeto));
		}
		if (params.unidadSolicitante != null) {
			query.append('unidadSolicitante', params.unidadSolicitante);
		}

		const response = await authorizedFetch(
			`/ControladorRequisicion/ObtenerReporteRequisiciones?${query.toString()}`,
			{
				method: 'GET',
			}
		);

		if (!response.ok) {
			await handleApiError(response, 'Error al obtener el reporte de requisiciones');
		}

		const data = await response.json();
		const requisiciones: Requisicion[] = data.dataList || data.data || [];

		return requisiciones
			.filter((item) => item && typeof item === 'object' && item.id)
			.map(mapRequisicionToView);
	},

	async obtenerIndicadoresSolicitante(tipoObjeto: number): Promise<IndicadoresSolicitante> {
		const idUsuario = getUsuarioId();

		const response = await authorizedFetch(
			`/ControladorRequisicion/ObtenerIndicadoresSolicitante?idUsuario=${idUsuario}&tipoObjeto=${tipoObjeto}`,
			{
				method: 'GET',
			}
		);

		if (!response.ok) {
			await handleApiError(response, 'Error al obtener indicadores del solicitante');
		}

		const result = await response.json();

		return result.data as IndicadoresSolicitante;
	},

};
