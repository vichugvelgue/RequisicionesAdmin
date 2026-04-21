import React from 'react';
import { ServiciosMenorPartidasSection } from '../../partidas/ServiciosMenorPartidasSection';
import type { ServiciosPartidaMenor } from '../../types';

export function MenorPartidasTab({
	partidas,
	canEditSolicitanteFields,
	onChange,
}: {
	partidas: ServiciosPartidaMenor[];
	canEditSolicitanteFields: boolean;
	onChange: (next: ServiciosPartidaMenor[]) => void;
}) {
	return (
		<ServiciosMenorPartidasSection
			partidas={partidas}
			canEditSolicitanteFields={canEditSolicitanteFields}
			onChange={onChange}
		/>
	);
}
