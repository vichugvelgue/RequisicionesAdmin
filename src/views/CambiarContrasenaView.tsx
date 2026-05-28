import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Button, Input, Label, PasswordRequirements, Toast } from '../components/UI';
import { getPasswordStrengthError } from '../utils/passwordPolicy';

const LOGO_SRC = '/assets/logos/logo_horizontal_beige.png';

/** Tokens aceptados solo en prototipo (sin API). Documentados en docs/acceso-publico-cambiar-contrasena.md */
const PROTOTYPE_VALID_TOKENS = new Set(['demo', '550e8400-e29b-41d4-a716-446655440000']);

function isPrototypeTokenValid(token: string): boolean {
	return token.length > 0 && PROTOTYPE_VALID_TOKENS.has(token);
}

export function CambiarContrasenaView() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	const token = useMemo(
		() => (searchParams.get('token') ?? '').trim(),
		[searchParams],
	);
	const tokenOk = isPrototypeTokenValid(token);

	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [toastVisible, setToastVisible] = useState(false);
	const [toastTitle, setToastTitle] = useState('');
	const [toastDescription, setToastDescription] = useState('');
	const [toastVariant, setToastVariant] = useState<'success' | 'error'>('success');

	useEffect(() => {
		if (!toastVisible) return;
		const t = window.setTimeout(() => setToastVisible(false), 3200);
		return () => window.clearTimeout(t);
	}, [toastVisible]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrorMessage(null);

		const pwdErr = getPasswordStrengthError(password);
		if (pwdErr) {
			setErrorMessage(pwdErr);
			return;
		}
		if (password !== confirmPassword) {
			setErrorMessage('Las contraseñas no coinciden.');
			return;
		}

		setIsSubmitting(true);
		try {
			await new Promise((r) => setTimeout(r, 400));
			setToastVariant('success');
			setToastTitle('Contraseña actualizada correctamente');
			setToastDescription('En producción aquí se confirmará con el servidor.');
			setToastVisible(true);
			window.setTimeout(() => {
				navigate('/login', { replace: true });
			}, 2200);
		} catch {
			setToastVariant('error');
			setToastTitle('Error');
			setToastDescription('No se pudo completar la acción. Intenta de nuevo.');
			setToastVisible(true);
			setIsSubmitting(false);
		}
	};

	const invalidTokenBlock = (
		<div className="w-full max-w-md md:max-w-sm shrink-0 flex flex-col justify-center space-y-5 rounded-lg border border-brand-neutral/15 bg-brand-white/95 p-6 sm:p-8 shadow-xl shadow-brand-neutral/10 backdrop-blur-sm">
			<div className="text-center md:text-left space-y-1">
				<h1 className="text-sm font-bold text-brand-primary uppercase tracking-widest">
					Enlace no válido
				</h1>
				<p className="text-[11px] text-brand-neutral/70 font-medium">
					Falta el token o no es reconocido en este prototipo. Solicita un nuevo
					enlace o inicia sesión si ya tienes cuenta.
				</p>
			</div>
			<div
				role="alert"
				className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900"
			>
				Usa un token de prueba documentado en el README del repositorio, por ejemplo{' '}
				<code className="rounded bg-amber-100/80 px-1">demo</code>.
			</div>
			<Button
				type="button"
				variant="primary"
				size="xl"
				className="w-full"
				onClick={() => navigate('/login')}
			>
				Ir al inicio de sesión
			</Button>
		</div>
	);

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-brand-secondary px-4 py-8 sm:py-10">
			<Toast
				visible={toastVisible}
				title={toastTitle}
				description={toastDescription}
				variant={toastVariant}
				size="long"
			/>
			<div className="w-full max-w-5xl flex flex-col md:flex-row md:items-stretch md:justify-center gap-8 md:gap-10 lg:gap-12 animate-fade-in">
				<div className="w-full md:flex-1 md:min-w-0 md:self-stretch flex items-stretch justify-center">
					<div className="w-full max-w-lg md:max-w-none rounded-xl bg-brand-neutral px-6 py-6 sm:py-10 shadow-lg shadow-brand-neutral/25 ring-1 ring-black/10 flex items-center justify-center min-h-[11rem] md:min-h-0 md:py-12">
						<img
							src={LOGO_SRC}
							alt="Gobierno municipal"
							className="w-full h-auto object-contain object-center select-none"
							draggable={false}
						/>
					</div>
				</div>

				{!tokenOk ? (
					invalidTokenBlock
				) : (
					<form
						noValidate
						onSubmit={handleSubmit}
						className="w-full max-w-md md:max-w-sm shrink-0 flex flex-col justify-center space-y-5 rounded-lg border border-brand-neutral/15 bg-brand-white/95 p-6 sm:p-8 shadow-xl shadow-brand-neutral/10 backdrop-blur-sm"
					>
						<div className="text-center md:text-left space-y-1">
							<h1 className="text-sm font-bold text-brand-primary uppercase tracking-widest">
								Cambiar contraseña
							</h1>
							<p className="text-[11px] text-brand-neutral/70 font-medium">
								Define una nueva contraseña para tu cuenta.
							</p>
						</div>

						{errorMessage ? (
							<div
								role="alert"
								className="rounded border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-800"
							>
								{errorMessage}
							</div>
						) : null}

						<div>
							<Label htmlFor="reset-password-new" required>
								Nueva contraseña
							</Label>
							<Input
								id="reset-password-new"
								type="password"
								autoComplete="new-password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Escribe tu nueva contraseña"
								disabled={isSubmitting}
							/>
							<div className="mt-2">
								<PasswordRequirements password={password} confirmPassword={confirmPassword} />
							</div>
						</div>

						<div>
							<Label htmlFor="reset-password-confirm" required>
								Confirmar contraseña
							</Label>
							<Input
								id="reset-password-confirm"
								type="password"
								autoComplete="new-password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								placeholder="Repite la contraseña"
								disabled={isSubmitting}
							/>
						</div>

						<Button
							type="submit"
							variant="primary"
							size="xl"
							className="w-full"
							disabled={isSubmitting}
						>
							{isSubmitting ? 'Guardando…' : 'Guardar contraseña'}
						</Button>

						<p className="text-center text-[11px] text-brand-neutral/60">
							<Link
								to="/login"
								className="font-semibold text-brand-primary underline-offset-2 hover:underline"
							>
								Volver al inicio de sesión
							</Link>
						</p>
					</form>
				)}
			</div>
		</div>
	);
}
