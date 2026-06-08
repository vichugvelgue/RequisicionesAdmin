import { authorizedFetch } from "./httpClient";

export interface TipoPrograma {
	id: number;
	nombre: string;
	estado: number;
}

export interface TipoProgramaView {
	id: number;
	nombre: string;
	estatus: string;
}

export interface CreateTipoProgramaRequest {
	nombre: string;
}

export interface UpdateTipoProgramaRequest {
	id: number;
	nombre: string;
}

const mapTipoProgramaToView = (item: TipoPrograma): TipoProgramaView => ({
	id: item.id,
	nombre: item.nombre || "",
	estatus: item.estado === 1 ? "ACTIVO" : "INACTIVO",
});

export const tipoProgramaApi = {
	async listar(): Promise<TipoProgramaView[]> {
		const response = await authorizedFetch("/ControladorTipoPrograma/ListarTipoPrograma", {
			method: "GET",
		});

		if (!response.ok) {
			throw new Error(`Error al listar tipo de programa: ${response.statusText}`);
		}

		const data = await response.json();
		const items: TipoPrograma[] = data.dataList || [];
		return items.filter(Boolean).map(mapTipoProgramaToView);
	},

	async obtenerPorId(id: number): Promise<TipoProgramaView> {
		const response = await authorizedFetch(
			`/ControladorTipoPrograma/ObtenerTipoProgramaPorID?id=${id}`,
			{ method: "GET" }
		);

		if (!response.ok) {
			throw new Error(`Error al obtener tipo de programa: ${response.statusText}`);
		}

		const data = await response.json();
		const item: TipoPrograma = data.data || data;
		return mapTipoProgramaToView(item);
	},

	async crear(request: CreateTipoProgramaRequest): Promise<TipoProgramaView> {
		const response = await authorizedFetch("/ControladorTipoPrograma/CrearTipoPrograma", {
			method: "PUT",
			body: JSON.stringify({ nombre: request.nombre }),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData?.mensaje || `Error al crear tipo de programa: ${response.statusText}`);
		}

		const data = await response.json();
		const item: TipoPrograma = data.data || data;
		return mapTipoProgramaToView(item);
	},

	async actualizar(request: UpdateTipoProgramaRequest): Promise<TipoProgramaView> {
		const response = await authorizedFetch("/ControladorTipoPrograma/ActualizarTipoPrograma", {
			method: "POST",
			body: JSON.stringify({ id: request.id, nombre: request.nombre }),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData?.mensaje || `Error al actualizar tipo de programa: ${response.statusText}`);
		}

		const data = await response.json();
		const item: TipoPrograma = data.data || data;
		return mapTipoProgramaToView(item);
	},

	async eliminar(id: number): Promise<void> {
		const response = await authorizedFetch(
			`/ControladorTipoPrograma/DarDebajaTipoPrograma?id=${id}`,
			{ method: "DELETE" }
		);

		if (!response.ok) {
			throw new Error(`Error al dar de baja tipo de programa: ${response.statusText}`);
		}
	},
};
