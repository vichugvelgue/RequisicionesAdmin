import type { AuthSession } from '../auth/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5214';

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

export interface NotificacionView {
	comentario: string;
	fechaRegistro?: string;
}

export const notificacionesApi = {
	async listar(idUsuario: number): Promise<NotificacionView[]> {
		const token = getAuthToken();

		const response = await fetch(`${API_BASE_URL}/ControladorNotificaciones/listarPorUsuario/${idUsuario}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		});

		if (!response.ok) {
			throw new Error(`Error al listar notificaciones: ${response.statusText}`);
		}

		const data = await response.json();
		const items: NotificacionView[] = data.dataList || [];
		return items.filter(Boolean);
	},
};