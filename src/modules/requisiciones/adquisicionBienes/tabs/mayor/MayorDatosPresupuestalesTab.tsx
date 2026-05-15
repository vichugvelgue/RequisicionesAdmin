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
import { FieldRoleLabel } from '../../fieldRoleLabel';
import type { MayorDatosPresupuestalesValues } from '../../types';
import { requisicionApi } from '../../../../../api';
import { origenRecursoApi } from '../../../../../api';
import { clavePresupuestalApi } from '../../../../../api';
import { componenteApi } from '../../../../../api';
import { actividadApi } from '../../../../../api';
import { tipoProgramaApi } from '../../../../../api';
import type { OptionItem } from '../../../../../components/UI/types';
import type { Resolver } from 'react-hook-form';

const schema: yup.ObjectSchema<MayorDatosPresupuestalesValues> = yup
	.object({
		presupuestoAutorizado: yup.string().default('').defined(),
		clavePresupuestalId: yup.string().default('').defined(),
		origenRecursoId: yup.string().default('').defined(),
		componenteId: yup.string().default('').defined(),
		actividadId: yup.string().default('').defined(),
		tipoProgramaId: yup.string().default('').defined(),
	})
	.required();

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
	idRequisicion,
	idUsuario,
	onSave,
}: {
	initialValues: Partial<MayorDatosPresupuestalesValues>;
	idRequisicion: number;
	idUsuario: number;
	onSave: (data: MayorDatosPresupuestalesValues) => void;
}) {
	const [toast, setToast] = useState({
		visible: false,
		title: '',
		variant: 'success' as 'success' | 'error',
	});

	const [saving, setSaving] = useState(false);

	// Estados para los catálogos
	const [origenesRecurso, setOrigenesRecurso] = useState<OptionItem[]>([]);
	const [clavesPresupuestales, setClavesPresupuestales] = useState<OptionItem[]>([]);
	const [componentes, setComponentes] = useState<OptionItem[]>([]);
	const [actividades, setActividades] = useState<OptionItem[]>([]);
	const [tiposPrograma, setTiposPrograma] = useState<OptionItem[]>([]);

	const {
	control,
	handleSubmit,
	reset,
	formState: { errors },
} = useForm<MayorDatosPresupuestalesValues>({
	resolver: yupResolver(schema) as Resolver<MayorDatosPresupuestalesValues>,
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

	// Cargar catálogos
	useEffect(() => {
		const loadCatalogos = async () => {
			try {
				const [
					origenesData,
					clavesData,
					componentesData,
					actividadesData,
					tiposProgramaData,
				] = await Promise.all([
					origenRecursoApi.listar(),
					clavePresupuestalApi.listar(),
					componenteApi.listar(),
					actividadApi.listar(),
					tipoProgramaApi.listar(),
				]);

				setOrigenesRecurso(
					origenesData.map((item) => ({
						value: String(item.id),
						label: item.nombre,
					}))
				);

				setClavesPresupuestales(
					clavesData.map((item) => ({
						value: String(item.id),
						label: item.nombre,
					}))
				);

				setComponentes(
					componentesData.map((item) => ({
						value: String(item.id),
						label: item.nombre,
					}))
				);

				setActividades(
					actividadesData.map((item) => ({
						value: String(item.id),
						label: item.nombre,
					}))
				);

				setTiposPrograma(
					tiposProgramaData.map((item) => ({
						value: String(item.id),
						label: item.nombre,
					}))
				);
			} catch (error) {
				setToast({
					visible: true,
					title: 'Error al cargar catálogos',
					variant: 'error',
				});
			}
		};

		loadCatalogos();
	}, []);

	const onSubmit = async (data: MayorDatosPresupuestalesValues) => {
		try {
			setSaving(true);

			const payload = {
				idRequisicion,
				idUsuario,
				presupuestoAutorizado: data.presupuestoAutorizado,
				idClavePresupuestal: data.clavePresupuestalId ? Number(data.clavePresupuestalId) : null,
				idOrigenRecurso: data.origenRecursoId ? Number(data.origenRecursoId) : null,
				idComponente: data.componenteId ? Number(data.componenteId) : null,
				idActividad: data.actividadId ? Number(data.actividadId) : null,
				idTipoPrograma: data.tipoProgramaId ? Number(data.tipoProgramaId) : null,
			};

			await requisicionApi.guardarDatosPresupuestales(payload);

			onSave(data);

			setToast({
				visible: true,
				title: 'Datos presupuestales guardados',
				variant: 'success',
			});
		} catch (error) {
			setToast({
				visible: true,
				title: error instanceof Error ? error.message : 'Error al guardar datos presupuestales',
				variant: 'error',
			});
		} finally {
			setSaving(false);
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
				<form
					className="space-y-4"
					onSubmit={handleSubmit(onSubmit, onInvalid)}
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
							<FieldRoleLabel>Clave presupuestal</FieldRoleLabel>
							<Controller
								name="clavePresupuestalId"
								control={control}
								render={({ field }) => (
									<SearchableSelect
										options={clavesPresupuestales}
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
										options={origenesRecurso}
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
										options={componentes}
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
										options={actividades}
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
										options={tiposPrograma}
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
