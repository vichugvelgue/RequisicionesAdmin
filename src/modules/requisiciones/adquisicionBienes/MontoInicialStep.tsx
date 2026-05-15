import React, { useState } from 'react';
import { Button, DecimalStringCellInput, FormSection, Label } from '../../../components/UI';
import type { TipoCompra } from './types';
import{ requisicionApi } from '../../../api/requisicionBienesAPI';

const UMBRAL = 56000;
const TIPO_OBJETO_BIEN = 1;
const TIPO_MONTO_MENOR = 1;
const TIPO_MONTO_MAYOR = 2;

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

export function MontoInicialStep({
	onContinue,
}: {
	onContinue: (payload: {
		idRequisicion: number;
		montoStr: string;
		tipoCompra: TipoCompra;
	}) => void;
}) {
	const [monto, setMonto] = useState('');
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState('');

	const parsed = parseFloat(monto.replace(/,/g, '.')) || 0;
	const tipoCompra: TipoCompra = parsed > UMBRAL ? 'MAYOR' : 'MENOR';

	const handleContinue = async () => {
		if (!monto.trim() || parsed <= 0) return;

		setIsSaving(true);
		setError('');

		try {
			const idUsuarioSolicitante = getUsuarioId();

			if (!idUsuarioSolicitante) {
				setError('No se encontró el usuario de sesión.');
				return;
			}

			const requisicion = await requisicionApi.crear({
				idUsuarioSolicitante,
				tipoObjetoRequisicion: TIPO_OBJETO_BIEN,
				tipoMontoRequisicion:
					tipoCompra === 'MAYOR' ? TIPO_MONTO_MAYOR : TIPO_MONTO_MENOR,
				monto: parsed,
			});

			onContinue({
				idRequisicion: requisicion.id,
				montoStr: monto.replace(/,/g, '.'),
				tipoCompra,
			});
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: 'No se pudo crear la requisición.'
			);
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<div className="p-4 max-w-lg">
			<FormSection title="Monto de la compra (IVA incluido)">
				<Label htmlFor="monto-inicial">Ingresar monto de la compra</Label>

				<div className="mt-1 flex items-end gap-3">
					<div className="w-full max-w-xs flex-1">
						<DecimalStringCellInput
							id="monto-inicial"
							value={monto}
							onChange={setMonto}
							fractionDigits={2}
							className="!text-sm !py-2 !px-3 w-full"
						/>
					</div>

					<Button
						type="button"
						variant="primary"
						size="md"
						className="shrink-0"
						onClick={handleContinue}
						disabled={!monto.trim() || parsed <= 0 || isSaving}
					>
						{isSaving ? 'Creando...' : 'Continuar con el formulario'}
					</Button>
				</div>

				{monto.trim() && parsed > 0 ? (
					<p className="mt-4 text-sm font-bold text-brand-primary">
						{tipoCompra === 'MAYOR'
							? 'Compra de bienes mayor (> $56,000.00)'
							: 'Compra de bienes menor (≤ $56,000.00)'}
					</p>
				) : null}

				{error ? (
					<p className="mt-3 text-sm font-semibold text-red-600">
						{error}
					</p>
				) : null}
			</FormSection>
		</div>
	);
}
