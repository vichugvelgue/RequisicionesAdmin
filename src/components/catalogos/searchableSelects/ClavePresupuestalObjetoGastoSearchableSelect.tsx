import React from "react";
import { BaseCatalogSearchableSelect } from "./BaseCatalogSearchableSelect";
import { CLAVE_PRESUPUESTAL_OBJETO_GASTO_MOCK_DATA } from "./mockData";
import type { CatalogSearchableSelectProps } from "./types";

export function ClavePresupuestalObjetoGastoSearchableSelect(
	props: CatalogSearchableSelectProps
) {
	return (
		<BaseCatalogSearchableSelect
			{...props}
			items={CLAVE_PRESUPUESTAL_OBJETO_GASTO_MOCK_DATA}
			placeholder={props.placeholder ?? "SELECCIONA CLAVE PRESUPUESTAL / OBJETO GASTO"}
		/>
	);
}
