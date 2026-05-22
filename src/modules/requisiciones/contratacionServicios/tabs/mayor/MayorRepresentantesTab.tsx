import React, { useEffect, useState } from 'react';
import { Button, FormSection, Input, Toast } from '../../../../../components/UI';
import { FieldRoleLabel } from '../../fieldRoleLabel';
import type { ServiciosPersonaContactoValues } from '../../types';
import { PersonaContactoValues } from '@/modules/requisiciones/adquisicionBienes/types';
import { requisicionApi } from '../../../../../api/requisicionBienesAPI';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Check } from 'lucide-react';

const schema = yup.object({
	nombre: yup.string().trim().required('*Requerido').defined(),
	cargo: yup.string().trim().required('*Requerido').defined(),
	correo: yup.string().trim().email('*Correo inválido').required('*Requerido').defined(),
	telefono: yup.string().trim().required('*Requerido').defined(),
});

const empty: PersonaContactoValues = {
	nombre: '',
	cargo: '',
	correo: '',
	telefono: '',
};

export function MayorRepresentantesTab({
	idRequisicion,
	idUsuario,
	initialValues,
	onSave,
}: {
	idRequisicion: number;
	idUsuario: number;
	initialValues: Partial<PersonaContactoValues>;
	onSave: (data: PersonaContactoValues) => void;
}) {
	const [isSaving, setIsSaving] = useState(false);
	const [toast, setToast] = useState({
		visible: false,
		title: '',
		variant: 'success' as 'success' | 'error',
	});
	const Resolver = yupResolver(schema);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<PersonaContactoValues>({
		resolver: yupResolver(schema) as any,
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

	const getUsuarioId = (): number => {
		try {
			const session = JSON.parse(
				localStorage.getItem('requisiciones_admin_auth_v1') || 'null'
			);

			return Number(session?.user?.id ?? 0);
		} catch {
			return 0;
		}
	};

	const onSubmit = async (data: PersonaContactoValues) => {
		try {
			setIsSaving(true);

			const usuarioIdFinal = getUsuarioId() || Number(idUsuario ?? 0);
			const payloadFinal: PersonaContactoValues = {
				...data,
			};

			await requisicionApi.guardarRepresentante({
				idRequisicion: idRequisicion,
				idUsuario: usuarioIdFinal,
				correoElectronico: data.correo,
				...data
			});

			onSave(payloadFinal);

			setToast({
				visible: true,
				title: 'Datos de ejecución guardados',
				variant: 'success',
			});
		} catch (error) {
			setToast({
				visible: true,
				title:
					error instanceof Error
						? error.message
						: 'No se pudieron guardar los datos generales',
				variant: 'error',
			});
		} finally {
			setIsSaving(false);
		}
	};

	const onInvalid = () => {
		setToast({
			visible: true,
			title: 'Faltan campos por capturar',
			variant: 'error',
		});
	};

	return (
		<div className="p-4 flex-1 min-h-0 overflow-auto">
			<FormSection>
				<form className="space-y-4" onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate>
					<div className="grid grid-cols-12 gap-4">
						<div className="col-span-12 lg:col-span-3">
							<FieldRoleLabel htmlFor="cs-rep-nom">Nombre</FieldRoleLabel>
							<Input id="cs-rep-nom" {...register('nombre')} className="uppercase" />
							{errors.nombre?.message ? (
								<p className="text-[11px] mt-1 text-red-600">{errors.nombre.message}</p>
							) : null}
						</div>
						<div className="col-span-12 lg:col-span-3">
							<FieldRoleLabel htmlFor="cs-rep-car">Cargo</FieldRoleLabel>
							<Input id="cs-rep-car" {...register('cargo')} className="uppercase" />
							{errors.cargo?.message ? (
								<p className="text-[11px] mt-1 text-red-600">{errors.cargo.message}</p>
							) : null}
						</div>
						<div className="col-span-12 lg:col-span-3">
							<FieldRoleLabel htmlFor="cs-rep-mail">Correo electrónico</FieldRoleLabel>
							<Input id="cs-rep-mail" type="email" {...register('correo')} className="uppercase" />
							{errors.correo?.message ? (
								<p className="text-[11px] mt-1 text-red-600">{errors.correo.message}</p>
							) : null}
						</div>
						<div className="col-span-12 lg:col-span-3">
							<FieldRoleLabel htmlFor="cs-rep-tel">Teléfono</FieldRoleLabel>
							<Input id="cs-rep-tel" {...register('telefono')} />
							{errors.telefono?.message ? (
								<p className="text-[11px] mt-1 text-red-600">{errors.telefono.message}</p>
							) : null}
						</div>
					</div>
					<div className="flex justify-end pt-2">
						<Button type="submit" variant="success" size="md">
							{isSaving ? 'Guardando...' : 'Guardar sección'}
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
