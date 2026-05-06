import type { AuthSession } from "../auth/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5214";

export interface Requisicion {
	id: number;
	folio?: string;
	tipoRequisicion?: string;
	tipoObjetoRequisicion?: string;
	tipoMontoRequisicion?: string;
	estatusRequisicion?: string;
	fechaRegistro?: string;
	fechaModificacion?: string;
	idUsuario?: number;
}

export interface RequisicionView {
	id: number;
	folio: string;
	tipoRequisicion: string;
	tipoObjetoRequisicion: string;
	tipoMontoRequisicion: string;
    monto?: number;
    solicitante?: string;    
	estatus: string;
	fechaRegistro: string;
	idUsuario?: number;
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

const getUsuarioId = (): number => {
	try {
		const session = JSON.parse(
			localStorage.getItem('requisiciones_admin_auth_v1') || 'null'
		);
		return Number(session?.usuario?.id ?? 0);
	} catch {
		return 0;
	}
};

const mapRequisicionToView = (item: Requisicion): RequisicionView => ({
	id: item.id,
	folio: item.folio ?? "",
	tipoRequisicion: item.tipoRequisicion ?? "",
	tipoObjetoRequisicion: item.tipoObjetoRequisicion ?? "",
	tipoMontoRequisicion: item.tipoMontoRequisicion ?? "",
	estatus: item.estatusRequisicion ?? "",
	fechaRegistro: item.fechaRegistro ?? "",
	idUsuario: item.idUsuario,
});

const handleApiError = async (response: Response, fallback: string): Promise<never> => {
	try {
		const data = await response.json();
		throw new Error(data?.mensaje || fallback);
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
		throw new Error(fallback);
	}
};

export const requisicionApi = {
	// GET /ControladorRequisicion/ListarPorSolicitante/{idUsuario}
	async listarPorSolicitante(): Promise<RequisicionView[]> {
		const token = getAuthToken();
        const idUsuario = getUsuarioId();

		const response = await fetch(
			`${API_BASE_URL}/ControladorRequisicion/ListarPorSolicitante/${idUsuario}`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			}
		);

		if (!response.ok) {
			await handleApiError(response, "Error al listar requisiciones por solicitante");
		}

		const data = await response.json();

		const requisiciones: Requisicion[] = data.dataList || [];

		return requisiciones
			.filter((item) => item && typeof item === "object" && item.id)
			.map(mapRequisicionToView);
	},
};