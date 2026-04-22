import type { SearchableSelectOption } from "../../common/SearchableSelect";
import type { CatalogMockItem } from "./types";

const toUpper = (value: string) => value.trim().toUpperCase();

export const ACTIVIDAD_MOCK_DATA: CatalogMockItem[] = [
	{ id: "1", label: "MANTENIMIENTO PREVENTIVO", status: "ACTIVO" },
	{ id: "2", label: "CAPACITACION INTERNA", status: "ACTIVO" },
	{ id: "3", label: "SUPERVISION DE OBRA", status: "INACTIVO" },
];

export const CLAVE_PRESUPUESTAL_OBJETO_GASTO_MOCK_DATA: CatalogMockItem[] = [
	{ id: "1", label: "1000 SERVICIOS PERSONALES", status: "ACTIVO" },
	{ id: "2", label: "2000 MATERIALES Y SUMINISTROS", status: "ACTIVO" },
	{ id: "3", label: "3000 SERVICIOS GENERALES", status: "INACTIVO" },
];

export const ORIGEN_RECURSO_MOCK_DATA: CatalogMockItem[] = [
	{ id: "1", label: "FEDERAL", status: "ACTIVO" },
	{ id: "2", label: "ESTATAL", status: "ACTIVO" },
	{ id: "3", label: "MUNICIPAL", status: "INACTIVO" },
];

export const TIPO_PROGRAMA_MOCK_DATA: CatalogMockItem[] = [
	{ id: "1", label: "PROGRAMA ANUAL", status: "ACTIVO" },
	{ id: "2", label: "PROGRAMA EMERGENTE", status: "ACTIVO" },
	{ id: "3", label: "PROGRAMA ESPECIAL", status: "INACTIVO" },
];

export const UNIDAD_MEDIDA_MOCK_DATA: CatalogMockItem[] = [
	{ id: "1", label: "PIEZA", status: "ACTIVO" },
	{ id: "2", label: "CAJA", status: "ACTIVO" },
	{ id: "3", label: "SERVICIO", status: "INACTIVO" },
];

export const UNIDAD_SOLICITANTE_MOCK_DATA: CatalogMockItem[] = [
	{ id: "1", label: "DIRECCION GENERAL", status: "ACTIVO" },
	{ id: "2", label: "AREA ADMINISTRATIVA", status: "ACTIVO" },
	{ id: "3", label: "UNIDAD OPERATIVA", status: "INACTIVO" },
];

export function toCatalogOptions(
	items: CatalogMockItem[],
	includeInactive = false
): SearchableSelectOption[] {
	return items
		.filter((item) => includeInactive || item.status === "ACTIVO")
		.map((item) => ({
			value: item.id,
			label: toUpper(item.label),
		}));
}
