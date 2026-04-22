import React, { useMemo, useState } from 'react';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import {
	Button,
	DecimalStringCellInput,
	FormSection,
	SearchableSelect,
	SimpleTable,
} from '../../../../components/UI';
import type { SimpleTableColumn } from '../../../../components/UI/SimpleTable/SimpleTable';
import { MOCK_UNIDAD_MEDIDA } from '../catalogMockOptions';
import { FieldRoleLabel } from '../fieldRoleLabel';
import type { ServiciosPartidaMenor } from '../types';

export function ServiciosMenorPartidasSection({
	partidas,
	canEditSolicitanteFields,
	onChange,
}: {
	partidas: ServiciosPartidaMenor[];
	canEditSolicitanteFields: boolean;
	onChange: (next: ServiciosPartidaMenor[]) => void;
}) {
	const [cantidadDraft, setCantidadDraft] = useState('');
	const [unidadMedidaIdDraft, setUnidadMedidaIdDraft] = useState('');
	const [showErrors, setShowErrors] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);

	const nextNumeroPartida = useMemo(() => {
		const max = partidas.reduce((acc, item) => Math.max(acc, item.numeroPartida), 0);
		return max + 1;
	}, [partidas]);

	const columns: SimpleTableColumn<ServiciosPartidaMenor>[] = useMemo(
		() => [
			{
				key: 'numeroPartida',
				label: 'No. partida',
				width: 'w-28 min-w-28',
				cellClassName: 'uppercase text-center font-semibold',
			},
			{
				key: 'unidadMedidaLabel',
				label: 'Unidad de medida',
				width: 'w-48 min-w-48',
				cellClassName: 'uppercase',
			},
			{
				key: 'cantidad',
				label: 'Cantidad',
				width: 'w-36 min-w-36',
				cellClassName: 'text-right tabular-nums font-semibold',
			},
		],
		[]
	);

	const editingRow = useMemo(
		() => partidas.find((item) => item.id === editingId) ?? null,
		[editingId, partidas]
	);

	function handleSavePartida() {
		setShowErrors(true);
		if (!unidadMedidaIdDraft || !cantidadDraft.trim()) return;

		const unidadSeleccionada = MOCK_UNIDAD_MEDIDA.find((u) => u.value === unidadMedidaIdDraft);

		const base: Omit<ServiciosPartidaMenor, 'id' | 'numeroPartida'> = {
			unidadMedidaId: unidadMedidaIdDraft,
			unidadMedidaLabel: (unidadSeleccionada?.label ?? unidadMedidaIdDraft).toUpperCase(),
			cantidad: cantidadDraft,
		};

		if (editingId) {
			onChange(
				partidas.map((item) => (item.id === editingId ? { ...item, ...base } : item))
			);
			setEditingId(null);
			setCantidadDraft('');
			setUnidadMedidaIdDraft('');
			setShowErrors(false);
			return;
		}

		onChange([
			...partidas,
			{
				...base,
				id: crypto.randomUUID(),
				numeroPartida: nextNumeroPartida,
			},
		]);
		setCantidadDraft('');
		setUnidadMedidaIdDraft('');
		setShowErrors(false);
	}

	function handleDeletePartida(row: ServiciosPartidaMenor) {
		if (editingId === row.id) {
			setEditingId(null);
			setCantidadDraft('');
			setUnidadMedidaIdDraft('');
			setShowErrors(false);
		}
		onChange(partidas.filter((item) => item.id !== row.id));
	}

	function handleEditPartida(row: ServiciosPartidaMenor) {
		setEditingId(row.id);
		setCantidadDraft(row.cantidad);
		setUnidadMedidaIdDraft(row.unidadMedidaId);
		setShowErrors(false);
	}

	function handleCancelEdit() {
		setEditingId(null);
		setCantidadDraft('');
		setUnidadMedidaIdDraft('');
		setShowErrors(false);
	}

	const unidadMedidaError = showErrors && !unidadMedidaIdDraft;
	const cantidadError = showErrors && !cantidadDraft.trim();

	return (
		<div className="p-4 flex-1 min-h-0 overflow-auto">
			<FormSection title="Partidas (servicio menor)">
				<div className="space-y-4">
					<div className="grid grid-cols-12 gap-4">
						<div className="col-span-12 lg:col-span-2">
							<FieldRoleLabel>Número de partida</FieldRoleLabel>
							<div className="flex h-[30px] items-center rounded border border-slate-300 bg-slate-100 px-2.5 text-xs font-semibold text-slate-600">
								{String(editingRow ? editingRow.numeroPartida : nextNumeroPartida)}
							</div>
						</div>
						<div className="col-span-12 lg:col-span-2">
							<FieldRoleLabel>Unidad de medida</FieldRoleLabel>
							<SearchableSelect
								options={MOCK_UNIDAD_MEDIDA}
								value={unidadMedidaIdDraft}
								onChange={setUnidadMedidaIdDraft}
								placeholder="Buscar..."
								disabled={!canEditSolicitanteFields}
							/>
							{unidadMedidaError ? (
								<p className="text-[11px] mt-1 text-red-600">*Requerido</p>
							) : null}
						</div>
						<div className="col-span-12 lg:col-span-2">
							<FieldRoleLabel>Cantidad</FieldRoleLabel>
							<DecimalStringCellInput
								value={cantidadDraft}
								onChange={setCantidadDraft}
								fractionDigits={4}
								disabled={!canEditSolicitanteFields}
								className="!text-xs !py-1.5 !px-2.5 w-full"
							/>
							{cantidadError ? (
								<p className="text-[11px] mt-1 text-red-600">*Requerido</p>
							) : null}
						</div>
					</div>

					<div className="flex items-center justify-end gap-2">
						<Button
							type="button"
							variant="success"
							size="md"
							leftIcon={editingId ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
							disabled={!canEditSolicitanteFields}
							onClick={handleSavePartida}
						>
							{editingId ? 'Actualizar' : 'Guardar'}
						</Button>
						{editingId ? (
							<Button
								type="button"
								variant="outline"
								size="md"
								leftIcon={<X className="w-4 h-4" />}
								onClick={handleCancelEdit}
							>
								Cancelar edición
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
					emptyDescription="Agregue al menos una partida para continuar."
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
		</div>
	);
}
