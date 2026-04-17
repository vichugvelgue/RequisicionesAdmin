import { Check, Circle } from "lucide-react";
import { getPasswordRuleStatuses } from "../../../utils/passwordPolicy";

export type PasswordRequirementsProps = {
	password: string;
	/** Si se pasa, se muestra una fila extra que exige coincidencia exacta. */
	confirmPassword?: string;
	className?: string;
};

export function PasswordRequirements({
	password,
	confirmPassword,
	className = "",
}: PasswordRequirementsProps) {
	const baseRules = getPasswordRuleStatuses(password);
	const showMatch = confirmPassword !== undefined;
	const matchOk =
		password.length > 0 && confirmPassword !== undefined && password === confirmPassword;

	return (
		<div
			className={`rounded border border-brand-neutral/12 bg-brand-secondary/30 px-3 py-2.5 ${className}`.trim()}
			aria-live="polite"
		>
			<p className="text-[10px] font-bold text-brand-neutral/60 uppercase tracking-wider mb-2">
				Requisitos de la contraseña
			</p>
			<ul className="space-y-1.5 list-none m-0 p-0">
				{baseRules.map((rule) => (
					<li key={rule.id} className="flex items-start gap-2 text-[11px] leading-snug">
						<span className="mt-0.5 shrink-0" aria-hidden>
							{rule.ok ? (
								<Check className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2.5} />
							) : (
								<Circle className="w-3.5 h-3.5 text-brand-neutral/30" strokeWidth={2} />
							)}
						</span>
						<span
							className={
								rule.ok
									? "font-medium text-emerald-800/90"
									: "font-medium text-brand-neutral/65"
							}
						>
							{rule.label}
						</span>
					</li>
				))}
				{showMatch ? (
					<li className="flex items-start gap-2 text-[11px] leading-snug">
						<span className="mt-0.5 shrink-0" aria-hidden>
							{matchOk ? (
								<Check className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2.5} />
							) : (
								<Circle className="w-3.5 h-3.5 text-brand-neutral/30" strokeWidth={2} />
							)}
						</span>
						<span
							className={
								matchOk
									? "font-medium text-emerald-800/90"
									: "font-medium text-brand-neutral/65"
							}
						>
							Coincide con la confirmación
						</span>
					</li>
				) : null}
			</ul>
		</div>
	);
}
