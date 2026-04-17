# Crear opción padre (sin submenú) con vista base

Añade una opción de primer nivel que **no tiene subopciones** pero **navega a una vista**, y genera esa vista con el layout estándar (patrón Requisiciones: PageCard, ViewHeader con título y botón de acción, divisor, leyenda "Aquí agrega el contenido"). Cubre el caso "módulo padre sin hijos" (ej. Reportes, Contabilidad).

## Input

| Parámetro            | Descripción                                                                                                   |
|----------------------|---------------------------------------------------------------------------------------------------------------|
| `LABEL`              | Texto en el menú (ej. Reportes).                                                                              |
| `NOMBRE_ICONO`       | Icono Lucide (ej. BarChart2). Ver https://lucide.dev/icons/                                                   |
| `VIEW_ID`            | Id de vista / activeView (ej. Reportes).                                                                       |
| `TITULO_PAGINA`      | Título en el ViewHeader de la página.                                                                         |
| `TEXTO_BOTON_ACCION` | (Opcional) Texto del botón de acción. Por defecto "Acción principal".                                         |
| `RUTA_MODULO`        | (Opcional) Ruta del módulo donde crear la vista (ej. `modules/reportes`). Por defecto `modules/{{labelEnMinusculas}}`. |

## Prompt

1. **menuData.jsx**
   - Importar el icono desde `lucide-react` (ej. `import { BarChart2 } from 'lucide-react'`).
   - Añadir a `SIDEBAR_ITEMS` un objeto: `{ icon: <NOMBRE_ICONO className="w-5 h-5" />, label: '{{LABEL}}', viewId: '{{VIEW_ID}}' }`.

2. **Sidebar.jsx**
   - Asegurar que el .map de SIDEBAR_ITEMS pasa `onClick={() => setActiveView(item.viewId)}` e `isActive={activeView === item.viewId}` cuando `item.viewId` exista. Si ya está implementado, no cambiar.

3. **App.jsx**
   - Importar la vista desde el módulo (se creará en el paso 4) y añadir la rama `activeView === '{{VIEW_ID}}' && <Vista setActiveView={setActiveView} />`.

4. **Crear módulo y vista**
   - Crear carpeta `src/modules/{{nombreModulo}}/` (nombre a partir de RUTA_MODULO o de LABEL en minúsculas, ej. `reportes`).
   - Crear archivo `src/modules/{{nombreModulo}}/{{VIEW_ID}}View.tsx` (o `{{NombrePascal}}View.tsx` si VIEW_ID no es PascalCase). **Layout base (patrón Requisiciones):**
     - **Wrapper raíz:** `<div className="flex-1 flex flex-col min-h-0 bg-slate-50 p-4 lg:p-6 overflow-auto">`.
     - **PageCard** con ViewHeader (title + action con Button + Plus), divisor `<div className="border-b border-slate-200" />`, y `<div className="p-5 text-sm text-slate-500">Aquí agrega el contenido</div>`.
     - No incluir: h1 fuera de la card, descripción, BackLink, FormSection.
   - Props: SetActiveViewProps. Imports: PageCard, ViewHeader, Button desde `../../components/UI`; Plus desde `lucide-react`.
   - Crear `src/modules/{{nombreModulo}}/index.ts` que exporte la vista: `export { NombreVista } from './NombreVista';` (ajustar al nombre del archivo sin extensión).

Archivos: `src/data/menuData.jsx`, `src/components/layout/Sidebar.jsx` (si aplica), `src/App.jsx`, `src/modules/{{nombreModulo}}/{{VIEW_ID}}View.tsx`, `src/modules/{{nombreModulo}}/index.ts`.
