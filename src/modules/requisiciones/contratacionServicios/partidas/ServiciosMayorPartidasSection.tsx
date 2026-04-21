import React, { useMemo, useState } from 'react';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import {
	Button,
	DateInputWithClear,
	DecimalStringCellInput,
	FormSection,
	Input,
	SearchableSelect,
	SimpleTable,
	Tabs,
	TabsList,
	TabsPanel,
	TabsTab,
	TextArea,
} from '../../../../components/UI';
import type { SimpleTableColumn } from '../../../../components/UI/SimpleTable/SimpleTable';
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

	const nextNumeroPartida = useMemo(() => {
		const max = partidas.reduce((acc, item) => Math.max(acc, item.numeroPartida), 0);
		return max + 1;
	}, [partidas]);

	const columns: SimpleTableColumn<ServiciosPartidaMayor>[] = useMemo(
		() => [
			{
				key: 'numeroPartida',
				label: 'No. partida',
				width: 'w-24 min-w-24',
				cellClassName: 'uppercase text-center font-semibold',
			},
			{
				key: 'cantidad',
				label: 'Cantidad',
				width: 'w-28 min-w-28',
				cellClassName: 'text-right tabular-nums font-semibold',
			},
			{
				key: 'unidadMedidaLabel',
				label: 'Unidad de medida',
				width: 'w-40 min-w-40',
				cellClassName: 'uppercase',
			},
			{
				key: 'defDescripcionGeneral',
				label: 'Descripción general',
				width: 'min-w-[14rem]',
				cellClassName: 'uppercase whitespace-normal break-words leading-5 align-top py-3',
			},
			{
				key: 'defDescripcionEspecifica',
				label: 'Descripción específica',
				width: 'min-w-[14rem]',
				cellClassName: 'uppercase whitespace-normal break-words leading-5 align-top py-3',
			},
		],
		[]
	);

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
				<SimpleTable
					columns={columns}
					data={partidas}
					actionsColumnLabel="Acciones"
					emptyTitle="No hay partidas agregadas"
					emptyDescription="Agregue partidas de servicio desde el modal de captura."
					customActions={
						canEditRows
							? [
									{
										icon: <Pencil className="w-4 h-4" />,
										title: 'Editar',
										variant: 'iconAmber',
										onClick: (row) => openEdit(row),
									},
									{
										icon: <Trash2 className="w-4 h-4" />,
										title: 'Eliminar',
										variant: 'iconRed',
										onClick: (row) => handleDelete(row),
									},
							  ]
							: []
					}
					wrapperClassName="min-h-[240px] max-h-[50vh]"
				/>
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
