# Crear opción hija con vista base

Añade una subopción a un padre existente (ej. bajo "Componentes") y **genera el archivo de la vista** con el layout estándar (patrón Requisiciones: PageCard, ViewHeader con título y botón de acción, divisor, leyenda "Aquí agrega el contenido"). El menú y la rama en App se crean igual que en `crear_hijo`; además se crea el componente de vista en el módulo correspondiente.

## Input

| Parámetro            | Descripción                                                                                                                                  |
|----------------------|----------------------------------------------------------------------------------------------------------------------------------------------|
| `PADRE`              | Padre en menú: "Componentes" (o otro que use `{ id, label }`).                                                                               |
| `VIEW_ID`            | Id de vista (ej. ComponentesModals). Coincide con `activeView`.                                                                               |
| `LABEL`              | Texto en el menú (ej. Modals).                                                                                                               |
| `TITULO_PAGINA`      | Título en el ViewHeader (ej. "Modals").                                                                                                      |
| `TEXTO_BOTON_ACCION` | (Opcional) Texto del botón de acción (ej. "Nueva Requisición"). Por defecto "Acción principal".                                              |
| `RUTA_MODULO`        | (Opcional) Ruta del módulo donde crear la vista (por defecto `modules/componentes`). La subcarpeta se derivará del VIEW_ID o LABEL (ej. modals). |

## Prompt

1. **Menú y App (igual que crear_hijo):**
   - En `src/data/menuData.jsx`, añadir al array del padre (ej. COMPONENTES_SUBMENU) el objeto `{ id: '{{VIEW_ID}}', label: '{{LABEL}}' }`.
   - En `src/App.jsx`: importar la nueva vista desde el módulo (se creará en el paso 2) y añadir la rama `activeView === '{{VIEW_ID}}' && <Vista setActiveView={setActiveView} />`.

2. **Crear el archivo de la vista** en `src/modules/{{nombreModulo}}/{{subcarpeta}}/`:
   - `nombreModulo`: si RUTA_MODULO es `modules/componentes`, usar `componentes`. Si es otro (ej. `modules/inventarios`), usar esa carpeta.
   - `subcarpeta`: derivar de LABEL en camelCase/minúsculas (ej. "Modals" → `modals`, "SearchableSelect" → `searchableSelect`).
   - Nombre del archivo: `{{VIEW_ID}}View.tsx` (ej. ComponentesModalsView.tsx).
   - Nombre del componente: mismo que el archivo sin extensión.

   **Layout base (patrón Requisiciones – estructura fija a generar):**
   - **Wrapper raíz:** `<div className="flex-1 flex flex-col min-h-0 bg-slate-50 p-4 lg:p-6 overflow-auto">`.
   - **PageCard** con:
     - **ViewHeader** con `title="{{TITULO_PAGINA}}"` y `action={<Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>{{TEXTO_BOTON_ACCION o "Acción principal"}}</Button>}`.
     - **Divisor:** `<div className="border-b border-slate-200" />`.
     - **Zona de contenido:** `<div className="p-5 text-sm text-slate-500">Aquí agrega el contenido</div>`.
   - No incluir: h1 fuera de la card, párrafo de descripción, BackLink, FormSection.
   - Props del componente: `SetActiveViewProps` (importar desde la ruta relativa a `components/UI/types`, ej. `../../../components/UI/types` desde la subcarpeta del módulo).
   - Imports: PageCard, ViewHeader, Button desde la ruta relativa a `components/UI` (ej. `../../../components/UI`); Plus desde `lucide-react`.

3. **Exportar la vista** desde el index del módulo: en `src/modules/{{nombreModulo}}/index.ts`, añadir `export { {{NombreVista}} } from './{{subcarpeta}}';`.

Archivos: `src/data/menuData.jsx`, `src/App.jsx`, `src/modules/{{nombreModulo}}/{{subcarpeta}}/{{VIEW_ID}}View.tsx`, `src/modules/{{nombreModulo}}/index.ts`.
