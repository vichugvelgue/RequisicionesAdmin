# Estrategia de generación: kind = "parent_sin_submenu"

Aplicar cuando el MenuSpec tiene `kind === "parent_sin_submenu"`. Añade una opción de primer nivel sin hijos (SidebarItem). Opcionalmente navega a una vista si parent.viewId está definido.

1. **menuData.jsx**
   - En `src/data/menuData.jsx`, importar el icono desde `lucide-react` (ej. `import { BarChart2 } from 'lucide-react'` si no está ya).
   - Añadir a `SIDEBAR_ITEMS` un objeto: `{ icon: <parent.icon className="w-5 h-5" />, label: parent.label }`. Si existe parent.viewId, añadir también `viewId: parent.viewId`.

2. **Sidebar.jsx**
   - El sidebar ya renderiza SIDEBAR_ITEMS con SidebarItem. Si existe parent.viewId: asegurar que el .map de SIDEBAR_ITEMS pasa `onClick={() => setActiveView(item.viewId)}` e `isActive={activeView === item.viewId}` cuando `item.viewId` exista. Si ya está implementado, no cambiar.
   - Si no hay viewId, el nuevo ítem aparecerá en el .map sin navegación.

3. **App.jsx**
   - Solo si parent.viewId está definido: importar la vista correspondiente a parent.viewId y añadir la rama `activeView === parent.viewId && <Vista setActiveView={setActiveView} />`.

Archivos: `src/data/menuData.jsx`, `src/components/layout/Sidebar.jsx` (si hay viewId), `src/App.jsx` (si hay viewId).
