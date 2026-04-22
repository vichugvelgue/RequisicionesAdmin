export { AuthProvider, useAuth } from './AuthContext';
export { RequireAuth } from './RequireAuth';
export { RequireCatalogosUsuariosAccess } from './RequireCatalogosUsuariosAccess';
export {
	canAccessCatalogosUsuarios,
	isRequisicionReadOnlyProfile,
} from './permissions';
export { signInWithMock } from './mockAuthService';
export {
	readStoredSession,
	writeStoredSession,
	clearStoredSession,
	AUTH_STORAGE_KEY,
} from './sessionStorage';
export type { TipoPerfilUsuario } from './types';
export type {
	AuthUser,
	AuthSession,
	LoginCredentials,
	AuthResult,
	AuthSuccess,
	AuthFailure,
	AuthErrorCode,
} from './types';
