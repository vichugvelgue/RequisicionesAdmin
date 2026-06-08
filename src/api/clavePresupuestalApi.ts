import { authorizedFetch } from "./httpClient";

export interface ClavePresupuestal {
	id: number;
	nombre: string;
	estado: number;
	fechaRegistro?: string;
	fechaModificacion?: string;
}

export interface ClavePresupuestalView {
	id: number;
	nombre: string;
	estatus: string;
}

export interface CreateClavePresupuestalRequest {
	nombre: string;
}

export interface UpdateClavePresupuestalRequest {
	id: number;
	nombre: string;
}

const mapClavePresupuestalToView = (item: ClavePresupuestal): ClavePresupuestalView => ({
	id: item.id,
	nombre: item.nombre || '',
	estatus: item.estado === 1 ? 'ACTIVO' : 'INACTIVO',
});

export const clavePresupuestalApi = {
	async listar(): Promise<ClavePresupuestalView[]> {
		const response = await authorizedFetch("/ControladorClavePresupuestal/ListarClavePresupuestal", {
			method: 'GET',
		});

		if (!response.ok) {
			throw new Error(`Error al listar claves presupuestales: ${response.statusText}`);
		}

		const data = await response.json();
		const items: ClavePresupuestal[] = data.dataList || [];
		return items.filter(Boolean).map(mapClavePresupuestalToView);
	},

	async obtenerPorId(id: number): Promise<ClavePresupuestalView> {
		const response = await authorizedFetch(`/ControladorClavePresupuestal/ObtenerClavePresupuestalPorID?id=${id}`, {
			method: 'GET',
		});

		if (!response.ok) {
			throw new Error(`Error al obtener clave presupuestal: ${response.statusText}`);
		}

		const data = await response.json();
		const item: ClavePresupuestal = data.data || data;
		return mapClavePresupuestalToView(item);
	},

	async crear(request: CreateClavePresupuestalRequest): Promise<ClavePresupuestalView> {
		const response = await authorizedFetch("/ControladorClavePresupuestal/CrearClavePresupuestal", {
			method: 'PUT',
			body: JSON.stringify({ nombre: request.nombre }),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData?.mensaje || `Error al crear clave presupuestal: ${response.statusText}`);
		}

		const data = await response.json();
		const item: ClavePresupuestal = data.data || data;
		return mapClavePresupuestalToView(item);
	},

	async actualizar(request: UpdateClavePresupuestalRequest): Promise<ClavePresupuestalView> {
		const response = await authorizedFetch("/ControladorClavePresupuestal/ActualizarClavePresupuestal", {
			method: 'POST',
			body: JSON.stringify({ id: request.id, nombre: request.nombre }),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData?.mensaje || `Error al actualizar clave presupuestal: ${response.statusText}`);
		}

		const data = await response.json();
		const item: ClavePresupuestal = data.data || data;
		return mapClavePresupuestalToView(item);
	},

	async eliminar(id: number): Promise<void> {
		const response = await authorizedFetch(`/ControladorClavePresupuestal/DarDebajaClavePresupuestal?id=${id}`, {
			method: 'DELETE',
		});

		if (!response.ok) {
			throw new Error(`Error al dar de baja clave presupuestal: ${response.statusText}`);
		}
	},
};
