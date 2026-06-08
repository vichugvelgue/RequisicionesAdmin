import type { LoginCredentials, RecuperationCredentials } from '../auth/types';
import { authorizedFetch } from "./httpClient";

const TIPO_USUARIO_ID_TO_LABEL: Record<string, string> = {
	'1': 'Administrador',
	'2': 'Solicitante',
	'3': 'Revisor',
	'4': 'Autorizador',
};

// Types
export interface Usuario {
	id: number;
	nombres: string;
	nombreCompleto: string;
	apellidoPaterno: string;
	apellidoMaterno: string;
	correo: string;
	tipoUsuario?: string | number;
	idTipoUsuario?: number;
	puesto?: string;
	Puesto?: string;
	area?: string;
	Area?: string;
	estado: number;
	fechaRegistro: string;
	fechaModificacion: string;
	tipoUsuarioNavigation?: {
		id: number;
		estado: number;
		nombre: string;
		permisos: any[];
	};
}

export interface UsuarioView {
	id: string;
	nombre: string;
	nombreCompleto: string;
	correo: string;
	tipoUsuario: string;
	puesto: string;
	area: string;
}

export interface CreateUsuarioRequest {
	nombres: string;
	apellidoPaterno: string;
	apellidoMaterno: string;
	correo: string;
	contrasena: string;
	idTipoUsuario: number;
	puesto: string;
	area: string;
	generarInvitacion: boolean;
}

export interface UpdateUsuarioRequest {
	id?: number;
	nombres: string;
	apellidoPaterno: string;
	apellidoMaterno: string;
	contrasena?: string;
	correo: string;
	idTipoUsuario: number;
	puesto: string;
	area: string;
}

export interface EnviarInvitacionRequest {
	id: number;
}

const mapUsuarioToView = (usuario: Usuario): UsuarioView => {
	const rawTipoUsuario =
		usuario.tipoUsuarioNavigation?.nombre ??
		usuario.tipoUsuario ??
		usuario.idTipoUsuario ??
		"";

	const tipoUsuarioLabel =
		typeof rawTipoUsuario === "string" && TIPO_USUARIO_ID_TO_LABEL[rawTipoUsuario]
			? TIPO_USUARIO_ID_TO_LABEL[rawTipoUsuario]
			: typeof rawTipoUsuario === "number"
				? TIPO_USUARIO_ID_TO_LABEL[String(rawTipoUsuario)] ?? String(rawTipoUsuario)
				: String(rawTipoUsuario);

	return {
		id: String(usuario.id ?? ""),
		nombre: `${usuario.nombres ?? ""} ${usuario.apellidoPaterno ?? ""} ${usuario.apellidoMaterno ?? ""}`.trim(),
		nombreCompleto: usuario.nombreCompleto ?? "",
		correo: usuario.correo ?? "",
		tipoUsuario: tipoUsuarioLabel,
		puesto: usuario.puesto ?? "",
		area: usuario.area ?? "",
	};
};

// API functions
export const usuarioApi = {
	// GET /ControladorUsuarioAdministrador/ListarUsuarios
	async listar(): Promise<UsuarioView[]> {
		const response = await authorizedFetch('/ControladorUsuarioAdministrador/ListarUsuarios', {
			method: 'GET',
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData?.mensaje || `Error al listar usuarios: ${response.statusText}`);
		}

		const data = await response.json();
		// API returns { dataList: Usuario[] }
		const usuarios: Usuario[] = data.dataList || [];
		console.log('Usuarios obtenidos del API:', usuarios);
		const mapped = usuarios
			.filter((item) => item && typeof item === "object" && item.id != null)
			.map(mapUsuarioToView);
		return mapped;
	},

	// PUT /ControladorUsuarioAdministrador/CrearUsuarioAdministrador
	async crear(request: CreateUsuarioRequest): Promise<UsuarioView> {
		const response = await authorizedFetch('/ControladorUsuarioAdministrador/CrearUsuarioAdministrador', {
			method: 'PUT',
			body: JSON.stringify(request),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData?.mensaje || `Error al crear usuario: ${response.statusText}`);
		}

		const data = await response.json();
		const usuario: Usuario = data.data || data;

		if (!usuario || typeof usuario !== 'object') {
			throw new Error('Respuesta del servidor inválida: estructura no esperada');
		}
		if (request.generarInvitacion) {
			await usuarioApi.enviarInvitacion(usuario.id);
		}

		return mapUsuarioToView(usuario);
	},

	// POST /ControladorUsuarioAdministrador/ActualizarUsuario
	async actualizar(request: UpdateUsuarioRequest): Promise<UsuarioView> {
		const response = await authorizedFetch('/ControladorUsuarioAdministrador/ActualizarUsuario', {
			method: 'POST',
			body: JSON.stringify(request),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData?.mensaje || `Error al actualizar usuario: ${response.statusText}`);
		}

		const data = await response.json();
		const usuario: Usuario = data.data || data;

		if (!usuario || typeof usuario !== 'object') {
			throw new Error('Respuesta del servidor inválida: estructura no esperada');
		}

		return mapUsuarioToView(usuario);
	},

	// DELETE /ControladorUsuarioAdministrador/DarDebajaUsuario
	async eliminar(id: number): Promise<void> {
		const response = await authorizedFetch(`/ControladorUsuarioAdministrador/DarDebajaUsuario?id=${id}`, {
			method: 'DELETE',
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData?.mensaje || `Error al eliminar usuario: ${response.statusText}`);
		}
	},

	// POST /ControladorUsuarioAdministrador/ActualizarUsuario (para invitación)
	async enviarInvitacion(idUsuario: number): Promise<void> {
		const response = await authorizedFetch(`/ControladorUsuarioAdministrador/InvitarUsuario/${idUsuario}`, {
			method: 'POST',
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData?.mensaje || `Error al enviar invitación: ${response.statusText}`);
		}
	},

	async validarToken(codigo: string): Promise<{id: number}> {
		const response = await authorizedFetch(`/ValidarToken/${codigo}`, {
			method: 'GET',
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData?.mensaje || `Error al validar token: ${response.statusText}`);
		}
		const data = await response.json();
		return data.data;
	},
	async enviarRecuperarContraseña(request: LoginCredentials): Promise<void> {
		const response = await authorizedFetch('/EnviarRecuperarContrasena', {
			method: 'POST',
			body: JSON.stringify(request),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData?.mensaje || `Error al enviar correo de recuperacion: ${response.statusText}`);
		}
	},
	async recuperarContraseña(request: RecuperationCredentials): Promise<void> {
		const response = await authorizedFetch('/RecuperarContrasena', {
			method: 'POST',
			body: JSON.stringify(request),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData?.mensaje || `Error al enviar correo de recuperacion: ${response.statusText}`);
		}
	},
};