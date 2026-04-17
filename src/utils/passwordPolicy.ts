export const MIN_PASSWORD_LENGTH = 8;

export type PasswordRuleId =
	| "minLength"
	| "upper"
	| "lower"
	| "digit"
	| "special";

export type PasswordRuleStatus = {
	id: PasswordRuleId;
	label: string;
	ok: boolean;
};

const RULE_MESSAGES: Record<PasswordRuleId, string> = {
	minLength: `Al menos ${MIN_PASSWORD_LENGTH} caracteres.`,
	upper: "Incluye al menos una letra mayúscula.",
	lower: "Incluye al menos una letra minúscula.",
	digit: "Incluye al menos un número.",
	special: "Incluye al menos un carácter especial (símbolo).",
};

export function getPasswordRuleStatuses(password: string): PasswordRuleStatus[] {
	return [
		{
			id: "minLength",
			label: `Al menos ${MIN_PASSWORD_LENGTH} caracteres`,
			ok: password.length >= MIN_PASSWORD_LENGTH,
		},
		{
			id: "upper",
			label: "Una letra mayúscula",
			ok: /[A-ZÁÉÍÓÚÑ]/.test(password),
		},
		{
			id: "lower",
			label: "Una letra minúscula",
			ok: /[a-záéíóúñ]/.test(password),
		},
		{
			id: "digit",
			label: "Un número",
			ok: /[0-9]/.test(password),
		},
		{
			id: "special",
			label: "Un carácter especial",
			ok: /[^A-Za-zÁÉÍÓÚáéíóúÑñ0-9]/.test(password),
		},
	];
}

/** Primera regla que no cumple; `null` si la contraseña cumple toda la política. */
export function getPasswordStrengthError(password: string): string | null {
	for (const s of getPasswordRuleStatuses(password)) {
		if (!s.ok) return RULE_MESSAGES[s.id];
	}
	return null;
}
