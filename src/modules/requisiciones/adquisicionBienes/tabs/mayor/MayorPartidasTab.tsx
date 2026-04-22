import React from 'react';
import { AdquisicionPartidasSection } from '../../partidas/AdquisicionPartidasSection';
import type { AdquisicionPartidaMayor } from '../../types';

export function MayorPartidasTab({
	partidas,
	canEditSolicitanteFields,
	onChange,
}: {
	partidas: AdquisicionPartidaMayor[];
	canEditSolicitanteFields: boolean;
	onChange: (next: AdquisicionPartidaMayor[]) => void;
}) {
	return (
		<AdquisicionPartidasSection
			tipoCompra="MAYOR"
			partidas={partidas}
			canEditSolicitanteFields={canEditSolicitanteFields}
			onChange={(next) => onChange(next as AdquisicionPartidaMayor[])}
		/>
	);
}
