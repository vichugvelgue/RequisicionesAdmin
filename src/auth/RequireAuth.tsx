import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function RequireAuth() {
	const { isAuthenticated, isHydrated } = useAuth();
	const location = useLocation();

	if (!isHydrated) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-black text-brand-secondary text-sm font-medium">
				Cargando…
			</div>
		);
	}

	if (!isAuthenticated) {
		return <Navigate to="/login" replace state={{ from: location }} />;
	}

	return <Outlet />;
}
