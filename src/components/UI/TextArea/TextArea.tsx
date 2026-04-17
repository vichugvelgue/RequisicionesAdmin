import React from "react";

export interface TextAreaProps
	extends Omit<
		React.TextareaHTMLAttributes<HTMLTextAreaElement>,
		"value" | "onChange"
	> {
	value?: string;
	onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	className?: string;
	disabled?: boolean;
	id?: string;
	rows?: number;
}

const DISABLED_BASE =
	"w-full bg-slate-100 border border-slate-200 text-slate-500 rounded font-medium outline-none text-xs cursor-not-allowed py-2 px-2.5";

const DEFAULT_BASE =
	"w-full bg-white border border-slate-300 text-slate-700 rounded font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-shadow text-xs py-2 px-2.5 resize-y min-h-[80px]";

export function TextArea({
	value,
	onChange,
	className = "",
	disabled,
	id,
	rows = 4,
	...rest
}: TextAreaProps) {
	return (
		<textarea
			{...rest}
			id={id}
			value={value ?? ""}
			onChange={onChange}
			disabled={disabled}
			rows={rows}
			className={`${disabled ? DISABLED_BASE : DEFAULT_BASE} ${className}`.trim()}
		/>
	);
}

