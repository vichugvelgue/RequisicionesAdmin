import React from "react";
import {
	FormSection,
	Input,
	Label,
	Select,
	SimpleTable,
} from "../../../components/UI";
import type { SimpleTableColumn } from "../../../components/UI/SimpleTable/SimpleTable";
import { formatDateToDDMMMYYYY } from "../../../utils/dateFormat";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { InvitacionHistorialItem, UsuarioFormValues } from "./types";

const TIPO_USUARIO_OPTIONS: { value: UsuarioFormValues["tipoPerfil"]; label: string }[] =
	[
		{ value: "", label: "Seleccione…" },
		{ value: "SOLICITANTE", label: "Solicitante" },
		{ value: "REVISOR", label: "Revisor" },
		{ value: "AUTORIZADOR", label: "Autorizador" },
		{ value: "ADMINISTRADOR GENERAL", label: "Administrador General" },
	];

const HISTORIAL_COLUMNS: SimpleTableColumn<InvitacionHistorialItem>[] = [
	{
		key: "enviadaPor",
		label: "ENVIADA POR",
		width: "w-1/2",
		cellClassName: "uppercase",
	},
	{
		key: "fecha",
		label: "FECHA",
		width: "w-1/4",
		cellClassName: "uppercase",
		render: (_v, row) => formatDateToDDMMMYYYY(row.fecha),
	},
	{
		key: "estatus",
		label: "ESTATUS",
		width: "w-1/4",
		cellClassName: "uppercase",
	},
];

interface UsuarioFormSectionProps {
	register: UseFormRegister<UsuarioFormValues>;
	errors: FieldErrors<UsuarioFormValues>;
	onSubmit: React.FormEventHandler<HTMLFormElement>;
	historialInvitaciones: InvitacionHistorialItem[];
	/** Solo en alta: muestra “Generar invitación” junto a Área. En edición no aplica. */
	showGenerarInvitacion: boolean;
}

export function UsuarioFormSection({
	register,
	errors,
	onSubmit,
	historialInvitaciones,
	showGenerarInvitacion,
}: UsuarioFormSectionProps) {
	return (
		<div className="p-4 flex-1 min-h-0 overflow-auto">
			<FormSection>
				<form className="space-y-4" onSubmit={onSubmit}>
					<div className="grid grid-cols-12 gap-4">
						<div className="col-span-12 lg:col-span-3">
							<Label required>Nombres</Label>
							<Input {...register("nombres")} className="uppercase" />
							{errors.nombres?.message ? (
								<p className="text-[11px] mt-1 text-red-600">
									{errors.nombres.message}
								</p>
							) : null}
						</div>
						<div className="col-span-12 lg:col-span-3">
							<Label required>Apellido Paterno</Label>
							<Input {...register("apellidoPaterno")} className="uppercase" />
							{errors.apellidoPaterno?.message ? (
								<p className="text-[11px] mt-1 text-red-600">
									{errors.apellidoPaterno.message}
								</p>
							) : null}
						</div>
						<div className="col-span-12 lg:col-span-3">
							<Label required>Apellido Materno</Label>
							<Input {...register("apellidoMaterno")} className="uppercase" />
							{errors.apellidoMaterno?.message ? (
								<p className="text-[11px] mt-1 text-red-600">
									{errors.apellidoMaterno.message}
								</p>
							) : null}
						</div>
						<div className="col-span-12 lg:col-span-3">
							<Label required>Correo</Label>
							<Input type="email" {...register("correo")} />
							{errors.correo?.message ? (
								<p className="text-[11px] mt-1 text-red-600">
									{errors.correo.message}
								</p>
							) : null}
						</div>
						<div className="col-span-12 lg:col-span-3">
							<Label required>Contraseña</Label>
							<Input type="password" {...register("contrasena")} />
							{errors.contrasena?.message ? (
								<p className="text-[11px] mt-1 text-red-600">
									{errors.contrasena.message}
								</p>
							) : null}
						</div>
						<div className="col-span-12 lg:col-span-3">
							<Label htmlFor="usuario-tipo-usuario" required>
								Tipo usuario
							</Label>
							<Select
								id="usuario-tipo-usuario"
								{...register("tipoUsuario")}
								size="default"
							>
								{TIPO_USUARIO_OPTIONS.map((opt) => (
									<option key={opt.value || "__empty"} value={opt.value}>
										{opt.label}
									</option>
								))}
							</Select>
							{errors.tipoUsuario?.message ? (
								<p className="text-[11px] mt-1 text-red-600">
									{errors.tipoUsuario.message}
								</p>
							) : null}
						</div>
						<div className="col-span-12 lg:col-span-3">
							<Label required>Puesto</Label>
							<Input {...register("puesto")} className="uppercase" />
							{errors.puesto?.message ? (
								<p className="text-[11px] mt-1 text-red-600">
									{errors.puesto.message}
								</p>
							) : null}
						</div>
						{showGenerarInvitacion ? (
							<div className="col-span-12 lg:col-span-6 min-w-0">
								<Label required>Area</Label>
								<div className="grid grid-cols-12 gap-4 lg:grid-cols-6">
									<div className="col-span-12 lg:col-span-3 min-w-0">
										<Input {...register("area")} className="uppercase" />
										{errors.area?.message ? (
											<p className="text-[11px] mt-1 text-red-600">
												{errors.area.message}
											</p>
										) : null}
									</div>
									<div className="col-span-12 lg:col-span-3 flex min-h-0 items-center gap-2">
										<input
											id="usuario-generar-invitacion"
											type="checkbox"
											className="h-4 w-4 shrink-0 rounded border-brand-neutral/40 text-brand-primary focus:ring-brand-primary/30"
											{...register("generarInvitacion")}
										/>
										<Label
											htmlFor="usuario-generar-invitacion"
											className="mb-0 font-medium"
										>
											Generar invitación
										</Label>
									</div>
								</div>
							</div>
						) : (
							<div className="col-span-12 lg:col-span-3">
								<Label required>Area</Label>
								<Input {...register("area")} className="uppercase" />
								{errors.area?.message ? (
									<p className="text-[11px] mt-1 text-red-600">
										{errors.area.message}
									</p>
								) : null}
							</div>
						)}
					</div>
				</form>

				<div className="mt-8 border-t border-brand-neutral/15 pt-4">
					<h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
						Histórico de invitaciones enviadas
					</h3>
					<div className="grid grid-cols-12 gap-4">
						<div className="col-span-12 lg:col-span-6 min-w-0 rounded border border-slate-200 overflow-hidden bg-white">
							<SimpleTable<InvitacionHistorialItem>
								columns={HISTORIAL_COLUMNS}
								data={historialInvitaciones}
								getRowKey={(row) => row.id}
								showInlineFilters={false}
								emptyTitle="Sin invitaciones registradas"
								emptyDescription="Use Enviar invitación para añadir un registro (prototipo)."
							/>
						</div>
					</div>
				</div>
			</FormSection>
		</div>
	);
}
