import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Pencil, Plus, Trash2, X } from 'lucide-react';
import {
	Button,
	DateInputWithClear,
	DecimalStringCellInput,
	FormSection,
	Input,
	SearchableSelect,
	Tabs,
	TabsList,
	TabsPanel,
	TabsTab,
	TextArea,
} from '../../../../components/UI';
import { MOCK_UNIDAD_MEDIDA } from '../catalogMockOptions';
import { FieldRoleLabel } from '../fieldRoleLabel';
import {
	createEmptyServiciosPartidaMayor,
	type ServiciosPartidaMayor,
} from '../types';

function upper(s: string) {
	return s.trim().toUpperCase();
}

function validatePartida(
	hideRevisorFields: boolean,
	p: ServiciosPartidaMayor
): string | null {
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
	const hasPeriodo =
		p.execPeriodoTexto.trim() ||
		(p.execPeriodoInicio.trim() && p.execPeriodoFin.trim());
	if (!hasPeriodo) return 'Indique periodo de ejecución (fechas o texto).';
	if (!p.recPersonalRequerido.trim()) return 'Personal requerido (recursos) requerido.';
	if (!p.entEntregables.trim()) return 'Entregables requeridos.';
	if (!p.condCondicionesGeneralesContratacion.trim()) {
		return 'Condiciones generales de contratación (condiciones) requeridas.';
	}
	if (!hideRevisorFields) {
		if (!p.execExperienciaLicitante.trim()) return 'Experiencia del licitante requerida.';
		if (!p.execCalle.trim() || !p.execColonia.trim() || !p.execCp.trim() || !p.execCiudad.trim()) {
			return 'Complete lugar de ejecución (dirección).';
		}
		if (!p.condDiasEntrega.trim()) return 'Días de entrega requeridos.';
		if (!p.condPagosSeRealizaran.trim()) return 'Indique cómo se realizarán los pagos.';
	}
	return null;
}

export function ServiciosMayorPartidasSection({
	partidas,
	hideRevisorFields,
	canEditSolicitanteFields,
	onChange,
}: {
	partidas: ServiciosPartidaMayor[];
	hideRevisorFields: boolean;
	canEditSolicitanteFields: boolean;
	onChange: (next: ServiciosPartidaMayor[]) => void;
}) {
	const [modalOpen, setModalOpen] = useState(false);
	const [modalDraft, setModalDraft] = useState<ServiciosPartidaMayor | null>(null);
	const [modalError, setModalError] = useState('');
	const [modalTab, setModalTab] = useState('base');
	const [expandedById, setExpandedById] = useState<Record<string, boolean>>({});

	const nextNumeroPartida = useMemo(() => {
		const max = partidas.reduce((acc, item) => Math.max(acc, item.numeroPartida), 0);
		return max + 1;
	}, [partidas]);

	function openNew() {
		const id = crypto.randomUUID();
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

	function handleSaveModal() {
		if (!modalDraft) return;
		const err = validatePartida(hideRevisorFields, modalDraft);
		if (err) {
			setModalError(err);
			return;
		}
		const um = MOCK_UNIDAD_MEDIDA.find((u) => u.value === modalDraft.unidadMedidaId);
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
			execExperienciaLicitante: upper(modalDraft.execExperienciaLicitante),
			execCalle: upper(modalDraft.execCalle),
			execColonia: upper(modalDraft.execColonia),
			execCp: modalDraft.execCp.trim(),
			execCiudad: upper(modalDraft.execCiudad),
			execPeriodoTexto: upper(modalDraft.execPeriodoTexto),
			execHorario: upper(modalDraft.execHorario),
			recPersonalRequerido: upper(modalDraft.recPersonalRequerido),
			entEntregables: upper(modalDraft.entEntregables),
			condDiasEntrega: upper(modalDraft.condDiasEntrega),
			condCondicionesGeneralesContratacion: upper(modalDraft.condCondicionesGeneralesContratacion),
			condPagosSeRealizaran: upper(modalDraft.condPagosSeRealizaran),
		};
		const exists = partidas.some((p) => p.id === normalized.id);
		if (exists) {
			onChange(partidas.map((p) => (p.id === normalized.id ? normalized : p)));
		} else {
			onChange([...partidas, normalized]);
		}
		closeModal();
	}

	function handleDelete(row: ServiciosPartidaMayor) {
		onChange(partidas.filter((p) => p.id !== row.id));
	}

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
										{canEditRows ? (
											<div className="ml-auto flex shrink-0 items-center gap-1">
												<Button
													type="button"
													size="sm"
													variant="iconAmber"
													title="Editar"
													onClick={() => openEdit(row)}
												>
													<Pencil className="w-4 h-4" />
												</Button>
												<Button
													type="button"
													size="sm"
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
												<div className="col-span-12 lg:col-span-6">
													<p className="mb-2 text-xs font-semibold text-slate-600 uppercase">
														Ejecución
													</p>
													<div className="space-y-2">
														{!hideRevisorFields ? (
															<>
																<DetailItem
																	label="Experiencia del licitante"
																	value={row.execExperienciaLicitante}
																/>
																<DetailItem
																	label="Dirección"
																	value={
																		[row.execCalle, row.execColonia, row.execCp, row.execCiudad]
																			.filter(Boolean)
																			.join(', ') || '-'
																	}
																/>
															</>
														) : null}
														<div className="grid grid-cols-12 gap-2">
															<div className="col-span-12 sm:col-span-4">
																<DetailItem label="Periodo inicio" value={row.execPeriodoInicio} />
															</div>
															<div className="col-span-12 sm:col-span-4">
																<DetailItem label="Periodo fin" value={row.execPeriodoFin} />
															</div>
															<div className="col-span-12 sm:col-span-4">
																<DetailItem label="Periodo (texto)" value={row.execPeriodoTexto} />
															</div>
															<div className="col-span-12">
																<DetailItem label="Horario" value={row.execHorario} />
															</div>
														</div>
													</div>
												</div>
												<div className="col-span-12 lg:col-span-6">
													<p className="mb-2 text-xs font-semibold text-slate-600 uppercase">
														Recursos y entregables
													</p>
													<div className="space-y-2">
														<DetailItem
															label="Personal requerido"
															value={row.recPersonalRequerido}
														/>
														<DetailItem label="Entregables" value={row.entEntregables} />
													</div>
													<p className="mb-2 mt-4 text-xs font-semibold text-slate-600 uppercase">
														Condiciones
													</p>
													<div className="space-y-2">
														{!hideRevisorFields ? (
															<DetailItem
																label="Días de entrega"
																value={row.condDiasEntrega}
															/>
														) : null}
														<DetailItem
															label="Condiciones generales de contratación"
															value={row.condCondicionesGeneralesContratacion}
														/>
														{!hideRevisorFields ? (
															<DetailItem
																label="Los pagos se realizarán"
																value={row.condPagosSeRealizaran}
															/>
														) : null}
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

			{modalOpen && modalDraft ? (
				<div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
					<div className="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-xl">
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
									<TabsTab value="ejecucion" label="Ejecución" />
									<TabsTab value="recursos" label="Recursos" />
									<TabsTab value="entregables" label="Entregables" />
									<TabsTab value="condiciones" label="Condiciones" />
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
													options={MOCK_UNIDAD_MEDIDA}
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

								<TabsPanel value="ejecucion" className="pt-4">
									<FormSection>
										<div className="grid grid-cols-12 gap-3">
											{!hideRevisorFields ? (
												<div className="col-span-12">
													<FieldRoleLabel>Experiencia del licitante</FieldRoleLabel>
													<TextArea
														rows={2}
														value={modalDraft.execExperienciaLicitante}
														onChange={(e) =>
															setModalDraft((d) =>
																d
																	? { ...d, execExperienciaLicitante: e.target.value.toUpperCase() }
																	: d
															)
														}
														className="uppercase"
													/>
												</div>
											) : null}
											{!hideRevisorFields ? (
												<>
													<div className="col-span-12 sm:col-span-6">
														<FieldRoleLabel>Lugar ejecución — Calle</FieldRoleLabel>
														<Input
															value={modalDraft.execCalle}
															onChange={(e) =>
																setModalDraft((d) =>
																	d ? { ...d, execCalle: e.target.value.toUpperCase() } : d
																)
															}
															className="uppercase"
														/>
													</div>
													<div className="col-span-12 sm:col-span-6">
														<FieldRoleLabel>Colonia</FieldRoleLabel>
														<Input
															value={modalDraft.execColonia}
															onChange={(e) =>
																setModalDraft((d) =>
																	d ? { ...d, execColonia: e.target.value.toUpperCase() } : d
																)
															}
															className="uppercase"
														/>
													</div>
													<div className="col-span-12 sm:col-span-4">
														<FieldRoleLabel>Código postal</FieldRoleLabel>
														<Input
															value={modalDraft.execCp}
															onChange={(e) =>
																setModalDraft((d) =>
																	d ? { ...d, execCp: e.target.value } : d
																)
															}
														/>
													</div>
													<div className="col-span-12 sm:col-span-8">
														<FieldRoleLabel>Ciudad</FieldRoleLabel>
														<Input
															value={modalDraft.execCiudad}
															onChange={(e) =>
																setModalDraft((d) =>
																	d ? { ...d, execCiudad: e.target.value.toUpperCase() } : d
																)
															}
															className="uppercase"
														/>
													</div>
												</>
											) : null}
											<div className="col-span-12 sm:col-span-4">
												<FieldRoleLabel>Periodo ejecución — Inicio</FieldRoleLabel>
												<DateInputWithClear
													value={modalDraft.execPeriodoInicio}
													onChange={(v) =>
														setModalDraft((d) => (d ? { ...d, execPeriodoInicio: v } : d))
													}
												/>
											</div>
											<div className="col-span-12 sm:col-span-4">
												<FieldRoleLabel>Periodo ejecución — Fin</FieldRoleLabel>
												<DateInputWithClear
													value={modalDraft.execPeriodoFin}
													onChange={(v) =>
														setModalDraft((d) => (d ? { ...d, execPeriodoFin: v } : d))
													}
												/>
											</div>
											<div className="col-span-12 sm:col-span-4">
												<FieldRoleLabel>Periodo ejecución (texto)</FieldRoleLabel>
												<Input
													value={modalDraft.execPeriodoTexto}
													onChange={(e) =>
														setModalDraft((d) =>
															d ? { ...d, execPeriodoTexto: e.target.value.toUpperCase() } : d
														)
													}
													className="uppercase"
												/>
											</div>
											<div className="col-span-12">
												<FieldRoleLabel>Horario (opcional)</FieldRoleLabel>
												<Input
													value={modalDraft.execHorario}
													onChange={(e) =>
														setModalDraft((d) =>
															d ? { ...d, execHorario: e.target.value.toUpperCase() } : d
														)
													}
													className="uppercase"
												/>
											</div>
										</div>
									</FormSection>
								</TabsPanel>

								<TabsPanel value="recursos" className="pt-4">
									<FormSection>
										<div className="col-span-12">
											<FieldRoleLabel>Personal requerido</FieldRoleLabel>
											<TextArea
												rows={2}
												value={modalDraft.recPersonalRequerido}
												onChange={(e) =>
													setModalDraft((d) =>
														d ? { ...d, recPersonalRequerido: e.target.value.toUpperCase() } : d
													)
												}
												className="uppercase"
											/>
										</div>
									</FormSection>
								</TabsPanel>

								<TabsPanel value="entregables" className="pt-4">
									<FormSection>
										<div className="col-span-12">
											<FieldRoleLabel>Entregables</FieldRoleLabel>
											<TextArea
												rows={2}
												value={modalDraft.entEntregables}
												onChange={(e) =>
													setModalDraft((d) =>
														d ? { ...d, entEntregables: e.target.value.toUpperCase() } : d
													)
												}
												className="uppercase"
											/>
										</div>
									</FormSection>
								</TabsPanel>

								<TabsPanel value="condiciones" className="pt-4">
									<FormSection>
										<div className="grid grid-cols-12 gap-3">
											{!hideRevisorFields ? (
												<div className="col-span-12 sm:col-span-6">
													<FieldRoleLabel>Días de entrega</FieldRoleLabel>
													<Input
														value={modalDraft.condDiasEntrega}
														onChange={(e) =>
															setModalDraft((d) =>
																d ? { ...d, condDiasEntrega: e.target.value.toUpperCase() } : d
															)
														}
														className="uppercase"
													/>
												</div>
											) : null}
											<div className="col-span-12">
												<FieldRoleLabel>Condiciones generales de contratación</FieldRoleLabel>
												<TextArea
													rows={2}
													value={modalDraft.condCondicionesGeneralesContratacion}
													onChange={(e) =>
														setModalDraft((d) =>
															d
																? {
																		...d,
																		condCondicionesGeneralesContratacion:
																			e.target.value.toUpperCase(),
																  }
																: d
														)
													}
													className="uppercase"
												/>
											</div>
											{!hideRevisorFields ? (
												<div className="col-span-12">
													<FieldRoleLabel>Los pagos se realizarán</FieldRoleLabel>
													<TextArea
														rows={2}
														value={modalDraft.condPagosSeRealizaran}
														onChange={(e) =>
															setModalDraft((d) =>
																d
																	? { ...d, condPagosSeRealizaran: e.target.value.toUpperCase() }
																	: d
															)
														}
														className="uppercase"
													/>
												</div>
											) : null}
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
				</div>
			) : null}
		</div>
	);
}
