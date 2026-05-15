import React, { useEffect, useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Check, Save } from 'lucide-react';
import { Button, FormSection, Input, Toast } from '../../../../../components/UI';
import { FieldRoleLabel } from '../../fieldRoleLabel';
import type { PersonaContactoValues } from '../../types';
import { requisicionApi } from '../../../../../api';

const schema: yup.ObjectSchema<PersonaContactoValues> = yup
	.object({
		nombre: yup.string().trim().required('*Requerido').defined(),
		cargo: yup.string().trim().required('*Requerido').defined(),
		correo: yup.string().trim().email('*Correo inválido').required('*Requerido').defined(),
		telefono: yup.string().trim().required('*Requerido').defined(),
	})
	.required();

const empty: PersonaContactoValues = {
	nombre: '',
	cargo: '',
	correo: '',
	telefono: '',
};

export function MayorRepresentantesTab({
	initialValues,
	idRequisicion,
	idUsuario,
	onSave,
}: {
	initialValues: Partial<PersonaContactoValues>;
	idRequisicion: number;
	idUsuario: number;
	onSave: (data: PersonaContactoValues) => void;
}) {
	const [toast, setToast] = useState({
		visible: false,
		title: '',
		variant: 'success' as 'success' | 'error',
	});

	const [saving, setSaving] = useState(false);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<PersonaContactoValues>({
		resolver: yupResolver(schema) as Resolver<PersonaContactoValues>,
		defaultValues: { ...empty, ...initialValues },
	});

	useEffect(() => {
		reset({ ...empty, ...initialValues });
	}, [
		initialValues.nombre,
		initialValues.cargo,
		initialValues.correo,
		initialValues.telefono,
		reset,
	]);

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
						async (data) => {
							const dataNormalizada: PersonaContactoValues = {
								nombre: data.nombre.trim().toUpperCase(),
								cargo: data.cargo.trim().toUpperCase(),
								correo: data.correo.trim().toLowerCase(),
								telefono: data.telefono.trim(),
							};

							try {
								setSaving(true);

								await requisicionApi.guardarRepresentante({
									idRequisicion,
									idUsuario,
									nombre: dataNormalizada.nombre,
									cargo: dataNormalizada.cargo,
									correoElectronico: dataNormalizada.correo,
									telefono: dataNormalizada.telefono,
								});

								onSave(dataNormalizada);

								setToast({
									visible: true,
									title: 'Representante guardado',
									variant: 'success',
								});
							} catch (error) {
								setToast({
									visible: true,
									title:
										error instanceof Error
											? error.message
											: 'Error al guardar representante',
									variant: 'error',
								});
							} finally {
								setSaving(false);
							}
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
							<FieldRoleLabel htmlFor="rep-nom">Nombre</FieldRoleLabel>
							<Input id="rep-nom" {...register('nombre')} className="uppercase" />
							{errors.nombre?.message ? (
								<p className="text-[11px] mt-1 text-red-600">{errors.nombre.message}</p>
							) : null}
						</div>

						<div className="col-span-12 lg:col-span-3">
							<FieldRoleLabel htmlFor="rep-car">Cargo</FieldRoleLabel>
							<Input id="rep-car" {...register('cargo')} className="uppercase" />
							{errors.cargo?.message ? (
								<p className="text-[11px] mt-1 text-red-600">{errors.cargo.message}</p>
							) : null}
						</div>

						<div className="col-span-12 lg:col-span-3">
							<FieldRoleLabel htmlFor="rep-mail">Correo electrónico</FieldRoleLabel>
							<Input id="rep-mail" type="email" {...register('correo')} />
							{errors.correo?.message ? (
								<p className="text-[11px] mt-1 text-red-600">{errors.correo.message}</p>
							) : null}
						</div>

						<div className="col-span-12 lg:col-span-3">
							<FieldRoleLabel htmlFor="rep-tel">Teléfono</FieldRoleLabel>
							<Input id="rep-tel" {...register('telefono')} />
							{errors.telefono?.message ? (
								<p className="text-[11px] mt-1 text-red-600">{errors.telefono.message}</p>
							) : null}
						</div>
					</div>

					<div className="flex justify-end pt-2">
						<Button
							type="submit"
							variant="success"
							size="md"
							leftIcon={<Save className="w-4 h-4" />}
							disabled={saving}
						>
							{saving ? 'Guardando...' : 'Guardar sección'}
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