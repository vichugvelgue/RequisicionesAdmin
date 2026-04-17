# Ejemplos de invocación – Crear padre con submenú

## Ejemplo 1: Inventarios con Entrada y Salida

**Invocación:**  
Usa prompts/menu/crear_padre_con_submenu/prompt.md

**Input:**
- NOMBRE_PADRE = Inventarios
- NOMBRE_ICONO = Package
- SUBMENU = `[{ id: 'InventariosEntrada', label: 'Entrada' }, { id: 'InventariosSalida', label: 'Salida' }]`

**Resultado:** En menuData se crea `INVENTARIOS_SUBMENU`. En Sidebar se añade estado `isInventariosOpen`, un `<SidebarParentExpandable>` con icono Package y label "Inventarios", y dentro dos `<SidebarSubmenuItem>` para Entrada y Salida. En App se añaden las condiciones para InventariosEntrada e InventariosSalida.

---

## Ejemplo 2: Reportes con tres subopciones

**Invocación:**  
Usa prompts/menu/crear_padre_con_submenu/prompt.md

**Input:**
- NOMBRE_PADRE = Reportes
- NOMBRE_ICONO = BarChart2
- SUBMENU = `[{ id: 'ReportesVentas', label: 'Ventas' }, { id: 'ReportesCompras', label: 'Compras' }, { id: 'ReportesInventario', label: 'Inventario' }]`

**Resultado:** Nueva constante REPORTES_SUBMENU, bloque expandible "Reportes" en Sidebar con tres hijos, y tres ramas en App para las vistas correspondientes.
