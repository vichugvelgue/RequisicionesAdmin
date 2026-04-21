import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Check, Save } from 'lucide-react';
import {
	Button,
	FormSection,
	Input,
	SearchableSelect,
	Toast,
	DateInputWithClear,
} from '../../../../../components/UI';
import { MOCK_UNIDAD_SOLICITANTE } from '../../catalogMockOptions';
import { FieldRoleLabel } from '../../fieldRoleLabel';
import { dateToInputValue } from '../../../../../utils/dateFormat';

export interface MenorServiciosDatosGeneralesForm {
	unidadSolicitanteId: string;
	nombreSolicitante: string;
	cargo: string;
	fechaSolicitud: string;
}

const schema = yup.object({
	unidadSolicitanteId: yup.string().required('*Requerido'),
	nombreSolicitante: yup.string().trim().required('*Requerido'),
	cargo: yup.string().trim().required('*Requerido'),
	fechaSolicitud: yup.string().trim(),
});

const empty: MenorServiciosDatosGeneralesForm = {
	unidadSolicitanteId: '',
	nombreSolicitante: '',
	cargo: '',
	fechaSolicitud: '',
};

function withDefaultFecha(
	initialValues: Partial<MenorServiciosDatosGeneralesForm>
): MenorServiciosDatosGeneralesForm {
	const todayIso = dateToInputValue(new Date());
	return {
		...empty,
		...initialValues,
		fechaSolicitud: initialValues.fechaSolicitud?.trim()
			? initialValues.fechaSolicitud
			: todayIso,
	};
}

export function MenorDatosGeneralesTab({
	initialValues,
	hideRevisorFields,
	onSave,
}: {
	initialValues: Partial<MenorServiciosDatosGeneralesForm>;
	hideRevisorFields: boolean;
	onSave: (data: MenorServiciosDatosGeneralesForm) => void;
}) {
	const [toast, setToast] = useState({
		visible: false,
		title: '',
		variant: 'success' as 'success' | 'error',
	});

	const {
		register,
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<MenorServiciosDatosGeneralesForm>({
		resolver: yupResolver(schema),
		defaultValues: withDefaultFecha(initialValues),
	});

	useEffect(() => {
		reset(withDefaultFecha(initialValues));
	}, [initialValues, reset]);

	useEffect(() => {
		if (!toast.visible) return;
		const t = setTimeout(() => setToast((s) => ({ ...s, visible: false })), 2800);
		return () => clearTimeout(t);
	}, [toast.visible]);

	return (
		<div className="p-4 flex-1 min-h-0 overflow-auto">
			<FormSection>
				<form
					className="space-y-4"
					onSubmit={handleSubmit(
						(data) => {
							onSave({
								...data,
								nombreSolicitante: data.nombreSolicitante.trim().toUpperCase(),
								cargo: data.cargo.trim().toUpperCase(),
							});
							setToast({
								visible: true,
								title: 'Datos generales guardados',
								variant: 'success',
							});
						},
						() =>
							setToast({
								visible: true,
								title: 'Faltan campos por capturar',
								variant: 'error',
							})
					)}
					noValidate
				>
					<div className="grid grid-cols-12 gap-4">
						<div className="col-span-12 lg:col-span-3">
							<FieldRoleLabel>Unidad solicitante</FieldRoleLabel>
							<Controller
								name="unidadSolicitanteId"
								control={control}
								render={({ field }) => (
									<SearchableSelect
										options={MOCK_UNIDAD_SOLICITANTE}
										value={field.value}
										onChange={field.onChange}
										placeholder="Buscar unidad…"
									/>
								)}
							/>
							{errors.unidadSolicitanteId?.message ? (
								<p className="text-[11px] mt-1 text-red-600">
									{errors.unidadSolicitanteId.message}
								</p>
							) : null}
						</div>
						<div className="col-span-12 lg:col-span-3">
							<FieldRoleLabel htmlFor="cs-menor-nom">Nombre del solicitante</FieldRoleLabel>
							<Input id="cs-menor-nom" {...register('nombreSolicitante')} className="uppercase" />
							{errors.nombreSolicitante?.message ? (
								<p className="text-[11px] mt-1 text-red-600">{errors.nombreSolicitante.message}</p>
							) : null}
						</div>
						<div className="col-span-12 lg:col-span-3">
							<FieldRoleLabel htmlFor="cs-menor-car">Cargo</FieldRoleLabel>
							<Input id="cs-menor-car" {...register('cargo')} className="uppercase" />
							{errors.cargo?.message ? (
								<p className="text-[11px] mt-1 text-red-600">{errors.cargo.message}</p>
							) : null}
						</div>
						{!hideRevisorFields ? (
							<div className="col-span-12 lg:col-span-3">
								<FieldRoleLabel>Fecha</FieldRoleLabel>
								<Controller
									name="fechaSolicitud"
									control={control}
									render={({ field }) => (
										<DateInputWithClear value={field.value ?? ''} onChange={field.onChange} />
									)}
								/>
								{errors.fechaSolicitud?.message ? (
									<p className="text-[11px] mt-1 text-red-600">{errors.fechaSolicitud.message}</p>
								) : null}
							</div>
						) : null}
					</div>
					<div className="flex justify-end pt-2">
						<Button type="submit" variant="success" size="md" leftIcon={<Save className="w-4 h-4" />}>
							Guardar sección
						</Button>
					</div>
				</form>
			</FormSection>
			<Toast
				visible={toast.visible}
				title={toast.title}
				variant={toast.variant}
				icon={<Check className="w-3.5 h-3.5 text-white" />}
			/>
		</div>
	);
}
