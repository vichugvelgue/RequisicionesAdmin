import React from "react";
import { BaseCatalogSearchableSelect } from "./BaseCatalogSearchableSelect";
import { UNIDAD_MEDIDA_MOCK_DATA } from "./mockData";
import type { CatalogSearchableSelectProps } from "./types";

export function UnidadMedidaSearchableSelect(props: CatalogSearchableSelectProps) {
	return (
		<BaseCatalogSearchableSelect
			{...props}
			items={UNIDAD_MEDIDA_MOCK_DATA}
			placeholder={props.placeholder ?? "SELECCIONA UNIDAD DE MEDIDA"}
		/>
	);
}
