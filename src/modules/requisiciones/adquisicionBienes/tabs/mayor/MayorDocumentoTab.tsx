import React from 'react';
import { formatDateToDDMMMYYYY } from '../../../../../utils/dateFormat';
import type { AdquisicionDraft } from '../../types';
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

export function MayorDocumentoTab({
	draft,
	numeroLabel,
	solicitanteLabel,
	hideRevisorFields,
}: {
	draft: AdquisicionDraft;
	numeroLabel: string;
	solicitanteLabel: string;
	hideRevisorFields: boolean;
}) {
	const g = draft.mayorDatosGenerales;
	const p = draft.mayorDatosPresupuestales;
	const r = draft.mayorDatosRequisicion;
	const a = draft.mayorDatosAdministrativos;
	const rep = draft.mayorRepresentantes;
	const adm = draft.mayorAdministradorContrato;

	return (
		<DocumentoTabChrome>
			<div className="w-full space-y-4">
				<PreviewSection title="Identificación">
					<PreviewFieldsGrid>
						<PreviewField label="Tipo" value="COMPRA MAYOR DE BIENES" fullWidth />
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
						<PreviewField label="Nombre titular" value={g?.nombreTitular ?? ''} />
						<PreviewField label="Cargo del solicitante" value={g?.cargoSolicitante ?? ''} />
						{!hideRevisorFields ? (
							<PreviewField
								label="Fecha de solicitud"
								value={g?.fechaSolicitud ? formatDateToDDMMMYYYY(g.fechaSolicitud) : ''}
								preserveCase
							/>
						) : null}
						<PreviewField label="Tipo de procedimiento" value={g?.tipoProcedimiento ?? ''} />
						<PreviewField label="Carácter del procedimiento" value={g?.caracterProcedimiento ?? ''} />
						<PreviewField label="Modalidad de contratación" value={g?.modalidadContratacion ?? ''} />
					</PreviewFieldsGrid>
				</PreviewSection>

				<PreviewSection title="Datos presupuestales">
					<PreviewFieldsGrid>
						<PreviewField label="Presupuesto autorizado" value={p?.presupuestoAutorizado ?? ''} preserveCase />
						<PreviewField label="Clave presupuestal / objeto de gasto (ID)" value={p?.clavePresupuestalId ?? ''} />
						<PreviewField label="Origen del recurso (ID)" value={p?.origenRecursoId ?? ''} />
						<PreviewField label="Componente (ID)" value={p?.componenteId ?? ''} />
						<PreviewField label="Actividad (ID)" value={p?.actividadId ?? ''} />
						<PreviewField label="Tipo de programa (ID)" value={p?.tipoProgramaId ?? ''} />
					</PreviewFieldsGrid>
				</PreviewSection>

				<PreviewSection title="Datos de la requisición">
					<PreviewFieldsGrid>
						<PreviewField label="Periodo de garantía" value={r?.periodoGarantia ?? ''} />
						<PreviewField label="Descripción general" value={r?.descripcionGeneral ?? ''} fullWidth />
						<PreviewField label="Justificación del gasto" value={r?.justificacionGasto ?? ''} fullWidth />
					</PreviewFieldsGrid>
				</PreviewSection>

				<PreviewSection title="Partidas">
					{draft.mayorPartidas.length === 0 ? (
						<p className="text-sm text-slate-500">Sin partidas registradas.</p>
					) : (
						<div className="overflow-x-auto rounded-lg border border-slate-100">
							<table className="w-full min-w-[720px] border-collapse text-left text-sm">
								<thead>
									<tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wide text-slate-600">
										<th className="px-3 py-2">Partida</th>
										<th className="px-3 py-2">Cantidad</th>
										<th className="px-3 py-2">Unidad</th>
										<th className="px-3 py-2">Descripción</th>
									</tr>
								</thead>
								<tbody>
									{draft.mayorPartidas.map((part) => (
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
											<td className="px-3 py-2 align-top uppercase text-slate-800 break-words">
												{part.descripcion?.trim() || '—'}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</PreviewSection>

				{!hideRevisorFields ? (
					<>
						<PreviewSection title="Datos administrativos">
							<PreviewFieldsGrid>
								<PreviewField label="Años de experiencia del licitante" value={a?.aniosExperienciaLicitante ?? ''} preserveCase />
								<PreviewField label="Los pagos se realizarán" value={a?.pagosSeRealizaran ?? ''} />
								<PreviewField label="Adquisición mediante contrato" value={a?.adquisicionMedianteContrato ?? ''} />
								<PreviewField label="Artículo (conformidad)" value={a?.articuloConformidad ?? ''} preserveCase />
							</PreviewFieldsGrid>
							<p className="mb-2 mt-4 text-[11px] font-bold uppercase tracking-wide text-slate-600">
								Lugar de entrega
							</p>
							<PreviewFieldsGrid>
								<PreviewField label="Calle" value={a?.lugarEntregaCalle ?? ''} />
								<PreviewField label="Colonia" value={a?.lugarEntregaColonia ?? ''} />
								<PreviewField label="Código postal" value={a?.lugarEntregaCp ?? ''} />
								<PreviewField label="Ciudad" value={a?.lugarEntregaCiudad ?? ''} />
								<PreviewField label="Días de entrega" value={a?.diasEntrega ?? ''} />
							</PreviewFieldsGrid>
						</PreviewSection>
					</>
				) : null}

				<PreviewSection title="Representantes">
					<PreviewFieldsGrid>
						<PreviewField label="Nombre" value={rep?.nombre ?? ''} />
						<PreviewField label="Cargo" value={rep?.cargo ?? ''} />
						<PreviewField label="Correo electrónico" value={rep?.correo ?? ''} preserveCase />
						<PreviewField label="Teléfono" value={rep?.telefono ?? ''} preserveCase />
					</PreviewFieldsGrid>
				</PreviewSection>

				<PreviewSection title="Administrador del contrato">
					<PreviewFieldsGrid>
						<PreviewField label="Nombre" value={adm?.nombre ?? ''} />
						<PreviewField label="Cargo" value={adm?.cargo ?? ''} />
						<PreviewField label="Correo electrónico" value={adm?.correo ?? ''} preserveCase />
						<PreviewField label="Teléfono" value={adm?.telefono ?? ''} preserveCase />
					</PreviewFieldsGrid>
				</PreviewSection>
			</div>
		</DocumentoTabChrome>
	);
}
