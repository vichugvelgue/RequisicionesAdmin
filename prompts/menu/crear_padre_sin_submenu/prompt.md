# Crear opción padre sin submenú

Añade una opción de primer nivel que no se expande (como los ítems de Contabilidad, Inventarios, etc.). Usa datos en `menuData.jsx` y el componente `SidebarItem` en Sidebar. Opcionalmente puede navegar a una vista.

## Input

| Parámetro       | Descripción                                                                 |
|-----------------|-----------------------------------------------------------------------------|
| `LABEL`         | Texto visible en el menú (ej. "Reportes", "Contabilidad").                  |
| `NOMBRE_ICONO`  | Nombre del icono en Lucide (ej. BarChart2, FileText). Ver https://lucide.dev/icons/ |
| `VIEW_ID`       | (Opcional) Id de la vista para navegación. Si se omite, el ítem no navega. |

## Prompt

1. **menuData.jsx**  
   - En `src/data/menuData.jsx`, importar el icono desde `lucide-react` (ej. `import { BarChart2 } from 'lucide-react'`).  
   - Añadir a `SIDEBAR_ITEMS` un objeto: `{ icon: <NOMBRE_ICONO className="w-5 h-5" />, label: '{{LABEL}}' }`. Si hay VIEW_ID, añadir también `viewId: '{{VIEW_ID}}'`.

2. **Sidebar.jsx**  
   - El sidebar ya renderiza `SIDEBAR_ITEMS` con `SidebarItem`. Para que el nuevo ítem navegue cuando exista `VIEW_ID`: en el `.map` de SIDEBAR_ITEMS, pasar `onClick={() => setActiveView(item.viewId)}` e `isActive={activeView === item.viewId}` cuando `item.viewId` exista.  
   - Si no se pasa VIEW_ID, no hace falta cambiar la lógica; el nuevo ítem ya aparecerá en el .map sin navegación.

3. **App.jsx**  
   - Solo si VIEW_ID está definido: importar la vista correspondiente y añadir la rama `activeView === '{{VIEW_ID}}' && <Vista setActiveView={setActiveView} />`.

Archivos: `src/data/menuData.jsx`, `src/components/layout/Sidebar.jsx` (si hay VIEW_ID), `src/App.jsx` (si hay VIEW_ID).
