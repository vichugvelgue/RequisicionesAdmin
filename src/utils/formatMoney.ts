/**
 * Formatea un valor numérico como moneda: $1,250.55 (2 decimales, separador de miles).
 */
export function formatMoney(value: unknown): string {
	const num = Number(value ?? 0);
	if (Number.isNaN(num)) return "$0.00";
	return `$${num.toLocaleString("en-US", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})}`;
}
