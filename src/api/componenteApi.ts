import { authorizedFetch } from "./httpClient";

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
	fechaRegistro: '',
	fechaModificacion: '',
});

export const componenteApi = {
	async listar(): Promise<ComponenteView[]> {
		const response = await authorizedFetch("/ControladorComponente/ListarComponente", {
			method: 'GET',
		});

		if (!response.ok) {
			throw new Error(`Error al listar componentes: ${response.statusText}`);
		}

		const data = await response.json();
		const componentes: Componente[] = data.dataList || [];
		const mapped = componentes
			.filter((item) => item && typeof item === "object" && item.id && item.nombre)
			.map(mapComponenteToView);
		return mapped;
	},

	async obtenerPorId(id: number): Promise<Componente> {
		const response = await authorizedFetch(`/ControladorComponente/ObtenerComponentePorID?id=${id}`, {
			method: 'GET',
		});

		if (!response.ok) {
			throw new Error(`Error al obtener componente: ${response.statusText}`);
		}

		const data = await response.json();
		return data.data || data;
	},

	async crear(request: CreateComponenteRequest): Promise<ComponenteView> {
		const response = await authorizedFetch("/ControladorComponente/CrearComponente", {
			method: 'PUT',
			body: JSON.stringify(request),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData?.mensaje);
		}

		const data = await response.json();
		const componente: Componente = data.data || data;

		if (!componente || typeof componente !== 'object') {
			throw new Error('Respuesta del servidor inválida: estructura no esperada');
		}

		return mapComponenteToView(componente);
	},

	async actualizar(request: UpdateComponenteRequest): Promise<ComponenteView> {
		const response = await authorizedFetch("/ControladorComponente/ActualizarComponente", {
			method: 'POST',
			body: JSON.stringify(request),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData?.mensaje);
		}

		const data = await response.json();
		const componente: Componente = data.data || data;

		if (!componente || typeof componente !== 'object') {
			throw new Error('Respuesta del servidor inválida: estructura no esperada');
		}

		return mapComponenteToView(componente);
	},

	async eliminar(id: number): Promise<void> {
		const response = await authorizedFetch(`/ControladorComponente/DarDebajaComponente?id=${id}`, {
			method: 'DELETE',
		});

		if (!response.ok) {
			throw new Error(`Error al eliminar componente: ${response.statusText}`);
		}
	},
};
