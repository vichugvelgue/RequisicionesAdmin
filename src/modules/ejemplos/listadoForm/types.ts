export type SearchCriteria =
	| "Coincidencia"
	| "Nombre"
	| "Correo"
	| "Tipo usuario"
	| "Puesto"
	| "Area";

export interface UsuarioRow {
	id: string;
	nombre: string;
	correo: string;
	tipoUsuario: string;
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
	puesto: string;
	area: string;
}
