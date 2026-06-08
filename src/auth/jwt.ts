export function decodeJWTPayload(token: string): Record<string, unknown> | null {
	try {
		const parts = token.split('.');
		if (parts.length !== 3) return null;
		const payload = parts[1];
		const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
		return JSON.parse(decoded);
	} catch {
		return null;
	}
}

export function getJWTExpiration(token: string): number | null {
	const payload = decodeJWTPayload(token);
	if (!payload) return null;
	const exp = payload.exp;
	return typeof exp === 'number' ? exp * 1000 : null;
}
