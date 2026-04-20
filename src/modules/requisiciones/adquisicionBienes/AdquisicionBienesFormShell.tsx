import React, { useEffect, useMemo, useState } from 'react';
import { Tabs, TabsList, TabsTab, TabsPanel } from '../../../components/UI';
import { StepperTabLabel } from './stepperTabLabel';
import type { AdquisicionDraft, TipoCompra } from './types';
import { MayorDatosGeneralesTab } from './tabs/mayor/MayorDatosGeneralesTab';
import { MayorDatosPresupuestalesTab } from './tabs/mayor/MayorDatosPresupuestalesTab';
import { MayorDatosRequisicionTab } from './tabs/mayor/MayorDatosRequisicionTab';
import { MayorPartidasTab } from './tabs/mayor/MayorPartidasTab';
import { MayorDatosAdministrativosTab } from './tabs/mayor/MayorDatosAdministrativosTab';
import { MayorRepresentantesTab } from './tabs/mayor/MayorRepresentantesTab';
import { MayorAdministradorContratoTab } from './tabs/mayor/MayorAdministradorContratoTab';
import { MayorDocumentoTab } from './tabs/mayor/MayorDocumentoTab';
import { MenorDatosGeneralesTab } from './tabs/menor/MenorDatosGeneralesTab';
import { MenorDatosRequisicionTab } from './tabs/menor/MenorDatosRequisicionTab';
import { MenorPartidasTab } from './tabs/menor/MenorPartidasTab';
import { MenorDocumentoTab } from './tabs/menor/MenorDocumentoTab';
import type { RequisicionRow } from './types';

/** Id de la pestaña "Documento" (última) en el flujo MAYOR. */
export const ADQUISICION_BIENES_TAB_DOCUMENTO_MAYOR = 'g8';
/** Id de la pestaña "Documento" (última) en el flujo MENOR. */
export const ADQUISICION_BIENES_TAB_DOCUMENTO_MENOR = 'm4';

export function AdquisicionBienesFormShell({
	tipoCompra,
	hideRevisorFields,
	draft,
	onDraftChange,
	editingRow,
	onPatchRow,
	isNewRecord,
	onActiveTabChange,
}: {
	tipoCompra: TipoCompra;
	hideRevisorFields: boolean;
	draft: AdquisicionDraft;
	onDraftChange: (next: AdquisicionDraft) => void;
	editingRow: RequisicionRow;
	onPatchRow: (patch: Partial<RequisicionRow>) => void;
	isNewRecord: boolean;
	onActiveTabChange?: (tabId: string) => void;
}) {
	const [tab, setTab] = useState(() => (tipoCompra === 'MAYOR' ? 'g1' : 'm1'));

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

	if (tipoCompra === 'MAYOR') {
		let step = 0;
		const tabsList: { id: string; label: React.ReactNode; panel: React.ReactNode }[] = [
			{
				id: 'g1',
				label: <StepperTabLabel step={++step} title="Datos generales" />,
				panel: (
					<MayorDatosGeneralesTab
						hideRevisorFields={hideRevisorFields}
						initialValues={draft.mayorDatosGenerales}
						onSave={(data) => {
							onDraftChange({
								...draft,
								mayorDatosGenerales: { ...draft.mayorDatosGenerales, ...data },
							});
							onPatchRow({ solicitante: data.nombreTitular });
						}}
					/>
				),
			},
			{
				id: 'g2',
				label: <StepperTabLabel step={++step} title="Datos presupuestales" />,
				panel: (
					<MayorDatosPresupuestalesTab
						initialValues={draft.mayorDatosPresupuestales}
						onSave={(data) => {
							onDraftChange({
								...draft,
								mayorDatosPresupuestales: { ...draft.mayorDatosPresupuestales, ...data },
							});
						}}
					/>
				),
			},
			{
				id: 'g3',
				label: <StepperTabLabel step={++step} title="Datos requisición" />,
				panel: (
					<MayorDatosRequisicionTab
						initialValues={draft.mayorDatosRequisicion}
						onSave={(data) => {
							onDraftChange({
								...draft,
								mayorDatosRequisicion: { ...draft.mayorDatosRequisicion, ...data },
							});
						}}
					/>
				),
			},
			{
				id: 'g4',
				label: <StepperTabLabel step={++step} title="Partidas" />,
				panel: (
					<MayorPartidasTab
						partidas={draft.mayorPartidas}
						canEditSolicitanteFields={hideRevisorFields}
						onChange={(partidas) => {
							onDraftChange({
								...draft,
								mayorPartidas: partidas,
							});
						}}
					/>
				),
			},
		];

		if (!hideRevisorFields) {
			tabsList.push({
				id: 'g5',
				label: <StepperTabLabel step={++step} title="Datos administrativos" />,
				panel: (
					<MayorDatosAdministrativosTab
						initialValues={draft.mayorDatosAdministrativos}
						onSave={(data) => {
							onDraftChange({
								...draft,
								mayorDatosAdministrativos: { ...draft.mayorDatosAdministrativos, ...data },
							});
						}}
					/>
				),
			});
		}

		tabsList.push(
			{
				id: 'g6',
				label: <StepperTabLabel step={++step} title="Representantes" />,
				panel: (
					<MayorRepresentantesTab
						initialValues={draft.mayorRepresentantes}
						onSave={(data) => {
							onDraftChange({
								...draft,
								mayorRepresentantes: { ...draft.mayorRepresentantes, ...data },
							});
						}}
					/>
				),
			},
			{
				id: 'g7',
				label: <StepperTabLabel step={++step} title="Administrador contrato" />,
				panel: (
					<MayorAdministradorContratoTab
						initialValues={draft.mayorAdministradorContrato}
						onSave={(data) => {
							onDraftChange({
								...draft,
								mayorAdministradorContrato: { ...draft.mayorAdministradorContrato, ...data },
							});
						}}
					/>
				),
			},
			{
				id: 'g8',
				label: <StepperTabLabel step={++step} title="Documento" />,
				panel: (
					<MayorDocumentoTab
						draft={draft}
						numeroLabel={numeroLabel}
						solicitanteLabel={solicitantePreview}
						hideRevisorFields={hideRevisorFields}
					/>
				),
			}
		);
		const orderedTabIds = tabsList.map((t) => t.id);
		tabsList[0].panel = (
			<MayorDatosGeneralesTab
				hideRevisorFields={hideRevisorFields}
				initialValues={draft.mayorDatosGenerales}
				onSave={(data) => {
					onDraftChange({
						...draft,
						mayorDatosGenerales: { ...draft.mayorDatosGenerales, ...data },
					});
					onPatchRow({ solicitante: data.nombreTitular });
					goToNextTab('g1', orderedTabIds);
				}}
			/>
		);
		tabsList[1].panel = (
			<MayorDatosPresupuestalesTab
				initialValues={draft.mayorDatosPresupuestales}
				onSave={(data) => {
					onDraftChange({
						...draft,
						mayorDatosPresupuestales: { ...draft.mayorDatosPresupuestales, ...data },
					});
					goToNextTab('g2', orderedTabIds);
				}}
			/>
		);
		tabsList[2].panel = (
			<MayorDatosRequisicionTab
				initialValues={draft.mayorDatosRequisicion}
				onSave={(data) => {
					onDraftChange({
						...draft,
						mayorDatosRequisicion: { ...draft.mayorDatosRequisicion, ...data },
					});
					goToNextTab('g3', orderedTabIds);
				}}
			/>
		);
		if (!hideRevisorFields) {
			const administrativosIdx = orderedTabIds.indexOf('g5');
			if (administrativosIdx >= 0) {
				tabsList[administrativosIdx].panel = (
					<MayorDatosAdministrativosTab
						initialValues={draft.mayorDatosAdministrativos}
						onSave={(data) => {
							onDraftChange({
								...draft,
								mayorDatosAdministrativos: { ...draft.mayorDatosAdministrativos, ...data },
							});
							goToNextTab('g5', orderedTabIds);
						}}
					/>
				);
			}
		}
		const representantesIdx = orderedTabIds.indexOf('g6');
		if (representantesIdx >= 0) {
			tabsList[representantesIdx].panel = (
				<MayorRepresentantesTab
					initialValues={draft.mayorRepresentantes}
					onSave={(data) => {
						onDraftChange({
							...draft,
							mayorRepresentantes: { ...draft.mayorRepresentantes, ...data },
						});
						goToNextTab('g6', orderedTabIds);
					}}
				/>
			);
		}
		const administradorIdx = orderedTabIds.indexOf('g7');
		if (administradorIdx >= 0) {
			tabsList[administradorIdx].panel = (
				<MayorAdministradorContratoTab
					initialValues={draft.mayorAdministradorContrato}
					onSave={(data) => {
						onDraftChange({
							...draft,
							mayorAdministradorContrato: { ...draft.mayorAdministradorContrato, ...data },
						});
						goToNextTab('g7', orderedTabIds);
					}}
				/>
			);
		}

		return (
			<Tabs value={tab} onChange={setTab} className="flex flex-col flex-1 min-h-0">
				<TabsList className="shrink-0 bg-white border-b border-slate-200">
					{tabsList.map((t) => (
						<TabsTab key={t.id} value={t.id} label={t.label} />
					))}
				</TabsList>
				{tabsList.map((t) => (
					<TabsPanel key={t.id} value={t.id} className="flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-50">
						{t.panel}
					</TabsPanel>
				))}
			</Tabs>
		);
	}

	/* MENOR */
	const menorTabs = [
		{
			id: 'm1',
			label: <StepperTabLabel step={1} title="Datos generales" />,
			panel: (
				<MenorDatosGeneralesTab
					initialValues={draft.menorDatosGenerales}
					onSave={(data) => {
						onDraftChange({
							...draft,
							menorDatosGenerales: { ...draft.menorDatosGenerales, ...data },
						});
						onPatchRow({ solicitante: data.nombreSolicitante });
					}}
				/>
			),
		},
		{
			id: 'm2',
			label: <StepperTabLabel step={2} title="Datos requisición" />,
			panel: (
				<MenorDatosRequisicionTab
					initialValues={draft.menorDatosRequisicion}
					onSave={(data) => {
						onDraftChange({
							...draft,
							menorDatosRequisicion: { ...draft.menorDatosRequisicion, ...data },
						});
					}}
				/>
			),
		},
		{
			id: 'm3',
			label: <StepperTabLabel step={3} title="Partidas" />,
			panel: (
				<MenorPartidasTab
					partidas={draft.menorPartidas}
					canEditSolicitanteFields={hideRevisorFields}
					onChange={(partidas) => {
						onDraftChange({
							...draft,
							menorPartidas: partidas,
						});
					}}
				/>
			),
		},
		{
			id: 'm4',
			label: <StepperTabLabel step={4} title="Documento" />,
			panel: (
				<MenorDocumentoTab
					draft={draft}
					numeroLabel={numeroLabel}
					solicitanteLabel={solicitantePreview}
				/>
			),
		},
	];
	const menorTabIds = menorTabs.map((t) => t.id);
	menorTabs[0].panel = (
		<MenorDatosGeneralesTab
			initialValues={draft.menorDatosGenerales}
			onSave={(data) => {
				onDraftChange({
					...draft,
					menorDatosGenerales: { ...draft.menorDatosGenerales, ...data },
				});
				onPatchRow({ solicitante: data.nombreSolicitante });
				goToNextTab('m1', menorTabIds);
			}}
		/>
	);
	menorTabs[1].panel = (
		<MenorDatosRequisicionTab
			initialValues={draft.menorDatosRequisicion}
			onSave={(data) => {
				onDraftChange({
					...draft,
					menorDatosRequisicion: { ...draft.menorDatosRequisicion, ...data },
				});
				goToNextTab('m2', menorTabIds);
			}}
		/>
	);

	return (
		<Tabs value={tab} onChange={setTab} className="flex flex-col flex-1 min-h-0">
			<TabsList className="shrink-0 bg-white border-b border-slate-200">
				{menorTabs.map((t) => (
					<TabsTab key={t.id} value={t.id} label={t.label} />
				))}
			</TabsList>
			{menorTabs.map((t) => (
				<TabsPanel key={t.id} value={t.id} className="flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-50">
					{t.panel}
				</TabsPanel>
			))}
		</Tabs>
	);
}
