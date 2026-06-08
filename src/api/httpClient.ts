import { AUTH_STORAGE_KEY } from '../auth/sessionStorage';
import type { AuthSession } from '../auth/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5214';

function getAuthToken(): string | null {
	try {
		const session: AuthSession | null = JSON.parse(
			localStorage.getItem(AUTH_STORAGE_KEY) || 'null'
		);
		return session?.accessToken || null;
	} catch {
		return null;
	}
}

export async function authorizedFetch(
	path: string,
	options: RequestInit = {}
): Promise<Response> {
	const token = getAuthToken();
	const response = await fetch(`${API_BASE_URL}${path}`, {
		...options,
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
			...((options.headers as Record<string, string>) || {}),
		},
	});

	if (response.status === 401) {
		window.dispatchEvent(new CustomEvent('auth:unauthorized'));
	}

	return response;
}

export async function apiFetch<T = unknown>(
	path: string,
	options: RequestInit = {}
): Promise<T> {
	const response = await authorizedFetch(path, options);

	if (!response.ok) {
		let errorMsg = `Error en la solicitud: ${response.statusText}`;
		try {
			const errorData = await response.json();
			errorMsg = errorData?.mensaje || errorMsg;
		} catch {}
		throw new Error(errorMsg);
	}

	const data = await response.json();
	return data as T;
}
