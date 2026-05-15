import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ClipboardList, LayoutDashboard, Package, Users, BarChart3 } from "lucide-react";

import {
	SidebarSubmenuItem,
	SidebarParentExpandable,
	SidebarItem,
} from "./sidebar/index.js";
import {
	CATALOGOS_SUBMENU,
	COMPONENTES_SUBMENU,
	EJEMPLOS_SUBMENU,
	USUARIOS_SUBMENU,
	REQUISICIONES_SUBMENU,
	REPORTES_SUBMENU,
} from "../../data/menuData";
import { useAuth, canAccessCatalogosUsuarios } from "../../auth";

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

const EJEMPLOS_PATH_MAP = {
	EjemplosCatalogoInline: "/ejemplos/catalogo-inline",
	EjemplosListadoForm: "/ejemplos/listado-form",
};

const USUARIOS_PATH_MAP = {
	UsuariosListado: "/usuarios",
};

const REQUISICIONES_PATH_MAP = {
	RequisicionesAdquisicionBienes: "/requisiciones/adquisicion-bienes",
	RequisicionesContratacionServicios: "/requisiciones/contratacion-servicios",
};

const REPORTES_PATH_MAP = {
	ReportesRequisiciones: "/reportes/reporte-requisiciones",
};

const CATALOGOS_PATH_MAP = {
	CatalogosActividad: "/catalogos/actividad",
	CatalogosComponente: "/catalogos/componente",
	CatalogosClavePresupuestalObjetoGasto: "/catalogos/clave-presupuestal-objeto-gasto",
	CatalogosOrigenRecurso: "/catalogos/origen-recurso",
	CatalogosTipoPrograma: "/catalogos/tipo-programa",
	CatalogosUnidadMedida: "/catalogos/unidad-medida",
	CatalogosUnidadSolicitante: "/catalogos/unidad-solicitante",
};

export function Sidebar({ isSidebarOpen }) {
	const { user } = useAuth();
	const location = useLocation();
	const navigate = useNavigate();
	const pathname = location.pathname;
	const showCatalogosUsuarios = canAccessCatalogosUsuarios(user?.tipoPerfil);

	const [isComponentesOpen, setIsComponentesOpen] = useState(false);
	const [isEjemplosOpen, setIsEjemplosOpen] = useState(false);
	const [isCatalogosOpen, setIsCatalogosOpen] = useState(false);
	const [isUsuariosOpen, setIsUsuariosOpen] = useState(false);
	const [isRequisicionesOpen, setIsRequisicionesOpen] = useState(false);
	const [isReportesOpen, setIsReportesOpen] = useState(false);

	const isComponentesActive = pathname.startsWith("/componentes");
	const isEjemplosActive = pathname.startsWith("/ejemplos");
	const isUsuariosActive = pathname.startsWith("/usuarios");
	const isRequisicionesActive = pathname.startsWith("/requisiciones");
	const isCatalogosActive = pathname.startsWith("/catalogos");
	const isReportesActive = pathname.startsWith("/reportes");
	const showComponentesMenu = import.meta.env.VITE_SHOW_COMPONENTES === "true";
	const showExamplesMenu = import.meta.env.VITE_SHOW_EXAMPLES === "true";

	const handleNav = (path) => {
		navigate(path);
	};

	return (
		<aside
			data-sidebar
			className="fixed inset-y-0 left-0 z-50 w-60 bg-brand-white border-r border-brand-neutral/20 flex flex-col shadow-lg lg:shadow-none"
		>
			<div className="h-14 flex items-center px-5 border-b border-brand-neutral/20 bg-brand-secondary/15">
				<div className="flex items-center gap-2.5 text-brand-primary">
					<div className="bg-brand-primary text-brand-white p-1 rounded">
						<LayoutDashboard className="w-4 h-4" />
					</div>
					<span className="font-bold text-lg text-brand-neutral tracking-tight">
						CUAUTLANCINGO
					</span>
				</div>
			</div>

				<div className="flex-1 overflow-y-auto py-3 px-2 flex flex-col gap-0.5 custom-scrollbar bg-brand-secondary/10">
					{showComponentesMenu ? (
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
					) : null}

					{showExamplesMenu ? (
						<SidebarParentExpandable
							icon={<LayoutDashboard className="w-4 h-4" />}
							label="Ejemplos"
							open={isEjemplosOpen}
							onToggle={() => setIsEjemplosOpen(!isEjemplosOpen)}
							isActive={isEjemplosActive}
						>
							{EJEMPLOS_SUBMENU.map((item) => {
								const path = EJEMPLOS_PATH_MAP[item.id];
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
					) : null}
					<SidebarParentExpandable
						icon={<ClipboardList className="w-4 h-4" />}
						label="Requisiciones"
						open={isRequisicionesOpen}
						onToggle={() => setIsRequisicionesOpen(!isRequisicionesOpen)}
						isActive={isRequisicionesActive}
					>
						{REQUISICIONES_SUBMENU.map((item) => {
							const path = REQUISICIONES_PATH_MAP[item.id];
							return (
								<SidebarSubmenuItem
									key={item.id}
									id={item.id}
									label={item.label}
									isActive={pathname === path || pathname.startsWith(`${path}/`)}
									onClick={() => path && handleNav(path)}
								/>
							);
						})}
					</SidebarParentExpandable>				{showCatalogosUsuarios ? (
					<SidebarParentExpandable
						icon={<BarChart3 className="w-4 h-4" />}
						label="Reportes"
						open={isReportesOpen}
						onToggle={() => setIsReportesOpen(!isReportesOpen)}
						isActive={isReportesActive}
					>
						{REPORTES_SUBMENU.map((item) => {
							const path = REPORTES_PATH_MAP[item.id];
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
				) : null}					{showCatalogosUsuarios ? (
						<SidebarParentExpandable
							icon={<Package className="w-4 h-4" />}
							label="Catálogos"
							open={isCatalogosOpen}
							onToggle={() => setIsCatalogosOpen(!isCatalogosOpen)}
							isActive={isCatalogosActive}
						>
							{CATALOGOS_SUBMENU.map((item) => {
								const path = CATALOGOS_PATH_MAP[item.id];
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
					) : null}
					{showCatalogosUsuarios ? (
						<SidebarParentExpandable
							icon={<Users className="w-4 h-4" />}
							label="Usuarios"
							open={isUsuariosOpen}
							onToggle={() => setIsUsuariosOpen(!isUsuariosOpen)}
							isActive={isUsuariosActive}
						>
							{USUARIOS_SUBMENU.map((item) => {
								const path = USUARIOS_PATH_MAP[item.id];
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
					) : null}
				</div>
			</aside>
	);
}
