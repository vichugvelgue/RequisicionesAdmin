import React, { useEffect, useMemo, useState } from 'react';
import { Tabs, TabsList, TabsTab, TabsPanel } from '../../../components/UI';
import { StepperTabLabel } from './stepperTabLabel';
import type { ContratacionServiciosDraft, ContratacionServiciosRow, TipoCompraServicios } from './types';
import { MayorDatosGeneralesTab } from './tabs/mayor/MayorDatosGeneralesTab';
import { MayorDatosPresupuestalesTab } from './tabs/mayor/MayorDatosPresupuestalesTab';
import { MayorDatosRequisicionTab } from './tabs/mayor/MayorDatosRequisicionTab';
import { MayorPartidasTab } from './tabs/mayor/MayorPartidasTab';
import { MayorEjecucionTab } from './tabs/mayor/MayorEjecucionTab';
import { MayorRecursosTab } from './tabs/mayor/MayorRecursosTab';
import { MayorEntregablesTab } from './tabs/mayor/MayorEntregablesTab';
import { MayorCondicionesTab } from './tabs/mayor/MayorCondicionesTab';
import { MayorRepresentantesTab } from './tabs/mayor/MayorRepresentantesTab';
import { MayorAdministradorContratoTab } from './tabs/mayor/MayorAdministradorContratoTab';
import { MayorDocumentoTab } from './tabs/mayor/MayorDocumentoTab';
import { MenorDatosGeneralesTab } from './tabs/menor/MenorDatosGeneralesTab';
import { MenorDatosRequisicionTab } from './tabs/menor/MenorDatosRequisicionTab';
import { MenorDetalleServicioTab } from './tabs/menor/MenorDetalleServicioTab';
import { MenorPartidasTab } from './tabs/menor/MenorPartidasTab';
import { MenorDocumentoTab } from './tabs/menor/MenorDocumentoTab';

export const CONTRATACION_SERVICIOS_TAB_DOCUMENTO_MAYOR = 'cs-g11';
export const CONTRATACION_SERVICIOS_TAB_DOCUMENTO_MENOR = 'cs-m5';

export function ContratacionServiciosFormShell({
	tipoCompra,
	hideRevisorFields,
	draft,
	onDraftChange,
	editingRow,
	onPatchRow,
	isNewRecord,
	onActiveTabChange,
}: {
	tipoCompra: TipoCompraServicios;
	hideRevisorFields: boolean;
	draft: ContratacionServiciosDraft;
	onDraftChange: (next: ContratacionServiciosDraft) => void;
	editingRow: ContratacionServiciosRow;
	onPatchRow: (patch: Partial<ContratacionServiciosRow>) => void;
	isNewRecord: boolean;
	onActiveTabChange?: (tabId: string) => void;
}) {
	const [tab, setTab] = useState(() => (tipoCompra === 'MAYOR' ? 'cs-g1' : 'cs-m1'));

	useEffect(() => {
		onActiveTabChange?.(tab);
	}, [tab, onActiveTabChange]);

	const AUTO_ADVANCE_DELAY_MS = 900;
	const goToNextTab = (currentTabId: string, orderedTabIds: string[]) => {
		if (!isNewRecord) return;
		const currentIndex = orderedTabIds.indexOf(currentTabId);
		if (currentIndex < 0) return;
		const nextTabId = orderedTabIds[currentIndex + 1];
		if (nextTabId) {
			window.setTimeout(() => {
				setTab(nextTabId);
			}, AUTO_ADVANCE_DELAY_MS);
		}
	};

	const numeroLabel = useMemo(
		() => String(editingRow.numero).padStart(7, '0'),
		[editingRow.numero]
	);

	const solicitantePreview =
		tipoCompra === 'MENOR'
			? (draft.menorDatosGenerales.nombreSolicitante ?? editingRow.solicitante)
			: (draft.mayorDatosGenerales.nombreTitular ?? editingRow.solicitante);

	const canEditSolicitanteFields = hideRevisorFields;

	if (tipoCompra === 'MAYOR') {
		let step = 0;
		const orderedTabIds = [
			'cs-g1',
			'cs-g2',
			'cs-g3',
			'cs-g4',
			'cs-g5',
			'cs-g6',
			'cs-g7',
			'cs-g8',
			'cs-g9',
			'cs-g10',
			'cs-g11',
		];

		return (
			<Tabs value={tab} onChange={setTab} className="flex flex-col flex-1 min-h-0">
				<TabsList className="shrink-0 bg-white border-b border-slate-200">
					<TabsTab value="cs-g1" label={<StepperTabLabel step={++step} title="Datos generales" />} />
					<TabsTab value="cs-g2" label={<StepperTabLabel step={++step} title="Datos presupuestales" />} />
					<TabsTab value="cs-g3" label={<StepperTabLabel step={++step} title="Datos requisición" />} />
					<TabsTab value="cs-g4" label={<StepperTabLabel step={++step} title="Partidas de servicio" />} />
					<TabsTab value="cs-g5" label={<StepperTabLabel step={++step} title="Ejecución" />} />
					<TabsTab value="cs-g6" label={<StepperTabLabel step={++step} title="Recursos" />} />
					<TabsTab value="cs-g7" label={<StepperTabLabel step={++step} title="Entregables" />} />
					<TabsTab value="cs-g8" label={<StepperTabLabel step={++step} title="Condiciones" />} />
					<TabsTab value="cs-g9" label={<StepperTabLabel step={++step} title="Representantes" />} />
					<TabsTab value="cs-g10" label={<StepperTabLabel step={++step} title="Administrador contrato" />} />
					<TabsTab value="cs-g11" label={<StepperTabLabel step={++step} title="Documento" />} />
				</TabsList>
				<TabsPanel value="cs-g1" className="flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-50">
					<MayorDatosGeneralesTab
						hideRevisorFields={hideRevisorFields}
						initialValues={draft.mayorDatosGenerales}
						onSave={(data) => {
							onDraftChange({
								...draft,
								mayorDatosGenerales: { ...draft.mayorDatosGenerales, ...data },
							});
							onPatchRow({ solicitante: data.nombreTitular });
							goToNextTab('cs-g1', orderedTabIds);
						}}
					/>
				</TabsPanel>
				<TabsPanel value="cs-g2" className="flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-50">
					<MayorDatosPresupuestalesTab
						initialValues={draft.mayorDatosPresupuestales}
						onSave={(data) => {
							onDraftChange({
								...draft,
								mayorDatosPresupuestales: { ...draft.mayorDatosPresupuestales, ...data },
							});
							goToNextTab('cs-g2', orderedTabIds);
						}}
					/>
				</TabsPanel>
				<TabsPanel value="cs-g3" className="flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-50">
					<MayorDatosRequisicionTab
						initialValues={draft.mayorDatosRequisicion}
						onSave={(data) => {
							onDraftChange({
								...draft,
								mayorDatosRequisicion: { ...draft.mayorDatosRequisicion, ...data },
							});
							goToNextTab('cs-g3', orderedTabIds);
						}}
					/>
				</TabsPanel>
				<TabsPanel value="cs-g4" className="flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-50">
					<MayorPartidasTab
						partidas={draft.mayorPartidas}
						hideRevisorFields={hideRevisorFields}
						canEditSolicitanteFields={canEditSolicitanteFields}
						onChange={(partidas) => {
							onDraftChange({ ...draft, mayorPartidas: partidas });
						}}
					/>
				</TabsPanel>
				<TabsPanel value="cs-g5" className="flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-50">
					<MayorEjecucionTab
						hideRevisorFields={hideRevisorFields}
						initialValues={draft.mayorEjecucion}
						onSave={(data) => {
							onDraftChange({
								...draft,
								mayorEjecucion: { ...draft.mayorEjecucion, ...data },
							});
							goToNextTab('cs-g5', orderedTabIds);
						}}
					/>
				</TabsPanel>
				<TabsPanel value="cs-g6" className="flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-50">
					<MayorRecursosTab
						initialValues={draft.mayorRecursos}
						onSave={(data) => {
							onDraftChange({
								...draft,
								mayorRecursos: { ...draft.mayorRecursos, ...data },
							});
							goToNextTab('cs-g6', orderedTabIds);
						}}
					/>
				</TabsPanel>
				<TabsPanel value="cs-g7" className="flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-50">
					<MayorEntregablesTab
						initialValues={draft.mayorEntregables}
						onSave={(data) => {
							onDraftChange({
								...draft,
								mayorEntregables: { ...draft.mayorEntregables, ...data },
							});
							goToNextTab('cs-g7', orderedTabIds);
						}}
					/>
				</TabsPanel>
				<TabsPanel value="cs-g8" className="flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-50">
					<MayorCondicionesTab
						hideRevisorFields={hideRevisorFields}
						initialValues={draft.mayorCondiciones}
						onSave={(data) => {
							onDraftChange({
								...draft,
								mayorCondiciones: { ...draft.mayorCondiciones, ...data },
							});
							goToNextTab('cs-g8', orderedTabIds);
						}}
					/>
				</TabsPanel>
				<TabsPanel value="cs-g9" className="flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-50">
					<MayorRepresentantesTab
						initialValues={draft.mayorRepresentantes}
						onSave={(data) => {
							onDraftChange({
								...draft,
								mayorRepresentantes: { ...draft.mayorRepresentantes, ...data },
							});
							goToNextTab('cs-g9', orderedTabIds);
						}}
					/>
				</TabsPanel>
				<TabsPanel value="cs-g10" className="flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-50">
					<MayorAdministradorContratoTab
						initialValues={draft.mayorAdministradorContrato}
						onSave={(data) => {
							onDraftChange({
								...draft,
								mayorAdministradorContrato: { ...draft.mayorAdministradorContrato, ...data },
							});
							goToNextTab('cs-g10', orderedTabIds);
						}}
					/>
				</TabsPanel>
				<TabsPanel value="cs-g11" className="flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-50">
					<MayorDocumentoTab
						draft={draft}
						numeroLabel={numeroLabel}
						solicitanteLabel={solicitantePreview}
						hideRevisorFields={hideRevisorFields}
					/>
				</TabsPanel>
			</Tabs>
		);
	}

	const menorTabIds = ['cs-m1', 'cs-m2', 'cs-m3', 'cs-m4', 'cs-m5'];
	let mStep = 0;

	return (
		<Tabs value={tab} onChange={setTab} className="flex flex-col flex-1 min-h-0">
			<TabsList className="shrink-0 bg-white border-b border-slate-200">
				<TabsTab value="cs-m1" label={<StepperTabLabel step={++mStep} title="Datos generales" />} />
				<TabsTab value="cs-m2" label={<StepperTabLabel step={++mStep} title="Datos requisición" />} />
				<TabsTab value="cs-m3" label={<StepperTabLabel step={++mStep} title="Detalle del servicio" />} />
				<TabsTab value="cs-m4" label={<StepperTabLabel step={++mStep} title="Partidas" />} />
				<TabsTab value="cs-m5" label={<StepperTabLabel step={++mStep} title="Documento" />} />
			</TabsList>
			<TabsPanel value="cs-m1" className="flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-50">
				<MenorDatosGeneralesTab
					initialValues={draft.menorDatosGenerales}
					onSave={(data) => {
						onDraftChange({
							...draft,
							menorDatosGenerales: { ...draft.menorDatosGenerales, ...data },
						});
						onPatchRow({ solicitante: data.nombreSolicitante });
						goToNextTab('cs-m1', menorTabIds);
					}}
				/>
			</TabsPanel>
			<TabsPanel value="cs-m2" className="flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-50">
				<MenorDatosRequisicionTab
					initialValues={draft.menorDatosRequisicion}
					onSave={(data) => {
						onDraftChange({
							...draft,
							menorDatosRequisicion: { ...draft.menorDatosRequisicion, ...data },
						});
						goToNextTab('cs-m2', menorTabIds);
					}}
				/>
			</TabsPanel>
			<TabsPanel value="cs-m3" className="flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-50">
				<MenorDetalleServicioTab
					initialValues={draft.menorDetalleServicio}
					onSave={(data) => {
						onDraftChange({
							...draft,
							menorDetalleServicio: { ...draft.menorDetalleServicio, ...data },
						});
						goToNextTab('cs-m3', menorTabIds);
					}}
				/>
			</TabsPanel>
			<TabsPanel value="cs-m4" className="flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-50">
				<MenorPartidasTab
					partidas={draft.menorPartidas}
					canEditSolicitanteFields={canEditSolicitanteFields}
					onChange={(partidas) => {
						onDraftChange({ ...draft, menorPartidas: partidas });
					}}
				/>
			</TabsPanel>
			<TabsPanel value="cs-m5" className="flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-50">
				<MenorDocumentoTab
					draft={draft}
					numeroLabel={numeroLabel}
					solicitanteLabel={solicitantePreview}
				/>
			</TabsPanel>
		</Tabs>
	);
}
