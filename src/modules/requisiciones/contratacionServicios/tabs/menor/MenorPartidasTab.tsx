import React from 'react';
import { ServiciosMayorPartidasSection } from '../../partidas/ServiciosMayorPartidasSection';
import type { ServiciosPartidaMenor } from '../../types';

export function MenorPartidasTab({
	partidas,
	canEditSolicitanteFields,
	onChange,
	idRequisicion,
	idUsuario,
}: {
	partidas: ServiciosPartidaMenor[];
	canEditSolicitanteFields: boolean;
	onChange: (next: ServiciosPartidaMenor[]) => void;
	idRequisicion?: number;
	idUsuario?: number;
}) {
	const handleChange = (next: ServiciosPartidaMenor[]) => {
		onChange(next);
	};

	return (
		<ServiciosMayorPartidasSection
			partidas={partidas}
			hideRevisorFields
			canEditSolicitanteFields={canEditSolicitanteFields}
			onChange={handleChange}
			idRequisicion={idRequisicion}
			idUsuario={idUsuario}
		/>
	);
}
