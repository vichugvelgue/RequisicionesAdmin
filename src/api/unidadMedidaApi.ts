import { authorizedFetch } from "./httpClient";

export interface UnidadMedida {
	id: number;
	nombre: string;
	estado: number;
	fechaRegistro?: string;
	fechaModificacion?: string;
}

export interface UnidadMedidaView {
	id: number;
	nombre: string;
	estatus: string;
}

export interface CreateUnidadMedidaRequest {
	nombre: string;
}

export interface UpdateUnidadMedidaRequest {
	id: number;
	nombre: string;
}

const mapUnidadMedidaToView = (item: UnidadMedida): UnidadMedidaView => ({
	id: item.id,
	nombre: item.nombre || "",
	estatus: item.estado === 1 ? "ACTIVO" : "INACTIVO",
});

export const unidadMedidaApi = {
	async listar(): Promise<UnidadMedidaView[]> {
		const response = await authorizedFetch("/ControladorUnidadMedida/ListarUnidadMedida", {
			method: "GET",
		});

		if (!response.ok) {
			throw new Error(`Error al listar unidad de medida: ${response.statusText}`);
		}

		const data = await response.json();
		const items: UnidadMedida[] = data.dataList || [];
		return items.filter(Boolean).map(mapUnidadMedidaToView);
	},

	async obtenerPorId(id: number): Promise<UnidadMedidaView> {
		const response = await authorizedFetch(
			`/ControladorUnidadMedida/ObtenerUnidadMedidaPorID?id=${id}`,
			{ method: "GET" }
		);

		if (!response.ok) {
			throw new Error(`Error al obtener unidad de medida: ${response.statusText}`);
		}

		const data = await response.json();
		const item: UnidadMedida = data.data || data;
		return mapUnidadMedidaToView(item);
	},

	async crear(request: CreateUnidadMedidaRequest): Promise<UnidadMedidaView> {
		const response = await authorizedFetch("/ControladorUnidadMedida/CrearUnidadMedida", {
			method: "PUT",
			body: JSON.stringify({ nombre: request.nombre }),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData?.mensaje || `Error al crear unidad de medida: ${response.statusText}`);
		}

		const data = await response.json();
		const item: UnidadMedida = data.data || data;
		return mapUnidadMedidaToView(item);
	},

	async actualizar(request: UpdateUnidadMedidaRequest): Promise<UnidadMedidaView> {
		const response = await authorizedFetch("/ControladorUnidadMedida/ActualizarUnidadMedida", {
			method: "POST",
			body: JSON.stringify({ id: request.id, nombre: request.nombre }),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData?.mensaje || `Error al actualizar unidad de medida: ${response.statusText}`);
		}

		const data = await response.json();
		const item: UnidadMedida = data.data || data;
		return mapUnidadMedidaToView(item);
	},

	async eliminar(id: number): Promise<void> {
		const response = await authorizedFetch(
			`/ControladorUnidadMedida/DarDebajaUnidadMedida?id=${id}`,
			{ method: "DELETE" }
		);

		if (!response.ok) {
			throw new Error(`Error al dar de baja unidad de medida: ${response.statusText}`);
		}
	},
};
