import type { TipoPerfilUsuario } from './types';

/** Catálogos y Usuarios: solo autorizador y administrador general. */
export function canAccessCatalogosUsuarios(
	tipoPerfil: TipoPerfilUsuario | undefined
): boolean {
	if (!tipoPerfil) return false;
	return tipoPerfil === 'ADMINISTRADOR GENERAL';
}

/** Requisiciones en modo solo consulta (sin altas ni edición). */
export function isRequisicionReadOnlyProfile(
	tipoPerfil: TipoPerfilUsuario | undefined
): boolean {
	return tipoPerfil === 'ADMINISTRADOR GENERAL';
}
