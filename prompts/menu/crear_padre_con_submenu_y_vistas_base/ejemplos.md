# Ejemplos de invocación – Crear padre con submenú y vistas base

## Ejemplo 1: Inventarios con Entrada y Salida y vistas generadas

**Invocación:**  
Usa prompts/menu/crear_padre_con_submenu_y_vistas_base/prompt.md

**Input:**
- NOMBRE_PADRE = Inventarios
- NOMBRE_ICONO = Package
- SUBMENU = [
  { id: 'InventariosEntrada', label: 'Entrada', tituloPagina: 'Entrada de inventario', textoBotonAccion: 'Nueva Entrada' },
  { id: 'InventariosSalida', label: 'Salida', tituloPagina: 'Salida de inventario' }
]
- RUTA_MODULO = modules/inventarios (opcional)

**Resultado:**
- En menuData: constante INVENTARIOS_SUBMENU con `[{ id: 'InventariosEntrada', label: 'Entrada' }, { id: 'InventariosSalida', label: 'Salida' }]`.
- En Sidebar: bloque SidebarParentExpandable "Inventarios" con icono Package, estado isInventariosOpen, dos SidebarSubmenuItem (Entrada, Salida). Por defecto insertado después de Compras.
- En App: ramas para InventariosEntrada y InventariosSalida con InventariosEntradaView e InventariosSalidaView importadas desde `./modules/inventarios`.
- Se crea `src/modules/inventarios/entrada/InventariosEntradaView.tsx` y `src/modules/inventarios/salida/InventariosSalidaView.tsx`, cada uno con layout patrón Requisiciones (PageCard, ViewHeader título+action, divisor, "Aquí agrega el contenido").
- Se crea `src/modules/inventarios/index.ts` con `export { InventariosEntradaView } from './entrada'; export { InventariosSalidaView } from './salida';`.

---

## Ejemplo 2: Almacenes con un solo hijo

**Invocación:**  
Usa prompts/menu/crear_padre_con_submenu_y_vistas_base/prompt.md

**Input:**
- NOMBRE_PADRE = Almacenes
- NOMBRE_ICONO = Warehouse
- SUBMENU = [{ id: 'AlmacenesListado', label: 'Listado' }]

**Resultado:** Constante ALMACENES_SUBMENU, bloque en Sidebar, rama en App para AlmacenesListado, archivo `src/modules/almacenes/listado/AlmacenesListadoView.tsx` con layout patrón Requisiciones (título "Listado"), y index.ts exportando la vista.

---

## Ejemplo 3: Módulo con UBICACION (después de división Módulos)

**Invocación:**  
Usa prompts/menu/crear_padre_con_submenu_y_vistas_base/prompt.md

**Input:**
- NOMBRE_PADRE = Tesorería
- NOMBRE_ICONO = Wallet
- SUBMENU = [{ id: 'TesoreriaMovimientos', label: 'Movimientos', tituloPagina: 'Movimientos de tesorería' }]
- UBICACION = después de división Módulos

**Resultado:** Constante TESORERIA_SUBMENU, bloque SidebarParentExpandable "Tesorería" insertado **justo después** de `<SidebarDivision text="Módulos" />` (antes de Compras). Vista en `src/modules/tesoreria/movimientos/TesoreriaMovimientosView.tsx` con layout patrón Requisiciones.
