import React, { useState } from 'react';
import { Button, DecimalStringCellInput, FormSection, Label } from '../../../components/UI';
import type { TipoCompra } from './types';

const UMBRAL = 56000;

export function MontoInicialStep({
	onContinue,
}: {
	onContinue: (payload: { montoStr: string; tipoCompra: TipoCompra }) => void;
}) {
	const [monto, setMonto] = useState('');

	const parsed = parseFloat(monto.replace(/,/g, '.')) || 0;
	const tipoCompra: TipoCompra = parsed >= UMBRAL ? 'MAYOR' : 'MENOR';

	const handleContinue = () => {
		if (!monto.trim() || parsed <= 0) return;
		onContinue({ montoStr: monto.replace(/,/g, '.'), tipoCompra });
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
						disabled={!monto.trim() || parsed <= 0}
					>
						Continuar con el formulario
					</Button>
				</div>
				{monto.trim() && parsed > 0 ? (
					<p className="mt-4 text-sm font-bold text-brand-primary">
						{tipoCompra === 'MAYOR'
							? 'Compra de bienes mayor (≥ $56,000.00)'
							: 'Compra de bienes menor (< $56,000.00)'}
					</p>
				) : null}
			</FormSection>
		</div>
	);
}
