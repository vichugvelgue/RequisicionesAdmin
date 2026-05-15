import React from 'react';
import { AdquisicionPartidasSection } from '../../partidas/AdquisicionPartidasSection';
import type { AdquisicionPartidaMenor } from '../../types';
import { PartidaRequest } from '../../../../../api/requisicionBienesAPI';

export function MenorPartidasTab({
	idRequisicion,
	idUsuario,
	partidas,
	canEditSolicitanteFields,
	onChange,
}: {
	idRequisicion: number;
	idUsuario: number;
	partidas: AdquisicionPartidaMenor[];
	canEditSolicitanteFields: boolean;
	onChange: (next: AdquisicionPartidaMenor[]) => void;
}) {
	console.log("Rendering MenorPartidasTab with partidas:", partidas);
	return (
		<AdquisicionPartidasSection
			idRequisicion={idRequisicion}
			idUsuario={idUsuario}
			tipoCompra="MENOR"
			partidas={partidas}
			canEditSolicitanteFields={canEditSolicitanteFields}
			onChange={(next) => onChange(next as AdquisicionPartidaMenor[])}
		/>
	);
}
