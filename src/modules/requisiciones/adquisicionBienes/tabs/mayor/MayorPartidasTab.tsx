import React from 'react';
import { FormSection, EmptyState } from '../../../../../components/UI';
import { Package } from 'lucide-react';

export function MayorPartidasTab() {
	return (
		<div className="p-4 flex-1 min-h-0 overflow-auto">
			<FormSection>
				<EmptyState
					icon={Package}
					title="Próximamente"
					description="Aquí se agregará el componente para altas múltiples de partidas (número autogenerado, descripción, unidad de medida, cantidad)."
				/>
			</FormSection>
		</div>
	);
}
