import { authorizedFetch } from "./httpClient";

export interface OrigenRecurso {
	id: number;
	nombre: string;
	estado: number;
	fechaRegistro?: string;
	fechaModificacion?: string;
}

export interface OrigenRecursoView {
	id: number;
	nombre: string;
	estatus: string;
}

export interface CreateOrigenRecursoRequest {
	nombre: string;
}

export interface UpdateOrigenRecursoRequest {
	id: number;
	nombre: string;
}

const mapOrigenRecursoToView = (item: OrigenRecurso): OrigenRecursoView => ({
	id: item.id,
	nombre: item.nombre || '',
	estatus: item.estado === 1 ? 'ACTIVO' : 'INACTIVO',
});

export const origenRecursoApi = {
	async listar(): Promise<OrigenRecursoView[]> {
		const response = await authorizedFetch("/ControladorOrigenRecurso/ListarOrigenRecurso", {
			method: 'GET',
		});

		if (!response.ok) {
			throw new Error(`Error al listar origen de recurso: ${response.statusText}`);
		}

		const data = await response.json();
		const items: OrigenRecurso[] = data.dataList || [];
		return items.filter(Boolean).map(mapOrigenRecursoToView);
	},

	async crear(request: CreateOrigenRecursoRequest): Promise<OrigenRecursoView> {
		const response = await authorizedFetch("/ControladorOrigenRecurso/CrearOrigenRecurso", {
			method: 'PUT',
			body: JSON.stringify({ nombre: request.nombre }),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData?.mensaje || `Error al crear origen de recurso: ${response.statusText}`);
		}

		const data = await response.json();
		const item: OrigenRecurso = data.data || data;
		return mapOrigenRecursoToView(item);
	},

	async actualizar(request: UpdateOrigenRecursoRequest): Promise<OrigenRecursoView> {
		const response = await authorizedFetch("/ControladorOrigenRecurso/ActualizarOrigenRecurso", {
			method: 'POST',
			body: JSON.stringify({ id: request.id, nombre: request.nombre }),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData?.mensaje || `Error al actualizar origen de recurso: ${response.statusText}`);
		}

		const data = await response.json();
		const item: OrigenRecurso = data.data || data;
		return mapOrigenRecursoToView(item);
	},

	async eliminar(id: number): Promise<void> {
		const response = await authorizedFetch(`/ControladorOrigenRecurso/DarDebajaOrigenRecurso?id=${id}`, {
			method: 'DELETE',
		});

		if (!response.ok) {
			throw new Error(`Error al dar de baja origen de recurso: ${response.statusText}`);
		}
	},
};
