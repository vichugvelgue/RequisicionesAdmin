import React from 'react';
import { AdquisicionPartidasSection } from '../../partidas/AdquisicionPartidasSection';
import type { AdquisicionPartidaMenor } from '../../types';

export function MenorPartidasTab({
	partidas,
	canEditSolicitanteFields,
	onChange,
}: {
	partidas: AdquisicionPartidaMenor[];
	canEditSolicitanteFields: boolean;
	onChange: (next: AdquisicionPartidaMenor[]) => void;
}) {
	return (
		<AdquisicionPartidasSection
			tipoCompra="MENOR"
			partidas={partidas}
			canEditSolicitanteFields={canEditSolicitanteFields}
			onChange={(next) => onChange(next as AdquisicionPartidaMenor[])}
		/>
	);
}
