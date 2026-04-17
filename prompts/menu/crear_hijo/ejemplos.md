# Ejemplos de invocación – Crear hijo

## Ejemplo 1: Nueva opción bajo Componentes (Modals)

**Invocación:**  
Usa prompts/menu/crear_hijo/prompt.md

**Input:**
- PADRE = Componentes
- VIEW_ID = ComponentesModals
- LABEL = Modals

**Resultado:** En menuData se añade a `COMPONENTES_SUBMENU` la entrada `{ id: 'ComponentesModals', label: 'Modals' }`. No se toca Sidebar (el .map ya pinta todos los ítems). En App se importa la vista (ej. ComponentesModalsView) y se añade la rama para activeView === 'ComponentesModals'.

---

## Ejemplo 2: Nueva opción bajo Compras

**Invocación:**  
Usa prompts/menu/crear_hijo/prompt.md

**Input:**
- PADRE = Compras
- VIEW_ID = OrdenesCompra
- LABEL = Órdenes de Compra

**Resultado:** En menuData se añade "Ordenes de Compra" (o el string acordado) a `COMPRAS_SUBMENU`. En Sidebar.jsx se añade ese valor al array `COMPRAS_NAVIGABLE` para que el clic llame a setActiveView. En App se añade la rama para la vista OrdenesCompra.
