# Estrategia de generación: kind = "parent_sin_submenu_con_vista"

Aplicar cuando el MenuSpec tiene `kind === "parent_sin_submenu_con_vista"`. Añade un padre de primer nivel que navega a una vista y genera esa vista con layout base (patrón Requisiciones).

1. **menuData.jsx**
   - Importar el icono desde `lucide-react`.
   - Añadir a SIDEBAR_ITEMS: `{ icon: <parent.icon className="w-5 h-5" />, label: parent.label, viewId: parent.viewId }`.

2. **Sidebar.jsx**
   - Asegurar que el .map de SIDEBAR_ITEMS pasa `onClick={() => setActiveView(item.viewId)}` e `isActive={activeView === item.viewId}` cuando `item.viewId` exista. Si ya está implementado, no cambiar.

3. **App.jsx**
   - Importar la vista desde el módulo (se creará en el paso 4) y añadir la rama `activeView === parent.viewId && <Vista setActiveView={setActiveView} />`.

4. **Crear módulo y vista**
   - Crear carpeta `src/modules/{{nombreModulo}}/` (nombre a partir de view.modulePath o parent.label en minúsculas, ej. reportes).
   - Crear archivo `src/modules/{{nombreModulo}}/{{parent.viewId}}View.tsx` (o nombre PascalCase según viewId). Layout base (patrón Requisiciones):
     - Wrapper raíz: `<div className="flex-1 flex flex-col min-h-0 bg-slate-50 p-4 lg:p-6 overflow-auto">`.
     - PageCard con ViewHeader (title = view.title; action = Button con Plus y texto view.buttonAction o "Acción principal"), divisor `<div className="border-b border-slate-200" />`, y `<div className="p-5 text-sm text-slate-500">Aquí agrega el contenido</div>`.
     - No incluir: h1 fuera de la card, descripción, BackLink, FormSection.
   - Props: SetActiveViewProps. Imports: PageCard, ViewHeader, Button desde `../../components/UI`; Plus desde `lucide-react`.
   - Crear `src/modules/{{nombreModulo}}/index.ts` que exporte la vista.

Archivos: `src/data/menuData.jsx`, `src/components/layout/Sidebar.jsx`, `src/App.jsx`, `src/modules/{{nombreModulo}}/{{parent.viewId}}View.tsx`, `src/modules/{{nombreModulo}}/index.ts`.
