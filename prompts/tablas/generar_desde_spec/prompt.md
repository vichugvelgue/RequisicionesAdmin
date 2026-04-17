# Generar vista de tabla desde TableSpec (JSON)

Este prompt genera o actualiza una única vista de tabla a partir de un objeto JSON llamado TableSpec.

La vista debe usar exclusivamente los componentes UI existentes del proyecto:

DataTable / SimpleTable  
InfiniteScrollTable (cuando table.pagination es true: tabla completa con búsqueda opcional, filtros inline, orden, acciones y scroll)  
InfiniteScrollSentinel (solo si se necesita sentinel sin usar InfiniteScrollTable)  
SortableHeader  
Input  
GlobalSearchBar  
TableFilterBar (filtros + onApply + actions: misma barra para búsqueda y botones Buscar/Exportar; ver sección "Barra de búsqueda y exportar")  
StatusBadge  
ActionCell  
Button  
TablePageLayout (solo en vista_completa)  

No crear estilos nuevos.

No modificar:

- Sidebar
- menuData
- App.jsx
- Layout global

Solo generar o modificar el archivo indicado en `target.file`.

---

# Regla fundamental

NO inventar nada fuera del JSON.

No agregar columnas  
No agregar acciones de fila  
No agregar criterios de búsqueda  
No agregar opciones de paginación no definidas  

Si algo no está en el JSON, no debe aparecer en el código.

---

# Input

El input puede ser:

- **(A) Ruta a un archivo TableSpec (JSON)**  
  El usuario indica un archivo que cumple el esquema de spec.md. Ejemplo: `@specs/tables/catalogos/materiales.table.json`. En este caso, leer ese JSON y continuar con la validación y generación.

- **(B) Petición de tabla sin JSON**  
  El usuario pide crear (o actualizar) una tabla sin pasar un archivo (ej. "quiero una tabla en UserTypesView", "crear la tabla de tipos de usuarios en src/modules/usuarios/tipos/UserTypesView.tsx"). En este caso, **primero** crear el TableSpec y guardarlo en la carpeta de specs del módulo; **después** aplicar la estrategia de generación como si el usuario hubiera pasado ese JSON.

Ejemplo de invocación con JSON:

Usa prompts/tablas/generar_desde_spec/prompt.md

Input: @specs/tables/catalogos/materiales.table.json

---

# Cuando el usuario no proporciona TableSpec (flujo B)

Si el usuario no ha pasado un archivo TableSpec y solo ha indicado que quiere una tabla (vista, módulo o archivo destino):

1. **Validar archivo destino y inferir mode.** Si el usuario indicó un archivo o vista existente (ej. "en UserTypesView" o "en src/modules/usuarios/tipos/UserTypesView.tsx"), leer ese archivo. Si el archivo **existe** y su contenido incluye layout de página (por ejemplo PageCard, ViewHeader, o una estructura con título + botón de acción + divisor tipo `border-b border-slate-200`), entonces **inferir** que se debe integrar la tabla en la vista existente: asignar `target.mode = "solo_tabla"` en el TableSpec (y en la generación se preservará ese layout y solo se reemplazará o insertará el bloque de tabla). Si el archivo no existe o no tiene ese layout, pedir o inferir mode según el contexto (vista_completa si es una página nueva, solo_tabla si es un componente reutilizable).

2. **Obtener los datos del spec.** Pedir al usuario los datos necesarios para armar el TableSpec según spec.md: target (file, component, mode, tableType), page (si vista_completa: title, description, action), table (columns, dataSource, globalSearch, searchCriteria, pagination, pageSizes, inlineFilters, inlineFiltersVisibleByDefault, rowActions, export, etc.). Si el usuario ya indicó archivo o vista, inferir target.file y target.component; si se aplicó el paso 1, mode ya está inferido como solo_tabla; pedir solo lo que falte (columnas, fuente de datos, búsqueda, acciones, etc.).

3. **Ruta del archivo de spec.** Crear o actualizar el TableSpec en la carpeta de specs del módulo:
   - **Ruta:** `src/modules/{{modulo}}/specs/{{nombreTabla}}.table.json`
   - **modulo:** primer segmento bajo `src/modules/` en `target.file`. Ejemplo: si target.file es `src/modules/usuarios/tipos/UserTypesView.tsx`, entonces `modulo` = `usuarios`.
   - **nombreTabla:** si el archivo de la vista está dentro de una subcarpeta del módulo (ej. `tipos/UserTypesView.tsx`), usar el nombre de esa carpeta: `tipos` → `tipos.table.json`. Si la vista está en la raíz del módulo (ej. `src/modules/usuarios/UserTypesView.tsx`), usar el nombre del componente en kebab-case sin el sufijo "View": `UserTypesView` → `user-types.table.json`.

4. **Crear la carpeta** `specs/` dentro de `src/modules/{{modulo}}/` si no existe.

5. **Generar el JSON.** Escribir el archivo con la estructura definida en spec.md: `specVersion`, `target`, `page` (si aplica), `table` (columns, dataSource, globalSearch, searchCriteria, pagination, pageSizes, inlineFilters, inlineFiltersVisibleByDefault, rowActions, etc.). No inventar propiedades; solo las documentadas en spec.md.

6. **Continuar con el flujo normal.** A partir de ese TableSpec (ya sea recién creado o leído de la ruta indicada), ejecutar la validación (PRE-CHECK) y la estrategia de generación de este prompt para generar o actualizar `target.file`.

Así queda un registro del TableSpec usado en `src/modules/{{modulo}}/specs/`, y el agente siempre usa el mismo flujo de generación.

---

# Datos mock (dataSource.mock)

Si `table.dataSource.mock?.enabled` es true:

1. Generar un archivo en `dataSource.mock.targetFile` que exporte un array (nombre coherente con el dominio, ej. `MATERIALES_MOCK` o `materialesMock`).
2. Los registros deben respetar `recordShape` y los tipos sugeridos por las columnas (id, fechas en rango razonable, estatus que coincidan con opciones si aplica, textos cortos). Valores variados pero coherentes.
3. Cantidad de registros: `dataSource.mock.size` si existe (≥ 1); si no, 100.
4. No modificar App.jsx. Indicar en el resultado que el desarrollador debe importar el array desde targetFile y pasarlo como prop (ej. `materiales={MATERIALES_MOCK}`).

Si no existe `dataSource.mock` o `mock.enabled` es false, no generar archivo de datos; la tabla espera recibir la prop como hasta ahora.

---

# Validación del spec (PRE-CHECK)

Antes de generar código, validar el TableSpec según la sección PRE-CHECK en spec.md:

- **target:** target.file debe comenzar con src/; target.component PascalCase; target.mode debe ser "vista_completa" o "solo_tabla"; target.tableType debe ser "simple", "con_paginacion", "con_filtros" o "completa".
- **table.columns:** cada columna debe tener id y label; ids únicos; si hay rowActions, debe existir una columna con tipoCelda "acciones".
- **table.dataSource:** debe estar definido (descripción y campos del registro).
- **Coherencia:** si tableType es "con_filtros" o "completa", table.inlineFilters debe ser coherente; flags (globalSearch, pagination, export) deben coincidir con lo que se usa en la generación.

Si hay errores: NO generar código. Responder con lista de errores y corrección sugerida.

---

# Estrategia de generación

**Si target.file no existe:** crear el archivo con el componente indicado en target.component.

**Si target.file existe:** actualizar solo el componente indicado en target.component. No modificar otros componentes del archivo.

**Según target.mode:**

- **vista_completa:** usar TablePageLayout (desde `src/components/layout/TablePageLayout.jsx`). Mapear page.title → prop title, page.description → prop description, page.action → prop action. Si table.pagination es true, children = **InfiniteScrollTable** con las props adecuadas (data ya filtrada/ordenada, pageSize, resetKey, searchBar si table.globalSearch, columnas, sortConfig, onSort, filtros inline, acciones); no montar a mano SimpleTable + InfiniteScrollSentinel + ref + visibleCount. Si table.pagination es false, children = bloque de tabla (SimpleTable/DataTable) sin scroll. Sin PaginationBar.
- **solo_tabla:** no usar TablePageLayout. Comportamiento según si el archivo ya existe:
  - **Si target.file ya existe** y su contenido incluye layout de página (PageCard, ViewHeader, o estructura con título + acción + divisor `border-b`): **no reemplazar** todo el componente. Conservar ese layout (PageCard, ViewHeader con título y botón, divisor) y **solo reemplazar o insertar** el bloque de contenido por el bloque de tabla y la lógica asociada (estados, handlers). El bloque de tabla va donde estaba el contenido (dentro del PageCard, debajo del divisor).
  - **Si target.file no existe** (archivo nuevo): generar solo el bloque de tabla y la lógica asociada para incrustar en cualquier layout. Si table.pagination es true: **InfiniteScrollTable**. Si table.pagination es false: contenedor con tabla (SimpleTable/DataTable). El contenedor raíz del bloque debe usar todo el ancho disponible (`w-full` / `flex-1 min-w-0` según contenedor).

**Según target.tableType y flags:**

- **simple:** solo encabezados + filas; sin búsqueda, filtros inline ni paginación.
- **con_paginacion:** cuando table.pagination es true, usar **InfiniteScrollTable** (data, pageSize, resetKey, columnas, sort si aplica). pageSize = table.pageSizes[0] si existe, si no 30.
- **con_filtros:** tabla + filtros por columna (según table.inlineFilters); si table.pagination es true, usar **InfiniteScrollTable**.
- **completa:** búsqueda global + filtros por columna + ordenamiento + infinite scroll; si table.pagination es true, usar **InfiniteScrollTable** (inline filters, sort, acciones). Si table.globalSearch es true y table.export es true: usar **TableFilterBar** (filters + onApply + actions) encima de la tabla y **no** pasar searchBar a InfiniteScrollTable (ver sección "Barra de búsqueda y exportar"). Si table.globalSearch es true y table.export es false: pasar searchBar a InfiniteScrollTable. Si table.export es true, el botón Exportar va en TableFilterBar.actions; table.exportHelperName para el helper.

**Nota:** InfiniteScrollTable encapsula barra de búsqueda (opcional), área de scroll, tabla (SimpleTable interno), sentinel y pie "Mostrando X de Y". La vista solo calcula la lista ya filtrada/ordenada como `data` y un `resetKey` que cambie al cambiar búsqueda, filtros u orden, y pasa las props al componente.

---

# Tabla (DataTable / SimpleTable / InfiniteScrollTable)

Cuando table.pagination es true se usa **InfiniteScrollTable**, que internamente usa SimpleTable; las columnas, filtros inline, sort y acciones se pasan como props a InfiniteScrollTable. Cuando table.pagination es false:

- Usar DataTable o SimpleTable desde `src/components/UI`.
- **Encabezados:** para columnas con ordenable true, usar SortableHeader. Si table.inlineFilters es true, añadir última columna con Button variant="filterToggle" e icono Filter que controle estado showFilters.
- **Fila de filtros inline:** solo si showFilters es true; por cada columna con usaFiltroInline true, Input variant="filter"; estado inlineFilters y handler para cambio; resetear visibleCount al filtrar (volver a pageSize). Si se usa SimpleTable, usar sus props: showInlineFilters, onToggleInlineFilters, inlineFilters, onInlineFilterChange, onClearInlineFilters; SimpleTable ya renderiza el botón filterToggle y la fila de filtros. **Estado inicial de showInlineFilters:** debe ser **false** salvo que el TableSpec tenga `table.inlineFiltersVisibleByDefault === true`. Es decir, por defecto los filtros inline están **ocultos** hasta que el usuario pulse el botón de alternar (icono filtro).
- **Celdas:** texto, StatusBadge para tipoCelda "estatus" (usaStatusBadge), ActionCell para tipoCelda "acciones" según table.rowActions.
- **transformacionDisplay:** aplicar la descripción (formatear fecha, etiqueta de catálogo mock, etc.) al mostrar el valor.
- **Ancho de columnas:** mapear `table.columns[].ancho` a la prop `width` de cada columna. Si una columna no tiene `ancho`, asignar ancho equitativo: `w-[X%]` donde X = piso(100 / número de columnas de datos), para que todas las columnas sin ancho repartan el espacio por igual. La columna de acciones (tipoCelda "acciones") la renderiza el componente SimpleTable con **ancho fijo reducido** (w-24); no definir ancho para esa columna en el spec.

---

# Barra de búsqueda y exportar (consistencia con TableFilterBar)

Cuando **table.globalSearch es true y table.export es true** (o tableType es "completa" con export): usar **TableFilterBar** encima de la tabla para mantener consistencia con el diseño del proyecto (filtros, Buscar y Exportar en la misma barra). No usar una barra separada solo para Exportar ni la prop searchBar de InfiniteScrollTable en ese caso.

- **TableFilterBar** con: `filters` (un filtro type "search" con labelCriteria "Buscar por:", criteriaOptions desde table.searchCriteria mapeados a { value, label }, criteriaValue/onCriteriaChange, labelInput "Búsqueda:", searchValue/onSearchChange, placeholder "Término de búsqueda..."); `onApply` (handler que aplica la búsqueda: actualizar el estado "aplicado" de criterio y texto para que la lista filtrada se recalcule); `applyLabel` "Buscar"; `actions` (si table.export es true: `{ label: "Exportar", icon: <Download />, onClick: llamar table.exportHelperName con la lista ya filtrada/ordenada, title: "Exportar a Excel" }`). La vista mantiene estado de criterio y texto de búsqueda (inputs) y estado "aplicado"; al hacer onApply se copian los valores de los inputs al estado aplicado; la lista que se pasa a InfiniteScrollTable se filtra por el estado aplicado. InfiniteScrollTable se usa **sin** la prop searchBar.
- Si table.globalSearch es true y table.export es false: pasar la búsqueda con la prop `searchBar` de InfiniteScrollTable como hasta ahora.

# Búsqueda global (cuando no se usa TableFilterBar)

Si table.globalSearch es true y no aplica la sección anterior: implementar handler que filtre la lista y usar table.searchCriteria como criterios. Si table.pagination es true, pasar la búsqueda mediante la prop `searchBar` de InfiniteScrollTable. Si table.pagination es false, incluir GlobalSearchBar en topBar (vista_completa) o contenedor cercano (solo_tabla).

---

# Infinite scroll

Si table.pagination es true, usar el componente **InfiniteScrollTable** de `src/components/UI`. Pasar la lista ya filtrada y ordenada como `data`; `pageSize` = table.pageSizes[0] si existe, si no 30; y un `resetKey` que cambie cuando cambie la búsqueda aplicada, los filtros inline o el orden. Si table.globalSearch es true **y no se usa TableFilterBar** (p. ej. export es false), pasar la prop `searchBar` con searchCriteria, onSearchCriteriaChange, criteriaOptions, searchText, onSearchTextChange, onSearch. Si se usa TableFilterBar (globalSearch + export), **no** pasar searchBar a InfiniteScrollTable. Pasar columnas (mapeadas desde table.columns), sortConfig, onSort, showInlineFilters (estado inicial false salvo table.inlineFiltersVisibleByDefault), onToggleInlineFilters, inlineFilters, onInlineFilterChange, onClearInlineFilters, y rowActions según el spec. Usar `showResultsInfo: true` para el pie "Mostrando X de Y resultados". No implementar a mano visibleCount, ref, handleLoadMore ni InfiniteScrollSentinel.

---

# Acciones por fila

Si table.rowActions existe: para cada acción (id, icon, title, behavior) configurar ActionCell con iconos de lucide-react, onClick según behavior, title para tooltip.

---

# Imports y restricciones

- Componentes solo de `src/components/UI`; para vista_completa usar TablePageLayout desde `src/components/layout/TablePageLayout.jsx`.
- Iconos solo desde `lucide-react`.
- No crear estilos nuevos; reutilizar clases existentes.

---

# Resultado esperado

1. **Si el usuario no proporcionó TableSpec (flujo B):** crear o actualizar el archivo TableSpec en `src/modules/{{modulo}}/specs/{{nombreTabla}}.table.json` según la sección "Cuando el usuario no proporciona TableSpec"; luego usar ese TableSpec como entrada.
2. Validar TableSpec según PRE-CHECK (spec.md).
3. Si hay errores → listarlos y no modificar archivos.
4. Si es válido → generar o actualizar target.file según la estrategia anterior.
5. No inventar lógica ni elementos fuera del JSON.
