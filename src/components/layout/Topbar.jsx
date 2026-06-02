import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, Bell, CheckCircle2, LogOut } from "lucide-react";
import { useAuth } from "../../auth";
import { notificacionesApi } from "../../api/notificacionesApi";

function initialsFromDisplayName(displayName) {
	if (!displayName || typeof displayName !== "string") return "?";
	const parts = displayName.trim().split(/\s+/).filter(Boolean);
	if (parts.length === 0) return "?";
	if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
	return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Topbar({ isSidebarOpen }) {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const activeProfileLabel = user?.tipoPerfil ?? "SIN PERFIL";
	const [notificaciones, setNotificaciones] = useState([]);
	const [open, setOpen] = useState(false);

	const avatarInitials = useMemo(
		() => initialsFromDisplayName(user?.displayName ?? user?.email ?? ""),
		[user]
	);

	const handleLogout = useCallback(() => {
		logout();
		navigate("/login", { replace: true });
	}, [logout, navigate]);

	const handleBell = () => {
		setOpen(!open);
		if (!open) listarNotificaciones();
	};
	const listarNotificaciones = () => {
		notificacionesApi.listar(user?.id ?? 0).then((notificaciones) => {
			setNotificaciones(notificaciones);
		});
	};

	return (
		<header className="h-14 bg-brand-white border-b border-brand-neutral/20 flex items-center justify-between px-4 shrink-0 shadow-sm z-30">
			<div className="flex items-center gap-3">
				<h1 className="text-base font-bold text-brand-neutral hidden sm:block">
					GESTIÓN Y SEGUIMIENTO DE REQUISICIONES
				</h1>
				<div className="h-4 w-px bg-brand-neutral/20 hidden sm:block"></div>
				<div className="flex items-center gap-1.5 px-2.5 py-1 bg-brand-secondary/25 text-brand-neutral rounded text-[11px] font-bold border border-brand-secondary/50 uppercase tracking-wider hidden md:flex">
					<CheckCircle2 className="w-3.5 h-3.5" />
					{activeProfileLabel}
				</div>
			</div>

			<div className="flex items-center gap-4">
				<div className="flex items-center gap-2 text-[13px] text-brand-neutral/75 font-medium hidden md:flex">
					<CalendarDays className="w-4 h-4 text-brand-neutral/60" />
					{new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" })}
				</div>

				<div className="relative">
					<button onClick={handleBell} className="relative text-brand-neutral/75 hover:text-brand-primary transition-colors p-1">
						<Bell className="w-4 h-4" />
						{/* <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-brand-white"></span> */}
					</button>

					{open && (
						<div className="absolute right-0 mt-2 w-72 bg-white border border-brand-neutral/20 rounded-md shadow-lg z-50">
							<div className="p-2 text-xs font-bold text-brand-neutral border-b">Notificaciones</div>
							{notificaciones.length === 0 ? (
								<div className="p-4 text-xs text-center text-brand-neutral/50">Sin notificaciones</div>
							) : (
								notificaciones.map((n, i) => (
									<div key={i} className="p-3 border-b last:border-0 hover:bg-gray-50">
										<p className="text-xs text-brand-neutral">{n.comentario}</p>
										<p className="text-[10px] text-brand-neutral/50 mt-1">{new Date(n.fechaRegistro).toLocaleString("es-MX", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
									</div>
								))
							)}
						</div>
					)}
				</div>

				<div className="h-6 w-px bg-brand-neutral/20 hidden sm:block"></div>

				<div className="flex items-center gap-1 sm:gap-2">
					<button
						type="button"
						onClick={handleLogout}
						className="text-brand-neutral/75 hover:text-brand-primary transition-colors p-1.5 rounded-md hover:bg-brand-secondary/15"
						title="Cerrar sesión"
						aria-label="Cerrar sesión"
					>
						<LogOut className="w-4 h-4" />
					</button>
					<div className="flex items-center gap-2.5 p-1.5 rounded-md">
						<div className="text-right hidden sm:block">
							<div className="text-[13px] font-bold text-brand-neutral leading-tight uppercase">
								{user?.displayName ?? "Usuario"}
							</div>
							<div className="text-[10px] text-brand-neutral/70 font-medium uppercase">
								{user?.email ?? ""}
							</div>
						</div>
						<div className="w-8 h-8 rounded bg-brand-primary text-brand-white flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
							{avatarInitials}
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}
