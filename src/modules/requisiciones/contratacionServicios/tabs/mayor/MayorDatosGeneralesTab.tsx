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
import type { ServiciosMayorDatosGeneralesValues } from '../../types';
import { dateToInputValue } from '../../../../../utils/dateFormat';
import { requisicionApi } from '../../../../../api/requisicionBienesAPI';
import { unidadSolicitanteApi } from '../../../../../api/unidadSolicitanteApi';
import { OptionItem } from '@/components/UI/types';
import { useParams } from 'react-router-dom';

const schemaSolicitante = yup.object({
	unidadSolicitanteId: yup.string().required('*Requerido'),
	nombreTitular: yup.string().trim().required('*Requerido'),
	cargoSolicitante: yup.string().trim().required('*Requerido'),
	fechaSolicitud: yup.string().trim(),
	caracterProcedimiento: yup.string().required('*Requerido'),
	modalidadContratacion: yup.string(),
	articuloConformidad: yup.string(),
	tipoProcedimiento: yup.string().trim().required('*Requerido'),
});

const schemaFull = schemaSolicitante.shape({
	fechaSolicitud: yup.string().trim().required('*Requerido'),
	modalidadContratacion: yup.string().required('*Requerido'),
	articuloConformidad: yup.string().required('*Requerido'),
});

const empty: ServiciosMayorDatosGeneralesValues = {
	unidadSolicitanteId: '',
	nombreTitular: '',
	cargoSolicitante: '',
	fechaSolicitud: dateToInputValue(new Date()),
	caracterProcedimiento: 'NACIONAL',
	modalidadContratacion: 'FIJA',
	articuloConformidad: '107',
	tipoProcedimiento: '',
};

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

function withDefaultFecha(
	initialValues: Partial<ServiciosMayorDatosGeneralesValues>
): ServiciosMayorDatosGeneralesValues {
	const todayIso = dateToInputValue(new Date());
	return {
		...empty,
		...initialValues,
		fechaSolicitud: initialValues.fechaSolicitud?.trim()
			? initialValues.fechaSolicitud
			: todayIso,
	};
}

export function MayorDatosGeneralesTab({
	idRequisicion,
	idUsuario,
	initialValues,
	hideRevisorFields,
	onSave,
}: {
	idRequisicion: number;
	idUsuario: number;
	initialValues: Partial<ServiciosMayorDatosGeneralesValues>;
	hideRevisorFields: boolean;
	onSave: (data: ServiciosMayorDatosGeneralesValues) => void;
}) {
	const [toast, setToast] = useState({
		visible: false,
		title: '',
		variant: 'success' as 'success' | 'error',
	});
	const [unidadesSolicitantes, setUnidadesSolicitantes] = useState<OptionItem[]>([]);
	const [isSaving, setIsSaving] = useState(false);

	const { id } = useParams();
	const requisicionIdFinal = Number(id ?? idRequisicion ?? 0);
	const caracterProcedimientoMap: Record<string, number> = {
	NACIONAL: 0,
	INTERNACIONAL: 1,
};

	const resolver = yupResolver(hideRevisorFields ? schemaSolicitante : schemaFull);

	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors },
	} = useForm<ServiciosMayorDatosGeneralesValues>({
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		resolver: resolver as any,
		defaultValues: withDefaultFecha(initialValues),
	});

	useEffect(() => {
	const loadUnidades = async () => {
		try {
			const data = await unidadSolicitanteApi.listar();

			setUnidadesSolicitantes(
				data.map((x) => ({
					value: String(x.id),
					label: x.nombre,
				}))
			);
		} catch {
			setToast({
				visible: true,
				title: 'No se pudo cargar unidad solicitante',
				variant: 'error',
			});
		}
	};

	loadUnidades();
}, []);

	useEffect(() => {
		reset(withDefaultFecha(initialValues));
	}, [initialValues, reset]);

	const onSubmit = async (data: ServiciosMayorDatosGeneralesValues) => {
	try {
		setIsSaving(true);

		const fechaSolicitud = hideRevisorFields
			? (initialValues.fechaSolicitud ?? data.fechaSolicitud ?? '').trim()
			: (data.fechaSolicitud ?? '').trim();

		const modalidadContratacion = hideRevisorFields
			? initialValues.modalidadContratacion ?? data.modalidadContratacion
			: data.modalidadContratacion;

		const articuloConformidad = hideRevisorFields
			? initialValues.articuloConformidad ?? data.articuloConformidad
			: data.articuloConformidad;

		const payloadFinal: ServiciosMayorDatosGeneralesValues = {
			...data,
			fechaSolicitud,
			modalidadContratacion,
			articuloConformidad,
			nombreTitular: data.nombreTitular.trim().toUpperCase(),
			cargoSolicitante: data.cargoSolicitante.trim().toUpperCase(),
			tipoProcedimiento: data.tipoProcedimiento.trim().toUpperCase(),
		};

		const usuarioIdFinal = getUsuarioId() || Number(idUsuario ?? 0);

		await requisicionApi.guardarDatosGenerales({
			idRequisicion: requisicionIdFinal,
			idUsuario: usuarioIdFinal,

			idUnidadSolicitante: Number(payloadFinal.unidadSolicitanteId),
			nombreSolicitante: payloadFinal.nombreTitular,
			cargoSolicitante: payloadFinal.cargoSolicitante,
			fechaSolicitud: payloadFinal.fechaSolicitud,

			caracterProcedimiento:
			payloadFinal.caracterProcedimiento === 'NACIONAL'
			? 0
			: payloadFinal.caracterProcedimiento === 'INTERNACIONAL'
				? 1
				: null,

			modalidadContratacion: payloadFinal.modalidadContratacion
				? Number(payloadFinal.modalidadContratacion)
				: null,

			articulo: payloadFinal.articuloConformidad
				? Number(payloadFinal.articuloConformidad)
				: null,

			tipoProcedimiento: payloadFinal.tipoProcedimiento,
		});		
		onSave(payloadFinal);

		setToast({
			visible: true,
			title: 'Datos generales guardados',
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
						<div className="col-span-12 lg:col-span-6 space-y-4">
							<div>
								<FieldRoleLabel>Unidad solicitante</FieldRoleLabel>
								<Controller
									name="unidadSolicitanteId"
									control={control}
									render={({ field }) => (
										<SearchableSelect
											options={unidadesSolicitantes}
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
								<FieldRoleLabel htmlFor="cs-mayor-nombre-titular">
									Nombre del titular / solicitante
								</FieldRoleLabel>
								<Input
									id="cs-mayor-nombre-titular"
									{...register('nombreTitular')}
									className="uppercase"
								/>
								{errors.nombreTitular?.message ? (
									<p className="text-[11px] mt-1 text-red-600">{errors.nombreTitular.message}</p>
								) : null}
							</div>
							<div>
								<FieldRoleLabel htmlFor="cs-mayor-cargo">Cargo del solicitante</FieldRoleLabel>
								<Input id="cs-mayor-cargo" {...register('cargoSolicitante')} className="uppercase" />
								{errors.cargoSolicitante?.message ? (
									<p className="text-[11px] mt-1 text-red-600">{errors.cargoSolicitante.message}</p>
								) : null}
							</div>
							<div>
								<FieldRoleLabel htmlFor="cs-mayor-tipo-proc">Tipo de procedimiento</FieldRoleLabel>
								<Input id="cs-mayor-tipo-proc" {...register('tipoProcedimiento')} className="uppercase" />
								{errors.tipoProcedimiento?.message ? (
									<p className="text-[11px] mt-1 text-red-600">{errors.tipoProcedimiento.message}</p>
								) : null}
							</div>
						</div>
						<div className="col-span-12 lg:col-span-6 space-y-4">
							{!hideRevisorFields ? (
								<>
									<div>
										<FieldRoleLabel>Fecha de solicitud</FieldRoleLabel>
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
									<Controller
										name="modalidadContratacion"
										control={control}
										render={({ field }) => (
											<RadioGroup
												label="Modalidad de contratación"
												name="cs-mayor-modalidad"
												value={field.value}
												onChange={(e) => field.onChange(e.target.value)}
												options={[
													{ value: 'FIJA', label: 'Fija' },
													{ value: 'ABIERTA', label: 'Abierta' },
												]}
											/>
										)}
									/>
									{errors.modalidadContratacion?.message ? (
										<p className="text-[11px] mt-1 text-red-600">
											{errors.modalidadContratacion.message}
										</p>
									) : null}
									<Controller
										name="articuloConformidad"
										control={control}
										render={({ field }) => (
											<RadioGroup
												label="En conformidad a lo establecido en el artículo"
												name="cs-mayor-art"
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
								</>
							) : null}
							<Controller
								name="caracterProcedimiento"
								control={control}
								render={({ field }) => (
									<RadioGroup
										label="Carácter del procedimiento"
										name="cs-mayor-caracter"
										value={field.value}
										onChange={(e) => field.onChange(e.target.value)}
										options={[
											{ value: 'NACIONAL', label: 'Nacional' },
											{ value: 'INTERNACIONAL', label: 'Internacional' },
										]}
									/>
								)}
							/>
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
