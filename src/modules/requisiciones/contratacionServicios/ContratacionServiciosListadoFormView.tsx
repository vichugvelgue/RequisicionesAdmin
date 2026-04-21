import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Check, Plus, Save, Trash2 } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../auth';
import {
	BackLink,
	Button,
	ConfirmModal,
	InfiniteScrollTable,
	PageCard,
	TableFilterBar,
	Toast,
	ViewHeader,
	StatusBadge,
	resolveStatusBadge,
} from '../../../components/UI';
import type { OptionItem, SortConfig } from '../../../components/UI/types';
import type { SimpleTableColumn } from '../../../components/UI/SimpleTable/SimpleTable';
import { MontoInicialStep } from './MontoInicialStep';
import {
	ContratacionServiciosFormShell,
	CONTRATACION_SERVICIOS_TAB_DOCUMENTO_MAYOR,
	CONTRATACION_SERVICIOS_TAB_DOCUMENTO_MENOR,
} from './ContratacionServiciosFormShell';
import {
	createEmptyDraft,
	userHidesRevisorFields,
	type ContratacionServiciosDraft,
	type ContratacionServiciosRow,
	type ContratacionServiciosSearchCriteria,
	type TipoCompraServicios,
} from './types';
import { createSeedDraftFromContratacionRow } from './seedDraftFromContratacionRow';

const BASE_PATH = '/requisiciones/contratacion-servicios';

const SEARCH_CRITERIA_OPTIONS: OptionItem[] = [
	{ value: 'Coincidencia', label: 'Coincidencia' },
	{ value: 'ID', label: 'ID' },
	{ value: 'Solicitante', label: 'Solicitante' },
	{ value: 'Tipo', label: 'Tipo' },
	{ value: 'Estatus', label: 'Estatus' },
];

const INITIAL_ROWS: ContratacionServiciosRow[] = [
	{
		id: 'cs-1',
		numero: 101,
		monto: 120000,
		tipoCompra: 'MAYOR',
		solicitante: 'LUIS MENDOZA RIVERA',
		estatus: 'PENDIENTE',
		fechaSolicitudIso: '2026-03-12',
	},
	{
		id: 'cs-2',
		numero: 102,
		monto: 15000.5,
		tipoCompra: 'MENOR',
		solicitante: 'CARLA NUÑEZ ORTEGA',
		estatus: 'APROBADA',
		fechaSolicitudIso: '2026-02-05',
	},
	{
		id: 'cs-3',
		numero: 115,
		monto: 56000,
		tipoCompra: 'MAYOR',
		solicitante: 'PEDRO SALINAS FLORES',
		estatus: 'RECHAZADA',
		fechaSolicitudIso: '2026-01-22',
	},
];

const TABLE_COLUMNS: SimpleTableColumn<ContratacionServiciosRow>[] = [
	{
		key: 'numero',
		label: 'ID',
		sortable: true,
		width: 'w-[10%]',
		render: (_v, row) => String(row.numero).padStart(7, '0'),
	},
	{
		key: 'monto',
		label: 'MONTO',
		sortable: true,
		width: 'w-[14%]',
		cellType: 'money',
	},
	{
		key: 'tipoCompra',
		label: 'TIPO',
		sortable: true,
		width: 'w-[12%]',
		cellClassName: 'uppercase',
	},
	{
		key: 'solicitante',
		label: 'SOLICITANTE',
		sortable: true,
		width: 'w-[26%]',
		cellClassName: 'uppercase',
	},
	{
		key: 'estatus',
		label: 'ESTATUS',
		sortable: true,
		width: 'w-[14%]',
		render: (_v, row) => {
			const r = resolveStatusBadge(row.estatus);
			return <StatusBadge variant={r.variant}>{r.label}</StatusBadge>;
		},
	},
	{
		key: 'fechaSolicitudIso',
		label: 'FECHA SOL.',
		sortable: true,
		width: 'w-[14%]',
	},
];

function matchesSearch(
	row: ContratacionServiciosRow,
	criteria: ContratacionServiciosSearchCriteria,
	text: string
): boolean {
	const t = text.trim().toLowerCase();
	if (!t) return true;
	const idStr = String(row.numero).padStart(7, '0');
	if (criteria === 'Coincidencia') {
		return (
			idStr.toLowerCase().includes(t) ||
			row.solicitante.toLowerCase().includes(t) ||
			row.tipoCompra.toLowerCase().includes(t) ||
			row.estatus.toLowerCase().includes(t)
		);
	}
	if (criteria === 'ID') return idStr.toLowerCase().includes(t);
	if (criteria === 'Solicitante') return row.solicitante.toLowerCase().includes(t);
	if (criteria === 'Tipo') return row.tipoCompra.toLowerCase().includes(t);
	if (criteria === 'Estatus') return row.estatus.toLowerCase().includes(t);
	return true;
}

export function ContratacionServiciosListadoFormView() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const { id } = useParams();

	const [rows, setRows] = useState<ContratacionServiciosRow[]>(INITIAL_ROWS);
	const [draftById, setDraftById] = useState<Record<string, ContratacionServiciosDraft>>({});
	const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'numero', direction: 'desc' });
	const [showInlineFilters, setShowInlineFilters] = useState(false);
	const [inlineFilters, setInlineFilters] = useState<Record<string, string>>({
		numero: '',
		monto: '',
		tipoCompra: '',
		solicitante: '',
		estatus: '',
		fechaSolicitudIso: '',
	});

	const [pendingCriteria, setPendingCriteria] = useState<string>('Coincidencia');
	const [pendingSearchText, setPendingSearchText] = useState('');
	const [pendingTipo, setPendingTipo] = useState('');
	const [pendingEstatus, setPendingEstatus] = useState('');

	const [appliedSearch, setAppliedSearch] = useState({
		criteria: 'Coincidencia' as ContratacionServiciosSearchCriteria,
		text: '',
	});
	const [appliedTipo, setAppliedTipo] = useState('');
	const [appliedEstatus, setAppliedEstatus] = useState('');

	const [pendingDeleteRow, setPendingDeleteRow] = useState<ContratacionServiciosRow | null>(null);
	const [newlyCreatedIds, setNewlyCreatedIds] = useState<string[]>([]);
	const [activeFormTabId, setActiveFormTabId] = useState('');
	const [toastState, setToastState] = useState<{
		visible: boolean;
		title: string;
		variant: 'success' | 'error';
	}>({ visible: false, title: '', variant: 'success' });

	const isCreateMode = location.pathname.endsWith('/nuevo');
	const editingRow = rows.find((row) => row.id === id) ?? null;
	const isEditRoute = Boolean(id) && !isCreateMode;
	const mode: 'listado' | 'form-alta' | 'form-edicion' = isCreateMode
		? 'form-alta'
		: isEditRoute
			? 'form-edicion'
			: 'listado';

	const isNewRecord = Boolean(editingRow && newlyCreatedIds.includes(editingRow.id));
	const isRevisorProfile = user?.tipoPerfil === 'REVISOR';
	/** Solo el solicitante oculta bloques de revisor; `isNewRecord` no debe acortar el formulario al revisor al consultar. */
	const hideRevisorFields = userHidesRevisorFields(user) || (isNewRecord && !isRevisorProfile);

	useEffect(() => {
		if (!isCreateMode || !isRevisorProfile) return;
		navigate(BASE_PATH, { replace: true });
		setToastState({
			visible: true,
			title: 'Los revisores no crean requisiciones nuevas.',
			variant: 'error',
		});
	}, [isCreateMode, isRevisorProfile, navigate]);

	useEffect(() => {
		if (mode !== 'form-edicion') return;
		if (editingRow) return;
		navigate(BASE_PATH, { replace: true });
	}, [editingRow, mode, navigate]);

	const applyFilters = useCallback(() => {
		setAppliedSearch({
			criteria: pendingCriteria as ContratacionServiciosSearchCriteria,
			text: pendingSearchText,
		});
		setAppliedTipo(pendingTipo);
		setAppliedEstatus(pendingEstatus);
	}, [pendingCriteria, pendingSearchText, pendingTipo, pendingEstatus]);

	const filteredAndSortedRows = useMemo(() => {
		const filtered = rows.filter((row) => {
			if (!matchesSearch(row, appliedSearch.criteria, appliedSearch.text)) return false;
			if (appliedTipo && row.tipoCompra !== appliedTipo) return false;
			if (appliedEstatus && row.estatus !== appliedEstatus) return false;
			return (
				String(row.numero).includes(inlineFilters.numero) &&
				String(row.monto).toLowerCase().includes(inlineFilters.monto.toLowerCase()) &&
				row.tipoCompra.toLowerCase().includes(inlineFilters.tipoCompra.toLowerCase()) &&
				row.solicitante.toLowerCase().includes(inlineFilters.solicitante.toLowerCase()) &&
				row.estatus.toLowerCase().includes(inlineFilters.estatus.toLowerCase()) &&
				row.fechaSolicitudIso.toLowerCase().includes(inlineFilters.fechaSolicitudIso.toLowerCase())
			);
		});
		return [...filtered].sort((a, b) => {
			const key = sortConfig.key as keyof ContratacionServiciosRow;
			const direction = sortConfig.direction === 'asc' ? 1 : -1;
			const av = a[key];
			const bv = b[key];
			if (typeof av === 'number' && typeof bv === 'number') {
				return (av - bv) * direction;
			}
			return String(av).localeCompare(String(bv), 'es', { numeric: true }) * direction;
		});
	}, [rows, sortConfig, inlineFilters, appliedSearch, appliedTipo, appliedEstatus]);

	const filterBarFilters = useMemo(
		() => [
			{
				type: 'search' as const,
				cols: 4,
				criteriaOptions: SEARCH_CRITERIA_OPTIONS,
				criteriaValue: pendingCriteria,
				onCriteriaChange: (v: string) => setPendingCriteria(v),
				labelInput: 'Búsqueda:',
				searchValue: pendingSearchText,
				onSearchChange: (v: string) => setPendingSearchText(v),
				placeholder: 'Término de búsqueda…',
			},
			{
				type: 'select' as const,
				cols: 2,
				label: 'Tipo',
				options: [
					{ value: '', label: 'Todos' },
					{ value: 'MAYOR', label: 'Mayor' },
					{ value: 'MENOR', label: 'Menor' },
				],
				value: pendingTipo,
				onChange: (v: string) => setPendingTipo(v),
			},
			{
				type: 'select' as const,
				cols: 2,
				label: 'Estatus',
				options: [
					{ value: '', label: 'Todos' },
					{ value: 'PENDIENTE', label: 'Pendiente' },
					{ value: 'APROBADA', label: 'Aprobada' },
					{ value: 'RECHAZADA', label: 'Rechazada' },
				],
				value: pendingEstatus,
				onChange: (v: string) => setPendingEstatus(v),
			},
		],
		[pendingCriteria, pendingSearchText, pendingTipo, pendingEstatus]
	);

	const resetToListado = () => {
		navigate(BASE_PATH);
	};

	const handleGuardarRequisicion = () => {
		if (!editingRow) return;
		const d = draftById[editingRow.id];
		if (d?.monto?.trim()) {
			const n = parseFloat(d.monto);
			if (!Number.isNaN(n)) patchRow(editingRow.id, { monto: n });
		}
		setNewlyCreatedIds((prev) => prev.filter((x) => x !== editingRow.id));
		resetToListado();
		setToastState({
			visible: true,
			title: 'Requisición guardada correctamente.',
			variant: 'success',
		});
	};

	const isDocumentoTab =
		editingRow &&
		((editingRow.tipoCompra === 'MAYOR' &&
			activeFormTabId === CONTRATACION_SERVICIOS_TAB_DOCUMENTO_MAYOR) ||
			(editingRow.tipoCompra === 'MENOR' &&
				activeFormTabId === CONTRATACION_SERVICIOS_TAB_DOCUMENTO_MENOR));

	const showGuardarRequisicionEnHeader =
		mode === 'form-edicion' &&
		editingRow &&
		newlyCreatedIds.includes(editingRow.id) &&
		Boolean(isDocumentoTab);

	const handleAddClick = () => {
		navigate(`${BASE_PATH}/nuevo`);
	};

	const handleEditClick = (row: ContratacionServiciosRow) => {
		navigate(`${BASE_PATH}/${row.id}`);
	};

	const handleMontoContinue = ({
		montoStr,
		tipoCompra,
	}: {
		montoStr: string;
		tipoCompra: TipoCompraServicios;
	}) => {
		const monto = parseFloat(montoStr) || 0;
		const nextNum = rows.reduce((max, r) => Math.max(max, r.numero || 0), 0) + 1;
		const newId = `cs-${rows.reduce((max, r) => Math.max(max, Number(String(r.id).replace(/\D/g, '')) || 0), 0) + 1}`;
		const solicitante = (
			user?.displayName?.trim() ||
			user?.email?.trim() ||
			'SOLICITANTE'
		).toUpperCase();
		const newRow: ContratacionServiciosRow = {
			id: newId,
			numero: nextNum,
			monto,
			tipoCompra,
			solicitante,
			estatus: 'PENDIENTE',
			fechaSolicitudIso: new Date().toISOString().slice(0, 10),
		};
		setRows((prev) => [newRow, ...prev]);
		setDraftById((prev) => ({
			...prev,
			[newId]: {
				...createEmptyDraft(),
				monto: monto.toFixed(2),
				tipoCompra,
			},
		}));
		setNewlyCreatedIds((prev) => (prev.includes(newId) ? prev : [...prev, newId]));
		navigate(`${BASE_PATH}/${newId}`, { replace: true });
		setToastState({
			visible: true,
			title: 'Requisición creada. Complete las pestañas.',
			variant: 'success',
		});
	};

	const handleDeleteConfirm = () => {
		if (!pendingDeleteRow) return;
		const delId = pendingDeleteRow.id;
		setRows((prev) => prev.filter((r) => r.id !== delId));
		setDraftById((prev) => {
			const n = { ...prev };
			delete n[delId];
			return n;
		});
		setPendingDeleteRow(null);
		setToastState({
			visible: true,
			title: 'Registro eliminado correctamente',
			variant: 'success',
		});
	};

	const patchRow = useCallback((rowId: string, patch: Partial<ContratacionServiciosRow>) => {
		setRows((prev) => prev.map((r) => (r.id === rowId ? { ...r, ...patch } : r)));
	}, []);

	const draftForEdit = editingRow
		? draftById[editingRow.id] ?? createEmptyDraft()
		: createEmptyDraft();

	useEffect(() => {
		if (mode !== 'form-edicion') {
			setActiveFormTabId('');
		}
	}, [mode]);

	useEffect(() => {
		if (mode !== 'form-edicion' || !editingRow) return;
		setDraftById((prev) => {
			if (prev[editingRow.id]) return prev;
			return {
				...prev,
				[editingRow.id]: createSeedDraftFromContratacionRow(editingRow),
			};
		});
	}, [mode, editingRow]);

	const setDraftForId = useCallback((rowId: string, next: ContratacionServiciosDraft) => {
		setDraftById((prev) => ({ ...prev, [rowId]: next }));
	}, []);

	useEffect(() => {
		if (!toastState.visible) return;
		const t = setTimeout(() => setToastState((s) => ({ ...s, visible: false })), 3000);
		return () => clearTimeout(t);
	}, [toastState.visible]);

	return (
		<div className="flex flex-col h-full min-h-0 bg-slate-50 p-2 lg:p-3 overflow-hidden">
			<div className="w-full min-h-0 flex-1 flex flex-col">
				{mode !== 'listado' ? (
					<div className="flex items-center justify-between mb-4 shrink-0">
						<BackLink onClick={resetToListado}>Volver a contratación de servicios</BackLink>
					</div>
				) : null}
				<PageCard className="h-full min-h-0 flex-1 flex flex-col">
					<ViewHeader
						title={
							mode === 'listado'
								? 'Contratación de servicios'
								: mode === 'form-alta'
									? 'Nueva requisición'
									: `Requisición ${editingRow ? String(editingRow.numero).padStart(7, '0') : ''}`
						}
						action={
							mode === 'listado' ? (
								<Button
									variant="primary"
									size="md"
									leftIcon={<Plus className="w-4 h-4" />}
									onClick={handleAddClick}
									disabled={isRevisorProfile}
									title={
										isRevisorProfile
											? 'Los revisores no crean requisiciones nuevas.'
											: undefined
									}
								>
									Agregar
								</Button>
							) : showGuardarRequisicionEnHeader ? (
								<Button
									type="button"
									variant="success"
									size="md"
									leftIcon={<Save className="w-4 h-4" />}
									onClick={handleGuardarRequisicion}
								>
									Guardar
								</Button>
							) : null
						}
					/>

					{mode === 'listado' ? (
						<div className="flex-1 min-h-0 flex flex-col px-5 pt-4 pb-2 gap-3">
							<TableFilterBar
								filters={filterBarFilters}
								gridCols={12}
								onApply={applyFilters}
								applyLabel="Buscar"
								className="shrink-0"
							/>
							<div className="flex-1 min-h-0">
								<InfiniteScrollTable<ContratacionServiciosRow>
									data={filteredAndSortedRows}
									pageSize={30}
									resetKey={JSON.stringify({
										appliedSearch,
										appliedTipo,
										appliedEstatus,
										inlineFilters,
										sortConfig,
									})}
									columns={TABLE_COLUMNS}
									getRowKey={(row) => row.id}
									sortConfig={sortConfig}
									onSort={(key) =>
										setSortConfig((prev) => ({
											key,
											direction:
												prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
										}))
									}
									onEdit={handleEditClick}
									onDelete={(row) => setPendingDeleteRow(row)}
									showInlineFilters={showInlineFilters}
									onToggleInlineFilters={() => setShowInlineFilters((v) => !v)}
									inlineFilters={inlineFilters}
									onInlineFilterChange={(key, value) =>
										setInlineFilters((prev) => ({ ...prev, [key]: value }))
									}
									onClearInlineFilters={() =>
										setInlineFilters({
											numero: '',
											monto: '',
											tipoCompra: '',
											solicitante: '',
											estatus: '',
											fechaSolicitudIso: '',
										})
									}
								/>
							</div>
						</div>
					) : mode === 'form-alta' ? (
						<MontoInicialStep onContinue={handleMontoContinue} />
					) : editingRow ? (
						<div className="flex-1 min-h-0 flex flex-col overflow-hidden">
							<ContratacionServiciosFormShell
								key={editingRow.id}
								tipoCompra={editingRow.tipoCompra}
								hideRevisorFields={hideRevisorFields}
								draft={draftForEdit}
								onDraftChange={(next) => setDraftForId(editingRow.id, next)}
								editingRow={editingRow}
								onPatchRow={(patch) => patchRow(editingRow.id, patch)}
								isNewRecord={isNewRecord}
								onActiveTabChange={setActiveFormTabId}
							/>
						</div>
					) : null}
				</PageCard>

				<ConfirmModal
					open={Boolean(pendingDeleteRow)}
					onClose={() => setPendingDeleteRow(null)}
					onConfirm={handleDeleteConfirm}
					title="Confirmar eliminación"
					icon={<Trash2 className="w-5 h-5" />}
					variant="danger"
					confirmLabel="Eliminar"
					cancelLabel="Cancelar"
				>
					<p className="text-sm text-slate-600">
						¿Deseas eliminar la requisición{' '}
						<strong>
							{pendingDeleteRow ? String(pendingDeleteRow.numero).padStart(7, '0') : ''}
						</strong>
						?
					</p>
				</ConfirmModal>

				<Toast
					visible={toastState.visible}
					title={toastState.title}
					variant={toastState.variant}
					icon={<Check className="w-3.5 h-3.5 text-white" />}
				/>
			</div>
		</div>
	);
}
