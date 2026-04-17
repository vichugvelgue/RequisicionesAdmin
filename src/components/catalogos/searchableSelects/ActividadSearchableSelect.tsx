import React from "react";
import { BaseCatalogSearchableSelect } from "./BaseCatalogSearchableSelect";
import { ACTIVIDAD_MOCK_DATA } from "./mockData";
import type { CatalogSearchableSelectProps } from "./types";

export function ActividadSearchableSelect(props: CatalogSearchableSelectProps) {
	return (
		<BaseCatalogSearchableSelect
			{...props}
			items={ACTIVIDAD_MOCK_DATA}
			placeholder={props.placeholder ?? "SELECCIONA ACTIVIDAD"}
		/>
	);
}
