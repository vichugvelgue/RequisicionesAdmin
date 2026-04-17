import React from "react";
import { Menu, CalendarDays, Bell, CheckCircle2 } from "lucide-react";

export function Topbar({ isSidebarOpen, setIsSidebarOpen }) {
	return (
		<header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 shadow-sm z-30">
			<div className="flex items-center gap-3">
				<button
					onClick={() => setIsSidebarOpen(!isSidebarOpen)}
					className="text-slate-500 hover:text-blue-600 p-1.5 rounded-md hover:bg-slate-100 transition-colors"
				>
					<Menu className="w-5 h-5" />
				</button>
				<h1 className="text-base font-bold text-slate-800 hidden sm:block">
					NexERP
				</h1>
				<div className="h-4 w-px bg-slate-200 hidden sm:block"></div>
				<div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded text-[11px] font-bold border border-emerald-100 uppercase tracking-wider hidden md:flex">
					<CheckCircle2 className="w-3.5 h-3.5" />
					Administrador
				</div>
			</div>

			<div className="flex items-center gap-4">
				<div className="flex items-center gap-2 text-[13px] text-slate-500 font-medium hidden md:flex">
					<CalendarDays className="w-4 h-4 text-slate-400" />
					24 de Octubre, 2023
				</div>

				<button className="relative text-slate-500 hover:text-blue-600 transition-colors p-1">
					<Bell className="w-4 h-4" />
					<span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
				</button>

				<div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

				<div className="flex items-center gap-2.5 cursor-pointer hover:bg-slate-50 p-1.5 rounded-md transition-colors">
					<div className="text-right hidden sm:block">
						<div className="text-[13px] font-bold text-slate-800 leading-tight">
							Developer
						</div>
						<div className="text-[10px] text-slate-500 font-medium">NexERP</div>
					</div>
					<div className="w-8 h-8 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
						JP
					</div>
				</div>
			</div>
		</header>
	);
}
