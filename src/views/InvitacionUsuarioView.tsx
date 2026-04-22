import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Ban } from "lucide-react";
import {
	Button,
	ConfirmModal,
	Input,
	Label,
	PasswordRequirements,
	Toast,
} from "../components/UI";
import { getPasswordStrengthError } from "../utils/passwordPolicy";

const LOGO_SRC = "/assets/logos/logo_horizontal_beige.png";

/** Tokens aceptados solo en prototipo (sin API). Documentados en docs/acceso-publico-invitacion.md */
const PROTOTYPE_VALID_TOKENS = new Set([
	"demo",
	"550e8400-e29b-41d4-a716-446655440000",
]);

/** Tokens que simulan caducidad (prototipo). */
const PROTOTYPE_EXPIRED_TOKENS = new Set(["expirado-demo"]);

function isPrototypeTokenExpired(token: string): boolean {
	return token.length > 0 && PROTOTYPE_EXPIRED_TOKENS.has(token);
}

function isPrototypeTokenValid(token: string): boolean {
	return token.length > 0 && PROTOTYPE_VALID_TOKENS.has(token);
}

function decodeQueryParam(raw: string | null): string {
	if (raw == null) return "";
	try {
		return decodeURIComponent(raw.replace(/\+/g, " ")).trim();
	} catch {
		return raw.trim();
	}
}

/** En producción vendrán del backend al validar el token; en prototipo: query opcional + valores demo. */
const PROTOTYPE_DEFAULT_NOMBRE = "USUARIO INVITADO (DEMO)";
const PROTOTYPE_DEFAULT_CORREO = "invitacion.demo@ejemplo.gob.mx";

export function InvitacionUsuarioView() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	const token = useMemo(
		() => (searchParams.get("token") ?? "").trim(),
		[searchParams]
	);
	const tokenExpired = isPrototypeTokenExpired(token);
	const tokenOk = !tokenExpired && isPrototypeTokenValid(token);

	const nombreInvitacion = useMemo(() => {
		const fromQuery = decodeQueryParam(searchParams.get("nombre"));
		if (fromQuery) return fromQuery;
		if (tokenOk) return PROTOTYPE_DEFAULT_NOMBRE;
		return "";
	}, [searchParams, tokenOk]);

	const correoInvitacion = useMemo(() => {
		const fromQuery =
			decodeQueryParam(searchParams.get("correo")) ||
			decodeQueryParam(searchParams.get("email"));
		if (fromQuery) return fromQuery;
		if (tokenOk) return PROTOTYPE_DEFAULT_CORREO;
		return "";
	}, [searchParams, tokenOk]);

	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [rejectModalOpen, setRejectModalOpen] = useState(false);

	const [toastVisible, setToastVisible] = useState(false);
	const [toastTitle, setToastTitle] = useState("");
	const [toastDescription, setToastDescription] = useState("");
	const [toastVariant, setToastVariant] = useState<"success" | "error">("success");

	useEffect(() => {
		if (!toastVisible) return;
		const t = window.setTimeout(() => setToastVisible(false), 3200);
		return () => window.clearTimeout(t);
	}, [toastVisible]);

	const goToLoginSoon = () => {
		window.setTimeout(() => {
			navigate("/login", { replace: true });
		}, 2200);
	};

	const handleAccept = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrorMessage(null);

		if (!nombreInvitacion || !correoInvitacion) {
			setErrorMessage(
				"No se pudo cargar el perfil de la invitación. Solicita un enlace nuevo."
			);
			return;
		}
		const pwdErr = getPasswordStrengthError(password);
		if (pwdErr) {
			setErrorMessage(pwdErr);
			return;
		}
		if (password !== confirmPassword) {
			setErrorMessage("Las contraseñas no coinciden.");
			return;
		}

		setIsSubmitting(true);
		try {
			await new Promise((r) => setTimeout(r, 400));
			setToastVariant("success");
			setToastTitle("Cuenta aceptada (prototipo)");
			setToastDescription(
				"En producción el servidor validará el token y creará el acceso."
			);
			setToastVisible(true);
			goToLoginSoon();
		} catch {
			setToastVariant("error");
			setToastTitle("Error");
			setToastDescription("No se pudo completar la acción. Intenta de nuevo.");
			setToastVisible(true);
			setIsSubmitting(false);
		}
	};

	const handleConfirmReject = () => {
		setRejectModalOpen(false);
		setToastVariant("success");
		setToastTitle("Invitación rechazada (prototipo)");
		setToastDescription("No se ha creado ningún acceso.");
		setToastVisible(true);
		goToLoginSoon();
	};

	const invalidTokenBlock = (
		<div className="w-full max-w-md md:max-w-sm shrink-0 flex flex-col justify-center space-y-5 rounded-lg border border-brand-neutral/15 bg-brand-white/95 p-6 sm:p-8 shadow-xl shadow-brand-neutral/10 backdrop-blur-sm">
			<div className="text-center md:text-left space-y-1">
				<h1 className="text-sm font-bold text-brand-primary uppercase tracking-widest">
					Enlace no válido
				</h1>
				<p className="text-[11px] text-brand-neutral/70 font-medium">
					Falta el token o no es reconocido en este prototipo. Si esperabas una
					invitación, solicita que te envíen un enlace nuevo o inicia sesión si ya
					tienes cuenta.
				</p>
			</div>
			<div
				role="alert"
				className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900"
			>
				Usa un token de prueba documentado en la documentación del repositorio,
				por ejemplo <code className="rounded bg-amber-100/80 px-1">demo</code>.
			</div>
			<Button
				type="button"
				variant="primary"
				size="xl"
				className="w-full"
				onClick={() => navigate("/login")}
			>
				Ir al inicio de sesión
			</Button>
		</div>
	);

	const expiredTokenBlock = (
		<div className="w-full max-w-md md:max-w-sm shrink-0 flex flex-col justify-center space-y-5 rounded-lg border border-brand-neutral/15 bg-brand-white/95 p-6 sm:p-8 shadow-xl shadow-brand-neutral/10 backdrop-blur-sm">
			<div className="text-center md:text-left space-y-1">
				<h1 className="text-sm font-bold text-brand-primary uppercase tracking-widest">
					Enlace expirado
				</h1>
				<p className="text-[11px] text-brand-neutral/70 font-medium">
					Esta invitación ya no está disponible por tiempo o uso. Solicita al
					administrador una nueva invitación.
				</p>
			</div>
			<Button
				type="button"
				variant="primary"
				size="xl"
				className="w-full"
				onClick={() => navigate("/login")}
			>
				Ir al inicio de sesión
			</Button>
		</div>
	);

	const mainCard =
		tokenExpired ? (
			expiredTokenBlock
		) : !tokenOk ? (
			invalidTokenBlock
		) : (
			<form
				noValidate
				onSubmit={handleAccept}
				className="w-full max-w-md md:max-w-sm shrink-0 flex flex-col justify-center space-y-5 rounded-lg border border-brand-neutral/15 bg-brand-white/95 p-6 sm:p-8 shadow-xl shadow-brand-neutral/10 backdrop-blur-sm"
			>
				<div className="text-center md:text-left space-y-1">
					<h1 className="text-sm font-bold text-brand-primary uppercase tracking-widest">
						Invitación al sistema
					</h1>
					<p className="text-[11px] text-brand-neutral/70 font-medium">
						Has sido invitado a unirte. Revisa que los datos sean correctos y define
						una contraseña segura para activar tu acceso. Si no deseas continuar,
						puedes rechazar la invitación.
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

				<div className="rounded border border-brand-neutral/15 bg-brand-secondary/40 px-3 py-3 space-y-2">
					<p className="text-[10px] font-bold text-brand-primary uppercase tracking-wider">
						Datos de la invitación
					</p>
					<dl className="space-y-2 text-xs">
						<div>
							<dt className="text-brand-neutral/55 font-medium">Nombre</dt>
							<dd className="font-semibold text-brand-neutral mt-0.5 uppercase">
								{nombreInvitacion}
							</dd>
						</div>
						<div>
							<dt className="text-brand-neutral/55 font-medium">Correo</dt>
							<dd className="font-semibold text-brand-neutral mt-0.5 break-all">
								{correoInvitacion}
							</dd>
						</div>
					</dl>
				</div>

				<div>
					<Label htmlFor="invitacion-password" required>
						Contraseña
					</Label>
					<Input
						id="invitacion-password"
						type="password"
						autoComplete="new-password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Escribe tu contraseña"
						disabled={isSubmitting}
					/>
					<div className="mt-2">
						<PasswordRequirements password={password} confirmPassword={confirmPassword} />
					</div>
				</div>

				<div>
					<Label htmlFor="invitacion-password-confirm" required>
						Confirmar contraseña
					</Label>
					<Input
						id="invitacion-password-confirm"
						type="password"
						autoComplete="new-password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						placeholder="Repite la contraseña"
						disabled={isSubmitting}
					/>
				</div>

				<div className="flex flex-col sm:flex-row gap-2">
					<Button
						type="button"
						variant="outline"
						size="xl"
						className="w-full sm:flex-1"
						disabled={isSubmitting}
						onClick={() => setRejectModalOpen(true)}
					>
						Rechazar
					</Button>
					<Button
						type="submit"
						variant="primary"
						size="xl"
						className="w-full sm:flex-1"
						disabled={isSubmitting}
					>
						{isSubmitting ? "Procesando…" : "Aceptar"}
					</Button>
				</div>

				<p className="text-center text-[11px] text-brand-neutral/60">
					<Link
						to="/login"
						className="font-semibold text-brand-primary underline-offset-2 hover:underline"
					>
						Volver al inicio de sesión
					</Link>
				</p>
			</form>
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
			<ConfirmModal
				open={rejectModalOpen}
				onClose={() => setRejectModalOpen(false)}
				onConfirm={handleConfirmReject}
				title="Rechazar invitación"
				icon={<Ban className="w-5 h-5" />}
				variant="danger"
				confirmLabel="Rechazar"
				cancelLabel="Volver"
			>
				<p className="text-sm text-slate-600">
					¿Seguro que deseas rechazar esta invitación? No se creará ninguna cuenta.
				</p>
			</ConfirmModal>

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

				{mainCard}
			</div>
		</div>
	);
}
