import React, { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, CalendarDays, Bell, CheckCircle2, LogOut } from "lucide-react";
import { useAuth } from "../../auth";

function initialsFromDisplayName(displayName) {
	if (!displayName || typeof displayName !== "string") return "?";
	const parts = displayName.trim().split(/\s+/).filter(Boolean);
	if (parts.length === 0) return "?";
	if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
	return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Topbar({ isSidebarOpen, setIsSidebarOpen }) {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const activeProfileLabel = user?.tipoPerfil ?? "SIN PERFIL";

	const avatarInitials = useMemo(
		() => initialsFromDisplayName(user?.displayName ?? user?.email ?? ""),
		[user]
	);

	const handleLogout = useCallback(() => {
		logout();
		navigate("/login", { replace: true });
	}, [logout, navigate]);
	return (
		<header className="h-14 bg-brand-white border-b border-brand-neutral/20 flex items-center justify-between px-4 shrink-0 shadow-sm z-30">
			<div className="flex items-center gap-3">
				<button
					onClick={() => setIsSidebarOpen(!isSidebarOpen)}
					className="text-brand-neutral/75 hover:text-brand-primary p-1.5 rounded-md hover:bg-brand-secondary/20 transition-colors"
				>
					<Menu className="w-5 h-5" />
				</button>
				<h1 className="text-base font-bold text-brand-neutral hidden sm:block">
					NexERP
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
					24 de Octubre, 2023
				</div>

				<button className="relative text-brand-neutral/75 hover:text-brand-primary transition-colors p-1">
					<Bell className="w-4 h-4" />
					<span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-brand-white"></span>
				</button>

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
