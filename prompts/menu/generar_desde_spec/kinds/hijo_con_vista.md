# Estrategia de generación: kind = "hijo_con_vista"

Aplicar cuando el MenuSpec tiene `kind === "hijo_con_vista"`. Añade un hijo a un padre existente y genera el archivo de la vista con layout base (patrón Requisiciones).

1. **menuData.jsx**
   - Añadir al array del padre (derivado de parentRef, ej. COMPONENTES_SUBMENU) el objeto `{ id: child.id, label: child.label }`.

2. **App.jsx**
   - Importar la nueva vista desde el módulo (se creará en el paso 3) y añadir la rama `activeView === child.id && <Vista setActiveView={setActiveView} />`.

3. **Crear el archivo de la vista**
   - Ruta: `src/modules/{{nombreModulo}}/{{subcarpeta}}/`. nombreModulo a partir de view.modulePath o parentRef en minúsculas (ej. componentes). subcarpeta derivada de child.label en camelCase/minúsculas (ej. "Modals" → modals).
   - Nombre del archivo: `{{child.id}}View.tsx` (ej. ComponentesModalsView.tsx). Nombre del componente: mismo que el archivo sin extensión.
   - Layout base (patrón Requisiciones): wrapper raíz (flex-1 flex flex-col min-h-0 bg-slate-50 p-4 lg:p-6 overflow-auto), PageCard con ViewHeader (title = view.title; action = Button con Plus y view.buttonAction o "Acción principal"), divisor border-b border-slate-200, zona de contenido "Aquí agrega el contenido". No incluir h1 fuera de la card, descripción, BackLink, FormSection.
   - Props: SetActiveViewProps. Imports: PageCard, ViewHeader, Button desde ruta relativa a components/UI (ej. ../../../components/UI); Plus desde lucide-react.

4. **Exportar la vista**
   - En `src/modules/{{nombreModulo}}/index.ts`, añadir `export { {{NombreVista}} } from './{{subcarpeta}}';`.

Archivos: `src/data/menuData.jsx`, `src/App.jsx`, `src/modules/{{nombreModulo}}/{{subcarpeta}}/{{child.id}}View.tsx`, `src/modules/{{nombreModulo}}/index.ts`.
