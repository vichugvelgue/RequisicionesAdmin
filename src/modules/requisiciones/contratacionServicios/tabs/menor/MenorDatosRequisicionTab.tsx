import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Check, Save } from 'lucide-react';
import { Button, FormSection, TextArea, Toast } from '../../../../../components/UI';
import { FieldRoleLabel } from '../../fieldRoleLabel';

const schema = yup.object({
	justificacionGasto: yup.string().trim().required('*Requerido'),
});

export function MenorDatosRequisicionTab({
	initialValues,
	onSave,
}: {
	initialValues: Partial<{ justificacionGasto: string }>;
	onSave: (data: { justificacionGasto: string }) => void;
}) {
	const [toast, setToast] = useState({
		visible: false,
		title: '',
		variant: 'success' as 'success' | 'error',
	});

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<{ justificacionGasto: string }>({
		resolver: yupResolver(schema),
		defaultValues: { justificacionGasto: initialValues.justificacionGasto ?? '' },
	});

	useEffect(() => {
		reset({ justificacionGasto: initialValues.justificacionGasto ?? '' });
	}, [initialValues.justificacionGasto, reset]);

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
						(data) => {
							onSave({ justificacionGasto: data.justificacionGasto.trim().toUpperCase() });
							setToast({
								visible: true,
								title: 'Datos de la requisición guardados',
								variant: 'success',
							});
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
							<FieldRoleLabel htmlFor="cs-menor-just">Justificación del gasto</FieldRoleLabel>
							<TextArea
								id="cs-menor-just"
								rows={5}
								{...register('justificacionGasto')}
								className="uppercase"
							/>
							{errors.justificacionGasto?.message ? (
								<p className="text-[11px] mt-1 text-red-600">{errors.justificacionGasto.message}</p>
							) : null}
						</div>
					</div>
					<div className="flex justify-end pt-2">
						<Button type="submit" variant="success" size="md" leftIcon={<Save className="w-4 h-4" />}>
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
