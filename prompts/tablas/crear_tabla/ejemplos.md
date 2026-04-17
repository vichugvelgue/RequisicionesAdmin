# Ejemplos de invocación – Crear/actualizar vista de tabla

## Ejemplo 1: Tabla simple de catálogo (sin filtros ni paginación)

**Invocación:**  
Usa `prompts/tablas/crear_tabla/prompt.md`

**Input:**
- ARCHIVO_DESTINO = @src/views/catalogos/CatalogoMaterialesView.jsx
- NOMBRE_COMPONENTE_VISTA = CatalogoMaterialesView
- MODO_SALIDA = vista_completa
- TIPO_TABLA = simple
- FUENTE_DATOS = La vista recibe una prop `materiales` que es un arreglo de objetos `{ id, nombre, estatus }`.
- COLUMNAS = [
  { id: 'id', label: 'ID', ordenable: false, usaFiltroInline: false, ancho: 'w-[10%]', tipoCelda: 'texto' },
  { id: 'nombre', label: 'Nombre', ordenable: false, usaFiltroInline: false, ancho: 'w-[60%]', tipoCelda: 'texto' },
  { id: 'estatus', label: 'Estatus', ordenable: false, usaFiltroInline: false, ancho: 'w-[20%]', tipoCelda: 'estatus', usaStatusBadge: true }
]
- USA_BUSQUEDA_GLOBAL = false
- USA_PAGINACION = false
- USA_FILTROS_INLINE = false
- TITULO_PAGINA = Catálogo de materiales

**Resultado esperado (resumen):**
- Se crea (o actualiza) el archivo `src/views/catalogos/CatalogoMaterialesView.jsx` con un componente `CatalogoMaterialesView` que:
  - Usa **`TablePageLayout`** con `title="Catálogo de materiales"` (sin topBar ni acción si no se indican).
  - En `children`, muestra una tabla simple con `DataTable` y las tres columnas configuradas.
  - No incluye búsqueda global, paginación ni filtros por columna.

---

## Ejemplo 2: Tabla con paginación y filtros por columna

**Invocación:**  
Usa `prompts/tablas/crear_tabla/prompt.md`

**Input:**
- ARCHIVO_DESTINO = src/views/tesoreria/PagosView.jsx
- NOMBRE_COMPONENTE_VISTA = PagosView
- MODO_SALIDA = vista_completa
- TIPO_TABLA = con_filtros
- FUENTE_DATOS = La vista maneja un estado `pagos` con registros `{ id, fecha, proveedor, monto, estatus }`.
- COLUMNAS = [
  { id: 'id', label: 'ID', ordenable: true, usaFiltroInline: true, ancho: 'w-[8%]', tipoCelda: 'texto' },
  { id: 'fecha', label: 'Fecha', ordenable: true, usaFiltroInline: true, ancho: 'w-[10%]', tipoCelda: 'texto', transformacionDisplay: 'interpretar como dd/mm/yyyy y permitir ordenamiento por fecha' },
  { id: 'proveedor', label: 'Proveedor', ordenable: true, usaFiltroInline: true, ancho: 'w-[32%] min-w-[200px]', tipoCelda: 'texto' },
  { id: 'monto', label: 'Monto', ordenable: true, usaFiltroInline: true, ancho: 'w-[15%]', tipoCelda: 'texto', transformacionDisplay: 'formato moneda simple' },
  { id: 'estatus', label: 'Estatus', ordenable: false, usaFiltroInline: true, ancho: 'w-[10%]', tipoCelda: 'estatus', usaStatusBadge: true }
]
- USA_BUSQUEDA_GLOBAL = false
- USA_PAGINACION = true
- TAMANOS_PAGINA = [10, 30, 50]
- USA_FILTROS_INLINE = true
- TITULO_PAGINA = Pagos

**Resultado esperado (resumen):**
- Se crea/actualiza `PagosView` en `src/views/tesoreria/PagosView.jsx` con:
  - **`TablePageLayout`** con `title="Pagos"`; sin `topBar` (no hay búsqueda global).
  - En `children`: estados `currentPage`, `itemsPerPage`, `inlineFilters` y `sortConfig`; `PaginationBar` encima de la tabla; tabla con encabezados ordenables y segunda fila de filtros inline (`Input` con `variant="filter"`).

---

## Ejemplo 3: Tabla completa estilo Requisiciones (búsqueda, filtros, orden, paginación, exportar)

**Invocación:**  
Usa `prompts/tablas/crear_tabla/prompt.md`

**Input:**
- ARCHIVO_DESTINO = @src/views/compras/RequisicionesLiteView.jsx
- NOMBRE_COMPONENTE_VISTA = RequisicionesLiteView
- MODO_SALIDA = vista_completa
- TIPO_TABLA = completa
- FUENTE_DATOS = La vista recibe `requisiciones` como prop (mismo shape que en `RequisicionesView`), y expone `setRequisiciones`.
- COLUMNAS = [
  { id: 'id', label: 'ID', ordenable: true, usaFiltroInline: true, ancho: 'w-[8%]', tipoCelda: 'texto' },
  { id: 'fecha', label: 'Fecha', ordenable: true, usaFiltroInline: true, ancho: 'w-[10%]', tipoCelda: 'texto', transformacionDisplay: 'parsear dd/mm/yyyy para ordenamiento' },
  { id: 'obra', label: 'Obra', ordenable: true, usaFiltroInline: true, ancho: 'w-[30%] min-w-[200px]', tipoCelda: 'texto', transformacionDisplay: 'usar etiqueta de catálogo OBRAS_MOCK' },
  { id: 'comprador', label: 'Comprador', ordenable: true, usaFiltroInline: true, ancho: 'w-[20%] min-w-[150px]', tipoCelda: 'texto', transformacionDisplay: 'usar etiqueta de catálogo COMPRADORES_MOCK' },
  { id: 'solicita', label: 'Solicita', ordenable: true, usaFiltroInline: true, ancho: 'w-[12%]', tipoCelda: 'texto' },
  { id: 'tipo', label: 'Tipo', ordenable: true, usaFiltroInline: true, ancho: 'w-[10%]', tipoCelda: 'texto' },
  { id: 'estatus', label: 'Estatus', ordenable: false, usaFiltroInline: true, ancho: 'w-[8%]', tipoCelda: 'estatus', usaStatusBadge: true },
  { id: 'acciones', label: '', tipoCelda: 'acciones' }
]
- ACCIONES_FILA = [
  { id: 'exportar', icono: 'Printer', titulo: 'Imprimir a Excel', comportamiento: 'llamar helper exportRequisicionToExcel(requisicion)' },
  { id: 'editar', icono: 'Edit', titulo: 'Editar', comportamiento: 'setear requisición a editar y navegar a NuevaRequisicion' },
  { id: 'cancelar', icono: 'Ban', titulo: 'Cancelar', comportamiento: 'abrir modal de confirmación para cancelar requisición, si estatus !== \"Cancelada\"' }
]
- USA_BUSQUEDA_GLOBAL = true
- CRITERIOS_BUSQUEDA = ['Coincidencia', 'Obra/Egreso Administrativo', 'Comprador', 'Fecha', 'ID Obra', 'ID']
- USA_PAGINACION = true
- TAMANOS_PAGINA = [30] (por defecto 30 por página, como en Requisiciones)
- USA_FILTROS_INLINE = true
- USA_EXPORTAR = true
- HELPER_EXPORTAR = exportRequisicionesTableToExcel
- TITULO_PAGINA = Requisiciones (versión lite)

**Resultado esperado (resumen):**
- Se crea `src/views/compras/RequisicionesLiteView.jsx` con un componente `RequisicionesLiteView` que:
  - Usa **`TablePageLayout`** con `title`, `topBar` (GlobalSearchBar con criterios y exportar) y `children` (paginación + tabla).
  - Incluye: búsqueda global con criterios, filtros inline por columna, ordenamiento con `SortableHeader`, paginación con `PaginationBar`, botón de exportar (`exportRequisicionesTableToExcel`), columna de estatus con `StatusBadge` y columna de acciones con `ActionCell`.
  - Limita los cambios al archivo de la vista e imports necesarios, sin modificar menú, sidebar ni `App.jsx`.

---

## Ejemplo 4: Solo tabla (sin layout de página)

**Invocación:**  
Usa `prompts/tablas/crear_tabla/prompt.md`

**Input:**
- ARCHIVO_DESTINO = @src/components/reports/ReportePagosTable.jsx
- NOMBRE_COMPONENTE_VISTA = ReportePagosTable
- MODO_SALIDA = solo_tabla
- TIPO_TABLA = con_paginacion
- FUENTE_DATOS = Recibe prop `pagos` (array de `{ id, concepto, monto, fecha }`).
- COLUMNAS = [
  { id: 'id', label: 'ID', ordenable: true, usaFiltroInline: false, ancho: 'w-[15%]', tipoCelda: 'texto' },
  { id: 'concepto', label: 'Concepto', ordenable: true, usaFiltroInline: false, ancho: 'w-[45%]', tipoCelda: 'texto' },
  { id: 'monto', label: 'Monto', ordenable: true, usaFiltroInline: false, ancho: 'w-[20%]', tipoCelda: 'texto' },
  { id: 'fecha', label: 'Fecha', ordenable: true, usaFiltroInline: false, ancho: 'w-[20%]', tipoCelda: 'texto' }
]
- USA_PAGINACION = true
- TAMANOS_PAGINA = [10, 25]

**Resultado esperado (resumen):**
- Se crea/actualiza el archivo con un **componente de tabla** (ej. `ReportePagosTable`) que:
  - **No** usa `TablePageLayout`, `PageCard` ni `ViewHeader`.
  - Exporta solo el bloque de tabla: estados de paginación y orden, `PaginationBar` + `DataTable`, listo para incrustar en un modal, tab o cualquier vista existente.

