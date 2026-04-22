import type { AuthSession } from './types';

export const AUTH_STORAGE_KEY = 'requisiciones_admin_auth_v1';

export function readStoredSession(): AuthSession | null {
	if (typeof window === 'undefined') return null;
	try {
		const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw) as AuthSession;
		if (!parsed?.user?.id || !parsed?.accessToken) return null;
		if (parsed.expiresAt != null && Date.now() > parsed.expiresAt) {
			clearStoredSession();
			return null;
		}
		return parsed;
	} catch {
		return null;
	}
}

export function writeStoredSession(session: AuthSession): void {
	window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function clearStoredSession(): void {
	window.localStorage.removeItem(AUTH_STORAGE_KEY);
}
