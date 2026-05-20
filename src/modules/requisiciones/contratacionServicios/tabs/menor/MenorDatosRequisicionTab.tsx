import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Check, Save } from 'lucide-react';
import { Button, FormSection, TextArea, Toast } from '../../../../../components/UI';
import { FieldRoleLabel } from '../../fieldRoleLabel';
import { requisicionApi } from '../../../../../api/requisicionBienesAPI';
import { useParams } from 'react-router-dom';

const schema = yup
	.object({
		justificacionGasto: yup.string().trim().required('*Requerido'),
	})
	.required();

type MenorDatosRequisicionForm = {
	justificacionGasto: string;
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

export function MenorDatosRequisicionTab({
	idRequisicion,
	idUsuario,
	initialValues,
	onSave,
}: {
	idRequisicion: number;
	idUsuario: number;
	initialValues: Partial<MenorDatosRequisicionForm>;
	onSave: (data: MenorDatosRequisicionForm) => void;
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
	} = useForm<MenorDatosRequisicionForm>({
		resolver: yupResolver(schema) as Resolver<MenorDatosRequisicionForm>,
		defaultValues: {
			justificacionGasto: initialValues.justificacionGasto ?? '',
		},
	});

	useEffect(() => {
		reset({
			justificacionGasto: initialValues.justificacionGasto ?? '',
		});
	}, [initialValues.justificacionGasto, reset]);

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

								const justificacionGasto = data.justificacionGasto
									.trim()
									.toUpperCase();

								const usuarioIdFinal = getUsuarioId() || Number(idUsuario ?? 0);

								await requisicionApi.guardarDatosRequisicion({
									idRequisicion: requisicionIdFinal,
									idUsuario: usuarioIdFinal,
									descripcionGeneral: '',
									justificacionGasto,
									periodoGarantia: '',
								});

								onSave({ justificacionGasto });

								setToast({
									visible: true,
									title: 'Justificación guardada',
									variant: 'success',
								});
							} catch (error) {
								setToast({
									visible: true,
									title:
										error instanceof Error
											? error.message
											: 'No se pudo guardar la justificación',
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
						<div className="col-span-12">
							<FieldRoleLabel htmlFor="cs-menor-just">
								Justificación del gasto
							</FieldRoleLabel>

							<TextArea
								id="cs-menor-just"
								rows={6}
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