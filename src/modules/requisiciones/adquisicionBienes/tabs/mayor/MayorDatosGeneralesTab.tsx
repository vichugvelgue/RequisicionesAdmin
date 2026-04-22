import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Check, Save } from 'lucide-react';
import {
	Button,
	FormSection,
	Input,
	RadioGroup,
	SearchableSelect,
	Toast,
	DateInputWithClear,
} from '../../../../../components/UI';
import { MOCK_UNIDAD_SOLICITANTE } from '../../catalogMockOptions';
import { FieldRoleLabel } from '../../fieldRoleLabel';
import type { MayorDatosGeneralesValues } from '../../types';
import { dateToInputValue } from '../../../../../utils/dateFormat';

const schemaSolicitante = yup.object({
	unidadSolicitanteId: yup.string().required('*Requerido'),
	nombreTitular: yup.string().trim().required('*Requerido'),
	cargoSolicitante: yup.string().trim().required('*Requerido'),
	fechaSolicitud: yup.string().trim(),
	caracterProcedimiento: yup.string().required('*Requerido'),
	modalidadContratacion: yup.string().required('*Requerido'),
	tipoProcedimiento: yup.string().trim().required('*Requerido'),
});

const schemaFull = schemaSolicitante.shape({
	fechaSolicitud: yup.string().trim().required('*Requerido'),
});

const empty: MayorDatosGeneralesValues = {
	unidadSolicitanteId: '',
	nombreTitular: '',
	cargoSolicitante: '',
	fechaSolicitud: dateToInputValue(new Date()),
	caracterProcedimiento: 'NACIONAL',
	modalidadContratacion: 'FIJA',
	tipoProcedimiento: '',
};

function withDefaultFecha(initialValues: Partial<MayorDatosGeneralesValues>): MayorDatosGeneralesValues {
	const todayIso = dateToInputValue(new Date());
	return {
		...empty,
		...initialValues,
		fechaSolicitud: initialValues.fechaSolicitud?.trim() ? initialValues.fechaSolicitud : todayIso,
	};
}

export function MayorDatosGeneralesTab({
	initialValues,
	hideRevisorFields,
	onSave,
}: {
	initialValues: Partial<MayorDatosGeneralesValues>;
	hideRevisorFields: boolean;
	onSave: (data: MayorDatosGeneralesValues) => void;
}) {
	const [toast, setToast] = useState<{
		visible: boolean;
		title: string;
		variant: 'success' | 'error';
	}>({ visible: false, title: '', variant: 'success' });

	const resolver = yupResolver(hideRevisorFields ? schemaSolicitante : schemaFull);

	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors },
	} = useForm<MayorDatosGeneralesValues>({
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		resolver: resolver as any,
		defaultValues: withDefaultFecha(initialValues),
	});

	useEffect(() => {
		reset(withDefaultFecha(initialValues));
	}, [initialValues, reset]);

	const onSubmit = (data: MayorDatosGeneralesValues) => {
		const fechaSolicitud = hideRevisorFields
			? (initialValues.fechaSolicitud ?? '').trim()
			: (data.fechaSolicitud ?? '').trim();
		onSave({
			...data,
			fechaSolicitud,
			nombreTitular: data.nombreTitular.trim().toUpperCase(),
			cargoSolicitante: data.cargoSolicitante.trim().toUpperCase(),
			tipoProcedimiento: data.tipoProcedimiento.trim().toUpperCase(),
		});
		setToast({
			visible: true,
			title: 'Datos generales guardados',
			variant: 'success',
		});
	};

	const onInvalid = () => {
		setToast({
			visible: true,
			title: 'Faltan campos por capturar',
			variant: 'error',
		});
	};

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
					onSubmit={handleSubmit(onSubmit, onInvalid)}
					noValidate
				>
					<div className="grid grid-cols-12 gap-4">
						<div className="col-span-12 lg:col-span-6 space-y-4">
							<div>
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
							<div>
								<FieldRoleLabel htmlFor="mayor-nombre-titular">
									Nombre titular
								</FieldRoleLabel>
								<Input
									id="mayor-nombre-titular"
									{...register('nombreTitular')}
									className="uppercase"
								/>
								{errors.nombreTitular?.message ? (
									<p className="text-[11px] mt-1 text-red-600">
										{errors.nombreTitular.message}
									</p>
								) : null}
							</div>
							<div>
								<FieldRoleLabel htmlFor="mayor-cargo">
									Cargo del solicitante
								</FieldRoleLabel>
								<Input id="mayor-cargo" {...register('cargoSolicitante')} className="uppercase" />
								{errors.cargoSolicitante?.message ? (
									<p className="text-[11px] mt-1 text-red-600">
										{errors.cargoSolicitante.message}
									</p>
								) : null}
							</div>
							<div>
								<FieldRoleLabel htmlFor="mayor-tipo-proc">
									Tipo de procedimiento
								</FieldRoleLabel>
								<Input id="mayor-tipo-proc" {...register('tipoProcedimiento')} className="uppercase" />
								{errors.tipoProcedimiento?.message ? (
									<p className="text-[11px] mt-1 text-red-600">
										{errors.tipoProcedimiento.message}
									</p>
								) : null}
							</div>
						</div>
						<div className="col-span-12 lg:col-span-6 space-y-4">
							{!hideRevisorFields ? (
								<div>
									<FieldRoleLabel>Fecha de solicitud</FieldRoleLabel>
									<Controller
										name="fechaSolicitud"
										control={control}
										render={({ field }) => (
											<DateInputWithClear
												value={field.value ?? ''}
												onChange={field.onChange}
											/>
										)}
									/>
									{errors.fechaSolicitud?.message ? (
										<p className="text-[11px] mt-1 text-red-600">
											{errors.fechaSolicitud.message}
										</p>
									) : null}
								</div>
							) : null}
							<Controller
								name="caracterProcedimiento"
								control={control}
								render={({ field }) => (
									<RadioGroup
										label="Carácter del procedimiento (solicitante)"
										name="caracterProc"
										value={field.value}
										onChange={(e) => field.onChange(e.target.value)}
										options={[
											{ value: 'NACIONAL', label: 'Nacional' },
											{ value: 'INTERNACIONAL', label: 'Internacional' },
										]}
									/>
								)}
							/>
							<Controller
								name="modalidadContratacion"
								control={control}
								render={({ field }) => (
									<RadioGroup
										label="Modalidad de contratación (solicitante)"
										name="modalidad"
										value={field.value}
										onChange={(e) => field.onChange(e.target.value)}
										options={[
											{ value: 'FIJA', label: 'Fija' },
											{ value: 'ABIERTA', label: 'Abierta' },
										]}
									/>
								)}
							/>
						</div>
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
