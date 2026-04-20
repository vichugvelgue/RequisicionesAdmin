import { jsPDF } from 'jspdf';
import type { AdquisicionDraft } from './types';
import { formatDateToDDMMMYYYY } from '../../../utils/dateFormat';

function addWrapped(doc: jsPDF, text: string, x: number, y: number, maxWidth: number): number {
	const lines = doc.splitTextToSize(text.toUpperCase(), maxWidth);
	doc.text(lines, x, y);
	return y + lines.length * 5 + 2;
}

export function buildAdquisicionMenorPdf(
	draft: AdquisicionDraft,
	opts: { numero: string; solicitante: string }
): void {
	const doc = new jsPDF({ unit: 'mm', format: 'letter' });
	const margin = 18;
	let y = 20;
	const w = 180;

	doc.setFont('helvetica', 'bold');
	doc.setFontSize(14);
	doc.text('REQUISICIÓN — COMPRA MENOR DE BIENES', margin, y);
	y += 10;
	doc.setFont('helvetica', 'normal');
	doc.setFontSize(10);
	y = addWrapped(doc, `No. REQUISICIÓN: ${opts.numero}`, margin, y, w);
	y = addWrapped(doc, `SOLICITANTE: ${opts.solicitante}`, margin, y, w);

	const g = draft.menorDatosGenerales;
	y += 4;
	doc.setFont('helvetica', 'bold');
	doc.text('DATOS GENERALES', margin, y);
	y += 6;
	doc.setFont('helvetica', 'normal');
	if (g?.unidadSolicitanteId)
		y = addWrapped(doc, `UNIDAD SOLICITANTE (ID): ${g.unidadSolicitanteId}`, margin, y, w);
	if (g?.nombreSolicitante)
		y = addWrapped(doc, `NOMBRE: ${g.nombreSolicitante}`, margin, y, w);
	if (g?.cargo) y = addWrapped(doc, `CARGO: ${g.cargo}`, margin, y, w);
	if (g?.fechaSolicitud)
		y = addWrapped(
			doc,
			`FECHA SOLICITUD: ${formatDateToDDMMMYYYY(g.fechaSolicitud)}`,
			margin,
			y,
			w
		);

	const r = draft.menorDatosRequisicion;
	y += 4;
	doc.setFont('helvetica', 'bold');
	doc.text('DATOS DE LA REQUISICIÓN', margin, y);
	y += 6;
	doc.setFont('helvetica', 'normal');
	if (r?.justificacionGasto)
		y = addWrapped(doc, `JUSTIFICACIÓN DEL GASTO: ${r.justificacionGasto}`, margin, y, w);

	if (draft.monto) {
		y += 4;
		y = addWrapped(doc, `MONTO (INCLUYE IVA): $${draft.monto}`, margin, y, w);
	}

	doc.save(`requisicion-menor-${opts.numero}.pdf`);
}
