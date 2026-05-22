import React, { useState, useEffect } from 'react';
import { Button, FormSection, Input, TextArea, Toast } from '../../../../../components/UI';
import { FieldRoleLabel } from '../../fieldRoleLabel';
import type { ServiciosMayorCondicionesValues } from '../../types';
import { requisicionApi } from '../../../../../api/requisicionBienesAPI';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Check } from 'lucide-react';

const schemaFull = yup.object({
	diasEntrega: yup.string().required('*Requerido').defined(),
	condicionesGeneralesContratacion: yup.string().defined(),
	pagosSeRealizaran: yup.string().required('*Requerido').defined(),
});
const empty: ServiciosMayorCondicionesValues = {
	diasEntrega: '',
	condicionesGeneralesContratacion: '',
	pagosSeRealizaran: '',
};

export function MayorCondicionesTab({
	idRequisicion,
	idUsuario,
	initialValues,
	hideRevisorFields,
	onSave,
}: {
	idRequisicion: number;
	idUsuario: number;
	initialValues: Partial<ServiciosMayorCondicionesValues>;
	hideRevisorFields: boolean;
	onSave: (data: ServiciosMayorCondicionesValues) => void;
}) {
	const [isSaving, setIsSaving] = useState(false);
	const [toast, setToast] = useState({
		visible: false,
		title: '',
		variant: 'success' as 'success' | 'error',
	});
	const Resolver = yupResolver(schemaFull);

	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors },
	} = useForm<ServiciosMayorCondicionesValues>({
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		resolver: Resolver as any,
		defaultValues: { ...empty, ...initialValues, },
	});

	useEffect(() => {
		reset({ ...empty, ...initialValues, })
	}, [initialValues]);

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

	const onSubmit = async (data: ServiciosMayorCondicionesValues) => {
		try {
			setIsSaving(true);

			const usuarioIdFinal = getUsuarioId() || Number(idUsuario ?? 0);
			const payloadFinal: ServiciosMayorCondicionesValues = {
				...data,
			};

			await requisicionApi.guardarDatosCondiciones({
				idRequisicion: idRequisicion,
				idUsuario: usuarioIdFinal,
				...payloadFinal
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
						<div className="col-span-12 sm:col-span-6">
							<FieldRoleLabel>Días de entrega</FieldRoleLabel>
							<Input
								{...register('diasEntrega')}
								className="uppercase"
							/>
							{errors.diasEntrega?.message ? (
								<p className="text-[11px] mt-1 text-red-600">{errors.diasEntrega.message}</p>
							) : null}
						</div>
						<div className="col-span-12">
							<FieldRoleLabel>Condiciones generales de contratación</FieldRoleLabel>
							<TextArea
								rows={3}
								{...register('condicionesGeneralesContratacion')}
								className="uppercase"
							/>
							{errors.condicionesGeneralesContratacion?.message ? (
								<p className="text-[11px] mt-1 text-red-600">{errors.condicionesGeneralesContratacion.message}</p>
							) : null}
						</div>
						<div className="col-span-12">
							<FieldRoleLabel>Los pagos se realizarán</FieldRoleLabel>
							<TextArea
								rows={3}
								{...register('pagosSeRealizaran')}
								className="uppercase"
							/>
							{errors.pagosSeRealizaran?.message ? (
								<p className="text-[11px] mt-1 text-red-600">{errors.pagosSeRealizaran.message}</p>
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
