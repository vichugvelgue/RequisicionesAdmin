import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, X } from "lucide-react";

import {
	SidebarSubmenuItem,
	SidebarParentExpandable,
	SidebarItem,
} from "./sidebar/index.js";
import { COMPONENTES_SUBMENU } from "../../data/menuData";

const COMPONENTES_PATH_MAP = {
	ComponentesInputs: "/componentes/inputs",
	ComponentesSearchableSelect: "/componentes/searchable-select",
	ComponentesButtons: "/componentes/buttons",
	ComponentesDisplayLabel: "/componentes/labels",
	ComponentesTables: "/componentes/tablas",
	ComponentesInfiniteScroll: "/componentes/infinite-scroll",
	ComponentesLayout: "/componentes/layout",
	ComponentesTabs: "/componentes/tabs",
	ComponentesFeedback: "/componentes/feedback",
	ComponentesFileUpload: "/componentes/file-upload",
};

export function Sidebar({ isSidebarOpen, setIsSidebarOpen }) {
	const location = useLocation();
	const navigate = useNavigate();
	const pathname = location.pathname;

	const [isComponentesOpen, setIsComponentesOpen] = useState(false);

	const isComponentesActive = pathname.startsWith("/componentes");

	const handleNav = (path) => {
		navigate(path);
		if (typeof window !== "undefined" && window.innerWidth < 1024) {
			setIsSidebarOpen?.(false);
		}
	};

	return (
		<>
			{isSidebarOpen && (
				<div
					className="fixed inset-0 bg-slate-800/40 backdrop-blur-sm z-40 lg:hidden"
					onClick={() => setIsSidebarOpen(false)}
				/>
			)}

			<aside
				data-sidebar
				className={`fixed inset-y-0 left-0 z-50 w-60 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out shadow-lg lg:shadow-none ${
					isSidebarOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<div className="h-14 flex items-center px-5 border-b border-slate-200 bg-slate-50/50">
					<div className="flex items-center gap-2.5 text-blue-600">
						<div className="bg-blue-600 text-white p-1 rounded">
							<LayoutDashboard className="w-4 h-4" />
						</div>
						<span className="font-bold text-lg text-slate-800 tracking-tight">
							NexERP
						</span>
					</div>
					<button
						type="button"
						onClick={() => setIsSidebarOpen(false)}
						className="ml-auto text-slate-400 hover:text-slate-600 lg:hidden p-1"
					>
						<X className="w-4 h-4" />
					</button>
				</div>

				<div className="flex-1 overflow-y-auto py-3 px-2 flex flex-col gap-0.5 custom-scrollbar bg-slate-50/20">
					<SidebarItem
						icon={<LayoutDashboard className="w-4 h-4" />}
						label="Dashboard"
						onClick={() => handleNav("/")}
						isActive={pathname === "/"}
					/>

					<SidebarParentExpandable
						icon={<LayoutDashboard className="w-4 h-4" />}
						label="Componentes"
						open={isComponentesOpen}
						onToggle={() => setIsComponentesOpen(!isComponentesOpen)}
						isActive={isComponentesActive}
					>
						{COMPONENTES_SUBMENU.map((item) => {
							const path = COMPONENTES_PATH_MAP[item.id];
							return (
								<SidebarSubmenuItem
									key={item.id}
									id={item.id}
									label={item.label}
									isActive={pathname === path}
									onClick={() => path && handleNav(path)}
								/>
							);
						})}
					</SidebarParentExpandable>
				</div>
			</aside>
		</>
	);
}
