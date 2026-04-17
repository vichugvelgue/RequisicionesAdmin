# Crear opción padre + hijos + vistas base

Genera de una vez un **padre expandible** con N subopciones y, **para cada subopción**, el archivo de vista con el layout estándar (patrón Requisiciones: PageCard, ViewHeader con título y botón de acción, divisor, leyenda "Aquí agrega el contenido"). Combina crear_padre_con_submenu con la generación de N vistas.

## Input

| Parámetro       | Descripción                                                                                                                                 |
|-----------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| `NOMBRE_PADRE`  | Nombre del ítem expandible (ej. Inventarios).                                                                                              |
| `NOMBRE_ICONO`  | Icono Lucide para el padre (ej. Package, Folder).                                                                                          |
| `SUBMENU`       | Array de objetos: `{ id, label, tituloPagina?, textoBotonAccion? }`. `id` = activeView. `tituloPagina` (opcional) = título en ViewHeader; si se omite, usar `label`. `textoBotonAccion` (opcional) = texto del botón (ej. "Nueva Entrada"); por defecto "Acción principal". |
| `RUTA_MODULO`   | (Opcional) Ruta del módulo padre (ej. `modules/inventarios`). Por defecto `modules/{{nombrePadreEnMinusculas}}`.                            |
| `UBICACION`     | (Opcional) Dónde insertar el bloque en el Sidebar. Formato: "después de &lt;referencia&gt;" o "antes de &lt;referencia&gt;". Referencias válidas: "Dashboard", "Componentes", "división Módulos", "Compras", "Inventarios", "lista SIDEBAR_ITEMS", "división Generado con prompts". Si no se indica, por defecto: después de Compras. |

## Prompt

1. **menuData.jsx**
   - Crear constante `{{NOMBRE_PADRE}}_SUBMENU` (en UPPER_SNAKE según el nombre, ej. INVENTARIOS_SUBMENU) con el array de `{ id, label }` extraído de SUBMENU (solo id y label para menuData).
   - Exportar la constante. Importar el icono desde `lucide-react` si hace falta; el padre usará el icono en Sidebar.

2. **Sidebar.jsx**
   - Importar el icono y la nueva constante desde menuData.
   - Añadir estado para abrir/cerrar, ej. `const [is{{NombrePadre}}Open, setIs{{NombrePadre}}Open] = useState(false);`.
   - **Insertar** el bloque `<SidebarParentExpandable>...</SidebarParentExpandable>` en la posición indicada por UBICACION (ver referencias arriba). Si UBICACION no se proporciona, insertar después de Compras.
   - El bloque debe tener: `icon`, `label="{{NOMBRE_PADRE}}"`, `open`, `onToggle`, `isActive={activeView.startsWith('{{PrefijoId}}')}` (prefijo según convenio de ids, ej. 'Inventarios'), y `children`: un .map del array del submenú que renderice `<SidebarSubmenuItem key={item.id} id={item.id} label={item.label} isActive={activeView === item.id} onClick={() => setActiveView(item.id)} />`.

3. **App.jsx**
   - Por cada elemento del SUBMENU: importar la vista correspondiente desde el módulo (se crearán en el paso 4) y añadir la rama `activeView === 'item.id' && <Vista setActiveView={setActiveView} />`.

4. **Crear módulo y vistas**
   - Crear carpeta `src/modules/{{nombrePadre}}/` (nombre en minúsculas, ej. inventarios).
   - Para cada ítem del SUBMENU: crear subcarpeta en minúsculas/camelCase (ej. entrada, salida). Dentro, archivo `{{item.id}}View.tsx` (ej. InventariosEntradaView.tsx) con el **layout base (patrón Requisiciones)**:
     - **Wrapper raíz:** `<div className="flex-1 flex flex-col min-h-0 bg-slate-50 p-4 lg:p-6 overflow-auto">`.
     - **PageCard** con:
       - **ViewHeader** con `title` = tituloPagina o label del ítem, y `action` = `<Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>{{textoBotonAccion o "Acción principal"}}</Button>`.
       - **Divisor:** `<div className="border-b border-slate-200" />`.
       - **Zona de contenido:** `<div className="p-5 text-sm text-slate-500">Aquí agrega el contenido</div>`.
     - No incluir: h1 fuera de la card, párrafo de descripción, BackLink, FormSection.
     - Imports: PageCard, ViewHeader, Button desde `../../../components/UI`; Plus desde `lucide-react`; SetActiveViewProps desde `../../../components/UI/types`.
   - Crear `src/modules/{{nombrePadre}}/index.ts` que exporte todas las vistas: `export { Vista1 } from './subcarpeta1'; export { Vista2 } from './subcarpeta2'; ...`.

Archivos: `src/data/menuData.jsx`, `src/components/layout/Sidebar.jsx`, `src/App.jsx`, `src/modules/{{nombrePadre}}/{{subcarpeta}}/{{id}}View.tsx` (por cada hijo), `src/modules/{{nombrePadre}}/index.ts`.
