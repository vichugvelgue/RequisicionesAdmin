import React, { useMemo } from "react";
import { SearchableSelect } from "../../UI";
import type { SearchableSelectOption } from "../../common/SearchableSelect";
import type { CatalogSearchableSelectProps, CatalogMockItem } from "./types";
import { toCatalogOptions } from "./mockData";

interface BaseCatalogSearchableSelectProps extends CatalogSearchableSelectProps {
	items: CatalogMockItem[];
}

export function BaseCatalogSearchableSelect({
	items,
	value,
	onChange,
	placeholder = "SELECCIONA UNA OPCION",
	disabled = false,
	allowClear = true,
	includeInactive = false,
	className,
}: BaseCatalogSearchableSelectProps) {
	const options = useMemo(
		() => toCatalogOptions(items, includeInactive),
		[items, includeInactive]
	);

	const currentValue = value ?? "";

	const handleChange = (nextValue: string) => {
		if (!allowClear && nextValue === "") return;
		const selectedOption: SearchableSelectOption | undefined = options.find(
			(option) => option.value === nextValue
		);
		onChange(nextValue || null, selectedOption);
	};

	return (
		<SearchableSelect
			options={options}
			value={currentValue}
			onChange={handleChange}
			placeholder={placeholder}
			disabled={disabled}
			className={className}
		/>
	);
}
