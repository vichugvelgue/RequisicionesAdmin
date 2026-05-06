import type { AuthSession } from "../auth/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5214";

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

const mapTipoProgramaToView = (item: TipoPrograma): TipoProgramaView => ({
	id: item.id,
	nombre: item.nombre || "",
	estatus: item.estado === 1 ? "ACTIVO" : "INACTIVO",
});

export const tipoProgramaApi = {
	async listar(): Promise<TipoProgramaView[]> {
		const token = getAuthToken();

		const response = await fetch(`${API_BASE_URL}/ControladorTipoPrograma/ListarTipoPrograma`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error(`Error al listar tipo de programa: ${response.statusText}`);
		}

		const data = await response.json();
		const items: TipoPrograma[] = data.dataList || [];
		return items.filter(Boolean).map(mapTipoProgramaToView);
	},

	async obtenerPorId(id: number): Promise<TipoProgramaView> {
		const token = getAuthToken();

		const response = await fetch(
			`${API_BASE_URL}/ControladorTipoPrograma/ObtenerTipoProgramaPorID?id=${id}`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			}
		);

		if (!response.ok) {
			throw new Error(`Error al obtener tipo de programa: ${response.statusText}`);
		}

		const data = await response.json();
		const item: TipoPrograma = data.data || data;
		return mapTipoProgramaToView(item);
	},

	async crear(request: CreateTipoProgramaRequest): Promise<TipoProgramaView> {
		const token = getAuthToken();

		const response = await fetch(`${API_BASE_URL}/ControladorTipoPrograma/CrearTipoPrograma`, {
			method: "PUT",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
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
		const token = getAuthToken();

		const response = await fetch(`${API_BASE_URL}/ControladorTipoPrograma/ActualizarTipoPrograma`, {
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
			throw new Error(errorData?.mensaje || `Error al actualizar tipo de programa: ${response.statusText}`);
		}

		const data = await response.json();
		const item: TipoPrograma = data.data || data;
		return mapTipoProgramaToView(item);
	},

	async eliminar(id: number): Promise<void> {
		const token = getAuthToken();

		const response = await fetch(
			`${API_BASE_URL}/ControladorTipoPrograma/DarDebajaTipoPrograma?id=${id}`,
			{
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			}
		);

		if (!response.ok) {
			throw new Error(`Error al dar de baja tipo de programa: ${response.statusText}`);
		}
	},
};