import type { SearchableSelectOption } from "../../common/SearchableSelect";

export type CatalogStatus = "ACTIVO" | "INACTIVO";

export interface CatalogMockItem {
	id: string;
	label: string;
	status: CatalogStatus;
}

export interface CatalogSearchableSelectProps {
	value: string | null;
	onChange: (nextValue: string | null, option?: SearchableSelectOption) => void;
	placeholder?: string;
	disabled?: boolean;
	allowClear?: boolean;
	includeInactive?: boolean;
	className?: string;
}
