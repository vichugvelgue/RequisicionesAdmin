import React from 'react';

export function StepperTabLabel({
	step,
	title,
}: {
	step: number;
	title: string;
}) {
	return (
		<span className="inline-flex items-center gap-2">
			<span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-secondary/40 text-[10px] font-bold text-brand-primary">
				{step}
			</span>
			<span>{title}</span>
		</span>
	);
}
