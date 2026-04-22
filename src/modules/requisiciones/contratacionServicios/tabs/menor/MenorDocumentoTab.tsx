import React from 'react';
import { formatDateToDDMMMYYYY } from '../../../../../utils/dateFormat';
import type { ContratacionServiciosDraft } from '../../types';
import {
	DocumentoTabChrome,
	PreviewField,
	PreviewFieldsGrid,
	PreviewSection,
} from '../../documento/DocumentoTabChrome';

function formatCantidadPreview(raw: string): string {
	const t = raw?.trim() ?? '';
	if (!t) return '';
	const n = Number(t.replace(',', '.'));
	if (Number.isFinite(n)) return n.toFixed(4);
	return t.toUpperCase();
}

export function MenorDocumentoTab({
	draft,
	numeroLabel,
	solicitanteLabel,
}: {
	draft: ContratacionServiciosDraft;
	numeroLabel: string;
	solicitanteLabel: string;
}) {
	const g = draft.menorDatosGenerales;
	const r = draft.menorDatosRequisicion;
	const d = draft.menorDetalleServicio;

	return (
		<DocumentoTabChrome>
			<div className="w-full space-y-4">
				<PreviewSection title="Identificación">
					<PreviewFieldsGrid>
						<PreviewField label="Tipo" value="CONTRATACIÓN DE SERVICIOS MENOR" fullWidth />
						<PreviewField label="No. requisición" value={numeroLabel} preserveCase />
						<PreviewField label="Solicitante" value={solicitanteLabel} />
						{draft.monto ? (
							<PreviewField label="Monto (incluye IVA)" value={`$${draft.monto}`} preserveCase />
						) : null}
					</PreviewFieldsGrid>
				</PreviewSection>

				<PreviewSection title="Datos generales">
					<PreviewFieldsGrid>
						<PreviewField label="Unidad solicitante (ID)" value={g?.unidadSolicitanteId ?? ''} />
						<PreviewField label="Nombre del solicitante" value={g?.nombreSolicitante ?? ''} />
						<PreviewField label="Cargo" value={g?.cargo ?? ''} />
						<PreviewField
							label="Fecha"
							value={g?.fechaSolicitud ? formatDateToDDMMMYYYY(g.fechaSolicitud) : ''}
							preserveCase
						/>
					</PreviewFieldsGrid>
				</PreviewSection>

				<PreviewSection title="Datos de la requisición">
					<PreviewFieldsGrid>
						<PreviewField label="Justificación del gasto" value={r?.justificacionGasto ?? ''} fullWidth />
					</PreviewFieldsGrid>
				</PreviewSection>

				<PreviewSection title="Detalle del servicio">
					<PreviewFieldsGrid>
						<PreviewField label="Descripción general" value={d?.descripcionGeneral ?? ''} fullWidth />
						<PreviewField label="Descripción específica" value={d?.descripcionEspecifica ?? ''} fullWidth />
						<PreviewField label="Lugar de ejecución" value={d?.lugarEjecucionServicio ?? ''} fullWidth />
						<PreviewField label="Personal requerido" value={d?.personalRequerido ?? ''} fullWidth />
						<PreviewField
							label="Condiciones generales de contratación"
							value={d?.condicionesGeneralesContratacion ?? ''}
							fullWidth
						/>
					</PreviewFieldsGrid>
				</PreviewSection>

				<PreviewSection title="Partidas">
					{draft.menorPartidas.length === 0 ? (
						<p className="text-sm text-slate-500">Sin partidas registradas.</p>
					) : (
						<div className="overflow-x-auto rounded-lg border border-slate-100">
							<table className="w-full min-w-[960px] border-collapse text-left text-sm">
								<thead>
									<tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wide text-slate-600">
										<th className="px-3 py-2">Partida</th>
										<th className="px-3 py-2">Cantidad</th>
										<th className="px-3 py-2">Unidad</th>
										<th className="px-3 py-2">Desc. general</th>
										<th className="px-3 py-2">Desc. específica</th>
										<th className="px-3 py-2">Lugar / periodo</th>
									</tr>
								</thead>
								<tbody>
									{draft.menorPartidas.map((part) => (
										<tr key={part.id} className="border-b border-slate-100 last:border-0">
											<td className="px-3 py-2 align-top font-medium text-slate-800">
												{String(part.numeroPartida)}
											</td>
											<td className="px-3 py-2 align-top whitespace-nowrap text-slate-800">
												{formatCantidadPreview(part.cantidad) || '—'}
											</td>
											<td className="px-3 py-2 align-top uppercase text-slate-800">
												{(part.unidadMedidaLabel || part.unidadMedidaId || '').trim() || '—'}
											</td>
											<td className="px-3 py-2 align-top uppercase text-slate-800 break-words max-w-xs">
												{part.defDescripcionGeneral?.trim() || '—'}
											</td>
											<td className="px-3 py-2 align-top uppercase text-slate-800 break-words max-w-xs">
												{part.defDescripcionEspecifica?.trim() || '—'}
											</td>
											<td className="px-3 py-2 align-top uppercase text-slate-800 break-words max-w-xs">
												{part.defLugarPeriodoEjecucion?.trim() || '—'}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</PreviewSection>
			</div>
		</DocumentoTabChrome>
	);
}
