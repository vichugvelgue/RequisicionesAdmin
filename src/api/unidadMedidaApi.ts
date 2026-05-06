import type { AuthSession } from "../auth/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5214";

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

const getAuthToken = (): string | null => {
	try {
		const session: AuthSession | null = JSON.parse(
			localStorage.getItem("requisiciones_admin_auth_v1") || "null"
		);
		return session?.accessToken || null;
	} catch {
		return null;
	}
};

const mapUnidadMedidaToView = (item: UnidadMedida): UnidadMedidaView => ({
	id: item.id,
	nombre: item.nombre || "",
	estatus: item.estado === 1 ? "ACTIVO" : "INACTIVO",
});

export const unidadMedidaApi = {
	async listar(): Promise<UnidadMedidaView[]> {
		const token = getAuthToken();

		const response = await fetch(`${API_BASE_URL}/ControladorUnidadMedida/ListarUnidadMedida`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error(`Error al listar unidad de medida: ${response.statusText}`);
		}

		const data = await response.json();
		const items: UnidadMedida[] = data.dataList || [];
		return items.filter(Boolean).map(mapUnidadMedidaToView);
	},

	async obtenerPorId(id: number): Promise<UnidadMedidaView> {
		const token = getAuthToken();

		const response = await fetch(
			`${API_BASE_URL}/ControladorUnidadMedida/ObtenerUnidadMedidaPorID?id=${id}`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			}
		);

		if (!response.ok) {
			throw new Error(`Error al obtener unidad de medida: ${response.statusText}`);
		}

		const data = await response.json();
		const item: UnidadMedida = data.data || data;
		return mapUnidadMedidaToView(item);
	},

	async crear(request: CreateUnidadMedidaRequest): Promise<UnidadMedidaView> {
		const token = getAuthToken();

		const response = await fetch(`${API_BASE_URL}/ControladorUnidadMedida/CrearUnidadMedida`, {
			method: "PUT",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
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
		const token = getAuthToken();

		const response = await fetch(`${API_BASE_URL}/ControladorUnidadMedida/ActualizarUnidadMedida`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				id: request.id,
				nombre: request.nombre,
			}),
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
		const token = getAuthToken();

		const response = await fetch(
			`${API_BASE_URL}/ControladorUnidadMedida/DarDebajaUnidadMedida?id=${id}`,
			{
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			}
		);

		if (!response.ok) {
			throw new Error(`Error al dar de baja unidad de medida: ${response.statusText}`);
		}
	},
};