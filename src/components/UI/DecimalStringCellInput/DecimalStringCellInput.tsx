import React, { useCallback } from "react";

/** Misma base visual que `Input` variant `numberCell` (texto para conservar ceros a la derecha). */
const CELL_BASE =
	"w-full px-2 py-1 text-xs font-semibold bg-white border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded shadow-sm outline-none transition-all text-right";

const CELL_DISABLED =
	"w-full px-2 py-1 text-xs font-semibold bg-slate-100 border border-slate-200 text-slate-500 rounded shadow-sm outline-none cursor-not-allowed text-right";

export function sanitizeDecimalTyping(raw: string): string | null {
	const v = raw.replace(/,/g, ".");
	if (v === "" || /^\d*\.?\d*$/.test(v)) return v;
	return null;
}

export interface DecimalStringCellInputProps {
	value: string;
	onChange: (next: string) => void;
	/** Decimales al salir del campo (p. ej. 2 → `20.00`). */
	fractionDigits?: number;
	onBlur?: () => void;
	disabled?: boolean;
	className?: string;
	id?: string;
	placeholder?: string;
	"aria-label"?: string;
	/** Si se define, ArrowUp / ArrowDown ajustan el valor en ±step (sin negativos, con `toFixed`). */
	arrowStep?: number;
}

/**
 * Celda numérica como texto: el navegador no elimina ceros finales (a diferencia de `type="number"`).
 * Al blur normaliza con `toFixed(fractionDigits)` y no permite negativos.
 */
export function DecimalStringCellInput({
	value,
	onChange,
	fractionDigits = 2,
	onBlur,
	disabled = false,
	className = "",
	id,
	placeholder,
	"aria-label": ariaLabel,
	arrowStep,
}: DecimalStringCellInputProps) {
	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const next = sanitizeDecimalTyping(e.target.value);
			if (next !== null) onChange(next);
		},
		[onChange],
	);

	const handleBlur = useCallback(() => {
		const raw = value.replace(/,/g, ".");
		const n = parseFloat(raw || "0");
		const clamped = Number.isFinite(n) ? Math.max(0, n) : 0;
		onChange(clamped.toFixed(fractionDigits));
		onBlur?.();
	}, [value, onChange, fractionDigits, onBlur]);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (disabled || arrowStep == null || arrowStep <= 0) return;
			if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
			e.preventDefault();
			const raw = value.replace(/,/g, ".");
			const parsed = parseFloat(raw || "0");
			const base = Number.isFinite(parsed) ? parsed : 0;
			const dir = e.key === "ArrowUp" ? 1 : -1;
			const next = Math.max(0, base + dir * arrowStep);
			onChange(next.toFixed(fractionDigits));
		},
		[disabled, arrowStep, value, onChange, fractionDigits],
	);

	return (
		<input
			id={id}
			type="text"
			inputMode="decimal"
			autoComplete="off"
			disabled={disabled}
			placeholder={placeholder}
			aria-label={ariaLabel}
			className={`${disabled ? CELL_DISABLED : `${CELL_BASE} text-slate-800`} ${className}`.trim()}
			value={value}
			onChange={handleChange}
			onBlur={handleBlur}
			onKeyDown={handleKeyDown}
		/>
	);
}
