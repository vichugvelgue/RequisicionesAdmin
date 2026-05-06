export type SearchCriteria =
	| "Coincidencia"
	| "Nombre"
	| "Correo"
	| "Tipo usuario"
	| "Puesto"
	| "Area";

export type TipoUsuarioLabel =
	| "Solicitante"
	| "Revisor"
	| "Autorizador"
	| "Administrador";

export type TipoUsuarioValue = "1" | "2" | "3" | "4" | "";

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
	tipoUsuario: TipoUsuarioLabel;
	puesto: string;
	area: string;
}

export interface UsuarioFormValues {
	nombres: string;
	apellidoPaterno: string;
	apellidoMaterno: string;
	correo: string;
	contrasena: string;
	tipoUsuario: TipoUsuarioValue;
	generarInvitacion: boolean;
	puesto: string;
	area: string;
}
