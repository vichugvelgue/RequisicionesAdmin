import React from "react";
import { BaseCatalogSearchableSelect } from "./BaseCatalogSearchableSelect";
import { UNIDAD_SOLICITANTE_MOCK_DATA } from "./mockData";
import type { CatalogSearchableSelectProps } from "./types";

export function UnidadSolicitanteSearchableSelect(
	props: CatalogSearchableSelectProps
) {
	return (
		<BaseCatalogSearchableSelect
			{...props}
			items={UNIDAD_SOLICITANTE_MOCK_DATA}
			placeholder={props.placeholder ?? "SELECCIONA UNIDAD SOLICITANTE"}
		/>
	);
}
