import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { canAccessCatalogosUsuarios } from './permissions';

export function RequireCatalogosUsuariosAccess() {
	const { user, isHydrated } = useAuth();

	if (!isHydrated) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-black text-brand-secondary text-sm font-medium">
				Cargando…
			</div>
		);
	}

	if (!canAccessCatalogosUsuarios(user?.tipoPerfil)) {
		return <Navigate to="/" replace />;
	}

	return <Outlet />;
}
