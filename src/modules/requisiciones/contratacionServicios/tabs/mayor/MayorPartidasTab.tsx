import React from 'react';
import { ServiciosMayorPartidasSection } from '../../partidas/ServiciosMayorPartidasSection';
import type { ServiciosPartidaMayor } from '../../types';

export function MayorPartidasTab({
	partidas,
	hideRevisorFields,
	canEditSolicitanteFields,
	onChange,
}: {
	partidas: ServiciosPartidaMayor[];
	hideRevisorFields: boolean;
	canEditSolicitanteFields: boolean;
	onChange: (next: ServiciosPartidaMayor[]) => void;
}) {
	return (
		<ServiciosMayorPartidasSection
			partidas={partidas}
			hideRevisorFields={hideRevisorFields}
			canEditSolicitanteFields={canEditSolicitanteFields}
			onChange={onChange}
		/>
	);
}
