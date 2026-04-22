import React from 'react';
import { Button, FormSection, TextArea } from '../../../../../components/UI';
import { FieldRoleLabel } from '../../fieldRoleLabel';
import type { ServiciosMayorEntregablesValues } from '../../types';

const empty: ServiciosMayorEntregablesValues = {
	entregables: '',
};

export function MayorEntregablesTab({
	initialValues,
	onSave,
}: {
	initialValues: Partial<ServiciosMayorEntregablesValues>;
	onSave: (data: ServiciosMayorEntregablesValues) => void;
}) {
	const [entregables, setEntregables] = React.useState(initialValues.entregables ?? empty.entregables);

	React.useEffect(() => {
		setEntregables(initialValues.entregables ?? empty.entregables);
	}, [initialValues]);

	const isValid = entregables.trim().length > 0;

	return (
		<div className="p-4 flex-1 min-h-0 overflow-auto">
			<FormSection>
				<form
					className="space-y-4"
					onSubmit={(e) => {
						e.preventDefault();
						if (!isValid) return;
						onSave({ entregables: entregables.trim().toUpperCase() });
					}}
				>
					<div className="grid grid-cols-12 gap-4">
						<div className="col-span-12">
							<FieldRoleLabel>Entregables</FieldRoleLabel>
							<TextArea
								rows={3}
								value={entregables}
								onChange={(e) => setEntregables(e.target.value.toUpperCase())}
								className="uppercase"
							/>
						</div>
						{!isValid ? (
							<p className="col-span-12 text-[11px] text-red-600">Entregables requeridos.</p>
						) : null}
					</div>
					<div className="flex justify-end pt-2">
						<Button type="submit" variant="success" size="md">
							Guardar sección
						</Button>
					</div>
				</form>
			</FormSection>
		</div>
	);
}
