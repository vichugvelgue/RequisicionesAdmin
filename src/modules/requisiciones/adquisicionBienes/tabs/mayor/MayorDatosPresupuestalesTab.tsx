import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Check, Save } from 'lucide-react';
import {
	Button,
	FormSection,
	SearchableSelect,
	Toast,
	DecimalStringCellInput,
} from '../../../../../components/UI';
import {
	MOCK_ACTIVIDAD,
	MOCK_CLAVE_PRESUPUESTAL,
	MOCK_COMPONENTE,
	MOCK_ORIGEN_RECURSO,
	MOCK_TIPO_PROGRAMA,
} from '../../catalogMockOptions';
import { FieldRoleLabel } from '../../fieldRoleLabel';
import type { MayorDatosPresupuestalesValues } from '../../types';

const schema = yup.object({
	presupuestoAutorizado: yup.string().trim().required('*Requerido'),
	clavePresupuestalId: yup.string().required('*Requerido'),
	origenRecursoId: yup.string().required('*Requerido'),
	componenteId: yup.string().required('*Requerido'),
	actividadId: yup.string().required('*Requerido'),
	tipoProgramaId: yup.string().required('*Requerido'),
});

const empty: MayorDatosPresupuestalesValues = {
	presupuestoAutorizado: '',
	clavePresupuestalId: '',
	origenRecursoId: '',
	componenteId: '',
	actividadId: '',
	tipoProgramaId: '',
};

export function MayorDatosPresupuestalesTab({
	initialValues,
	onSave,
}: {
	initialValues: Partial<MayorDatosPresupuestalesValues>;
	onSave: (data: MayorDatosPresupuestalesValues) => void;
}) {
	const [toast, setToast] = useState({
		visible: false,
		title: '',
		variant: 'success' as 'success' | 'error',
	});

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<MayorDatosPresupuestalesValues>({
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
							onSave(data);
							setToast({
								visible: true,
								title: 'Datos presupuestales guardados',
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
						<div className="col-span-12 lg:col-span-4">
							<FieldRoleLabel>Presupuesto autorizado</FieldRoleLabel>
							<Controller
								name="presupuestoAutorizado"
								control={control}
								render={({ field }) => (
									<DecimalStringCellInput
										value={field.value}
										onChange={field.onChange}
										onBlur={field.onBlur}
										fractionDigits={2}
										className="!py-1.5 !px-2.5 w-full"
									/>
								)}
							/>
							{errors.presupuestoAutorizado?.message ? (
								<p className="text-[11px] mt-1 text-red-600">
									{errors.presupuestoAutorizado.message}
								</p>
							) : null}
						</div>
						<div className="col-span-12 lg:col-span-4">
							<FieldRoleLabel>Clave presupuestal / objeto de gasto</FieldRoleLabel>
							<Controller
								name="clavePresupuestalId"
								control={control}
								render={({ field }) => (
									<SearchableSelect
										options={MOCK_CLAVE_PRESUPUESTAL}
										value={field.value}
										onChange={field.onChange}
										placeholder="Buscar…"
									/>
								)}
							/>
							{errors.clavePresupuestalId?.message ? (
								<p className="text-[11px] mt-1 text-red-600">
									{errors.clavePresupuestalId.message}
								</p>
							) : null}
						</div>
						<div className="col-span-12 lg:col-span-4">
							<FieldRoleLabel>Origen del recurso</FieldRoleLabel>
							<Controller
								name="origenRecursoId"
								control={control}
								render={({ field }) => (
									<SearchableSelect
										options={MOCK_ORIGEN_RECURSO}
										value={field.value}
										onChange={field.onChange}
										placeholder="Buscar…"
									/>
								)}
							/>
							{errors.origenRecursoId?.message ? (
								<p className="text-[11px] mt-1 text-red-600">{errors.origenRecursoId.message}</p>
							) : null}
						</div>
						<div className="col-span-12 lg:col-span-4">
							<FieldRoleLabel>Componente</FieldRoleLabel>
							<Controller
								name="componenteId"
								control={control}
								render={({ field }) => (
									<SearchableSelect
										options={MOCK_COMPONENTE}
										value={field.value}
										onChange={field.onChange}
										placeholder="Buscar…"
									/>
								)}
							/>
							{errors.componenteId?.message ? (
								<p className="text-[11px] mt-1 text-red-600">{errors.componenteId.message}</p>
							) : null}
						</div>
						<div className="col-span-12 lg:col-span-4">
							<FieldRoleLabel>Actividad</FieldRoleLabel>
							<Controller
								name="actividadId"
								control={control}
								render={({ field }) => (
									<SearchableSelect
										options={MOCK_ACTIVIDAD}
										value={field.value}
										onChange={field.onChange}
										placeholder="Buscar…"
									/>
								)}
							/>
							{errors.actividadId?.message ? (
								<p className="text-[11px] mt-1 text-red-600">{errors.actividadId.message}</p>
							) : null}
						</div>
						<div className="col-span-12 lg:col-span-4">
							<FieldRoleLabel>Tipo de programa</FieldRoleLabel>
							<Controller
								name="tipoProgramaId"
								control={control}
								render={({ field }) => (
									<SearchableSelect
										options={MOCK_TIPO_PROGRAMA}
										value={field.value}
										onChange={field.onChange}
										placeholder="Buscar…"
									/>
								)}
							/>
							{errors.tipoProgramaId?.message ? (
								<p className="text-[11px] mt-1 text-red-600">{errors.tipoProgramaId.message}</p>
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
