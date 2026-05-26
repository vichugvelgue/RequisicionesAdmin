import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '../../../../components/UI';

export function DocumentoTabChrome({
	children,
	actions,
}: {
	children: React.ReactNode;
	actions?: React.ReactNode;
}) {
	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<div className="flex shrink-0 flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-4 py-3">
				{actions ?? (
					<Button
						type="button"
						variant="primary"
						size="md"
						leftIcon={<Download className="w-4 h-4" />}
						onClick={() => {}}
					>
						Descargar documento
					</Button>
				)}

				<p className="min-w-[200px] flex-1 text-xs text-slate-500">
					Vista previa de los datos capturados en las pestañas anteriores.
				</p>
			</div>

			<div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
				<div className="w-full px-4 py-4">{children}</div>
			</div>
		</div>
	);
}

export function PreviewSection({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
			<div className="border-b border-slate-200 bg-slate-100/90 px-4 py-2.5">
				<h3 className="text-xs font-bold uppercase tracking-wide text-slate-700">
					{title}
				</h3>
			</div>
			<div className="p-4">{children}</div>
		</section>
	);
}

export function PreviewFieldsGrid({ children }: { children: React.ReactNode }) {
	return (
		<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{children}
		</div>
	);
}

export function PreviewField({
	label,
	value,
	preserveCase = false,
	fullWidth = false,
}: {
	label: string;
	value: string;
	preserveCase?: boolean;
	fullWidth?: boolean;
}) {
	const t = value?.trim() ?? '';
	const empty = !t;

	return (
		<div className={fullWidth ? 'sm:col-span-2 lg:col-span-3 xl:col-span-4' : ''}>
			<dl className="rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2.5">
				<dt className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
					{label}
				</dt>
				<dd
					className={`text-sm leading-snug text-slate-900 break-words ${
						preserveCase ? '' : 'uppercase'
					}`}
				>
					{empty ? <span className="text-slate-400">—</span> : value}
				</dd>
			</dl>
		</div>
	);
}