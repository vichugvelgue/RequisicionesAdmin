import { authorizedFetch } from "./httpClient";

export interface NotificacionView {
	comentario: string;
	fechaRegistro?: string;
}

export const notificacionesApi = {
	async listar(idUsuario: number): Promise<NotificacionView[]> {
		const response = await authorizedFetch(`/ControladorNotificaciones/listarPorUsuario/${idUsuario}`, {
			method: 'GET',
		});

		if (!response.ok) {
			throw new Error(`Error al listar notificaciones: ${response.statusText}`);
		}

		const data = await response.json();
		const items: NotificacionView[] = data.dataList || [];
		return items.filter(Boolean);
	},
};
