# Ejemplos de invocación – Crear padre sin submenú con vista base

## Ejemplo 1: Reportes como opción de primer nivel con vista

**Invocación:**  
Usa prompts/menu/crear_padre_sin_submenu_con_vista_base/prompt.md

**Input:**
- LABEL = Reportes
- NOMBRE_ICONO = BarChart2
- VIEW_ID = Reportes
- TITULO_PAGINA = Reportes
- DESCRIPCION = Consulta de reportes del sistema.

**Resultado:**
- En menuData se añade a SIDEBAR_ITEMS `{ icon: <BarChart2 className="w-5 h-5" />, label: 'Reportes', viewId: 'Reportes' }`.
- En Sidebar el ítem navega con setActiveView('Reportes') cuando exista viewId.
- En App se importa ReportesView desde `./modules/reportes` y se añade la rama para activeView === 'Reportes'.
- Se crea `src/modules/reportes/ReportesView.tsx` con layout base y `src/modules/reportes/index.ts` exportando la vista.

---

## Ejemplo 2: Contabilidad con RUTA_MODULO explícita

**Invocación:**  
Usa prompts/menu/crear_padre_sin_submenu_con_vista_base/prompt.md

**Input:**
- LABEL = Contabilidad
- NOMBRE_ICONO = FileText
- VIEW_ID = Contabilidad
- TITULO_PAGINA = Módulo Contabilidad
- RUTA_MODULO = modules/contabilidad

**Resultado:** Ítem en SIDEBAR_ITEMS con viewId 'Contabilidad', rama en App, carpeta `src/modules/contabilidad/` con ContabilidadView.tsx y index.ts.
