import { authorizedFetch } from "./httpClient";

export interface Actividad {
	id: number;
	nombre: string;
	estado: number;
	fechaRegistro: string;
	fechaModificacion: string;
}

export interface ActividadView {
	id: number;
	nombre: string;
	estatus: string;
}

export interface CreateActividadRequest {
	nombre: string;
}

export interface UpdateActividadRequest {
	id: number;
	nombre: string;
}

const mapActividadToView = (actividad: Actividad): ActividadView => ({
	id: actividad.id,
	nombre: actividad.nombre,
	estatus: actividad.estado === 1 ? 'ACTIVO' : 'INACTIVO',
});

const mapViewToActividad = (view: ActividadView): Actividad => ({
	id: view.id,
	nombre: view.nombre,
	estado: view.estatus === 'ACTIVO' ? 1 : 0,
	fechaRegistro: '',
	fechaModificacion: '',
});

export const actividadApi = {
	async listar(): Promise<ActividadView[]> {
		const response = await authorizedFetch("/ControladorActividad/ListarActividad", {
			method: 'GET',
		});

		if (!response.ok) {
			throw new Error(`Error al listar actividades: ${response.statusText}`);
		}

		const data = await response.json();
		const actividades: Actividad[] = data.dataList || [];
		const mapped = actividades
			.filter((item) => item && typeof item === "object" && item.id && item.nombre)
			.map(mapActividadToView);
		return mapped;
	},

	async obtenerPorId(id: number): Promise<Actividad> {
		const response = await authorizedFetch(`/ControladorActividad/ObtenerActividadPorID?id=${id}`, {
			method: 'GET',
		});

		if (!response.ok) {
			throw new Error(`Error al obtener actividad: ${response.statusText}`);
		}

		const data = await response.json();
		return data.data || data;
	},

	async crear(request: CreateActividadRequest): Promise<ActividadView> {
		const response = await authorizedFetch("/ControladorActividad/CrearActividad", {
			method: 'PUT',
			body: JSON.stringify(request),
		});

		if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.mensaje);
        }

		const data = await response.json();
		const actividad: Actividad = data.data || data;
		return mapActividadToView(actividad);
	},

	async actualizar(request: UpdateActividadRequest): Promise<ActividadView> {
		const response = await authorizedFetch("/ControladorActividad/ActualizarActividad", {
			method: 'POST',
			body: JSON.stringify(request),
		});

		if (!response.ok) {
			const errorData = await response.json();
            throw new Error(errorData?.mensaje);
		}

		const data = await response.json();
		const actividad: Actividad = data.data || data;
		const mapped = mapActividadToView(actividad);
		return mapped;
	},

	async eliminar(id: number): Promise<void> {
		const response = await authorizedFetch(`/ControladorActividad/DarDebajaActividad?id=${id}`, {
			method: 'DELETE',
		});

		if (!response.ok) {
			throw new Error(`Error al eliminar actividad: ${response.statusText}`);
		}
	},
};
