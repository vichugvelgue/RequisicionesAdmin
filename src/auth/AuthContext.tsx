import React, {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
	useEffect,
} from 'react';
import type { AuthUser, LoginCredentials } from './types';
import { signInWithAPI } from './apiAuthService';
import {
	readStoredSession,
	writeStoredSession,
	clearStoredSession,
} from './sessionStorage';

interface AuthContextValue {
	user: AuthUser | null;
	accessToken: string | null;
	isHydrated: boolean;
	isAuthenticated: boolean;
	login: (credentials: LoginCredentials) => Promise<{ ok: true } | { ok: false; message: string }>;
	logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [accessToken, setAccessToken] = useState<string | null>(null);
	const [isHydrated, setIsHydrated] = useState(false);

	useEffect(() => {
		const session = readStoredSession();
		if (session) {
			setUser(session.user);
			setAccessToken(session.accessToken);
		}
		setIsHydrated(true);
	}, []);

	useEffect(() => {
		const onUnauthorized = () => {
			clearStoredSession();
			setUser(null);
			setAccessToken(null);
		};
		window.addEventListener('auth:unauthorized', onUnauthorized);
		return () => window.removeEventListener('auth:unauthorized', onUnauthorized);
	}, []);

	const login = useCallback(async (credentials: LoginCredentials) => {
		const result = await signInWithAPI(credentials); 
		if (!result.ok) {
    		return { ok: false, message: 'message' in result ? result.message : 'Error desconocido' } 
		}
		writeStoredSession(result.session);
		setUser(result.session.user);
		setAccessToken(result.session.accessToken);
		return { ok: true as const };
	}, []);

	const logout = useCallback(() => {
		clearStoredSession();
		setUser(null);
		setAccessToken(null);
	}, []);

	const value = useMemo<AuthContextValue>(
		() => ({
			user,
			accessToken,
			isHydrated,
			isAuthenticated: Boolean(user && accessToken),
			login,
			logout,
		}),
		[user, accessToken, isHydrated, login, logout]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
	const ctx = useContext(AuthContext);
	if (!ctx) {
		throw new Error('useAuth debe usarse dentro de AuthProvider');
	}
	return ctx;
}
