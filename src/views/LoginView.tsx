import React, { useEffect, useState } from 'react';
import {
	Navigate,
	useLocation,
	useNavigate,
	type Location,
} from 'react-router-dom';
import { Button, Input, Label, Toast } from '../components/UI';
import { useAuth } from '../auth';
import { usuarioApi } from '../api';
import { Check } from 'lucide-react';

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

	const [correoTelefono, setCorreoTelefono] = useState('');
	const [contrasena, setContrasena] = useState('');
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [toastState, setToastState] = useState<{
		visible: boolean;
		title: string;
		variant: "success" | "error";
	}>({
		visible: false,
		title: "",
		variant: "success",
	});

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

	const showToast = (title: string, message: string, variant: "success" | "error" = "success") => {
		setToastState({
			visible: true,
			title: message,
			variant,
		});
		const timer = setTimeout(() => {
			setToastState((prev) => ({ ...prev, visible: false }));
		}, 3000);

		return () => clearTimeout(timer);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrorMessage(null);
		setIsSubmitting(true);
		console.log('Submitting login with:', correoTelefono, contrasena);
		try {
			const result = await login({ correoTelefono, contrasena });
			console.log('Login result:', result);
			if (!result.ok) {
				//console.log('Setting error message:', result.message);
				setErrorMessage((result as { ok: false; message: string; }).message);
				setIsSubmitting(false);
				return;
			}
			const target = resolvePostLoginPath(from);
			navigate(target, { replace: true });
		} catch (error) {
			setErrorMessage(error instanceof Error ? error.message : 'No se pudo iniciar sesión. Intenta de nuevo.');
		} finally {
			setIsSubmitting(false);
		}
	};

	const recuperarContraseña = async () => {
		setErrorMessage(null);
		setIsSubmitting(true);
		try {
			const result = await usuarioApi.enviarRecuperarContraseña({ correoTelefono, contrasena })
			showToast("Recuperacion contraseña", "Se envio correo de recuperacion correctamente");
		} catch (error) {
			setErrorMessage(error instanceof Error ? error.message : "No se pudo enviar correo de recuperacion");
		} finally {
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
							Ingresa con tu correo autorizado
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
						<Label htmlFor="login-correoTelefono" required>
							Correo o Teléfono
						</Label>
						<Input
							id="login-correoTelefono"
							type="text"
							autoComplete="username"
							value={correoTelefono}
							onChange={(e) => setCorreoTelefono(e.target.value)}
							placeholder="correo@ejemplo.gob.mx o teléfono"
							disabled={isSubmitting}
							required
						/>
					</div>

					<div>
						<Label htmlFor="login-contrasena" required>
							Contraseña
						</Label>
						<Input
							id="login-contrasena"
							type="password"
							autoComplete="current-password"
							value={contrasena}
							onChange={(e) => setContrasena(e.target.value)}
							placeholder="Ingresa tu contraseña"
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

					<button onClick={recuperarContraseña} type='button' className='text-gray-500 text-center'>
						Recuperar contraseña
					</button>
				</form>
			</div>
			<Toast
				visible={toastState.visible}
				title={toastState.title}
				variant={toastState.variant}
				icon={<Check className="w-3.5 h-3.5 text-white" />}
			/>
		</div>
	);
}
