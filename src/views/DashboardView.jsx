import React from "react";

export function DashboardView() {
	return (
		<div className="flex-1 overflow-y-auto p-6 md:p-8 bg-brand-secondary/10">
			<div className="max-w-5xl mx-auto">
				{/* Welcome Section */}
				<div className="text-center mb-10 mt-2">
					<h2 className="text-3xl font-extrabold text-brand-neutral mb-3 flex items-center justify-center gap-2">
						¡Hola, Developer!{" "}
						<span className="animate-wave inline-block origin-[70%_70%]">
							👋
						</span>
					</h2>
					<p className="text-brand-neutral/75 text-base max-w-xl mx-auto leading-relaxed">
						Bienvenido a tu panel de control. Aquí tienes acceso directo a tus
						herramientas y tareas principales del día.
					</p>
				</div>

				{/* Quick Access Area - Blank Space / Future Widgets Area */}
				<div className="flex flex-col items-center justify-center min-h-[350px] border-2 border-dashed border-brand-neutral/30 rounded-xl bg-brand-white shadow-sm mt-6">
					<p className="text-brand-neutral/60 font-medium text-sm">
						Espacio de trabajo para futuros módulos (Gráficos, KPIs, Tablas)
					</p>
				</div>
			</div>
		</div>
	);
}
