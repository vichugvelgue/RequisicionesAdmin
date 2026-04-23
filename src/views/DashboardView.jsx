import React from "react";
import { useAuth } from "../auth";

export function DashboardView() {
	const { user } = useAuth();
	return (
		<div className="flex-1 overflow-y-auto p-6 md:p-8 bg-brand-secondary/10">
			<div className="max-w-5xl mx-auto">
				{/* Welcome Section */}
				<div className="text-center mb-10 mt-2">
					<h2 className="text-3xl font-extrabold text-brand-neutral mb-3 flex items-center justify-center gap-2">
						¡Hola, {user?.displayName || "Usuario"}!{" "}
						<span className="animate-wave inline-block origin-[70%_70%]">
							👋
						</span>
					</h2>
					<p className="text-brand-neutral/75 text-base max-w-xl mx-auto leading-relaxed">
						Bienvenido a tu panel de control. Aquí tienes acceso directo a tus
						herramientas y tareas principales del día.
					</p>
				</div>
			</div>
		</div>
	);
}
