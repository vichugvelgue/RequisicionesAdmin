import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
import { FieldRoleLabel } from '../../fieldRoleLabel';
import { dateToInputValue } from '../../../../../utils/dateFormat';
import { unidadSolicitanteApi } from '../../../../../api/unidadSolicitanteApi';
import { requisicionApi } from '../../../../../api/requisicionBienesAPI';
import { OptionItem } from '@/components/UI/types';
import { useParams } from "react-router-dom";


export interface MenorDatosGeneralesForm {
	unidadSolicitanteId: string;
	nombreSolicitante: string;
	cargo: string;
	fechaSolicitud: string;
}

const schema = yup.object({
	unidadSolicitanteId: yup.string().required('*Requerido'),
	nombreSolicitante: yup.string().trim().required('*Requerido'),
	cargo: yup.string().trim().required('*Requerido'),
	fechaSolicitud: yup.string().trim().required('*Requerido'),
});

const empty: MenorDatosGeneralesForm = {
	unidadSolicitanteId: '',
	nombreSolicitante: '',
	cargo: '',
	fechaSolicitud: '',
};

function withDefaultFecha(initialValues: Partial<MenorDatosGeneralesForm>): MenorDatosGeneralesForm {
	const todayIso = dateToInputValue(new Date());
	return {
		...empty,
		...initialValues,
		fechaSolicitud: initialValues.fechaSolicitud?.trim()
			? initialValues.fechaSolicitud
			: todayIso,
	};
}

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

export function MenorDatosGeneralesTab({idRequisicion,idUsuario,initialValues,onSave,readOnly}: {
	idRequisicion: number;
	idUsuario: number;
	initialValues: Partial<MenorDatosGeneralesForm>;
	onSave: (data: MenorDatosGeneralesForm) => void;
	readOnly: boolean;
	}) {
	
	const [toast, setToast] = useState({visible: false,title: '',variant: 'success' as 'success' | 'error',});
	const [unidadesSolicitantes, setUnidadesSolicitantes] = useState<OptionItem[]>([]);
	const [isSaving, setIsSaving] = useState(false);
	const { id } = useParams();
	 idRequisicion = Number(id ?? 0);

	const {
		control,
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<MenorDatosGeneralesForm>({
		defaultValues: withDefaultFecha(initialValues),
	});


useEffect(() => {
	reset({
		unidadSolicitanteId: initialValues.unidadSolicitanteId ?? '',
		nombreSolicitante: initialValues.nombreSolicitante ?? '',
		cargo: initialValues.cargo ?? '',
		fechaSolicitud: initialValues.fechaSolicitud ?? dateToInputValue(new Date()),
	});
}, [
	initialValues.unidadSolicitanteId,
	initialValues.nombreSolicitante,
	initialValues.cargo,
	initialValues.fechaSolicitud,
	reset,
]);


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
						try {
							setIsSaving(true);
							idUsuario = getUsuarioId();
							await requisicionApi.guardarDatosGenerales({
								idRequisicion,
								idUsuario,
								idUnidadSolicitante: Number(data.unidadSolicitanteId),
								nombreSolicitante: data.nombreSolicitante.trim().toUpperCase(),
								cargoSolicitante: data.cargo.trim().toUpperCase(),
								fechaSolicitud: data.fechaSolicitud,

								caracterProcedimiento: null,
								modalidadContratacion: null,
								articulo: null,
								tipoProcedimiento: '',
							});

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
						} catch (err) {
							setToast({
								visible: true,
								title: err instanceof Error ? err.message : 'No se pudieron guardar los datos generales',
								variant: 'error',
							});
						} finally {
							setIsSaving(false);
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
						<div className="col-span-12 lg:col-span-3">
							<FieldRoleLabel htmlFor="menor-nom">
								Nombre del solicitante
							</FieldRoleLabel>
							<Input id="menor-nom" {...register('nombreSolicitante')} className="uppercase" />
							{errors.nombreSolicitante?.message ? (
								<p className="text-[11px] mt-1 text-red-600">{errors.nombreSolicitante.message}</p>
							) : null}
						</div>
						<div className="col-span-12 lg:col-span-3">
							<FieldRoleLabel htmlFor="menor-car">
								Cargo
							</FieldRoleLabel>
							<Input id="menor-car" {...register('cargo')} className="uppercase" />
							{errors.cargo?.message ? (
								<p className="text-[11px] mt-1 text-red-600">{errors.cargo.message}</p>
							) : null}
						</div>
						<div className="col-span-12 lg:col-span-3">
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
					</div>
					<div className="flex justify-end pt-2">
						<Button type="submit" variant="success" size="md" leftIcon={<Save className="w-4 h-4" />} disabled={readOnly}>
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
