import type {
	AuthResult,
	LoginCredentials,
	AuthSession,
	AuthUser,
	TipoPerfilUsuario,
} from './types';

const SOLICITANTE_EMAIL =
	import.meta.env.VITE_AUTH_MOCK_SOLICITANTE_EMAIL ??
	import.meta.env.VITE_AUTH_MOCK_EMAIL ??
	'solicitante@cuautlancingo.gob.mx';
const REVISOR_EMAIL =
	import.meta.env.VITE_AUTH_MOCK_REVISOR_EMAIL ?? 'revisor@cuautlancingo.gob.mx';
const ADMIN_GENERAL_EMAIL =
	import.meta.env.VITE_AUTH_MOCK_ADMIN_GENERAL_EMAIL ??
	'admin.general@cuautlancingo.gob.mx';

const MOCK_LATENCY_MS = 450;

const ALLOWED_USERS: Record<string, { id: string; displayName: string; tipoPerfil: TipoPerfilUsuario }> = {
	[SOLICITANTE_EMAIL.trim().toLowerCase()]: {
		id: 'mock-solicitante-1',
		displayName: 'USUARIO SOLICITANTE',
		tipoPerfil: 'SOLICITANTE',
	},
	[REVISOR_EMAIL.trim().toLowerCase()]: {
		id: 'mock-revisor-1',
		displayName: 'USUARIO REVISOR',
		tipoPerfil: 'REVISOR',
	},
	[ADMIN_GENERAL_EMAIL.trim().toLowerCase()]: {
		id: 'mock-admin-general-1',
		displayName: 'ADMINISTRADOR GENERAL',
		tipoPerfil: 'ADMINISTRADOR GENERAL',
	},
};

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
	const allowedUser = ALLOWED_USERS[email];
	if (!allowedUser) {
		return {
			ok: false,
			code: 'INVALID_CREDENTIALS',
			message: 'Correo no autorizado para esta demo.',
		};
	}

	const user: AuthUser = {
		id: allowedUser.id,
		email,
		displayName: allowedUser.displayName,
		tipoPerfil: allowedUser.tipoPerfil,
	};

	return {
		ok: true,
		session: buildSession(user),
	};
}
