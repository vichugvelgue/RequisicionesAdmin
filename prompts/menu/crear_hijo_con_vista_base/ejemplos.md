# Ejemplos de invocación – Crear hijo con vista base

## Ejemplo 1: Nueva opción Modals bajo Componentes con vista generada

**Invocación:**  
Usa prompts/menu/crear_hijo_con_vista_base/prompt.md

**Input:**
- PADRE = Componentes
- VIEW_ID = ComponentesModals
- LABEL = Modals
- TITULO_PAGINA = Modals
- DESCRIPCION = Componentes de modal (ConfirmModal, etc.).

**Resultado:**
- En menuData se añade a `COMPONENTES_SUBMENU` la entrada `{ id: 'ComponentesModals', label: 'Modals' }`.
- En App se importa `ComponentesModalsView` desde `./modules/componentes` y se añade la rama para `activeView === 'ComponentesModals'`.
- Se crea `src/modules/componentes/modals/ComponentesModalsView.tsx` con el layout base (wrapper, título, BackLink, PageCard, ViewHeader, FormSection con "Contenido").
- En `src/modules/componentes/index.ts` se añade `export { ComponentesModalsView } from './modals';`.

---

## Ejemplo 2: Nueva opción bajo Componentes sin descripción

**Invocación:**  
Usa prompts/menu/crear_hijo_con_vista_base/prompt.md

**Input:**
- PADRE = Componentes
- VIEW_ID = ComponentesDialogs
- LABEL = Dialogs
- TITULO_PAGINA = Dialogs

**Resultado:** Entrada en COMPONENTES_SUBMENU, rama en App, nuevo archivo `src/modules/componentes/dialogs/ComponentesDialogsView.tsx` con layout base (sin párrafo de descripción), y export en `modules/componentes/index.ts`.
