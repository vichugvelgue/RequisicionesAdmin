import React from 'react';
import { Label } from '../../../components/UI';

export function FieldRoleLabel({
	htmlFor,
	className = '',
	children,
}: {
	htmlFor?: string;
	className?: string;
	children: React.ReactNode;
}) {
	return (
		<Label htmlFor={htmlFor} className={className.trim()}>
			{children}
		</Label>
	);
}
