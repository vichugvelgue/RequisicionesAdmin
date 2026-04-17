export interface AuthUser {
	id: string;
	email: string;
	displayName: string;
}

export interface AuthSession {
	user: AuthUser;
	accessToken: string;
	expiresAt: number | null;
}

export interface LoginCredentials {
	email: string;
	password: string;
}

export type AuthErrorCode = 'INVALID_CREDENTIALS' | 'NETWORK' | 'UNKNOWN';

export interface AuthFailure {
	ok: false;
	code: AuthErrorCode;
	message: string;
}

export interface AuthSuccess {
	ok: true;
	session: AuthSession;
}

export type AuthResult = AuthSuccess | AuthFailure;
