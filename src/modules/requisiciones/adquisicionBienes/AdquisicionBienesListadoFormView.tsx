import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Ban, Check, MessageSquare, Plus, Save, Trash2 } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth, isRequisicionReadOnlyProfile } from '../../../auth';
import {
	BackLink,
	Button,
	ConfirmModal,
	InfiniteScrollTable,
	Label,
	PageCard,
	TableFilterBar,
	TextArea,
	Toast,
	ViewHeader,
	StatusBadge,
	resolveStatusBadge,
} from '../../../components/UI';
import type { OptionItem, SortConfig } from '../../../components/UI/types';
import type { SimpleTableColumn } from '../../../components/UI/SimpleTable/SimpleTable';
import { MontoInicialStep } from './MontoInicialStep';
import {
	AdquisicionBienesFormShell,
	ADQUISICION_BIENES_TAB_DOCUMENTO_MAYOR,
	ADQUISICION_BIENES_TAB_DOCUMENTO_MENOR,
} from './AdquisicionBienesFormShell';
import {
	createEmptyDraft,
	userHidesRevisorFields,
	type AdquisicionDraft,
	type RequisicionRow,
	type SearchCriteria,
	type TipoCompra,
} from './types';
import { createSeedDraftFromRequisicionRow } from './seedDraftFromRequisicionRow';

const BASE_PATH = '/requisiciones/adquisicion-bienes';

const SEARCH_CRITERIA_OPTIONS: OptionItem[] = [
	{ value: 'Coincidencia', label: 'Coincidencia' },
	{ value: 'ID', label: 'ID' },
	{ value: 'Solicitante', label: 'Solicitante' },
	{ value: 'Tipo', label: 'Tipo' },
	{ value: 'Estatus', label: 'Estatus' },
];

const INITIAL_ROWS: RequisicionRow[] = [
	{
		id: '1',
		numero: 1,
		monto: 120000,
		tipoCompra: 'MAYOR',
		solicitante: 'JUAN PEREZ LOPEZ',
		estatus: 'PENDIENTE',
		fechaSolicitudIso: '2026-03-10',
	},
	{
		id: '2',
		numero: 2,
		monto: 15000.5,
		tipoCompra: 'MENOR',
		solicitante: 'MARIA GARCIA RAMOS',
		estatus: 'APROBADA',
		fechaSolicitudIso: '2026-02-01',
	},
	{
		id: '3',
		numero: 15,
		monto: 56000,
		tipoCompra: 'MAYOR',
		solicitante: 'ANA TORRES RUIZ',
		estatus: 'RECHAZADA',
		fechaSolicitudIso: '2026-01-20',
	},
];

const TABLE_COLUMNS: SimpleTableColumn<RequisicionRow>[] = [
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

function matchesSearch(row: RequisicionRow, criteria: SearchCriteria, text: string): boolean {
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

export function AdquisicionBienesListadoFormView() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const { id } = useParams();

	const [rows, setRows] = useState<RequisicionRow[]>(INITIAL_ROWS);
	const [draftById, setDraftById] = useState<Record<string, AdquisicionDraft>>({});
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
		criteria: 'Coincidencia' as SearchCriteria,
		text: '',
	});
	const [appliedTipo, setAppliedTipo] = useState('');
	const [appliedEstatus, setAppliedEstatus] = useState('');

	const [pendingDeleteRow, setPendingDeleteRow] = useState<RequisicionRow | null>(null);
	const [newlyCreatedIds, setNewlyCreatedIds] = useState<string[]>([]);
	const [activeFormTabId, setActiveFormTabId] = useState('');
	const [toastState, setToastState] = useState<{
		visible: boolean;
		title: string;
		variant: 'success' | 'error';
	}>({ visible: false, title: '', variant: 'success' });

	const [revisorModal, setRevisorModal] = useState<'solicitar-cambios' | 'cancelar' | null>(null);
	const [revisorModalText, setRevisorModalText] = useState('');

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
	const isRequisicionReadOnly = isRequisicionReadOnlyProfile(user?.tipoPerfil);
	/** Solo el solicitante oculta bloques de revisor; `isNewRecord` no debe acortar el formulario al revisor al consultar. */
	const hideRevisorFields = userHidesRevisorFields(user) || (isNewRecord && !isRevisorProfile);

	useEffect(() => {
		if (!isCreateMode) return;
		if (isRevisorProfile) {
			navigate(BASE_PATH, { replace: true });
			setToastState({
				visible: true,
				title: 'Los revisores no crean requisiciones nuevas.',
				variant: 'error',
			});
			return;
		}
		if (isRequisicionReadOnly) {
			navigate(BASE_PATH, { replace: true });
			setToastState({
				visible: true,
				title: 'El administrador general solo puede consultar requisiciones.',
				variant: 'error',
			});
		}
	}, [isCreateMode, isRevisorProfile, isRequisicionReadOnly, navigate]);

	useEffect(() => {
		if (mode !== 'form-edicion') return;
		if (editingRow) return;
		navigate(BASE_PATH, { replace: true });
	}, [editingRow, mode, navigate]);

	const applyFilters = useCallback(() => {
		setAppliedSearch({
			criteria: pendingCriteria as SearchCriteria,
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
			const key = sortConfig.key as keyof RequisicionRow;
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
					{ value: 'CAMBIOS_SOLICITADOS', label: 'Cambios solicitados' },
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
		((editingRow.tipoCompra === 'MAYOR' && activeFormTabId === ADQUISICION_BIENES_TAB_DOCUMENTO_MAYOR) ||
			(editingRow.tipoCompra === 'MENOR' && activeFormTabId === ADQUISICION_BIENES_TAB_DOCUMENTO_MENOR));

	const showGuardarRequisicionEnHeader =
		mode === 'form-edicion' &&
		editingRow &&
		newlyCreatedIds.includes(editingRow.id) &&
		Boolean(isDocumentoTab) &&
		!isRequisicionReadOnly;

	const handleAddClick = () => {
		navigate(`${BASE_PATH}/nuevo`);
	};

	const handleEditClick = (row: RequisicionRow) => {
		navigate(`${BASE_PATH}/${row.id}`);
	};

	const handleMontoContinue = ({
		montoStr,
		tipoCompra,
	}: {
		montoStr: string;
		tipoCompra: TipoCompra;
	}) => {
		const monto = parseFloat(montoStr) || 0;
		const nextNum =
			rows.reduce((max, r) => Math.max(max, r.numero || 0), 0) + 1;
		const newId = String(
			rows.reduce((max, r) => Math.max(max, Number(r.id) || 0), 0) + 1
		);
		const solicitante = (
			user?.displayName?.trim() ||
			user?.email?.trim() ||
			'SOLICITANTE'
		).toUpperCase();
		const newRow: RequisicionRow = {
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

	const patchRow = useCallback(
		(rowId: string, patch: Partial<RequisicionRow>) => {
			setRows((prev) => prev.map((r) => (r.id === rowId ? { ...r, ...patch } : r)));
		},
		[]
	);

	const closeRevisorModal = useCallback(() => {
		setRevisorModal(null);
		setRevisorModalText('');
	}, []);

	const handleRevisorValidar = useCallback(() => {
		if (!editingRow) return;
		patchRow(editingRow.id, { estatus: 'APROBADA' });
		resetToListado();
		setToastState({
			visible: true,
			title: 'Requisición validada correctamente.',
			variant: 'success',
		});
	}, [editingRow, patchRow, resetToListado]);

	const handleRevisorModalConfirm = useCallback(() => {
		const note = revisorModalText.trim();
		if (!note) {
			setToastState({
				visible: true,
				title: 'Escribe un comentario antes de confirmar.',
				variant: 'error',
			});
			return;
		}
		if (!editingRow || !revisorModal) return;
		if (revisorModal === 'solicitar-cambios') {
			patchRow(editingRow.id, { estatus: 'CAMBIOS_SOLICITADOS', notaRevision: note });
			closeRevisorModal();
			resetToListado();
			setToastState({
				visible: true,
				title: 'La solicitud de cambios se registró correctamente.',
				variant: 'success',
			});
			return;
		}
		patchRow(editingRow.id, { estatus: 'RECHAZADA', notaRevision: note });
		closeRevisorModal();
		resetToListado();
		setToastState({
			visible: true,
			title: 'Requisición cancelada.',
			variant: 'success',
		});
	}, [closeRevisorModal, editingRow, patchRow, revisorModal, revisorModalText, resetToListado]);

	useEffect(() => {
		if (mode === 'form-edicion') return;
		setRevisorModal(null);
		setRevisorModalText('');
	}, [mode]);

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
				[editingRow.id]: createSeedDraftFromRequisicionRow(editingRow),
			};
		});
	}, [mode, editingRow]);

	const setDraftForId = useCallback((rowId: string, next: AdquisicionDraft) => {
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
						<BackLink onClick={resetToListado}>Volver a adquisición de bienes</BackLink>
					</div>
				) : null}
				<PageCard className="h-full min-h-0 flex-1 flex flex-col">
					<ViewHeader
						title={
							mode === 'listado'
								? 'Adquisición de bienes'
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
									disabled={isRevisorProfile || isRequisicionReadOnly}
									title={
										isRevisorProfile
											? 'Los revisores no crean requisiciones nuevas.'
											: isRequisicionReadOnly
												? 'El administrador general solo puede consultar requisiciones.'
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
							) : mode === 'form-edicion' && isRevisorProfile && editingRow ? (
								<div className="flex flex-wrap items-center justify-end gap-2 shrink-0">
									<Button
										type="button"
										variant="outline"
										size="md"
										onClick={() => {
											setRevisorModal('solicitar-cambios');
											setRevisorModalText('');
										}}
									>
										Solicitar cambios
									</Button>
									<Button
										type="button"
										variant="success"
										size="md"
										onClick={handleRevisorValidar}
									>
										Validar
									</Button>
									<Button
										type="button"
										variant="danger"
										size="md"
										onClick={() => {
											setRevisorModal('cancelar');
											setRevisorModalText('');
										}}
									>
										Cancelar
									</Button>
								</div>
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
								<InfiniteScrollTable<RequisicionRow>
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
									onDelete={
										isRequisicionReadOnly ? undefined : (row) => setPendingDeleteRow(row)
									}
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
							<AdquisicionBienesFormShell
								key={editingRow.id}
								tipoCompra={editingRow.tipoCompra}
								hideRevisorFields={hideRevisorFields}
								readOnly={isRequisicionReadOnly}
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

				<ConfirmModal
					open={revisorModal !== null}
					onClose={closeRevisorModal}
					onConfirm={handleRevisorModalConfirm}
					title={
						revisorModal === 'cancelar'
							? 'Cancelar requisición'
							: 'Solicitar cambios'
					}
					icon={
						revisorModal === 'cancelar' ? (
							<Ban className="w-5 h-5" />
						) : (
							<MessageSquare className="w-5 h-5" />
						)
					}
					variant={revisorModal === 'cancelar' ? 'danger' : 'neutral'}
					confirmLabel={revisorModal === 'cancelar' ? 'Confirmar cancelación' : 'Enviar solicitud'}
					cancelLabel="Cerrar"
				>
					<div className="flex flex-col gap-2">
						<Label htmlFor="revisor-modal-textarea">
							{revisorModal === 'cancelar'
								? 'Motivo de cancelación'
								: 'Describe los cambios solicitados'}
						</Label>
						<TextArea
							id="revisor-modal-textarea"
							value={revisorModalText}
							onChange={(e) => setRevisorModalText(e.target.value)}
							rows={5}
							placeholder="Escribe aquí…"
						/>
					</div>
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
