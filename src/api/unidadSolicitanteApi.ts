import { authorizedFetch } from "./httpClient";

export interface UnidadSolicitante {
	id: number;
	nombre: string;
	estado: number;
	fechaRegistro?: string;
	fechaModificacion?: string;
}

export interface UnidadSolicitanteView {
	id: number;
	nombre: string;
	estatus: string;
}

export interface CreateUnidadSolicitanteRequest {
	nombre: string;
}

export interface UpdateUnidadSolicitanteRequest {
	id: number;
	nombre: string;
}

const mapUnidadSolicitanteToView = (item: UnidadSolicitante): UnidadSolicitanteView => ({
	id: item.id,
	nombre: item.nombre || "",
	estatus: item.estado === 1 ? "ACTIVO" : "INACTIVO",
});

export const unidadSolicitanteApi = {
	async listar(): Promise<UnidadSolicitanteView[]> {
		const response = await authorizedFetch(
			"/ControladorUnidadSolicitante/ListarUnidadSolicitante",
			{ method: "GET" }
		);

		if (!response.ok) {
			throw new Error(`Error al listar unidad solicitante: ${response.statusText}`);
		}

		const data = await response.json();
		const items: UnidadSolicitante[] = data.dataList || [];
		return items.filter(Boolean).map(mapUnidadSolicitanteToView);
	},

	async obtenerPorId(id: number): Promise<UnidadSolicitanteView> {
		const response = await authorizedFetch(
			`/ControladorUnidadSolicitante/ObtenerUnidadSolicitantePorID?id=${id}`,
			{ method: "GET" }
		);

		if (!response.ok) {
			throw new Error(`Error al obtener unidad solicitante: ${response.statusText}`);
		}

		const data = await response.json();
		const item: UnidadSolicitante = data.data || data;
		return mapUnidadSolicitanteToView(item);
	},

	async crear(request: CreateUnidadSolicitanteRequest): Promise<UnidadSolicitanteView> {
		const response = await authorizedFetch(
			"/ControladorUnidadSolicitante/CrearUnidadSolicitante",
			{
				method: "PUT",
				body: JSON.stringify({ nombre: request.nombre }),
			}
		);

		if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.mensaje);
        }

		const data = await response.json();
		const item: UnidadSolicitante = data.data || data;
		return mapUnidadSolicitanteToView(item);
	},

	async actualizar(request: UpdateUnidadSolicitanteRequest): Promise<UnidadSolicitanteView> {
		const response = await authorizedFetch(
			"/ControladorUnidadSolicitante/ActualizarUnidadSolicitante",
			{
				method: "POST",
				body: JSON.stringify({ id: request.id, nombre: request.nombre }),
			}
		);

		if (!response.ok) {
			const errorData = await response.json();
            throw new Error(errorData?.mensaje);
		}

		const data = await response.json();
		const item: UnidadSolicitante = data.data || data;
		return mapUnidadSolicitanteToView(item);
	},

	async eliminar(id: number): Promise<void> {
		const response = await authorizedFetch(
			`/ControladorUnidadSolicitante/DarDebajaUnidadSolicitante?id=${id}`,
			{ method: "DELETE" }
		);

		if (!response.ok) {
			throw new Error(`Error al dar de baja unidad solicitante: ${response.statusText}`);
		}
	},
};
