import type { AuthSession } from '../auth/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5214';

// Types
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

// Utility to get auth token
const getAuthToken = (): string | null => {
	try {
		const session: AuthSession | null = JSON.parse(
			localStorage.getItem('requisiciones_admin_auth_v1') || 'null'
		);
		return session?.accessToken || null;
	} catch {
		return null;
	}
};

// Utility functions
const mapActividadToView = (actividad: Actividad): ActividadView => ({
	id: actividad.id,
	nombre: actividad.nombre,
	estatus: actividad.estado === 1 ? 'ACTIVO' : 'INACTIVO',
});

const mapViewToActividad = (view: ActividadView): Actividad => ({
	id: view.id,
	nombre: view.nombre,
	estado: view.estatus === 'ACTIVO' ? 1 : 0,
	fechaRegistro: '', // No tenemos esta info en la vista
	fechaModificacion: '',
});

// API functions
export const actividadApi = {
	// GET /ControladorActividad/ListarActividad
	async listar(): Promise<ActividadView[]> {
		const token = getAuthToken();
		const response = await fetch(`${API_BASE_URL}/ControladorActividad/ListarActividad`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		});

		if (!response.ok) {
			throw new Error(`Error al listar actividades: ${response.statusText}`);
		}

		const data = await response.json();		
		// API returns { dataList: Actividad[] }
		const actividades: Actividad[] = data.dataList || [];		
		const mapped = actividades
			.filter((item) => item && typeof item === "object" && item.id && item.nombre)
			.map(mapActividadToView);		
		return mapped;
	},

	// GET /ControladorActividad/ObtenerActividadPorID?id={id}
	async obtenerPorId(id: number): Promise<Actividad> {
		const token = getAuthToken();
		const response = await fetch(`${API_BASE_URL}/ControladorActividad/ObtenerActividadPorID?id=${id}`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		});

		if (!response.ok) {
			throw new Error(`Error al obtener actividad: ${response.statusText}`);
		}

		const data = await response.json();
		return data.data || data;
	},

	// PUT /ControladorActividad/CrearActividad
	async crear(request: CreateActividadRequest): Promise<ActividadView> {
		const token = getAuthToken();
		const response = await fetch(`${API_BASE_URL}/ControladorActividad/CrearActividad`, {
			method: 'PUT',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(request),
		});

			if (!response.ok) {
            const errorData = await response.json();
            console.log("Error response:", errorData);
            console.log("errorData.mensaje:", errorData?.mensaje);
            throw new Error(
                errorData?.mensaje 
            );
        }


		const data = await response.json();
		const actividad: Actividad = data.data || data;
		return mapActividadToView(actividad);
	},

	// POST /ControladorActividad/ActualizarActividad
	async actualizar(request: UpdateActividadRequest): Promise<ActividadView> {
		const token = getAuthToken();		
		const response = await fetch(`${API_BASE_URL}/ControladorActividad/ActualizarActividad`, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(request),
		});

		if (!response.ok) {
			const errorData = await response.json();            
            throw new Error(
                errorData?.mensaje 
            );
		}

		const data = await response.json();		
		console.log("Respuesta actualizar actividad:", data);
		const actividad: Actividad = data.data || data;
		const mapped = mapActividadToView(actividad);		
		return mapped;
	},

	// DELETE /ControladorActividad/EliminarActividad
	async eliminar(id: number): Promise<void> {
		const token = getAuthToken();
		const response = await fetch(`${API_BASE_URL}/ControladorActividad/DarDebajaActividad?id=${id}`, {
			method: 'DELETE',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		});

		if (!response.ok) {
			throw new Error(`Error al eliminar actividad: ${response.statusText}`);
		}
	},
};