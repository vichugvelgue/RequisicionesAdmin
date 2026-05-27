import React, { useState, useEffect } from 'react';
import { Button, DateInputWithClear, FormSection, Input, TextArea, Toast } from '../../../../../components/UI';
import { requisicionApi } from '../../../../../api/requisicionBienesAPI';
import { dateToInputValue } from '../../../../../utils/dateFormat';
import { FieldRoleLabel } from '../../fieldRoleLabel';
import type { ServiciosMayorEjecucionValues } from '../../types';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { Check } from 'lucide-react';

const schemaFull = yup.object({
	experienciaLicitante: yup.string().required('*Requerido').defined(),
	calle: yup.string().required('*Requerido').defined(),
	colonia: yup.string().required('*Requerido').defined(),
	cp: yup.string().required('*Requerido').defined(),
	ciudad: yup.string().required('*Requerido').defined(),
	nombreDependenciaEntrega: yup.string().required('*Requerido').defined(),
	telefonoEntrega: yup.string().required('*Requerido').defined(),
	extencionTelefonoEntrega: yup.string().required('*Requerido').defined(),
});

const empty: ServiciosMayorEjecucionValues = {
	experienciaLicitante: '',
	calle: '',
	colonia: '',
	cp: '',
	ciudad: '',
	nombreDependenciaEntrega: '',
	telefonoEntrega: '',
	extencionTelefonoEntrega: '',
};

export function MayorEjecucionTab({
	idRequisicion,
	idUsuario,
	initialValues,
	hideRevisorFields,
	onSave,
}: {
	idRequisicion: number;
	idUsuario: number;
	initialValues: Partial<ServiciosMayorEjecucionValues>;
	hideRevisorFields: boolean;
	onSave: (data: ServiciosMayorEjecucionValues) => void;
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
	} = useForm<ServiciosMayorEjecucionValues>({
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		resolver: Resolver as any,
		defaultValues: withDefaultFecha(initialValues),
	});

	useEffect(() => {
	reset(withDefaultFecha(initialValues));
}, [initialValues, reset]);

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
	// const hasPeriodo = data.periodoTexto.trim() || (data.periodoInicio.trim() && data.periodoFin.trim());

	function withDefaultFecha(
	initialValues: Partial<ServiciosMayorEjecucionValues>
): ServiciosMayorEjecucionValues {
	return {
		experienciaLicitante: initialValues.experienciaLicitante ?? '',
		calle: initialValues.calle ?? '',
		colonia: initialValues.colonia ?? '',
		cp: initialValues.cp ?? '',
		ciudad: initialValues.ciudad ?? '',
		nombreDependenciaEntrega: initialValues.nombreDependenciaEntrega ?? '',
		telefonoEntrega: initialValues.telefonoEntrega ?? '',
		extencionTelefonoEntrega: initialValues.extencionTelefonoEntrega ?? '',
	};
}

	const onSubmit = async (data: ServiciosMayorEjecucionValues) => {
		try {
			setIsSaving(true);

			const usuarioIdFinal = getUsuarioId() || Number(idUsuario ?? 0);
			const payloadFinal: ServiciosMayorEjecucionValues = {
				...data,
			};

			await requisicionApi.guardarDatosEjecucion({
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

	useEffect(() => {
		if (!toast.visible) return;
		const t = setTimeout(() => setToast((s) => ({ ...s, visible: false })), 2800);
		return () => clearTimeout(t);
	}, [toast.visible]);

	return (
		<div className="p-4 flex-1 min-h-0 overflow-auto">
			<FormSection>
				<form className="space-y-4" onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate>
					<div className="grid grid-cols-12 gap-4">
						<div className="col-span-12">
							<FieldRoleLabel>Experiencia del licitante</FieldRoleLabel>
							<TextArea
								rows={2}
								{...register('experienciaLicitante')}
								className="uppercase"
							/>
							{errors.experienciaLicitante?.message ? (
								<p className="text-[11px] mt-1 text-red-600">{errors.experienciaLicitante.message}</p>
							) : null}
						</div>
						<div className="col-span-12 sm:col-span-6">
							<FieldRoleLabel>Lugar ejecución — Calle</FieldRoleLabel>
							<Input
								{...register('calle')}
								className="uppercase"
							/>
							{errors.calle?.message ? (
								<p className="text-[11px] mt-1 text-red-600">{errors.calle.message}</p>
							) : null}
						</div>
						<div className="col-span-12 sm:col-span-6">
							<FieldRoleLabel>Colonia</FieldRoleLabel>
							<Input
								{...register('colonia')}
								className="uppercase"
							/>
							{errors.colonia?.message ? (
								<p className="text-[11px] mt-1 text-red-600">{errors.colonia.message}</p>
							) : null}
						</div>
						<div className="col-span-12 sm:col-span-4">
							<FieldRoleLabel>Código postal</FieldRoleLabel>
							<Input
								{...register('cp')}
								className="uppercase"
							/>
							{errors.cp?.message ? (
								<p className="text-[11px] mt-1 text-red-600">{errors.cp.message}</p>
							) : null}
						</div>
						<div className="col-span-12 sm:col-span-8">
							<FieldRoleLabel>Ciudad</FieldRoleLabel>
							<Input
								{...register('ciudad')}
								className="uppercase"
							/>
							{errors.ciudad?.message ? (
								<p className="text-[11px] mt-1 text-red-600">{errors.ciudad.message}</p>
							) : null}
						</div>
						<div className="col-span-12 sm:col-span-6">
							<FieldRoleLabel>Nombre de la dependencia donde se entregarán los servicios</FieldRoleLabel>
							<Input
								{...register('nombreDependenciaEntrega')}
								className="uppercase"
							/>
							{errors.nombreDependenciaEntrega?.message ? (
								<p className="text-[11px] mt-1 text-red-600">{errors.nombreDependenciaEntrega.message}</p>
							) : null}
						</div>
						<div className="col-span-12 sm:col-span-6">
							<FieldRoleLabel>Teléfono de entrega</FieldRoleLabel>
							<Input
								{...register('telefonoEntrega')}
								className="uppercase"
							/>
							{errors.telefonoEntrega?.message ? (
								<p className="text-[11px] mt-1 text-red-600">{errors.telefonoEntrega.message}</p>
							) : null}
						</div>
						<div className="col-span-12 sm:col-span-6">
							<FieldRoleLabel>Extensión del teléfono de entrega</FieldRoleLabel>
							<Input
								{...register('extencionTelefonoEntrega')}
								className="uppercase"
							/>
							{errors.extencionTelefonoEntrega?.message ? (
								<p className="text-[11px] mt-1 text-red-600">{errors.extencionTelefonoEntrega.message}</p>
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
