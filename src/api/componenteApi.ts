import type { AuthSession } from '../auth/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5214';

// Types
export interface Componente {
	id: number;
	nombre: string;
	estado: number;
	fechaRegistro: string;
	fechaModificacion: string;
}

export interface ComponenteView {
	id: number;
	nombre: string;
	estatus: string;
}

export interface CreateComponenteRequest {
	nombre: string;
}

export interface UpdateComponenteRequest {
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
const mapComponenteToView = (componente: Componente): ComponenteView => {
	if (!componente || typeof componente !== 'object') {
		throw new Error('Datos de componente inválidos');
	}
	return {
		id: componente.id,
		nombre: componente.nombre,
		estatus: componente.estado === 1 ? 'ACTIVO' : 'INACTIVO',
	};
};

const mapViewToComponente = (view: ComponenteView): Componente => ({
	id: view.id,
	nombre: view.nombre,
	estado: view.estatus === 'ACTIVO' ? 1 : 0,
	fechaRegistro: '', // No tenemos esta info en la vista
	fechaModificacion: '',
});

// API functions
export const componenteApi = {
	// GET /ControladorComponente/ListarComponente
	async listar(): Promise<ComponenteView[]> {
		const token = getAuthToken();
		const response = await fetch(`${API_BASE_URL}/ControladorComponente/ListarComponente`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		});

		if (!response.ok) {
			throw new Error(`Error al listar componentes: ${response.statusText}`);
		}

		const data = await response.json();
		// API returns { dataList: Componente[] }
		const componentes: Componente[] = data.dataList || [];
		const mapped = componentes
			.filter((item) => item && typeof item === "object" && item.id && item.nombre)
			.map(mapComponenteToView);
		return mapped;
	},

	// GET /ControladorComponente/ObtenerComponentePorID?id={id}
	async obtenerPorId(id: number): Promise<Componente> {
		const token = getAuthToken();
		const response = await fetch(`${API_BASE_URL}/ControladorComponente/ObtenerComponentePorID?id=${id}`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		});

		if (!response.ok) {
			throw new Error(`Error al obtener componente: ${response.statusText}`);
		}

		const data = await response.json();
		return data.data || data;
	},

	// PUT /ControladorComponente/CrearComponente
	async crear(request: CreateComponenteRequest): Promise<ComponenteView> {
		const token = getAuthToken();
		const response = await fetch(`${API_BASE_URL}/ControladorComponente/CrearComponente`, {
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
			throw new Error(
				errorData?.mensaje
			);
		}

		const data = await response.json();
		console.log("Respuesta crear componente:", data);
		const componente: Componente = data.data || data;
		console.log("Componente mapeado:", componente);
		
		if (!componente || typeof componente !== 'object') {
			throw new Error('Respuesta del servidor inválida: estructura no esperada');
		}
		
		return mapComponenteToView(componente);
	},

	// POST /ControladorComponente/ActualizarComponente
	async actualizar(request: UpdateComponenteRequest): Promise<ComponenteView> {
		const token = getAuthToken();
		const response = await fetch(`${API_BASE_URL}/ControladorComponente/ActualizarComponente`, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(request),
		});

		if (!response.ok) {            
			const errorData = await response.json();
            console.log("Error response:", errorData);
			throw new Error(
				errorData?.mensaje
			);
		}

		const data = await response.json();
		console.log("Respuesta actualizar componente:", data);
		const componente: Componente = data.data || data;
		console.log("Componente mapeado:", componente);
		
		if (!componente || typeof componente !== 'object') {
			throw new Error('Respuesta del servidor inválida: estructura no esperada');
		}
		
		const mapped = mapComponenteToView(componente);
		console.log("ComponenteView mapeada:", mapped);
		return mapped;
	},

	// DELETE /ControladorComponente/DarDebajaComponente
	async eliminar(id: number): Promise<void> {
		const token = getAuthToken();
		const response = await fetch(`${API_BASE_URL}/ControladorComponente/DarDebajaComponente?id=${id}`, {
			method: 'DELETE',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		});

		if (!response.ok) {
			throw new Error(`Error al eliminar componente: ${response.statusText}`);
		}
	},
};