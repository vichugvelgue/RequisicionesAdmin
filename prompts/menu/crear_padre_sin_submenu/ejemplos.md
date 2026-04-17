# Ejemplos de invocación – Crear padre sin submenú

## Ejemplo 1: Reportes con navegación

**Invocación:**  
Usa prompts/menu/crear_padre_sin_submenu/prompt.md

**Input:**
- LABEL = Reportes
- NOMBRE_ICONO = BarChart2
- VIEW_ID = Reportes

**Resultado:** En menuData se añade el ítem con icono BarChart2, label "Reportes" y viewId "Reportes". En Sidebar se pasa onClick e isActive para ítems con viewId. En App se añade la condición para la vista Reportes.

---

## Ejemplo 2: Solo mostrar (sin navegación)

**Invocación:**  
Usa prompts/menu/crear_padre_sin_submenu/prompt.md

**Input:**
- LABEL = Contabilidad
- NOMBRE_ICONO = BookOpen

**Resultado:** En menuData se añade el ítem. Aparece en el sidebar con el resto de SIDEBAR_ITEMS; no navega a ninguna vista.
