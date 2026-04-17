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
			</Route>
		</Routes>
	);
}

export default App;
