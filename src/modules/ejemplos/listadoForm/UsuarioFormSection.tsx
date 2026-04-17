import React from "react";
import { FormSection, Input, Label } from "../../../components/UI";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { UsuarioFormValues } from "./types";

interface UsuarioFormSectionProps {
	register: UseFormRegister<UsuarioFormValues>;
	errors: FieldErrors<UsuarioFormValues>;
	onSubmit: React.FormEventHandler<HTMLFormElement>;
}

export function UsuarioFormSection({
	register,
	errors,
	onSubmit,
}: UsuarioFormSectionProps) {
	return (
		<div className="p-4 flex-1 min-h-0 overflow-auto">
			<FormSection

			>
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
							<Label required>Tipo usuario</Label>
							<Input {...register("tipoUsuario")} className="uppercase" />
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
						<div className="col-span-12 lg:col-span-3">
							<Label required>Area</Label>
							<Input {...register("area")} className="uppercase" />
							{errors.area?.message ? (
								<p className="text-[11px] mt-1 text-red-600">
									{errors.area.message}
								</p>
							) : null}
						</div>
					</div>
				</form>
			</FormSection>
		</div>
	);
}
