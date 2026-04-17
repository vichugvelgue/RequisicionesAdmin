# Estrategia de generación: kind = "parent_con_submenu_y_vistas"

Aplicar cuando el MenuSpec tiene `kind === "parent_con_submenu_y_vistas"`. Genera padre expandible + N hijos + N vistas con layout base (patrón Requisiciones) en un módulo nuevo.

1. **menuData.jsx**
   - Crear constante {{NOMBRE_PADRE}}_SUBMENU (UPPER_SNAKE) con el array de `{ id, label }` extraído de parent.submenu (solo id y label para menuData).
   - Exportar la constante. Importar el icono desde lucide-react.

2. **Sidebar.jsx**
   - Importar el icono y la nueva constante desde menuData.
   - Añadir estado para abrir/cerrar (is{{NombrePadre}}Open).
   - Insertar el bloque SidebarParentExpandable en la posición parent.position (o después de Compras). icon, label=parent.label, open, onToggle, isActive (startsWith prefijo de ids), children: .map con SidebarSubmenuItem (id, label, isActive, onClick setActiveView).

3. **App.jsx**
   - Por cada elemento de parent.submenu: importar la vista desde el módulo (se crearán en el paso 4) y añadir la rama `activeView === item.id && <Vista setActiveView={setActiveView} />`.

4. **Crear módulo y vistas**
   - Crear carpeta `src/modules/{{nombreModulo}}/` (modulePath o parent.label en minúsculas, ej. inventarios).
   - Para cada ítem de parent.submenu: crear subcarpeta en minúsculas/camelCase (ej. entrada, salida). Dentro, archivo `{{item.id}}View.tsx` con layout base (patrón Requisiciones):
     - Wrapper raíz: div flex-1 flex flex-col min-h-0 bg-slate-50 p-4 lg:p-6 overflow-auto.
     - PageCard con ViewHeader (title = item.tituloPagina o item.label; action = Button con Plus y texto item.textoBotonAccion o "Acción principal"), divisor border-b border-slate-200, zona de contenido "Aquí agrega el contenido".
     - No incluir: h1 fuera de la card, descripción, BackLink, FormSection.
     - Imports: PageCard, ViewHeader, Button desde `../../../components/UI`; Plus desde lucide-react; SetActiveViewProps desde `../../../components/UI/types`.
   - Crear `src/modules/{{nombreModulo}}/index.ts` que exporte todas las vistas: `export { Vista1 } from './subcarpeta1';` etc.

Archivos: `src/data/menuData.jsx`, `src/components/layout/Sidebar.jsx`, `src/App.jsx`, `src/modules/{{nombreModulo}}/{{subcarpeta}}/{{id}}View.tsx` (por cada hijo), `src/modules/{{nombreModulo}}/index.ts`.
