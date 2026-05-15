import React from 'react';
import { AdquisicionPartidasSection } from '../../partidas/AdquisicionPartidasSection';
import type { AdquisicionPartidaMayor } from '../../types';

export function MayorPartidasTab({
		idRequisicion,
	idUsuario,
	partidas,
	canEditSolicitanteFields,
	onChange,
}: {
	idRequisicion: number;
		idUsuario: number;
		partidas: AdquisicionPartidaMayor[];
		canEditSolicitanteFields: boolean;
		onChange: (next: AdquisicionPartidaMayor[]) => void;
}) {
	return (
		<AdquisicionPartidasSection
			idRequisicion={idRequisicion}
						idUsuario={idUsuario}
						tipoCompra="MENOR"
						partidas={partidas}
						canEditSolicitanteFields={canEditSolicitanteFields}
						onChange={(next) => onChange(next as AdquisicionPartidaMayor[])}
		/>
	);
}
