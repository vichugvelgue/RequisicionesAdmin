import type { AuthSession } from '../auth/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5214';

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

const mapOrigenRecursoToView = (item: OrigenRecurso): OrigenRecursoView => ({
	id: item.id,
	nombre: item.nombre || '',
	estatus: item.estado === 1 ? 'ACTIVO' : 'INACTIVO',
});

export const origenRecursoApi = {
	async listar(): Promise<OrigenRecursoView[]> {
		const token = getAuthToken();

		const response = await fetch(`${API_BASE_URL}/ControladorOrigenRecurso/ListarOrigenRecurso`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		});

		if (!response.ok) {
			throw new Error(`Error al listar origen de recurso: ${response.statusText}`);
		}

		const data = await response.json();
		const items: OrigenRecurso[] = data.dataList || [];
		return items.filter(Boolean).map(mapOrigenRecursoToView);
	},

	async crear(request: CreateOrigenRecursoRequest): Promise<OrigenRecursoView> {
		const token = getAuthToken();

		const response = await fetch(`${API_BASE_URL}/ControladorOrigenRecurso/CrearOrigenRecurso`, {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
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
		const token = getAuthToken();

		const response = await fetch(`${API_BASE_URL}/ControladorOrigenRecurso/ActualizarOrigenRecurso`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
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
		const token = getAuthToken();

		const response = await fetch(`${API_BASE_URL}/ControladorOrigenRecurso/DarDebajaOrigenRecurso?id=${id}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		});

		if (!response.ok) {
			throw new Error(`Error al dar de baja origen de recurso: ${response.statusText}`);
		}
	},
};