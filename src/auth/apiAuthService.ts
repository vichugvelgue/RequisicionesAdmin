import { getJWTExpiration } from './jwt';
import type {
	AuthResult,
	LoginCredentials,
	AuthSession,
	AuthUser,
	TipoPerfilUsuario,
} from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5214';

export async function signInWithAPI(
	credentials: LoginCredentials
): Promise<AuthResult> {
	try {
		console.log('Attempting login with:', credentials.correoTelefono);
		const response = await fetch(`${API_BASE_URL}/IniciarSesionAdmin`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				correoTelefono: credentials.correoTelefono,
				contrasena: credentials.contrasena,
			}),
		});

		console.log('Response status:', response.status);
		let data: any = null;
		try {
			data = await response.json();
			console.log('Response data:', data);
		} catch (parseError) {
			console.error('Failed to parse JSON:', parseError);
		}

		if (!response.ok) {
			let message = 'Error desconocido.';
			let code: 'INVALID_CREDENTIALS' | 'NETWORK' | 'UNKNOWN' = 'UNKNOWN';

			if (response.status === 400) {
				message = data?.mensaje || 'Usuario o contraseña incorrectos.';
				code = 'INVALID_CREDENTIALS';
			} else if (response.status === 401) {
				if (data?.mensaje) {
					message = data.mensaje;
				} else {
					message = 'Usuario bloqueado o no autorizado.';
				}
				code = 'INVALID_CREDENTIALS';
			} else if (response.status === 500) {
				message = 'Error interno del servidor.';
				code = 'NETWORK';
			} else {
				message = data?.mensaje || response.statusText || 'Error en la solicitud.';
			}

			console.log('Returning error:', message);
			return {
				ok: false,
				code,
				message,
			};
		}

		// For 200, check data.error
		if (data.error) {
			console.log('API returned error:', data.mensaje);
			return {
				ok: false,
				code: 'INVALID_CREDENTIALS',
				message: data.mensaje || 'Error en la autenticación.',
			};
		}

		console.log('Login successful');
		// ... rest of success code

		// Map tipoPerfil based on tipoUsuarioNavigation.nombre
		let tipoPerfil: TipoPerfilUsuario = 'SOLICITANTE'; // default
		const tipoNombre = data.data.tipoUsuarioNavigation?.nombre;
		if (tipoNombre === 'Administrador') {
			tipoPerfil = 'ADMINISTRADOR GENERAL';
		} else if (tipoNombre === 'Revisor') {
			tipoPerfil = 'REVISOR';
		} else if (tipoNombre === 'Autorizador') {
			tipoPerfil = 'AUTORIZADOR';
		}
		// Add more mappings if needed

		const user: AuthUser = {
			id: String(data.data.id),
			email: data.data.correo,
			displayName: data.data.nombreCompleto,
			tipoPerfil,
		};

		const session: AuthSession = {
			user,
			accessToken: data.data.jwt,
			expiresAt: getJWTExpiration(data.data.jwt), // TODO: decode JWT exp if needed
		};

		return {
			ok: true,
			session,
		};
	} catch (error) {
		return {
			ok: false,
			code: 'NETWORK',
			message: 'Error de red. Intenta de nuevo.',
		};
	}
}