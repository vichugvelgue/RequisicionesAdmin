import React from 'react';
import { ServiciosMayorPartidasSection } from '../../partidas/ServiciosMayorPartidasSection';
import type { ServiciosPartidaMayor } from '../../types';

export function MayorPartidasTab({
	partidas,
	hideRevisorFields,
	canEditSolicitanteFields,
	onChange,
	idRequisicion,
	idUsuario,
}: {
	partidas: ServiciosPartidaMayor[];
	hideRevisorFields: boolean;
	canEditSolicitanteFields: boolean;
	onChange: (next: ServiciosPartidaMayor[]) => void;
	idRequisicion?: number;
	idUsuario?: number;
}) {
	return (
		<ServiciosMayorPartidasSection
			partidas={partidas}
			hideRevisorFields={hideRevisorFields}
			canEditSolicitanteFields={canEditSolicitanteFields}
			onChange={onChange}
			idRequisicion={idRequisicion}
			idUsuario={idUsuario}
		/>
	);
}
