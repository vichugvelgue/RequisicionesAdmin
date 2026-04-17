import React from "react";
import { Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { DashboardView } from "./views/DashboardView";
import {
	ComponentesInputsView,
	ComponentesSearchableSelectView,
	ComponentesButtonsView,
	ComponentesDisplayLabelView,
	ComponentesTablesView,
	ComponentesInfiniteScrollView,
	ComponentesLayoutView,
	ComponentesFeedbackView,
	ComponentesTabsView,
	ComponentesFileUploadView,
} from "./modules/componentes";
import { CatalogoInlineView, EjemplosListadoFormView } from "./modules/ejemplos";
import {
	ActividadView,
	ClavePresupuestalObjetoGastoView,
	OrigenRecursoView,
	TipoProgramaView,
	UnidadMedidaView,
	UnidadSolicitanteView,
} from "./modules/catalogos";

function App() {
	return (
		<Routes>
			<Route path="/" element={<MainLayout />}>
				<Route index element={<DashboardView />} />
				<Route path="componentes/inputs" element={<ComponentesInputsView />} />
				<Route
					path="componentes/searchable-select"
					element={<ComponentesSearchableSelectView />}
				/>
				<Route path="componentes/buttons" element={<ComponentesButtonsView />} />
				<Route path="componentes/labels" element={<ComponentesDisplayLabelView />} />
				<Route path="componentes/tablas" element={<ComponentesTablesView />} />
				<Route
					path="componentes/infinite-scroll"
					element={<ComponentesInfiniteScrollView />}
				/>
				<Route path="componentes/layout" element={<ComponentesLayoutView />} />
				<Route path="componentes/tabs" element={<ComponentesTabsView />} />
				<Route path="componentes/feedback" element={<ComponentesFeedbackView />} />
				<Route path="componentes/file-upload" element={<ComponentesFileUploadView />} />
				<Route path="ejemplos/catalogo-inline" element={<CatalogoInlineView />} />
				<Route path="ejemplos/listado-form" element={<EjemplosListadoFormView />} />
				<Route path="ejemplos/listado-form/nuevo" element={<EjemplosListadoFormView />} />
				<Route path="ejemplos/listado-form/:id" element={<EjemplosListadoFormView />} />
				<Route path="catalogos/actividad" element={<ActividadView />} />
				<Route
					path="catalogos/clave-presupuestal-objeto-gasto"
					element={<ClavePresupuestalObjetoGastoView />}
				/>
				<Route path="catalogos/origen-recurso" element={<OrigenRecursoView />} />
				<Route path="catalogos/tipo-programa" element={<TipoProgramaView />} />
				<Route path="catalogos/unidad-medida" element={<UnidadMedidaView />} />
				<Route
					path="catalogos/unidad-solicitante"
					element={<UnidadSolicitanteView />}
				/>
			</Route>
		</Routes>
	);
}

export default App;
