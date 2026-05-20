import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Check, Save } from 'lucide-react';
import { Button, FormSection, TextArea, Toast, Input } from '../../../../../components/UI';
import { FieldRoleLabel } from '../../fieldRoleLabel';
import type { ServiciosMayorDatosRequisicionValues } from '../../types';
import { requisicionApi } from '../../../../../api/requisicionBienesAPI';
import { useParams } from 'react-router-dom';

const schema = yup
	.object({
		descripcionGeneral: yup.string().trim().required('*Requerido'),
		justificacionGasto: yup.string().trim().required('*Requerido'),
		periodoGarantia: yup.string().trim().required('*Requerido'),
	})
	.required();

const empty: ServiciosMayorDatosRequisicionValues = {
	descripcionGeneral: '',
	justificacionGasto: '',
	periodoGarantia: '',
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

export function MayorDatosRequisicionTab({
	idRequisicion,
	idUsuario,
	initialValues,
	onSave,
}: {
	idRequisicion: number;
	idUsuario: number;
	initialValues: Partial<ServiciosMayorDatosRequisicionValues>;
	onSave: (data: ServiciosMayorDatosRequisicionValues) => void;
}) {
	const [toast, setToast] = useState({
		visible: false,
		title: '',
		variant: 'success' as 'success' | 'error',
	});

	const [isSaving, setIsSaving] = useState(false);

	const { id } = useParams();
	const requisicionIdFinal = Number(id ?? idRequisicion ?? 0);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<ServiciosMayorDatosRequisicionValues>({
		resolver: yupResolver(schema) as Resolver<ServiciosMayorDatosRequisicionValues>,
		defaultValues: { ...empty, ...initialValues },
	});

	useEffect(() => {
		reset({ ...empty, ...initialValues });
	}, [initialValues, reset]);

	useEffect(() => {
		if (!toast.visible) return;

		const t = setTimeout(
			() => setToast((s) => ({ ...s, visible: false })),
			2800
		);

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

								const payloadFinal: ServiciosMayorDatosRequisicionValues = {
									descripcionGeneral: data.descripcionGeneral
										.trim()
										.toUpperCase(),
									justificacionGasto: data.justificacionGasto
										.trim()
										.toUpperCase(),
									periodoGarantia: data.periodoGarantia
										.trim()
										.toUpperCase(),
								};

								const usuarioIdFinal = getUsuarioId() || Number(idUsuario ?? 0);

								await requisicionApi.guardarDatosRequisicion({
									idRequisicion: requisicionIdFinal,
									idUsuario: usuarioIdFinal,
									descripcionGeneral: payloadFinal.descripcionGeneral,
									justificacionGasto: payloadFinal.justificacionGasto,
									periodoGarantia: payloadFinal.periodoGarantia,
								});

								onSave(payloadFinal);

								setToast({
									visible: true,
									title: 'Datos de la requisición guardados',
									variant: 'success',
								});
							} catch (error) {
								setToast({
									visible: true,
									title:
										error instanceof Error
											? error.message
											: 'No se pudieron guardar los datos de la requisición',
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
						<div className="col-span-12 lg:col-span-4">
							<FieldRoleLabel htmlFor="cs-mayor-gar">
								Periodo de garantía
							</FieldRoleLabel>

							<Input
								id="cs-mayor-gar"
								{...register('periodoGarantia')}
								className="uppercase"
							/>

							{errors.periodoGarantia?.message ? (
								<p className="text-[11px] mt-1 text-red-600">
									{errors.periodoGarantia.message}
								</p>
							) : null}
						</div>

						<div className="col-span-12">
							<FieldRoleLabel htmlFor="cs-mayor-desc">
								Descripción general
							</FieldRoleLabel>

							<TextArea
								id="cs-mayor-desc"
								rows={4}
								{...register('descripcionGeneral')}
								className="uppercase"
							/>

							{errors.descripcionGeneral?.message ? (
								<p className="text-[11px] mt-1 text-red-600">
									{errors.descripcionGeneral.message}
								</p>
							) : null}
						</div>

						<div className="col-span-12">
							<FieldRoleLabel htmlFor="cs-mayor-just">
								Justificación del gasto
							</FieldRoleLabel>

							<TextArea
								id="cs-mayor-just"
								rows={4}
								{...register('justificacionGasto')}
								className="uppercase"
							/>

							{errors.justificacionGasto?.message ? (
								<p className="text-[11px] mt-1 text-red-600">
									{errors.justificacionGasto.message}
								</p>
							) : null}
						</div>
					</div>

					<div className="flex justify-end pt-2">
						<Button
							type="submit"
							variant="success"
							size="md"
							leftIcon={<Save className="w-4 h-4" />}
							disabled={isSaving}
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