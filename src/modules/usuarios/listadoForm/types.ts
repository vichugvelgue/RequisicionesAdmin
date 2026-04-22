export type SearchCriteria =
	| "Coincidencia"
	| "Nombre"
	| "Correo"
	| "Tipo usuario"
	| "Tipo perfil"
	| "Puesto"
	| "Area";

export type TipoPerfil =
	| "SOLICITANTE"
	| "REVISOR"
	| "AUTORIZADOR"
	| "ADMINISTRADOR GENERAL";

export interface InvitacionHistorialItem {
	id: string;
	/** ISO 8601 */
	fecha: string;
	estatus: string;
	/** Nombre o identificador del usuario que envió la invitación (mayúsculas en UI). */
	enviadaPor: string;
}

export interface UsuarioRow {
	id: string;
	nombre: string;
	correo: string;
	tipoUsuario: string;
	tipoPerfil: TipoPerfil;
	puesto: string;
	area: string;
}

export interface UsuarioFormValues {
	nombres: string;
	apellidoPaterno: string;
	apellidoMaterno: string;
	correo: string;
	contrasena: string;
	tipoUsuario: string;
	tipoPerfil: TipoPerfil | "";
	generarInvitacion: boolean;
	puesto: string;
	area: string;
}
