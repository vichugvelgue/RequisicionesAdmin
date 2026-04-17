import React from "react";
import { Menu, CalendarDays, Bell, CheckCircle2 } from "lucide-react";

export function Topbar({ isSidebarOpen, setIsSidebarOpen }) {
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
					Administrador
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

				<div className="flex items-center gap-2.5 cursor-pointer hover:bg-brand-secondary/15 p-1.5 rounded-md transition-colors">
					<div className="text-right hidden sm:block">
						<div className="text-[13px] font-bold text-brand-neutral leading-tight">
							Developer
						</div>
						<div className="text-[10px] text-brand-neutral/70 font-medium">NexERP</div>
					</div>
					<div className="w-8 h-8 rounded bg-brand-primary text-brand-white flex items-center justify-center font-bold text-xs shadow-sm">
						JP
					</div>
				</div>
			</div>
		</header>
	);
}
