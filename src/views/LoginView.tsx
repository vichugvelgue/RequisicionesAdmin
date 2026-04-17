import React, { useState } from 'react';
import {
	Navigate,
	useLocation,
	useNavigate,
	type Location,
} from 'react-router-dom';
import { Button, Input, Label } from '../components/UI';
import { useAuth } from '../auth';

const LOGO_SRC = '/assets/logos/logo_horizontal_beige.png';

function isSafeInternalPath(pathname: string): boolean {
	return pathname.startsWith('/') && !pathname.startsWith('//');
}

function resolvePostLoginPath(fromState: unknown): string {
	if (
		fromState &&
		typeof fromState === 'object' &&
		'pathname' in fromState &&
		typeof (fromState as Location).pathname === 'string'
	) {
		const p = (fromState as Location).pathname;
		if (isSafeInternalPath(p) && p !== '/login') return p;
	}
	return '/';
}

export function LoginView() {
	const { isAuthenticated, isHydrated, login } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const from = location.state?.from as Location | undefined;

	if (!isHydrated) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-brand-secondary text-brand-neutral text-sm font-medium">
				Cargando…
			</div>
		);
	}

	if (isAuthenticated) {
		return <Navigate to={resolvePostLoginPath(from)} replace />;
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrorMessage(null);
		setIsSubmitting(true);
		try {
			const result = await login({ email, password });
			if (!result.ok) {
				setErrorMessage(result.message);
				setIsSubmitting(false);
				return;
			}
			const target = resolvePostLoginPath(from);
			navigate(target, { replace: true });
		} catch {
			setErrorMessage('No se pudo iniciar sesión. Intenta de nuevo.');
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-brand-secondary px-4 py-8 sm:py-10">
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

				<form
					onSubmit={handleSubmit}
					className="w-full max-w-md md:max-w-sm shrink-0 flex flex-col justify-center space-y-5 rounded-lg border border-brand-neutral/15 bg-brand-white/95 p-6 sm:p-8 shadow-xl shadow-brand-neutral/10 backdrop-blur-sm"
				>
					<div className="text-center md:text-left space-y-1">
						<h1 className="text-sm font-bold text-brand-primary uppercase tracking-widest">
							Acceso
						</h1>
						<p className="text-[11px] text-brand-neutral/70 font-medium">
							Ingresa con tu correo y contraseña
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
						<Label htmlFor="login-email" required>
							Correo
						</Label>
						<Input
							id="login-email"
							type="email"
							autoComplete="username"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="correo@ejemplo.gob.mx"
							disabled={isSubmitting}
							required
						/>
					</div>

					<div>
						<Label htmlFor="login-password" required>
							Contraseña
						</Label>
						<Input
							id="login-password"
							type="password"
							autoComplete="current-password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="••••••••"
							disabled={isSubmitting}
							required
						/>
					</div>

					<Button
						type="submit"
						variant="primary"
						size="xl"
						className="w-full"
						disabled={isSubmitting}
					>
						{isSubmitting ? 'Ingresando…' : 'Ingresar'}
					</Button>
				</form>
			</div>
		</div>
	);
}
