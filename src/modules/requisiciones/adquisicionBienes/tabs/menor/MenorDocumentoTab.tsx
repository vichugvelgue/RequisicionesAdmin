import React from 'react';
import { Download } from 'lucide-react';
import { Button, FormSection } from '../../../../../components/UI';
import { formatDateToDDMMMYYYY } from '../../../../../utils/dateFormat';
import type { AdquisicionDraft } from '../../types';
import { buildAdquisicionMenorPdf } from '../../buildAdquisicionMenorPdf';

function Row({ label, value }: { label: string; value: string }) {
	return (
		<div className="py-2 border-b border-slate-100 text-sm">
			<span className="font-bold text-slate-600">{label}: </span>
			<span className="text-slate-800 uppercase">{value || '—'}</span>
		</div>
	);
}

export function MenorDocumentoTab({
	draft,
	numeroLabel,
	solicitanteLabel,
}: {
	draft: AdquisicionDraft;
	numeroLabel: string;
	solicitanteLabel: string;
}) {
	const g = draft.menorDatosGenerales;
	const r = draft.menorDatosRequisicion;

	const handlePdf = () => {
		buildAdquisicionMenorPdf(draft, {
			numero: numeroLabel,
			solicitante: solicitanteLabel,
		});
	};

	return (
		<div className="p-4 flex-1 min-h-0 overflow-auto">
			<FormSection>
				<p className="text-xs text-slate-500 mb-4">
					Vista previa con los datos guardados en las pestañas anteriores. Descargue el PDF para conservar el formato base lleno.
				</p>
				<div className="rounded-lg border border-slate-200 bg-white p-4 max-w-3xl mb-4">
					<p className="text-sm font-bold text-slate-800 mb-2">COMPRA MENOR DE BIENES</p>
					<Row label="No. REQUISICIÓN" value={numeroLabel} />
					<Row label="SOLICITANTE" value={solicitanteLabel} />
					{draft.monto ? <Row label="MONTO (INCLUYE IVA)" value={`$${draft.monto}`} /> : null}
					<div className="mt-4 text-xs font-bold text-slate-600 uppercase">Datos generales</div>
					<Row label="UNIDAD (ID)" value={g?.unidadSolicitanteId ?? ''} />
					<Row label="NOMBRE" value={g?.nombreSolicitante ?? ''} />
					<Row label="CARGO" value={g?.cargo ?? ''} />
					<Row
						label="FECHA SOLICITUD"
						value={g?.fechaSolicitud ? formatDateToDDMMMYYYY(g.fechaSolicitud) : ''}
					/>
					<div className="mt-4 text-xs font-bold text-slate-600 uppercase">Datos de la requisición</div>
					<Row label="JUSTIFICACIÓN DEL GASTO" value={r?.justificacionGasto ?? ''} />
				</div>
				<Button
					type="button"
					variant="primary"
					size="md"
					leftIcon={<Download className="w-4 h-4" />}
					onClick={handlePdf}
				>
					Descargar PDF
				</Button>
			</FormSection>
		</div>
	);
}
