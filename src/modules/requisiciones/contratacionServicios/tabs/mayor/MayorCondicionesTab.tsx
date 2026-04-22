import React from 'react';
import { Button, FormSection, Input, TextArea } from '../../../../../components/UI';
import { FieldRoleLabel } from '../../fieldRoleLabel';
import type { ServiciosMayorCondicionesValues } from '../../types';

const empty: ServiciosMayorCondicionesValues = {
	diasEntrega: '',
	condicionesGeneralesContratacion: '',
	pagosSeRealizaran: '',
};

export function MayorCondicionesTab({
	initialValues,
	hideRevisorFields,
	onSave,
}: {
	initialValues: Partial<ServiciosMayorCondicionesValues>;
	hideRevisorFields: boolean;
	onSave: (data: ServiciosMayorCondicionesValues) => void;
}) {
	const [data, setData] = React.useState<ServiciosMayorCondicionesValues>({ ...empty, ...initialValues });

	React.useEffect(() => {
		setData({ ...empty, ...initialValues });
	}, [initialValues]);

	const hasCondiciones = data.condicionesGeneralesContratacion.trim().length > 0;
	const hasReviewerFields = hideRevisorFields || (data.diasEntrega.trim() && data.pagosSeRealizaran.trim());

	return (
		<div className="p-4 flex-1 min-h-0 overflow-auto">
			<FormSection>
				<form
					className="space-y-4"
					onSubmit={(e) => {
						e.preventDefault();
						if (!hasCondiciones || !hasReviewerFields) return;
						onSave({
							diasEntrega: data.diasEntrega.trim().toUpperCase(),
							condicionesGeneralesContratacion: data.condicionesGeneralesContratacion.trim().toUpperCase(),
							pagosSeRealizaran: data.pagosSeRealizaran.trim().toUpperCase(),
						});
					}}
				>
					<div className="grid grid-cols-12 gap-4">
						{!hideRevisorFields ? (
							<div className="col-span-12 sm:col-span-6">
								<FieldRoleLabel>Días de entrega</FieldRoleLabel>
								<Input
									value={data.diasEntrega}
									onChange={(e) =>
										setData((prev) => ({ ...prev, diasEntrega: e.target.value.toUpperCase() }))
									}
									className="uppercase"
								/>
							</div>
						) : null}
						<div className="col-span-12">
							<FieldRoleLabel>Condiciones generales de contratación</FieldRoleLabel>
							<TextArea
								rows={3}
								value={data.condicionesGeneralesContratacion}
								onChange={(e) =>
									setData((prev) => ({
										...prev,
										condicionesGeneralesContratacion: e.target.value.toUpperCase(),
									}))
								}
								className="uppercase"
							/>
						</div>
						{!hideRevisorFields ? (
							<div className="col-span-12">
								<FieldRoleLabel>Los pagos se realizarán</FieldRoleLabel>
								<TextArea
									rows={3}
									value={data.pagosSeRealizaran}
									onChange={(e) =>
										setData((prev) => ({ ...prev, pagosSeRealizaran: e.target.value.toUpperCase() }))
									}
									className="uppercase"
								/>
							</div>
						) : null}
						{!hasCondiciones ? (
							<p className="col-span-12 text-[11px] text-red-600">
								Condiciones generales de contratación (condiciones) requeridas.
							</p>
						) : null}
						{!hideRevisorFields && !hasReviewerFields ? (
							<p className="col-span-12 text-[11px] text-red-600">
								Complete días de entrega y cómo se realizarán los pagos.
							</p>
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
