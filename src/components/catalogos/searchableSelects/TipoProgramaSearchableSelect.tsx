import React from "react";
import { BaseCatalogSearchableSelect } from "./BaseCatalogSearchableSelect";
import { TIPO_PROGRAMA_MOCK_DATA } from "./mockData";
import type { CatalogSearchableSelectProps } from "./types";

export function TipoProgramaSearchableSelect(props: CatalogSearchableSelectProps) {
	return (
		<BaseCatalogSearchableSelect
			{...props}
			items={TIPO_PROGRAMA_MOCK_DATA}
			placeholder={props.placeholder ?? "SELECCIONA TIPO DE PROGRAMA"}
		/>
	);
}
