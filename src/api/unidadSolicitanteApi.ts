import type { AuthSession } from "../auth/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5214";

export interface UnidadSolicitante {
	id: number;
	nombre: string;
	estado: number;
	fechaRegistro?: string;
	fechaModificacion?: string;
}

export interface UnidadSolicitanteView {
	id: number;
	nombre: string;
	estatus: string;
}

export interface CreateUnidadSolicitanteRequest {
	nombre: string;
}

export interface UpdateUnidadSolicitanteRequest {
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

const mapUnidadSolicitanteToView = (item: UnidadSolicitante): UnidadSolicitanteView => ({
	id: item.id,
	nombre: item.nombre || "",
	estatus: item.estado === 1 ? "ACTIVO" : "INACTIVO",
});

export const unidadSolicitanteApi = {
	async listar(): Promise<UnidadSolicitanteView[]> {
		const token = getAuthToken();

		const response = await fetch(
			`${API_BASE_URL}/ControladorUnidadSolicitante/ListarUnidadSolicitante`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			}
		);

		if (!response.ok) {
			throw new Error(`Error al listar unidad solicitante: ${response.statusText}`);
		}

		const data = await response.json();
		const items: UnidadSolicitante[] = data.dataList || [];
		return items.filter(Boolean).map(mapUnidadSolicitanteToView);
	},

	async obtenerPorId(id: number): Promise<UnidadSolicitanteView> {
		const token = getAuthToken();

		const response = await fetch(
			`${API_BASE_URL}/ControladorUnidadSolicitante/ObtenerUnidadSolicitantePorID?id=${id}`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			}
		);

		if (!response.ok) {
			throw new Error(`Error al obtener unidad solicitante: ${response.statusText}`);
		}

		const data = await response.json();
		const item: UnidadSolicitante = data.data || data;
		return mapUnidadSolicitanteToView(item);
	},

	async crear(request: CreateUnidadSolicitanteRequest): Promise<UnidadSolicitanteView> {
		const token = getAuthToken();

		const response = await fetch(
			`${API_BASE_URL}/ControladorUnidadSolicitante/CrearUnidadSolicitante`,
			{
				method: "PUT",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ nombre: request.nombre }),
			}
		);

		if (!response.ok) {
            const errorData = await response.json();
            console.log("Error response:", errorData);
            console.log("errorData.mensaje:", errorData?.mensaje);
            throw new Error(
                errorData?.mensaje 
            );
        }

		const data = await response.json();
		const item: UnidadSolicitante = data.data || data;
		return mapUnidadSolicitanteToView(item);
	},

	async actualizar(request: UpdateUnidadSolicitanteRequest): Promise<UnidadSolicitanteView> {
		const token = getAuthToken();

		const response = await fetch(
			`${API_BASE_URL}/ControladorUnidadSolicitante/ActualizarUnidadSolicitante`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					id: request.id,
					nombre: request.nombre,
				}),
			}
		);

		if (!response.ok) {
			const errorData = await response.json();            
            throw new Error(
                errorData?.mensaje 
            );
		}

		const data = await response.json();
		const item: UnidadSolicitante = data.data || data;
		return mapUnidadSolicitanteToView(item);
	},

	async eliminar(id: number): Promise<void> {
		const token = getAuthToken();

		const response = await fetch(
			`${API_BASE_URL}/ControladorUnidadSolicitante/DarDebajaUnidadSolicitante?id=${id}`,
			{
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			}
		);

		if (!response.ok) {
			throw new Error(`Error al dar de baja unidad solicitante: ${response.statusText}`);
		}
	},
};