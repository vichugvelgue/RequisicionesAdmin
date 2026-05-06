import type { AuthSession } from '../auth/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5214';

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

const mapClavePresupuestalToView = (item: ClavePresupuestal): ClavePresupuestalView => ({
	id: item.id,
	nombre: item.nombre || '',
	estatus: item.estado === 1 ? 'ACTIVO' : 'INACTIVO',
});

export const clavePresupuestalApi = {
	async listar(): Promise<ClavePresupuestalView[]> {
		const token = getAuthToken();
		const response = await fetch(`${API_BASE_URL}/ControladorClavePresupuestal/ListarClavePresupuestal`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		});

		if (!response.ok) {
			throw new Error(`Error al listar claves presupuestales: ${response.statusText}`);
		}

		const data = await response.json();        
		const items: ClavePresupuestal[] = data.dataList || [];
		return items.filter(Boolean).map(mapClavePresupuestalToView);
	},

	async obtenerPorId(id: number): Promise<ClavePresupuestalView> {
		const token = getAuthToken();
		const response = await fetch(`${API_BASE_URL}/ControladorClavePresupuestal/ObtenerClavePresupuestalPorID?id=${id}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		});

		if (!response.ok) {
			throw new Error(`Error al obtener clave presupuestal: ${response.statusText}`);
		}

		const data = await response.json();
		const item: ClavePresupuestal = data.data || data;
		return mapClavePresupuestalToView(item);
	},

	async crear(request: CreateClavePresupuestalRequest): Promise<ClavePresupuestalView> {
		const token = getAuthToken();
		const response = await fetch(`${API_BASE_URL}/ControladorClavePresupuestal/CrearClavePresupuestal`, {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
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
		const token = getAuthToken();
		const response = await fetch(`${API_BASE_URL}/ControladorClavePresupuestal/ActualizarClavePresupuestal`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
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
		const token = getAuthToken();
		const response = await fetch(`${API_BASE_URL}/ControladorClavePresupuestal/DarDebajaClavePresupuestal?id=${id}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		});

		if (!response.ok) {
			throw new Error(`Error al dar de baja clave presupuestal: ${response.statusText}`);
		}
	},
};
