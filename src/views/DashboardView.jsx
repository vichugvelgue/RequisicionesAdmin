import React from "react";

export function DashboardView() {
	return (
		<div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50">
			<div className="max-w-5xl mx-auto">
				{/* Welcome Section */}
				<div className="text-center mb-10 mt-2">
					<h2 className="text-3xl font-extrabold text-slate-800 mb-3 flex items-center justify-center gap-2">
						¡Hola, Developer!{" "}
						<span className="animate-wave inline-block origin-[70%_70%]">
							👋
						</span>
					</h2>
					<p className="text-slate-500 text-base max-w-xl mx-auto leading-relaxed">
						Bienvenido a tu panel de control. Aquí tienes acceso directo a tus
						herramientas y tareas principales del día.
					</p>
				</div>

				{/* Quick Access Area - Blank Space / Future Widgets Area */}
				<div className="flex flex-col items-center justify-center min-h-[350px] border-2 border-dashed border-slate-300 rounded-xl bg-white shadow-sm mt-6">
					<p className="text-slate-400 font-medium text-sm">
						Espacio de trabajo para futuros módulos (Gráficos, KPIs, Tablas)
					</p>
				</div>
			</div>
		</div>
	);
}
