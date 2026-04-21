import React from 'react';
import { Button, DateInputWithClear, FormSection, Input, TextArea } from '../../../../../components/UI';
import { FieldRoleLabel } from '../../fieldRoleLabel';
import type { ServiciosMayorEjecucionValues } from '../../types';

const empty: ServiciosMayorEjecucionValues = {
	experienciaLicitante: '',
	calle: '',
	colonia: '',
	cp: '',
	ciudad: '',
	periodoInicio: '',
	periodoFin: '',
	periodoTexto: '',
	horario: '',
};

export function MayorEjecucionTab({
	initialValues,
	hideRevisorFields,
	onSave,
}: {
	initialValues: Partial<ServiciosMayorEjecucionValues>;
	hideRevisorFields: boolean;
	onSave: (data: ServiciosMayorEjecucionValues) => void;
}) {
	const [data, setData] = React.useState<ServiciosMayorEjecucionValues>({ ...empty, ...initialValues });

	React.useEffect(() => {
		setData({ ...empty, ...initialValues });
	}, [initialValues]);

	const hasPeriodo = data.periodoTexto.trim() || (data.periodoInicio.trim() && data.periodoFin.trim());

	return (
		<div className="p-4 flex-1 min-h-0 overflow-auto">
			<FormSection>
				<form
					className="space-y-4"
					onSubmit={(e) => {
						e.preventDefault();
						if (!hasPeriodo) return;
						onSave({
							experienciaLicitante: data.experienciaLicitante.trim().toUpperCase(),
							calle: data.calle.trim().toUpperCase(),
							colonia: data.colonia.trim().toUpperCase(),
							cp: data.cp.trim(),
							ciudad: data.ciudad.trim().toUpperCase(),
							periodoInicio: data.periodoInicio,
							periodoFin: data.periodoFin,
							periodoTexto: data.periodoTexto.trim().toUpperCase(),
							horario: data.horario.trim().toUpperCase(),
						});
					}}
				>
					<div className="grid grid-cols-12 gap-4">
						{!hideRevisorFields ? (
							<div className="col-span-12">
								<FieldRoleLabel>Experiencia del licitante</FieldRoleLabel>
								<TextArea
									rows={2}
									value={data.experienciaLicitante}
									onChange={(e) =>
										setData((prev) => ({ ...prev, experienciaLicitante: e.target.value.toUpperCase() }))
									}
									className="uppercase"
								/>
							</div>
						) : null}
						{!hideRevisorFields ? (
							<>
								<div className="col-span-12 sm:col-span-6">
									<FieldRoleLabel>Lugar ejecución — Calle</FieldRoleLabel>
									<Input
										value={data.calle}
										onChange={(e) => setData((prev) => ({ ...prev, calle: e.target.value.toUpperCase() }))}
										className="uppercase"
									/>
								</div>
								<div className="col-span-12 sm:col-span-6">
									<FieldRoleLabel>Colonia</FieldRoleLabel>
									<Input
										value={data.colonia}
										onChange={(e) => setData((prev) => ({ ...prev, colonia: e.target.value.toUpperCase() }))}
										className="uppercase"
									/>
								</div>
								<div className="col-span-12 sm:col-span-4">
									<FieldRoleLabel>Código postal</FieldRoleLabel>
									<Input value={data.cp} onChange={(e) => setData((prev) => ({ ...prev, cp: e.target.value }))} />
								</div>
								<div className="col-span-12 sm:col-span-8">
									<FieldRoleLabel>Ciudad</FieldRoleLabel>
									<Input
										value={data.ciudad}
										onChange={(e) => setData((prev) => ({ ...prev, ciudad: e.target.value.toUpperCase() }))}
										className="uppercase"
									/>
								</div>
							</>
						) : null}
						<div className="col-span-12 sm:col-span-4">
							<FieldRoleLabel>Periodo ejecución — Inicio</FieldRoleLabel>
							<DateInputWithClear
								value={data.periodoInicio}
								onChange={(v) => setData((prev) => ({ ...prev, periodoInicio: v }))}
							/>
						</div>
						<div className="col-span-12 sm:col-span-4">
							<FieldRoleLabel>Periodo ejecución — Fin</FieldRoleLabel>
							<DateInputWithClear
								value={data.periodoFin}
								onChange={(v) => setData((prev) => ({ ...prev, periodoFin: v }))}
							/>
						</div>
						<div className="col-span-12 sm:col-span-4">
							<FieldRoleLabel>Periodo ejecución (texto)</FieldRoleLabel>
							<Input
								value={data.periodoTexto}
								onChange={(e) => setData((prev) => ({ ...prev, periodoTexto: e.target.value.toUpperCase() }))}
								className="uppercase"
							/>
						</div>
						<div className="col-span-12">
							<FieldRoleLabel>Horario (opcional)</FieldRoleLabel>
							<Input
								value={data.horario}
								onChange={(e) => setData((prev) => ({ ...prev, horario: e.target.value.toUpperCase() }))}
								className="uppercase"
							/>
						</div>
						{!hasPeriodo ? (
							<p className="col-span-12 text-[11px] text-red-600">
								Indique periodo de ejecución (fechas o texto).
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
