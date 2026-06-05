import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Pencil, Plus, Trash2, X } from 'lucide-react';
import {
	Button,
	DecimalStringCellInput,
	FormSection,
	SearchableSelect,
	Tabs,
	TabsList,
	TabsPanel,
	TabsTab,
	TextArea,
	Toast,
} from '../../../../components/UI';
import { MOCK_UNIDAD_MEDIDA } from '../catalogMockOptions';
import { FieldRoleLabel } from '../fieldRoleLabel';
import {
	createEmptyServiciosPartidaMayor,
	type ServiciosPartidaMayor,
} from '../types';
import { requisicionApi, type PartidaRequest, unidadMedidaApi } from '../../../../api';
import type { OptionItem } from '../../../../components/UI/types';
import { createPortal } from "react-dom";


function upper(s: string) {
	return s.trim().toUpperCase();
}

function validatePartida(p: ServiciosPartidaMayor): string | null {
	if (!p.unidadMedidaId.trim()) return 'Seleccione unidad de medida.';
	if (!p.cantidad.trim()) return 'Capture la cantidad.';
	if (!p.defDescripcionGeneral.trim()) return 'Descripción general requerida.';
	if (!p.defDescripcionEspecifica.trim()) return 'Descripción específica requerida.';
	if (!p.defLugarPeriodoEjecucion.trim()) return 'Lugar y periodo de ejecución requeridos.';
	if (!p.defPersonalRequerido.trim()) return 'Personal requerido (definición) requerido.';
	if (!p.defEntregablesAcreditacion.trim()) return 'Entregables para acreditar ejecución requeridos.';
	if (!p.defCondicionesGeneralesContratacion.trim()) {
		return 'Condiciones generales de contratación (definición) requeridas.';
	}
	return null;
}

export function ServiciosMayorPartidasSection({
	partidas,
	hideRevisorFields,
	canEditSolicitanteFields,
	onChange,
	idRequisicion,
	idUsuario,
	isReadOnly,
}: {
	partidas: ServiciosPartidaMayor[];
	hideRevisorFields: boolean;
	canEditSolicitanteFields: boolean;
	onChange: (next: ServiciosPartidaMayor[]) => void;
	idRequisicion?: number;
	idUsuario?: number;
	isReadOnly: boolean;
}) {
	const [modalOpen, setModalOpen] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [modalDraft, setModalDraft] = useState<ServiciosPartidaMayor | null>(null);
	const [modalError, setModalError] = useState('');
	const [modalTab, setModalTab] = useState('base');
	const [expandedById, setExpandedById] = useState<Record<string, boolean>>({});
	const [saving, setSaving] = useState(false);
	const [toast, setToast] = useState<{ visible: boolean; title: string; variant: 'success' | 'error' }>({ visible: false, title: '', variant: 'success' });
	const [unidadesMedida, setUnidadesMedida] = useState<OptionItem[]>([]);

	const nextNumeroPartida = useMemo(() => {
		const max = partidas.reduce((acc, item) => Math.max(acc, item.numeroPartida), 0);
		return max + 1;
	}, [partidas]);

	// Cargar unidades de medida desde la API
	useEffect(() => {
		const loadUnidades = async () => {
			try {
				const data = await unidadMedidaApi.listar();
				setUnidadesMedida(
					data.map((item) => ({
						value: String(item.id),
						label: item.nombre,
					}))
				);
			} catch (error) {
				console.error('Error cargando unidades de medida:', error);
				// Fallback a mock data si falla la API
				setUnidadesMedida(MOCK_UNIDAD_MEDIDA);
			}
		};

		loadUnidades();
	}, []);

	// Cargar unidades de medida desde la API
	useEffect(() => {
		const loadUnidades = async () => {
			try {
				const data = await unidadMedidaApi.listar();
				setUnidadesMedida(
					data.map((item) => ({
						value: String(item.id),
						label: item.nombre,
					}))
				);
			} catch (error) {
				console.error('Error cargando unidades de medida:', error);
				// Fallback a mock data si falla la API
				setUnidadesMedida(MOCK_UNIDAD_MEDIDA);
			}
		};

		loadUnidades();
	}, []);

		const generarIdTemporal = () => {
		if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
			return crypto.randomUUID();
		}

		return `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
	};


	function openNew() {
		const id = generarIdTemporal();
		setModalDraft(createEmptyServiciosPartidaMayor(id, nextNumeroPartida));
		setModalError('');
		setModalTab('base');
		setModalOpen(true);
	}

	function openEdit(row: ServiciosPartidaMayor) {
		setModalDraft({ ...row });
		setModalError('');
		setModalTab('base');
		setModalOpen(true);
	}

	function closeModal() {
		setModalOpen(false);
		setModalDraft(null);
		setModalError('');
	}

	const handleSaveModal = async () => {
		if (!modalDraft) return;
		const err = validatePartida(modalDraft);
		if (err) {
			setModalError(err);
			return;
		}
		const um = unidadesMedida.find((u) => u.value === modalDraft.unidadMedidaId);
		const label = (um?.label ?? modalDraft.unidadMedidaId).toUpperCase();
		const normalized: ServiciosPartidaMayor = {
			...modalDraft,
			unidadMedidaLabel: label,
			defDescripcionGeneral: upper(modalDraft.defDescripcionGeneral),
			defDescripcionEspecifica: upper(modalDraft.defDescripcionEspecifica),
			defLugarPeriodoEjecucion: upper(modalDraft.defLugarPeriodoEjecucion),
			defPersonalRequerido: upper(modalDraft.defPersonalRequerido),
			defEntregablesAcreditacion: upper(modalDraft.defEntregablesAcreditacion),
			defCondicionesGeneralesContratacion: upper(modalDraft.defCondicionesGeneralesContratacion),
		};
		const exists = partidas.some((p) => p.id === normalized.id);
		if (exists) {
			onChange(partidas.map((p) => (p.id === normalized.id ? normalized : p)));
		} else {
			onChange([...partidas, normalized]);
		}


		closeModal();
	};



	const handleGuardarSeccion = async () => {

		try {
			setSaving(true);
			const listaPartidas: PartidaRequest[] = partidas.map((p) => ({
				id: p.id ? Number(p.id) : undefined,
				descripcion: p.defDescripcionGeneral,
				descripcionGeneral: p.defDescripcionGeneral,
				descripcionEspecifica: p.defDescripcionEspecifica,
				lugarPeriodoEjecucionServicio: p.defLugarPeriodoEjecucion,
				personalRequerido: p.defPersonalRequerido,
				entregablesNecesarios: p.defEntregablesAcreditacion,
				condicionesGeneralesContratacion: p.defCondicionesGeneralesContratacion,
				idUnidadMedida: Number(p.unidadMedidaId),
				idRequisicion,
				cantidad: Number(p.cantidad),
				unidadMedidaLabel: p.unidadMedidaLabel,
			}));

			await requisicionApi.guardarPartidas({
				idRequisicion,
				idUsuario,
				listaPartidas,
			});

			setToast({
				visible: true,
				title: 'Sección de partidas guardada correctamente',
				variant: 'success',
			});
		} catch (error) {
			setToast({
				visible: true,
				title: error instanceof Error ? error.message : 'Error al guardar partidas',
				variant: 'error',
			});
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async (row: ServiciosPartidaMayor) => {
		const updatedPartidas = partidas.filter((p) => p.id !== row.id);
		onChange(updatedPartidas);

		// Eliminar de API si se proporcionan los parámetros
		if (idRequisicion && idUsuario) {
			try {
				const listaPartidas: PartidaRequest[] = updatedPartidas.map((p) => ({
					id: p.id ? Number(p.id) : undefined,
					descripcion: p.defDescripcionGeneral,
					descripcionGeneral: p.defDescripcionGeneral,
					descripcionEspecifica: p.defDescripcionEspecifica,
					lugarPeriodoEjecucionServicio: p.defLugarPeriodoEjecucion,
					personalRequerido: p.defPersonalRequerido,
					entregablesNecesarios: p.defEntregablesAcreditacion,
					condicionesGeneralesContratacion: p.defCondicionesGeneralesContratacion,
					idUnidadMedida: Number(p.unidadMedidaId),
					idRequisicion: idRequisicion,
					cantidad: Number(p.cantidad),
					unidadMedidaLabel: p.unidadMedidaLabel,
				}));

				await requisicionApi.guardarPartidas({
					idRequisicion,
					idUsuario,
					listaPartidas,
				});

				setToast({
					visible: true,
					title: 'Partida eliminada correctamente',
					variant: 'success',
				});
			} catch (error) {
				setToast({
					visible: true,
					title: error instanceof Error ? error.message : 'Error al eliminar partida',
					variant: 'error',
				});
			}
		}
	};

	useEffect(() => {
		if (!toast.visible) return;
		const t = setTimeout(() => setToast((s) => ({ ...s, visible: false })), 2800);
		return () => clearTimeout(t);
	}, [toast.visible]);
	
	const canEditRows = canEditSolicitanteFields || !hideRevisorFields;
	const sortedPartidas = useMemo(
		() => [...partidas].sort((a, b) => a.numeroPartida - b.numeroPartida),
		[partidas]
	);

	function toggleExpanded(id: string) {
		setExpandedById((prev) => ({ ...prev, [id]: !prev[id] }));
	}

	function DetailItem({ label, value }: { label: string; value: string }) {
		return (
			<div className="rounded-md border border-slate-200 bg-white px-3 py-2">
				<p className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase">{label}</p>
				<p className="mt-1 text-sm leading-5 text-slate-700 uppercase whitespace-pre-wrap break-words">
					{value || '-'}
				</p>
			</div>
		);
	}

	return (
		<div className="p-4 flex-1 min-h-0 flex flex-col overflow-hidden">
			<div className="flex shrink-0 justify-end pb-3">
				<Button
					type="button"
					variant="primary"
					size="md"
					leftIcon={<Plus className="w-4 h-4" />}
					disabled={!canEditSolicitanteFields}
					onClick={openNew}
				>
					Agregar partida
				</Button>
			</div>
			<div className="min-h-0 flex-1 overflow-x-auto overflow-y-auto">
				{sortedPartidas.length === 0 ? (
					<div className="flex min-h-[240px] items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 text-center">
						<div>
							<p className="text-sm font-semibold text-slate-700 uppercase">
								No hay partidas agregadas
							</p>
							<p className="mt-1 text-sm text-slate-500 uppercase">
								Agregue partidas de servicio desde el modal de captura.
							</p>
						</div>
					</div>
				) : (
					<div className="min-h-[240px] max-h-[50vh] overflow-y-auto rounded-lg border border-slate-200 bg-white">
						{sortedPartidas.map((row, idx) => {
							const isExpanded = expandedById[row.id] ?? false;
							return (
								<div
									key={row.id}
									className={idx > 0 ? 'border-t border-slate-200' : undefined}
								>
									<div className="flex flex-wrap items-center gap-2 px-4 py-3">
										<button
											type="button"
											onClick={() => toggleExpanded(row.id)}
											className="flex min-w-0 flex-1 items-center gap-3 text-left"
										>
											<span className="inline-flex h-7 min-w-20 items-center justify-center rounded-md bg-slate-100 px-2 text-xs font-semibold uppercase text-slate-700">
												Partida {row.numeroPartida}
											</span>
											<div className="min-w-[9rem] text-sm">
												<span className="text-slate-500 uppercase">Cantidad:</span>{' '}
												<span className="font-semibold tabular-nums">{row.cantidad || '-'}</span>
											</div>
											<div className="min-w-[12rem] text-sm uppercase text-slate-700">
												<span className="text-slate-500">Unidad:</span>{' '}
												{row.unidadMedidaLabel || '-'}
											</div>
											<div className="hidden min-w-0 flex-1 text-sm text-slate-700 md:block">
												<span className="text-slate-500 uppercase">Descripción:</span>{' '}
												<span className="uppercase">
													{row.defDescripcionGeneral || row.defDescripcionEspecifica || '-'}
												</span>
											</div>
											{isExpanded ? (
												<ChevronUp className="h-4 w-4 shrink-0 text-slate-500" />
											) : (
												<ChevronDown className="h-4 w-4 shrink-0 text-slate-500" />
											)}
										</button>
										{canEditRows && !isReadOnly ? (
											<div className="ml-auto flex shrink-0 items-center gap-1">
												<Button
													type="button"
													variant="iconAmber"
													title="Editar"
													onClick={() => openEdit(row)}
												>
													<Pencil className="w-4 h-4" />
												</Button>
												<Button
													type="button"
													variant="iconRed"
													title="Eliminar"
													onClick={() => handleDelete(row)}
												>
													<Trash2 className="w-4 h-4" />
												</Button>
											</div>
										) : null}
									</div>
									{isExpanded ? (
										<div className="border-t border-slate-100 bg-slate-50/60 px-4 py-4">
											<div className="grid grid-cols-12 gap-4">
												<div className="col-span-12">
													<p className="mb-2 text-xs font-semibold text-slate-600 uppercase">
														Definición del servicio
													</p>
													<div className="grid grid-cols-12 gap-2">
														<div className="col-span-12 lg:col-span-6">
															<DetailItem
																label="Descripción general"
																value={row.defDescripcionGeneral}
															/>
														</div>
														<div className="col-span-12 lg:col-span-6">
															<DetailItem
																label="Descripción específica"
																value={row.defDescripcionEspecifica}
															/>
														</div>
														<div className="col-span-12">
															<DetailItem
																label="Lugar y periodo de ejecución del servicio"
																value={row.defLugarPeriodoEjecucion}
															/>
														</div>
														<div className="col-span-12 lg:col-span-6">
															<DetailItem
																label="Personal requerido"
																value={row.defPersonalRequerido}
															/>
														</div>
														<div className="col-span-12 lg:col-span-6">
															<DetailItem
																label="Entregables para acreditar ejecución"
																value={row.defEntregablesAcreditacion}
															/>
														</div>
														<div className="col-span-12">
															<DetailItem
																label="Condiciones generales de contratación"
																value={row.defCondicionesGeneralesContratacion}
															/>
														</div>
													</div>
												</div>
											</div>
										</div>
									) : null}
								</div>
							);
						})}
					</div>
				)}
			</div>
			<div className="flex justify-end pt-4">
				<Button
					type="button"
					variant="success"
					size="md"
					disabled={isSaving || partidas.length === 0 || isReadOnly}
					onClick={handleGuardarSeccion}
				>
					{isSaving ? 'Guardando...' : 'Guardar partidas'}
				</Button>
			</div>

			{modalOpen && modalDraft ? createPortal(
				<div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
					<div className="relative z-[10000] flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-xl">
						<div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-3">
							<h3 className="text-lg font-bold text-slate-800">
								{partidas.some((p) => p.id === modalDraft.id) ? 'Editar partida' : 'Nueva partida'} — No.{' '}
								{modalDraft.numeroPartida}
							</h3>
							<button
								type="button"
								className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
								onClick={closeModal}
								aria-label="Cerrar"
							>
								<X className="w-5 h-5" />
							</button>
						</div>
						<div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
							{modalError ? (
								<p className="mb-3 text-sm font-semibold text-red-600">{modalError}</p>
							) : null}
							<Tabs value={modalTab} onChange={setModalTab} className="flex min-h-0 flex-1 flex-col">
								<TabsList className="shrink-0 border-b border-slate-200 bg-white">
									<TabsTab value="base" label="Información base" />
									<TabsTab value="definicion" label="Definición del servicio" />
								</TabsList>

								<TabsPanel value="base" className="pt-4">
									<FormSection>
										<div className="grid grid-cols-12 gap-3">
											<div className="col-span-12 sm:col-span-4">
												<FieldRoleLabel>Número de partida</FieldRoleLabel>
												<div className="flex h-[34px] items-center rounded border border-slate-200 bg-slate-50 px-2 text-sm font-semibold">
													{String(modalDraft.numeroPartida)}
												</div>
											</div>
											<div className="col-span-12 sm:col-span-4">
												<FieldRoleLabel>Unidad de medida</FieldRoleLabel>
												<SearchableSelect
													options={unidadesMedida.length > 0 ? unidadesMedida : MOCK_UNIDAD_MEDIDA}
													value={modalDraft.unidadMedidaId}
													onChange={(v) =>
														setModalDraft((d) => (d ? { ...d, unidadMedidaId: v } : d))
													}
													placeholder="Buscar…"
												/>
											</div>
											<div className="col-span-12 sm:col-span-4">
												<FieldRoleLabel>Cantidad</FieldRoleLabel>
												<DecimalStringCellInput
													value={modalDraft.cantidad}
													onChange={(v) =>
														setModalDraft((d) => (d ? { ...d, cantidad: v } : d))
													}
													fractionDigits={4}
													className="!text-sm w-full"
												/>
											</div>
										</div>
									</FormSection>
								</TabsPanel>

								<TabsPanel value="definicion" className="pt-4">
									<FormSection>
										<div className="grid grid-cols-12 gap-3">
											{(
												[
													['defDescripcionGeneral', 'Descripción general'],
													['defDescripcionEspecifica', 'Descripción específica'],
													['defLugarPeriodoEjecucion', 'Lugar y periodo de ejecución del servicio'],
													['defPersonalRequerido', 'Personal requerido'],
													[
														'defEntregablesAcreditacion',
														'Entregables necesarios para acreditar la ejecución del servicio',
													],
													[
														'defCondicionesGeneralesContratacion',
														'Condiciones generales de contratación',
													],
												] as const
											).map(([key, label]) => (
												<div key={key} className="col-span-12">
													<FieldRoleLabel>{label}</FieldRoleLabel>
													<TextArea
														rows={2}
														value={modalDraft[key]}
														onChange={(e) =>
															setModalDraft((d) =>
																d ? { ...d, [key]: e.target.value.toUpperCase() } : d
															)
														}
														className="uppercase !min-h-0"
													/>
												</div>
											))}
										</div>
									</FormSection>
								</TabsPanel>

							</Tabs>
						</div>
						<div className="flex shrink-0 justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3">
							<Button type="button" variant="ghost" onClick={closeModal}>
								Cancelar
							</Button>
							<Button type="button" variant="primary" disabled={!canEditRows} onClick={handleSaveModal}>
								Guardar partida
							</Button>
						</div>
					</div>
				</div>,
				document.body
			) : null}

			<Toast
				visible={toast.visible}
				title={toast.title}
				variant={toast.variant}
			/>
		</div>
	);
}
