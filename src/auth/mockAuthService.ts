import type {
	AuthResult,
	LoginCredentials,
	AuthSession,
	AuthUser,
	TipoPerfilUsuario,
} from './types';

/**
 * Credenciales mock: por defecto demo@cuautlancingo.gob.mx / demo123.
 * Opcional: VITE_AUTH_MOCK_EMAIL y VITE_AUTH_MOCK_PASSWORD en .env
 */
const MOCK_EMAIL =
	import.meta.env.VITE_AUTH_MOCK_EMAIL ?? 'demo@cuautlancingo.gob.mx';
const MOCK_PASSWORD = import.meta.env.VITE_AUTH_MOCK_PASSWORD ?? 'demo123';

const MOCK_LATENCY_MS = 450;

const MOCK_TIPO_PERFIL_RAW = import.meta.env.VITE_AUTH_MOCK_TIPO_PERFIL as
	| string
	| undefined;
const VALID_PERFILES: TipoPerfilUsuario[] = [
	'SOLICITANTE',
	'REVISOR',
	'AUTORIZADOR',
	'ADMINISTRADOR GENERAL',
];

function resolveMockTipoPerfil(): TipoPerfilUsuario {
	const u = MOCK_TIPO_PERFIL_RAW?.trim().toUpperCase();
	if (u && VALID_PERFILES.includes(u as TipoPerfilUsuario)) {
		return u as TipoPerfilUsuario;
	}
	return 'SOLICITANTE';
}

function buildSession(user: AuthUser): AuthSession {
	return {
		user,
		accessToken: `mock_${crypto.randomUUID?.() ?? String(Date.now())}`,
		expiresAt: Date.now() + 8 * 60 * 60 * 1000,
	};
}

export async function signInWithMock(
	credentials: LoginCredentials
): Promise<AuthResult> {
	await new Promise((r) => setTimeout(r, MOCK_LATENCY_MS));

	const email = credentials.email.trim().toLowerCase();
	const password = credentials.password;

	if (email !== MOCK_EMAIL.toLowerCase() || password !== MOCK_PASSWORD) {
		return {
			ok: false,
			code: 'INVALID_CREDENTIALS',
			message: 'Correo o contraseña incorrectos.',
		};
	}

	const user: AuthUser = {
		id: 'mock-user-1',
		email: MOCK_EMAIL,
		displayName: 'USUARIO DEMO',
		tipoPerfil: resolveMockTipoPerfil(),
	};

	return {
		ok: true,
		session: buildSession(user),
	};
}
