import type { OptionItem } from '../../../components/UI/types';

export const MOCK_UNIDAD_SOLICITANTE: OptionItem[] = [
	{ value: 'US-001', label: 'DIRECCIÓN DE OBRAS PÚBLICAS' },
	{ value: 'US-002', label: 'TESORERÍA MUNICIPAL' },
	{ value: 'US-003', label: 'SISTEMAS' },
];

export const MOCK_CLAVE_PRESUPUESTAL: OptionItem[] = [
	{ value: 'CP-1001', label: '1001 — MATERIALES Y SUMINISTROS' },
	{ value: 'CP-2002', label: '2002 — SERVICIOS GENERALES' },
];

export const MOCK_ORIGEN_RECURSO: OptionItem[] = [
	{ value: 'OR-1', label: 'FEDERAL' },
	{ value: 'OR-2', label: 'ESTATAL' },
	{ value: 'OR-3', label: 'PROPIO' },
];

export const MOCK_COMPONENTE: OptionItem[] = [
	{ value: 'COMP-1', label: 'COMPONENTE PROGRAMA 1' },
	{ value: 'COMP-2', label: 'COMPONENTE PROGRAMA 2' },
];

export const MOCK_ACTIVIDAD: OptionItem[] = [
	{ value: 'ACT-1', label: 'MANTENIMIENTO DE INFRAESTRUCTURA' },
	{ value: 'ACT-2', label: 'ADQUISICIÓN DE BIENES' },
];

export const MOCK_TIPO_PROGRAMA: OptionItem[] = [
	{ value: 'TP-1', label: 'PROGRAMA INSTITUCIONAL' },
	{ value: 'TP-2', label: 'PROGRAMA ESPECÍFICO' },
];

export const MOCK_UNIDAD_MEDIDA: OptionItem[] = [
	{ value: 'PZA', label: 'PIEZA' },
	{ value: 'KG', label: 'KILOGRAMO' },
	{ value: 'LT', label: 'LITRO' },
	{ value: 'M', label: 'METRO' },
];
