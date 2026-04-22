import React from "react";
import { BaseCatalogSearchableSelect } from "./BaseCatalogSearchableSelect";
import { ORIGEN_RECURSO_MOCK_DATA } from "./mockData";
import type { CatalogSearchableSelectProps } from "./types";

export function OrigenRecursoSearchableSelect(props: CatalogSearchableSelectProps) {
	return (
		<BaseCatalogSearchableSelect
			{...props}
			items={ORIGEN_RECURSO_MOCK_DATA}
			placeholder={props.placeholder ?? "SELECCIONA ORIGEN DEL RECURSO"}
		/>
	);
}
