import React from 'react';
import { Button, FormSection, TextArea } from '../../../../../components/UI';
import { FieldRoleLabel } from '../../fieldRoleLabel';
import type { ServiciosMayorRecursosValues } from '../../types';

const empty: ServiciosMayorRecursosValues = {
	personalRequerido: '',
};

export function MayorRecursosTab({
	initialValues,
	onSave,
}: {
	initialValues: Partial<ServiciosMayorRecursosValues>;
	onSave: (data: ServiciosMayorRecursosValues) => void;
}) {
	const [personalRequerido, setPersonalRequerido] = React.useState(initialValues.personalRequerido ?? '');

	React.useEffect(() => {
		setPersonalRequerido(initialValues.personalRequerido ?? '');
	}, [initialValues]);

	const isValid = personalRequerido.trim().length > 0;

	return (
		<div className="p-4 flex-1 min-h-0 overflow-auto">
			<FormSection>
				<form
					className="space-y-4"
					onSubmit={(e) => {
						e.preventDefault();
						if (!isValid) return;
						onSave({ personalRequerido: personalRequerido.trim().toUpperCase() });
					}}
				>
					<div className="grid grid-cols-12 gap-4">
						<div className="col-span-12">
							<FieldRoleLabel>Personal requerido</FieldRoleLabel>
							<TextArea
								rows={3}
								value={personalRequerido}
								onChange={(e) => setPersonalRequerido(e.target.value.toUpperCase())}
								className="uppercase"
							/>
						</div>
						{!isValid ? (
							<p className="col-span-12 text-[11px] text-red-600">Personal requerido (recursos) requerido.</p>
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
