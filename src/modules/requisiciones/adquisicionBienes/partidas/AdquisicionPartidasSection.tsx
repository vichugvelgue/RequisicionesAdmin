import React, { useEffect, useMemo, useState } from 'react';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import {
	Button,
	DecimalStringCellInput,
	FormSection,
	Input,
	SearchableSelect,
	SimpleTable,
	TextArea,
	Toast,
} from '../../../../components/UI';
import type { SimpleTableColumn } from '../../../../components/UI/SimpleTable/SimpleTable';
import { FieldRoleLabel } from '../fieldRoleLabel';
import type {
	AdquisicionPartidaMayor,
	AdquisicionPartidaMenor,
	TipoCompra,
} from '../types';

import { Save } from 'lucide-react';
import { requisicionApi } from '../../../../api/requisicionBienesAPI';

import { unidadMedidaApi } from "../../../../api";
import type { OptionItem } from '../../../../components/UI/types';

type PartidaRow = AdquisicionPartidaMayor | AdquisicionPartidaMenor;

interface DraftPartidaForm {
	cantidad: string;
	unidadMedidaId: string;
	descripcion: string;
}

const EMPTY_FORM: DraftPartidaForm = {
	cantidad: '',
	unidadMedidaId: '',
	descripcion: '',
};

export function AdquisicionPartidasSection({
	idRequisicion,
	idUsuario,
	tipoCompra,
	canEditSolicitanteFields,
	partidas,
	onChange,
}: {
	idRequisicion: number;
	idUsuario: number;
	tipoCompra: TipoCompra;
	canEditSolicitanteFields: boolean;
	partidas: PartidaRow[];
	onChange: (next: PartidaRow[]) => void;
}) {
	const [draft, setDraft] = useState<DraftPartidaForm>(EMPTY_FORM);
	const [showErrors, setShowErrors] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [isSavingPartidas, setIsSavingPartidas] = useState(false);
	const [unidadesMedida, setUnidadesMedida] = useState<OptionItem[]>([]);
	const [toast, setToast] = useState<{ visible: boolean; title: string; variant: 'success' | 'error' }>({ visible: false, title: '', variant: 'success' });

	const nextNumeroPartida = useMemo(() => {
		const max = partidas.reduce((acc, item) => Math.max(acc, item.numeroPartida), 0);
		return max + 1;
	}, [partidas]);

	const columns: SimpleTableColumn<PartidaRow>[] = useMemo(() => {
		const baseColumns: SimpleTableColumn<PartidaRow>[] = [
			{
				key: 'numeroPartida',
				label: 'No. partida',
				width: 'w-28 min-w-28',
				cellClassName: 'uppercase text-center font-semibold',
			},
		];

		baseColumns.push(
			{
				key: 'cantidad',
				label: 'Cantidad',
				width: 'w-36 min-w-36',
				cellClassName: 'text-right tabular-nums font-semibold',
			},
			{
				key: 'unidadMedidaLabel',
				label: 'Unidad de medida',
				width: 'w-48 min-w-48',
				cellClassName: 'uppercase',
			},
			{
				key: 'descripcion',
				label: 'Descripcion',
				width: 'min-w-[28rem]',
				cellClassName:
					'uppercase whitespace-normal break-words leading-5 align-top py-3 [text-align:justify]',
			}
		);
		return baseColumns;
	}, []);

	const errors = {
		cantidad: showErrors && !draft.cantidad.trim(),
		unidadMedidaId: showErrors && !draft.unidadMedidaId,
		descripcion: showErrors && !draft.descripcion.trim(),
	};

	const editingRow = useMemo(
		() => partidas.find((item) => item.id === editingId) ?? null,
		[editingId, partidas]
	);

	useEffect(() => {
		if (!toast.visible) return;
		const t = setTimeout(() => setToast((s) => ({ ...s, visible: false })), 2800);
		return () => clearTimeout(t);
	}, [toast.visible]);

	useEffect(() => {
		const loadUnidadesMedida = async () => {
			try {
				const data = await unidadMedidaApi.listar();
				setUnidadesMedida(
					data.map((item) => ({
						value: String(item.id),
						label: item.nombre,
					}))
				);
			} catch (error) {
				console.error('Error al cargar unidades de medida:', error);
			}
		};

		loadUnidadesMedida();
	}, []);


	async function handleGuardarPartidasApi() {
		console.log("handleGuardarPartidasApi called with partidas:", partidas);
		if (!partidas.length) return;

		try {
			setIsSavingPartidas(true);

			await requisicionApi.guardarPartidas({
				idRequisicion,
				idUsuario,
				listaPartidas: partidas.map((p) => ({
					idRequisicion,
					descripcion: p.descripcion.trim().toUpperCase(),
					idUnidadMedida: Number(p.unidadMedidaId),
					cantidad: Number(String(p.cantidad).replace(/,/g, '.')),
					unidadMedidaLabel: p.unidadMedidaLabel ?? "",
					descripcionGeneral: '',
					descripcionEspecifica: '',
					lugarPeriodoEjecucionServicio: '',
					personalRequerido: '',
					entregablesNecesarios: '',
					condicionesGeneralesContratacion: '',
				})),
			});
			setToast({ visible: true, title: 'Partidas guardadas con éxito', variant: 'success' });
		} catch (error) {
			setToast({ visible: true, title: error instanceof Error ? error.message : 'Error al guardar partidas', variant: 'error' });
		} finally {
			setIsSavingPartidas(false);
		}
	}

	const generarIdTemporal = () => {
		if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
			return crypto.randomUUID();
		}

		return `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
	};



	function handleSavePartida() {
		setShowErrors(true);
		if (!draft.cantidad.trim() || !draft.unidadMedidaId || !draft.descripcion.trim()) return;

		try {


		} catch (error) {
			setToast({ visible: true, title: error instanceof Error ? error.message : 'Error al guardar partida', variant: 'error' });
			return;
		}
		const unidadSeleccionada = unidadesMedida.find((u) => u.value === draft.unidadMedidaId);
		const basePartida = {
			cantidad: draft.cantidad,
			unidadMedidaId: draft.unidadMedidaId,
			unidadMedidaLabel: (unidadSeleccionada?.label ?? draft.unidadMedidaId).toUpperCase(),
			descripcion: draft.descripcion.trim().toUpperCase(),
		};

		if (editingId) {
			onChange(
				partidas.map((item) => (item.id === editingId ? { ...item, ...basePartida } : item))
			);
			setEditingId(null);
			setDraft(EMPTY_FORM);
			setShowErrors(false);
			return;
		}

		if (tipoCompra === 'MAYOR') {
			const next = [
				...(partidas as AdquisicionPartidaMayor[]),
				{
					...basePartida,
					id: generarIdTemporal(),
					numeroPartida: nextNumeroPartida,
				},
			];
			onChange(next);
		} else {
			const next = [
				...(partidas as AdquisicionPartidaMenor[]),
				{
					...basePartida,
					id: generarIdTemporal(),
					numeroPartida: nextNumeroPartida,
				},
			];
			onChange(next);
		}

		setToast({ visible: true, title: 'Partida guardada con éxito', variant: 'success' });

		setDraft(EMPTY_FORM);
		setShowErrors(false);
	}

	function handleDeletePartida(row: PartidaRow) {
		if (editingId === row.id) {
			setEditingId(null);
			setDraft(EMPTY_FORM);
			setShowErrors(false);
		}
		onChange(partidas.filter((item) => item.id !== row.id));
	}

	function handleEditPartida(row: PartidaRow) {
		setEditingId(row.id);
		setDraft({
			cantidad: row.cantidad,
			unidadMedidaId: row.unidadMedidaId,
			descripcion: row.descripcion,
		});
		setShowErrors(false);
	}

	function handleCancelEdit() {
		setEditingId(null);
		setDraft(EMPTY_FORM);
		setShowErrors(false);
	}

	return (
		<div className="p-4 flex-1 min-h-0 overflow-auto">
			<FormSection title={tipoCompra === 'MAYOR' ? 'Partidas mayor' : 'Partidas menor'}>
				<div className="space-y-4">
					<div className="grid grid-cols-12 gap-4">
						<div className="col-span-12 lg:col-span-2">
							<FieldRoleLabel>Numero de partida</FieldRoleLabel>
							<div className="h-[30px] px-2.5 border border-slate-300 rounded bg-slate-100 text-xs font-semibold text-slate-600 flex items-center">
								{String(editingRow ? editingRow.numeroPartida : nextNumeroPartida)}
							</div>
						</div>
						<div className="col-span-12 lg:col-span-2">
							<FieldRoleLabel>Cantidad</FieldRoleLabel>
							<DecimalStringCellInput
								value={draft.cantidad}
								onChange={(value) => setDraft((prev) => ({ ...prev, cantidad: value }))}
								fractionDigits={0}
								disabled={!canEditSolicitanteFields}
								className="!text-xs !py-1.5 !px-2.5 w-full"
							/>
							{errors.cantidad ? (
								<p className="text-[11px] mt-1 text-red-600">*Requerido</p>
							) : null}
						</div>
						<div className="col-span-12 lg:col-span-3">
							<FieldRoleLabel>Unidad de medida</FieldRoleLabel>
							<SearchableSelect
								options={unidadesMedida}
								value={draft.unidadMedidaId}
								onChange={(value) => setDraft((prev) => ({ ...prev, unidadMedidaId: value }))}
								placeholder="Buscar..."
								disabled={!canEditSolicitanteFields}
							/>
							{errors.unidadMedidaId ? (
								<p className="text-[11px] mt-1 text-red-600">*Requerido</p>
							) : null}
						</div>
						<div className="flex justify-end pt-2">
							<Button
								type="button"
								variant="primary"
								size="md"
								className="!px-3 !py-1 text-xs h-8 min-h-0"
								onClick={handleSavePartida}
								disabled={!canEditSolicitanteFields}
							>
								{editingId ? 'Actualizar partida' : 'Agregar partida'}
							</Button>
						</div>
					</div>

					<div className="grid grid-cols-12 gap-4">
						<div className="col-span-12">
							<FieldRoleLabel>Descripcion</FieldRoleLabel>
							<TextArea
								value={draft.descripcion}
								onChange={(e) =>
									setDraft((prev) => ({
										...prev,
										descripcion: e.target.value.toUpperCase(),
									}))
								}
								rows={3}
								disabled={!canEditSolicitanteFields}
								placeholder="Captura la descripcion de la partida"
							/>
							{errors.descripcion ? (
								<p className="text-[11px] mt-1 text-red-600">*Requerido</p>
							) : null}
						</div>
					</div>

					<div className="flex items-center justify-end gap-2">
						<Button
							type="button"
							variant="success"
							size="md"
							leftIcon={<Save className="w-4 h-4" />}
							disabled={!canEditSolicitanteFields || !partidas.length || isSavingPartidas}
							onClick={handleGuardarPartidasApi}
						>
							{isSavingPartidas ? 'Guardando...' : 'Guardar partidas'}
						</Button>
						{editingId ? (
							<Button
								type="button"
								variant="outline"
								size="md"
								leftIcon={<X className="w-4 h-4" />}
								onClick={handleCancelEdit}
							>
								Cancelar edicion
							</Button>
						) : null}
					</div>
				</div>
			</FormSection>

			<div className="mt-4">
				<SimpleTable
					columns={columns}
					data={partidas}
					actionsColumnLabel="Acciones"
					emptyTitle="No hay partidas agregadas"
					emptyDescription="Agrega al menos una partida para continuar con la requisicion."
					customActions={
						canEditSolicitanteFields
							? [
								{
									icon: <Pencil className="w-4 h-4" />,
									title: 'Editar',
									variant: 'iconAmber',
									onClick: (row) => handleEditPartida(row),
								},
								{
									icon: <Trash2 className="w-4 h-4" />,
									title: 'Eliminar',
									variant: 'iconRed',
									onClick: (row) => handleDeletePartida(row),
								},
							]
							: []
					}
					wrapperClassName="h-[40vh]"
				/>
			</div>
			<Toast
				visible={toast.visible}
				title={toast.title}
				variant={toast.variant}
			/>
		</div>
	);
}
