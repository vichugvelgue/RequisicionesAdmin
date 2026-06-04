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
	Toast,
} from '../../../../../components/UI';
import { FieldRoleLabel } from '../../fieldRoleLabel';
import type { MayorDatosAdministrativosValues } from '../../types';
import { requisicionApi } from '../../../../../api/requisicionBienesAPI';

const schema: yup.ObjectSchema<MayorDatosAdministrativosValues> = yup.object({
	aniosExperienciaLicitante: yup.string().defined(),
	pagosSeRealizaran: yup.string().defined(),
	adquisicionMedianteContrato: yup.string().required('*Requerido').defined(),
	articuloConformidad: yup.string().required('*Requerido').defined(),
	lugarEntregaCalle: yup.string().required('*Requerido').defined(),
	lugarEntregaColonia: yup.string().required('*Requerido').defined(),
	lugarEntregaCp: yup.string().required('*Requerido').defined(),
	lugarEntregaCiudad: yup.string().required('*Requerido').defined(),
	diasEntrega: yup.string().required('*Requerido').defined(),
	nombreDependenciaEntrega: yup.string().required('*Requerido').defined(),
	telefonoEntrega: yup.string().required('*Requerido').defined(),
	extencionTelefonoEntrega: yup.string().required('*Requerido').defined(),
});

const empty: MayorDatosAdministrativosValues = {
	aniosExperienciaLicitante: '',
	pagosSeRealizaran: '',
	adquisicionMedianteContrato: 'FIJO',
	articuloConformidad: '107',
	lugarEntregaCalle: '',
	lugarEntregaColonia: '',
	lugarEntregaCp: '',
	lugarEntregaCiudad: '',
	diasEntrega: '',
	nombreDependenciaEntrega: '',
	telefonoEntrega: '',
	extencionTelefonoEntrega: '',
};

export function MayorDatosAdministrativosTab({
	idRequisicion,
	idUsuario,
	initialValues,
	onSave,
}: {
	idRequisicion: number;
	idUsuario: number;
	initialValues: Partial<MayorDatosAdministrativosValues>;
	onSave: (data: MayorDatosAdministrativosValues) => void;
}) {
	const [isSaving, setIsSaving] = useState(false);

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
	} = useForm<MayorDatosAdministrativosValues>({
		resolver: yupResolver(schema) as any,
		defaultValues: { ...empty, ...initialValues },
	});

	useEffect(() => {
		reset({ ...empty, ...initialValues });
	}, [reset]);

	useEffect(() => {
		if (!toast.visible) return;

		const t = setTimeout(
			() => setToast((s) => ({ ...s, visible: false })),
			2800
		);

		return () => clearTimeout(t);
	}, [toast.visible]);

	const norm = (s?: string) => (s ?? '').trim().toUpperCase();

	const onSubmit = async (data: MayorDatosAdministrativosValues) => {
		try {
			setIsSaving(true);

			const cleanData: MayorDatosAdministrativosValues = {
				...data,
				aniosExperienciaLicitante: data.aniosExperienciaLicitante.trim(),
				pagosSeRealizaran: norm(data.pagosSeRealizaran),
				lugarEntregaCalle: norm(data.lugarEntregaCalle),
				lugarEntregaColonia: norm(data.lugarEntregaColonia),
				lugarEntregaCp: norm(data.lugarEntregaCp),
				lugarEntregaCiudad: norm(data.lugarEntregaCiudad),
				diasEntrega: norm(data.diasEntrega),
				nombreDependenciaEntrega: norm(data.nombreDependenciaEntrega),
				telefonoEntrega: norm(data.telefonoEntrega),
				extencionTelefonoEntrega: norm(data.extencionTelefonoEntrega),
			};

			const lugarEntrega = [
				cleanData.lugarEntregaCalle,
				cleanData.lugarEntregaColonia,
				cleanData.lugarEntregaCiudad,
				`C.P. ${cleanData.lugarEntregaCp}`,
			]
				.filter(Boolean)
				.join(', ');

			await requisicionApi.guardarDatosAdministrativosBien({
				idRequisicion,
				idUsuario,

				aniosExperienciaLicitante: cleanData.aniosExperienciaLicitante,
				pagosSeRealizaran: cleanData.pagosSeRealizaran,

				adquisicionMedianteContrato:
					cleanData.adquisicionMedianteContrato === 'FIJO' ? 1 : 2,

				conformidadArticulo: cleanData.articuloConformidad == '107' ? 1 : 2,

				lugarEntrega,
				diasEntrega: cleanData.diasEntrega,

				calle: cleanData.lugarEntregaCalle,
				colonia: cleanData.lugarEntregaColonia,
				ciudad: cleanData.lugarEntregaCiudad,
				codigoPostal: cleanData.lugarEntregaCp,
				nombreDependenciaEntrega: cleanData.nombreDependenciaEntrega,
				telefonoEntrega: cleanData.telefonoEntrega,
				extencionTelefonoEntrega: cleanData.extencionTelefonoEntrega,
			});

			onSave(cleanData);

			setToast({
				visible: true,
				title: 'Datos administrativos guardados',
				variant: 'success',
			});
		} catch (error) {
			console.error('Error al guardar datos administrativos:', error);

			setToast({
				visible: true,
				title:
					error instanceof Error
						? error.message
						: 'Error al guardar los datos administrativos',
				variant: 'error',
			});
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<div className="p-4 flex-1 min-h-0 overflow-auto">
			<FormSection>
				<form
					className="space-y-4"
					onSubmit={handleSubmit(
						onSubmit,
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
							<FieldRoleLabel htmlFor="adm-anios">
								Años de experiencia del licitante
							</FieldRoleLabel>
							<Input
								id="adm-anios"
								{...register('aniosExperienciaLicitante')}
							/>
						</div>

						<div className="col-span-12 lg:col-span-8">
							<FieldRoleLabel htmlFor="adm-pagos">
								Los pagos se realizarán
							</FieldRoleLabel>
							<Input
								id="adm-pagos"
								{...register('pagosSeRealizaran')}
								className="uppercase"
							/>
						</div>

						<div className="col-span-12 lg:col-span-6">
							<Controller
								name="adquisicionMedianteContrato"
								control={control}
								render={({ field }) => (
									<RadioGroup
										label="La adquisición se llevará a cabo mediante contrato (revisor)"
										name="adm-contrato"
										value={field.value}
										onChange={(e) => field.onChange(e.target.value)}
										options={[
											{ value: 'FIJO', label: 'Fijo' },
											{ value: 'ABIERTO', label: 'Abierto' },
										]}
									/>
								)}
							/>
							{errors.adquisicionMedianteContrato?.message ? (
								<p className="text-[11px] mt-1 text-red-600">
									{errors.adquisicionMedianteContrato.message}
								</p>
							) : null}
						</div>

						<div className="col-span-12 lg:col-span-6">
							<Controller
								name="articuloConformidad"
								control={control}
								render={({ field }) => (
									<RadioGroup
										label="En conformidad a lo establecido en el artículo (revisor)"
										name="adm-art"
										value={field.value}
										onChange={(e) => field.onChange(e.target.value)}
										options={[
											{ value: '107', label: '107' },
											{ value: '108', label: '108' },
										]}
									/>
								)}
							/>
							{errors.articuloConformidad?.message ? (
								<p className="text-[11px] mt-1 text-red-600">
									{errors.articuloConformidad.message}
								</p>
							) : null}
						</div>

						<div className="col-span-12">
							<p className="text-xs font-bold text-slate-700 mb-2">
								Lugar de entrega (revisor)
							</p>

							<div className="grid grid-cols-12 gap-3">
								<div className="col-span-12 lg:col-span-6">
									<FieldRoleLabel htmlFor="adm-cal">Calle</FieldRoleLabel>
									<Input
										id="adm-cal"
										{...register('lugarEntregaCalle')}
										className="uppercase"
									/>
									{errors.lugarEntregaCalle?.message ? (
										<p className="text-[11px] mt-1 text-red-600">
											{errors.lugarEntregaCalle.message}
										</p>
									) : null}
								</div>

								<div className="col-span-12 lg:col-span-3">
									<FieldRoleLabel htmlFor="adm-col">Colonia</FieldRoleLabel>
									<Input
										id="adm-col"
										{...register('lugarEntregaColonia')}
										className="uppercase"
									/>
									{errors.lugarEntregaColonia?.message ? (
										<p className="text-[11px] mt-1 text-red-600">
											{errors.lugarEntregaColonia.message}
										</p>
									) : null}
								</div>

								<div className="col-span-12 lg:col-span-3">
									<FieldRoleLabel htmlFor="adm-cp">
										Código postal
									</FieldRoleLabel>
									<Input
										id="adm-cp"
										{...register('lugarEntregaCp')}
										className="uppercase"
									/>
									{errors.lugarEntregaCp?.message ? (
										<p className="text-[11px] mt-1 text-red-600">
											{errors.lugarEntregaCp.message}
										</p>
									) : null}
								</div>

								<div className="col-span-12 lg:col-span-6">
									<FieldRoleLabel htmlFor="adm-ciu">Ciudad</FieldRoleLabel>
									<Input
										id="adm-ciu"
										{...register('lugarEntregaCiudad')}
										className="uppercase"
									/>
									{errors.lugarEntregaCiudad?.message ? (
										<p className="text-[11px] mt-1 text-red-600">
											{errors.lugarEntregaCiudad.message}
										</p>
									) : null}
								</div>

								<div className="col-span-12 lg:col-span-3">
									<FieldRoleLabel htmlFor="adm-dias">
										Días de entrega
									</FieldRoleLabel>
									<Input
										id="adm-dias"
										{...register('diasEntrega')}
										className="uppercase"
									/>
									{errors.diasEntrega?.message ? (
										<p className="text-[11px] mt-1 text-red-600">
											{errors.diasEntrega.message}
										</p>
									) : null}
								</div>
								<div className="col-span-12 lg:col-span-3">
									<FieldRoleLabel htmlFor="adm-dependencia">
										Nombre de la dependencia de entrega
									</FieldRoleLabel>
									<Input
										id="adm-dependencia"
										{...register('nombreDependenciaEntrega')}
										className="uppercase"
									/>
									{errors.nombreDependenciaEntrega?.message ? (
										<p className="text-[11px] mt-1 text-red-600">
											{errors.nombreDependenciaEntrega.message}
										</p>
									) : null}
								</div>
								<div className="col-span-12 lg:col-span-3">
									<FieldRoleLabel htmlFor="adm-telefono">
										Teléfono de entrega
									</FieldRoleLabel>
									<Input
										id="adm-telefono"
										{...register('telefonoEntrega')}
										className="uppercase"
									/>
									{errors.telefonoEntrega?.message ? (
										<p className="text-[11px] mt-1 text-red-600">
											{errors.telefonoEntrega.message}
										</p>
									) : null}
								</div>
								<div className="col-span-12 lg:col-span-3">
									<FieldRoleLabel htmlFor="adm-extension">
										Extensión del teléfono
									</FieldRoleLabel>
									<Input
										id="adm-extension"
										{...register('extencionTelefonoEntrega')}
										className="uppercase"
									/>
									{errors.extencionTelefonoEntrega?.message ? (
										<p className="text-[11px] mt-1 text-red-600">
											{errors.extencionTelefonoEntrega.message}
										</p>
									) : null}
								</div>
							</div>
						</div>
					</div>

					<div className="flex justify-end pt-2">
						<Button
							type="submit"
							variant="success"
							size="md"
							disabled={isSaving}
							leftIcon={<Save className="w-4 h-4" />}
						>
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