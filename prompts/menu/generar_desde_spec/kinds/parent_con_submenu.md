# Estrategia de generación: kind = "parent_con_submenu"

Aplicar cuando el MenuSpec tiene `kind === "parent_con_submenu"`. Añade un padre expandible con N hijos (SidebarParentExpandable + SidebarSubmenuItem). No genera vistas.

1. **menuData.jsx**
   - En `src/data/menuData.jsx`, crear una constante nueva (ej. INVENTARIOS_SUBMENU) con el nombre en UPPER_SNAKE según parent.label + "_SUBMENU", con el array de `{ id, label }` de parent.submenu.
   - Exportar la constante. Importar el icono desde lucide-react si hace falta.

2. **Sidebar.jsx**
   - Importar el icono y la nueva constante desde menuData.
   - Añadir estado para abrir/cerrar, ej. `const [is{{NombrePadre}}Open, setIs{{NombrePadre}}Open] = useState(false);` (NombrePadre en PascalCase derivado de parent.label).
   - Insertar el bloque `<SidebarParentExpandable>` en la posición indicada por parent.position (si existe; si no, después de Compras). El bloque debe tener:
     - icon = `<parent.icon className="w-4 h-4" />`
     - label = parent.label
     - open, onToggle con el estado anterior
     - isActive = activeView.startsWith('Prefijo') (prefijo según convenio de ids del submenú, ej. 'Inventarios')
     - children: .map del array del submenú con `<SidebarSubmenuItem key={item.id} id={item.id} label={item.label} isActive={activeView === item.id} onClick={() => setActiveView(item.id)} />`

3. **App.jsx**
   - Por cada elemento de parent.submenu: importar la vista correspondiente (el usuario debe tenerla o crearla aparte; este kind no genera vistas) y añadir la rama `activeView === item.id && <Vista setActiveView={setActiveView} />`. Si las vistas no existen aún, dejar el import y la rama apuntando al id; el desarrollador creará los componentes.

Archivos: `src/data/menuData.jsx`, `src/components/layout/Sidebar.jsx`, `src/App.jsx`.
