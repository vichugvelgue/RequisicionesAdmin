import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Check, Save } from 'lucide-react';
import { Button, FormSection, TextArea, Toast } from '../../../../../components/UI';
import { FieldRoleLabel } from '../../fieldRoleLabel';
import type { MenorDetalleServicioValues } from '../../types';

const schema = yup.object({
	descripcionGeneral: yup.string().trim().required('*Requerido'),
	descripcionEspecifica: yup.string().trim().required('*Requerido'),
	lugarEjecucionServicio: yup.string().trim().required('*Requerido'),
	personalRequerido: yup.string().trim().required('*Requerido'),
	condicionesGeneralesContratacion: yup.string().trim().required('*Requerido'),
});

const empty: MenorDetalleServicioValues = {
	descripcionGeneral: '',
	descripcionEspecifica: '',
	lugarEjecucionServicio: '',
	personalRequerido: '',
	condicionesGeneralesContratacion: '',
};

export function MenorDetalleServicioTab({
	initialValues,
	onSave,
}: {
	initialValues: Partial<MenorDetalleServicioValues>;
	onSave: (data: MenorDetalleServicioValues) => void;
}) {
	const [toast, setToast] = useState({
		visible: false,
		title: '',
		variant: 'success' as 'success' | 'error',
	});

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<MenorDetalleServicioValues>({
		resolver: yupResolver(schema),
		defaultValues: { ...empty, ...initialValues },
	});

	useEffect(() => {
		reset({ ...empty, ...initialValues });
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
								descripcionGeneral: data.descripcionGeneral.trim().toUpperCase(),
								descripcionEspecifica: data.descripcionEspecifica.trim().toUpperCase(),
								lugarEjecucionServicio: data.lugarEjecucionServicio.trim().toUpperCase(),
								personalRequerido: data.personalRequerido.trim().toUpperCase(),
								condicionesGeneralesContratacion: data.condicionesGeneralesContratacion
									.trim()
									.toUpperCase(),
							});
							setToast({
								visible: true,
								title: 'Detalle del servicio guardado',
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
						<div className="col-span-12">
							<FieldRoleLabel htmlFor="cs-det-desc">Descripción general</FieldRoleLabel>
							<TextArea id="cs-det-desc" rows={2} {...register('descripcionGeneral')} className="uppercase" />
							{errors.descripcionGeneral?.message ? (
								<p className="text-[11px] mt-1 text-red-600">{errors.descripcionGeneral.message}</p>
							) : null}
						</div>
						<div className="col-span-12">
							<FieldRoleLabel htmlFor="cs-det-desc2">Descripción específica</FieldRoleLabel>
							<TextArea
								id="cs-det-desc2"
								rows={2}
								{...register('descripcionEspecifica')}
								className="uppercase"
							/>
							{errors.descripcionEspecifica?.message ? (
								<p className="text-[11px] mt-1 text-red-600">{errors.descripcionEspecifica.message}</p>
							) : null}
						</div>
						<div className="col-span-12">
							<FieldRoleLabel htmlFor="cs-det-lugar">Lugar de ejecución del servicio</FieldRoleLabel>
							<TextArea
								id="cs-det-lugar"
								rows={2}
								{...register('lugarEjecucionServicio')}
								className="uppercase"
							/>
							{errors.lugarEjecucionServicio?.message ? (
								<p className="text-[11px] mt-1 text-red-600">{errors.lugarEjecucionServicio.message}</p>
							) : null}
						</div>
						<div className="col-span-12">
							<FieldRoleLabel htmlFor="cs-det-per">Personal requerido</FieldRoleLabel>
							<TextArea id="cs-det-per" rows={2} {...register('personalRequerido')} className="uppercase" />
							{errors.personalRequerido?.message ? (
								<p className="text-[11px] mt-1 text-red-600">{errors.personalRequerido.message}</p>
							) : null}
						</div>
						<div className="col-span-12">
							<FieldRoleLabel htmlFor="cs-det-cond">Condiciones generales de contratación</FieldRoleLabel>
							<TextArea
								id="cs-det-cond"
								rows={2}
								{...register('condicionesGeneralesContratacion')}
								className="uppercase"
							/>
							{errors.condicionesGeneralesContratacion?.message ? (
								<p className="text-[11px] mt-1 text-red-600">
									{errors.condicionesGeneralesContratacion.message}
								</p>
							) : null}
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
