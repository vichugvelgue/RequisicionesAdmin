> Prompt para que el agente genere o actualice **vistas con tablas** (simples o avanzadas) usando los **componentes de UI existentes** (`PageCard`, `ViewHeader`, `DataTable`, `SimpleTable`, `PaginationBar`, `InfiniteScrollTable`, `SortableHeader`, `Input`, `GlobalSearchBar`, `StatusBadge`, `ActionCell`, etc.) y el layout genérico `TablePageLayout` para vistas completas. **InfiniteScrollTable** se usa cuando la tabla tiene infinite scroll (parámetro `TIPO_PAGINACION = "infinite"`).

# Crear/actualizar vista de tabla (simple o avanzada)

Genera o modifica una vista que muestra datos en una **tabla** usando los componentes estándar de `src/components/UI`. Soporta:

- Tablas **simples** (solo encabezados + filas).
- Tablas con **búsqueda global**, **filtros por columna**, **ordenamiento**.
- Tablas con **paginación**.
- Tablas con **acciones por fila** y/o columna de estatus.

La salida puede ser:

- Una **vista completa de listado** usando el layout `TablePageLayout`.
- Solo el **bloque de tabla** (con o sin paginación/búsqueda) para incrustar donde el developer lo necesite.

---

## Input

Define estos parámetros al invocar el prompt.

| Parámetro              | Descripción |
|------------------------|------------|
| `ARCHIVO_DESTINO`      | **Obligatorio.** Archivo donde se generará o actualizará la vista de tabla. Acepta ruta relativa (ej. `src/views/compras/MisRequisicionesView.jsx`) o referencia Cursor con `@` (ej. `@src/views/compras/MisRequisicionesView.jsx`). |
| `NOMBRE_COMPONENTE_VISTA` | **Obligatorio.** Nombre del componente React de la vista (ej. `MisRequisicionesView`). Debe exportarse con `export function {{NOMBRE_COMPONENTE_VISTA}}(...) { ... }`. |
| `MODO_SALIDA`          | **Obligatorio.** Controla la forma en que se genera el código. Valores esperados: `vista_completa` \| `solo_tabla`. `vista_completa` genera una página de listado usando `TablePageLayout`; `solo_tabla` genera solo el bloque de tabla (y lógica asociada) sin layout de página. |
| `TIPO_TABLA`           | **Obligatorio.** Tipo de tabla a generar. Valores esperados: `simple`, `con_paginacion`, `con_filtros`, `completa`. `completa` significa: búsqueda global + filtros por columna + ordenamiento + paginación. |
| `COLUMNAS`             | **Obligatorio.** Descripción estructurada de las columnas de la tabla. Ver detalle más abajo. |
| `FUENTE_DATOS`         | **Obligatorio.** Cómo llega la data a la vista: nombre de la lista principal (ej. `requisiciones`), si viene como prop o de un estado local, y los campos disponibles en cada registro. |
| `ACCIONES_FILA`        | Opcional. Lista de acciones por fila (ej. editar, cancelar, exportar) con id, icono Lucide, título tooltip y qué debe hacer el handler. Se usarán en `ActionCell`. |
| `USA_BUSQUEDA_GLOBAL`  | Opcional. Booleano. Si es `true`, incluir una barra de búsqueda global (ej. `GlobalSearchBar`) arriba de la tabla. |
| `CRITERIOS_BUSQUEDA`   | Opcional. Lista de criterios para búsqueda global (ej. `['Coincidencia', 'ID', 'Fecha']`) si `USA_BUSQUEDA_GLOBAL` es `true`. |
| `USA_PAGINACION`       | Opcional. Booleano. Si es `true`, incluir paginación: según `TIPO_PAGINACION` será barra de páginas (`PaginationBar`) o infinite scroll (`InfiniteScrollTable`). |
| `TIPO_PAGINACION`      | Opcional. Valores: `barra` \| `infinite`. Por defecto `barra`. Si es `barra`, usar `PaginationBar` y estados `currentPage`/`itemsPerPage`. Si es `infinite`, usar **InfiniteScrollTable** (búsqueda global, filtros inline, orden y acciones según el Input; pie "Mostrando X de Y"). Requiere `USA_PAGINACION = true`. |
| `TAMANOS_PAGINA`       | Opcional. Lista de valores (ej. `[10, 25]` o `[10, 30, 50]`). Con `TIPO_PAGINACION = "barra"`: opciones del selector y valor inicial (por defecto `[15, 30, 50, 100]`). Con `TIPO_PAGINACION = "infinite"`: el primer valor es el `pageSize` del infinite scroll (por defecto 30). |
| `USA_FILTROS_INLINE`   | Opcional. Booleano. Si es `true`, la tabla debe soportar filtros por columna con una fila de inputs inline que se pueda mostrar/ocultar mediante un botón de toggle en la última columna del encabezado (usa `Button variant="filterToggle"` con ícono `Filter`). |
| `USA_EXPORTAR`         | Opcional. Booleano. Si es `true`, incluir acción de exportar (ej. botón en la barra de búsqueda) y especificar helper a usar. |
| `HELPER_EXPORTAR`      | Opcional. Nombre del helper para exportar a Excel u otro formato (ej. `exportRequisicionesTableToExcel`). Se importará desde la ruta que se indique o se asumirá ya disponible en el archivo. |
| `TITULO_PAGINA`        | Opcional. Título para el `ViewHeader` / `TablePageLayout` (ej. "Requisiciones"). Si se omite, usar un título derivado del contexto. |
| `DESCRIPCION`          | Opcional. Descripción corta a mostrar debajo del título si la vista la necesita (por defecto, se puede omitir para tablas puras). |

### Detalle del parámetro `COLUMNAS`

`COLUMNAS` debe describir cada columna de la tabla como una lista de objetos con al menos:

- `id`: nombre del campo en cada registro (ej. `id`, `fecha`, `obra`).
- `label`: texto a mostrar en el `thead`.
- `ordenable`: booleano, si permite ordenamiento con `SortableHeader`.
- `usaFiltroInline`: booleano, si tendrá `Input` de filtro en la fila de filtros por columna.
- `ancho`: (opcional) clases de ancho Tailwind para la columna (ej. `w-[10%]`, `w-[30%] min-w-[200px]`).
- `tipoCelda`: (opcional) tipo de celda (`texto`, `estatus`, `acciones`, etc.).
- `usaStatusBadge`: (opcional) booleano para usar `StatusBadge` (ej. en campo `estatus`).
- `transformacionDisplay`: (opcional) descripción de cómo mostrar el valor (ej. "mostrar etiqueta de catálogo OBRAS_MOCK" o "formatear fecha dd/mm/yyyy").

Ejemplo conceptual:

```text
COLUMNAS = [
  { id: 'id', label: 'ID', ordenable: true, usaFiltroInline: true, ancho: 'w-[8%]', tipoCelda: 'texto' },
  { id: 'fecha', label: 'Fecha', ordenable: true, usaFiltroInline: true, ancho: 'w-[10%]', tipoCelda: 'texto', transformacionDisplay: 'formatear fecha' },
  { id: 'estatus', label: 'Estatus', ordenable: false, usaFiltroInline: true, ancho: 'w-[8%]', tipoCelda: 'estatus', usaStatusBadge: true },
  { id: 'acciones', label: '', tipoCelda: 'acciones' }
]
```

---

## Instrucciones para el agente

### 1. Resolver `ARCHIVO_DESTINO`

- Si `ARCHIVO_DESTINO` comienza con `@`, quitar el `@` y usar el resto como ruta relativa dentro del repo.
- Si no tiene `@`, usar la ruta tal cual.
- Si el archivo **existe**, **modificar o reemplazar** únicamente el componente `{{NOMBRE_COMPONENTE_VISTA}}` para agregar o actualizar la tabla según el Input.
- Si el archivo **no existe**, crearlo con el contenido adecuado según `MODO_SALIDA` y `TIPO_TABLA`.

### 2. Comportamiento según `MODO_SALIDA`

#### `MODO_SALIDA = "vista_completa"`

- Generar una **vista de listado completa** usando el layout `TablePageLayout` definido en `src/components/layout/TablePageLayout.jsx`.
- Importar `TablePageLayout` con la ruta relativa correcta (ej. desde una vista en `src/views/...`: `import { TablePageLayout } from '../../components/layout/TablePageLayout';`).
- Mapear:
  - `TITULO_PAGINA` → prop `title`.
  - `DESCRIPCION` → prop `description` (si viene).
  - Acción principal (si el Input la describe) → prop `action` (normalmente un `Button` de `components/UI`).
- Usar:
  - `topBar` para la barra de búsqueda global y/o filtros principales solo si `USA_BUSQUEDA_GLOBAL` y **no** se usa infinite scroll (si `USA_PAGINACION` y `TIPO_PAGINACION = "infinite"`, la búsqueda va dentro de InfiniteScrollTable vía `searchBar`).
  - `children`: si `USA_PAGINACION = true` y `TIPO_PAGINACION = "infinite"`, usar **InfiniteScrollTable** (data filtrada/ordenada, pageSize, resetKey, searchBar si USA_BUSQUEDA_GLOBAL, columnas, sort, filtros inline, acciones). Si no, `PaginationBar` (si USA_PAGINACION) + `DataTable`/SimpleTable con encabezados, filtros inline, filas, etc.

#### `MODO_SALIDA = "solo_tabla"`

- **No** usar `TablePageLayout`.
- Generar **solo el bloque de tabla** y la lógica asociada (estados, handlers) para incrustar dentro de cualquier layout existente.
- Por defecto, generar un **componente de tabla reutilizable** dentro del archivo destino (ej. `export function {{NOMBRE_COMPONENTE_VISTA}}Table(props) { ... }`) o, si el Input lo indica, un snippet JSX delimitado para pegar en un componente existente.
- Respetar uso de `DataTable`, `SimpleTable`, `InfiniteScrollTable` (si TIPO_PAGINACION = "infinite"), `SortableHeader`, `PaginationBar`, `StatusBadge`, `ActionCell`, `Input`, etc., según los flags; no introducir layout de página (no `PageCard`, no `ViewHeader`, no `TablePageLayout`).

### 3. Layout base (solo `vista_completa`)

Cuando `MODO_SALIDA = "vista_completa"`, usar `TablePageLayout` como envoltura principal:

- `title` = TITULO_PAGINA (o derivado).
- `description` = DESCRIPCION si existe.
- `action` = botón principal si se definió.
- `topBar` = barra de búsqueda global o filtros si aplica (salvo cuando se usa InfiniteScrollTable, que lleva la búsqueda en `searchBar`).
- `children` = si paginación infinite: `InfiniteScrollTable`; si no, paginación (barra) + `DataTable`/SimpleTable + etc.

### 4. Tabla (`DataTable`)

En ambos modos:

- Usar `DataTable` desde `src/components/UI`.
- `<thead>`:
  - Fila principal de encabezados:
    - Para columnas con `ordenable = true`, usar `SortableHeader`.
    - Para el **toggle de filtros inline** cuando `USA_FILTROS_INLINE = true`, añadir una **última columna** con un `Button` `variant="filterToggle"` y el ícono `Filter` (de `lucide-react`) que controle un estado tipo `showFilters`.
  - Fila de filtros inline:
    - **Estado inicial:** `showFilters` / `showInlineFilters` debe ser **false** (filtros ocultos hasta que el usuario pulse el botón de alternar).
    - Solo se renderiza si `showFilters` es `true`.
    - Para cada columna con `usaFiltroInline = true`, añadir un `Input variant="filter"` en la fila de filtros.
    - Mantener un estado `inlineFilters` y un handler `handleInlineFilterChange(campo, valor)`; resetear `currentPage` al filtrar.
    - La última celda de la fila de filtros puede contener un botón de **limpiar filtros** (solo visible cuando hay algún filtro activo).
- `<tbody>`: filas con zebra/hover; celdas de texto, `StatusBadge` para estatus, `ActionCell` para acciones según `ACCIONES_FILA`.

> **Nota sobre `SimpleTable`**  
> Si en lugar de construir la tabla manualmente con `DataTable` se usa el componente `SimpleTable` de `components/UI`, **no debes recrear esta lógica a mano**. En su lugar, utiliza sus props nativas:
> - `showInlineFilters`, `onToggleInlineFilters`
> - `inlineFilters`, `onInlineFilterChange`
> - `onClearInlineFilters`
>  
> `SimpleTable` ya se encarga de renderizar el botón `filterToggle` en la columna derecha y la fila de filtros inline según estas props.

### 5. Búsqueda global

Si `USA_BUSQUEDA_GLOBAL = true`: incluir `GlobalSearchBar` en `topBar` (vista_completa) o contenedor cercano (solo_tabla); implementar `handleGlobalSearch` que filtre la lista y actualice el dataset visible.

### 6. Paginación

Si `USA_PAGINACION = true`:
- **TIPO_PAGINACION = "barra"** (o no indicado): usar `PaginationBar`, estados `currentPage`/`itemsPerPage`, cálculo de `totalPages` y slice paginado; resetear página al cambiar filtros o itemsPerPage. Opciones de `itemsPerPage`: usar `TAMANOS_PAGINA` si se proporciona; si no, `[15, 30, 50, 100]` (valor inicial ej. 30).
- **TIPO_PAGINACION = "infinite"**: usar el componente **InfiniteScrollTable** de `src/components/UI`. Pasar la lista ya filtrada/ordenada como `data`; `pageSize` = primer valor de `TAMANOS_PAGINA` o 30; `resetKey` que cambie al cambiar búsqueda, filtros inline u orden. Si `USA_BUSQUEDA_GLOBAL` es true, pasar prop `searchBar` (criterios, valor, handlers). Pasar columnas, sortConfig, onSort, **showInlineFilters** con estado inicial **false** (filtros ocultos hasta que el usuario pulse el botón), onToggleInlineFilters, inlineFilters, onInlineFilterChange, onClearInlineFilters, acciones según ACCIONES_FILA. `showResultsInfo: true` para el pie "Mostrando X de Y". No implementar a mano visibleCount, ref ni InfiniteScrollSentinel. La columna de acciones tiene ancho fijo (w-24) en el componente SimpleTable.

### 7. Acciones por fila

Si hay `ACCIONES_FILA`: arreglo de acciones para `ActionCell` con iconos `lucide-react`, `onClick`, `title`, `variant` si aplica.

### 8. Imports y restricciones

- Componentes solo de `src/components/UI`; para vista completa usar `TablePageLayout` desde `src/components/layout/TablePageLayout.jsx`.
- Iconos solo desde `lucide-react`.
- No crear estilos nuevos; reutilizar clases existentes.

---

## Archivos del proyecto implicados

- Vista objetivo: `ARCHIVO_DESTINO`.
- Layout: `src/components/layout/TablePageLayout.jsx` (modo `vista_completa`).
- No tocar: `menuData.jsx`, `Sidebar.jsx`, `App.jsx`.

> Prompt para que el agente genere o actualice **vistas con tablas** (simples o avanzadas) usando los **componentes de UI existentes** (`PageCard`, `ViewHeader`, `DataTable`, `SimpleTable`, `PaginationBar`, `InfiniteScrollTable`, `SortableHeader`, `Input`, `GlobalSearchBar`, `StatusBadge`, `ActionCell`, etc.) y el layout genérico `TablePageLayout` para vistas completas. **InfiniteScrollTable** se usa cuando la tabla tiene infinite scroll (parámetro `TIPO_PAGINACION = "infinite"`).

# Crear/actualizar vista de tabla (simple o avanzada)

Genera o modifica una vista que muestra datos en una **tabla** usando los componentes estándar de `src/components/UI`. Soporta:

- Tablas **simples** (solo encabezados + filas).
- Tablas con **búsqueda global**, **filtros por columna**, **ordenamiento**.
- Tablas con **paginación**.
- Tablas con **acciones por fila** y/o columna de estatus.

La salida puede ser:

- Una **vista completa de listado** usando el layout `TablePageLayout`.
- Solo el **bloque de tabla** (con o sin paginación/búsqueda) para incrustar donde el developer lo necesite.

---

## Input

Define estos parámetros al invocar el prompt.

| Parámetro              | Descripción |
|------------------------|------------|
| `ARCHIVO_DESTINO`      | **Obligatorio.** Archivo donde se generará o actualizará la vista de tabla. Acepta ruta relativa (ej. `src/views/compras/MisRequisicionesView.jsx`) o referencia Cursor con `@` (ej. `@src/views/compras/MisRequisicionesView.jsx`). |
| `NOMBRE_COMPONENTE_VISTA` | **Obligatorio.** Nombre del componente React de la vista (ej. `MisRequisicionesView`). Debe exportarse con `export function {{NOMBRE_COMPONENTE_VISTA}}(...) { ... }`. |
| `MODO_SALIDA`          | **Obligatorio.** Controla la forma en que se genera el código. Valores esperados: `vista_completa` \| `solo_tabla`. `vista_completa` genera una página de listado usando `TablePageLayout`; `solo_tabla` genera solo el bloque de tabla (y lógica asociada) sin layout de página. |
| `TIPO_TABLA`           | **Obligatorio.** Tipo de tabla a generar. Valores esperados: `simple`, `con_paginacion`, `con_filtros`, `completa`. `completa` significa: búsqueda global + filtros por columna + ordenamiento + paginación. |
| `COLUMNAS`             | **Obligatorio.** Descripción estructurada de las columnas de la tabla. Ver detalle más abajo. |
| `FUENTE_DATOS`         | **Obligatorio.** Cómo llega la data a la vista: nombre de la lista principal (ej. `requisiciones`), si viene como prop o de un estado local, y los campos disponibles en cada registro. |
| `ACCIONES_FILA`        | Opcional. Lista de acciones por fila (ej. editar, cancelar, exportar) con id, icono Lucide, título tooltip y qué debe hacer el handler. Se usarán en `ActionCell`. |
| `USA_BUSQUEDA_GLOBAL`  | Opcional. Booleano. Si es `true`, incluir una barra de búsqueda global (ej. `GlobalSearchBar`) arriba de la tabla. |
| `CRITERIOS_BUSQUEDA`   | Opcional. Lista de criterios para búsqueda global (ej. `['Coincidencia', 'ID', 'Fecha']`) si `USA_BUSQUEDA_GLOBAL` es `true`. |
| `USA_PAGINACION`       | Opcional. Booleano. Si es `true`, incluir paginación: según `TIPO_PAGINACION` será barra de páginas o infinite scroll (InfiniteScrollTable). |
| `TIPO_PAGINACION`      | Opcional. Valores: `barra` \| `infinite`. Por defecto `barra`. Con `infinite` usar **InfiniteScrollTable** (búsqueda, filtros inline, orden, acciones, pie "Mostrando X de Y"). |
| `TAMANOS_PAGINA`       | Opcional. Con `barra`: opciones de itemsPerPage (por defecto `[15, 30, 50, 100]`). Con `infinite`: primer valor = pageSize (por defecto 30). |
| `USA_FILTROS_INLINE`   | Opcional. Booleano. Si es `true`, incluir segunda fila en el `thead` con inputs de filtro por columna usando `Input` con `variant="filter"`. |
| `USA_EXPORTAR`         | Opcional. Booleano. Si es `true`, incluir acción de exportar (ej. botón en la barra de búsqueda) y especificar helper a usar. |
| `HELPER_EXPORTAR`      | Opcional. Nombre del helper para exportar a Excel u otro formato (ej. `exportRequisicionesTableToExcel`). Se importará desde la ruta que se indique o se asumirá ya disponible en el archivo. |
| `TITULO_PAGINA`        | Opcional. Título para el `ViewHeader` / `TablePageLayout` (ej. "Requisiciones"). Si se omite, usar un título derivado del contexto. |
| `DESCRIPCION`          | Opcional. Descripción corta a mostrar debajo del título si la vista la necesita (por defecto, se puede omitir para tablas puras). |

### Detalle del parámetro `COLUMNAS`

`COLUMNAS` debe describir cada columna de la tabla como una lista de objetos con al menos:

- `id`: nombre del campo en cada registro (ej. `id`, `fecha`, `obra`).
- `label`: texto a mostrar en el `thead`.
- `ordenable`: booleano, si permite ordenamiento con `SortableHeader`.
- `usaFiltroInline`: booleano, si tendrá `Input` de filtro en la fila de filtros por columna.
- `ancho`: (opcional) clases de ancho Tailwind para la columna (ej. `w-[10%]`, `w-[30%] min-w-[200px]`).
- `tipoCelda`: (opcional) tipo de celda (`texto`, `estatus`, `acciones`, etc.).
- `usaStatusBadge`: (opcional) booleano para usar `StatusBadge` (ej. en campo `estatus`).
- `transformacionDisplay`: (opcional) descripción de cómo mostrar el valor (ej. "mostrar etiqueta de catálogo OBRAS_MOCK" o "formatear fecha dd/mm/yyyy").

Ejemplo conceptual:

```text
COLUMNAS = [
  { id: 'id', label: 'ID', ordenable: true, usaFiltroInline: true, ancho: 'w-[8%]', tipoCelda: 'texto' },
  { id: 'fecha', label: 'Fecha', ordenable: true, usaFiltroInline: true, ancho: 'w-[10%]', tipoCelda: 'texto', transformacionDisplay: 'formatear fecha' },
  { id: 'estatus', label: 'Estatus', ordenable: false, usaFiltroInline: true, ancho: 'w-[8%]', tipoCelda: 'estatus', usaStatusBadge: true },
  { id: 'acciones', label: '', tipoCelda: 'acciones' }
]
```

---

## Instrucciones para el agente

### 1. Resolver `ARCHIVO_DESTINO`

- Si `ARCHIVO_DESTINO` comienza con `@`, quitar el `@` y usar el resto como ruta relativa dentro del repo.
- Si no tiene `@`, usar la ruta tal cual.
- Si el archivo **existe**, **modificar o reemplazar** únicamente el componente `{{NOMBRE_COMPONENTE_VISTA}}` para agregar o actualizar la tabla según el Input.
- Si el archivo **no existe**, crearlo con el contenido adecuado según `MODO_SALIDA` y `TIPO_TABLA`.

### 2. Comportamiento según `MODO_SALIDA`

#### `MODO_SALIDA = "vista_completa"`

- Generar una **vista de listado completa** usando el layout `TablePageLayout` definido en `src/components/layout/TablePageLayout.jsx`.
- Importar `TablePageLayout` con la ruta relativa correcta (ej. desde una vista en `src/views/...`: `import { TablePageLayout } from '../../components/layout/TablePageLayout';`).
- Mapear:
  - `TITULO_PAGINA` → prop `title`.
  - `DESCRIPCION` → prop `description` (si viene).
  - Acción principal (si el Input la describe) → prop `action` (normalmente un `Button` de `components/UI`).
- Usar:
  - `topBar` para la barra de búsqueda global y/o filtros principales solo si `USA_BUSQUEDA_GLOBAL` y **no** se usa infinite scroll (si `USA_PAGINACION` y `TIPO_PAGINACION = "infinite"`, la búsqueda va dentro de InfiniteScrollTable vía `searchBar`).
  - `children`: si `USA_PAGINACION = true` y `TIPO_PAGINACION = "infinite"`, usar **InfiniteScrollTable** (data filtrada/ordenada, pageSize, resetKey, searchBar si USA_BUSQUEDA_GLOBAL, columnas, sort, filtros inline, acciones). Si no, `PaginationBar` (si USA_PAGINACION) + `DataTable`/SimpleTable con encabezados, filtros inline, filas, etc.

#### `MODO_SALIDA = "solo_tabla"`

- **No** usar `TablePageLayout`.
- Generar **solo el bloque de tabla** y la lógica asociada (estados, handlers) para incrustar dentro de cualquier layout existente.
- Por defecto, generar un **componente de tabla reutilizable** dentro del archivo destino (ej. `export function {{NOMBRE_COMPONENTE_VISTA}}Table(props) { ... }`) o, si el Input lo indica, un snippet JSX delimitado para pegar en un componente existente.
- Respetar uso de `DataTable`, `SimpleTable`, `InfiniteScrollTable` (si TIPO_PAGINACION = "infinite"), `SortableHeader`, `PaginationBar`, `StatusBadge`, `ActionCell`, `Input`, etc., según los flags; no introducir layout de página (no `PageCard`, no `ViewHeader`, no `TablePageLayout`).

### 3. Layout base (solo `vista_completa`)

Cuando `MODO_SALIDA = "vista_completa"`, usar `TablePageLayout` como envoltura principal:

- `title` = TITULO_PAGINA (o derivado).
- `description` = DESCRIPCION si existe.
- `action` = botón principal si se definió.
- `topBar` = barra de búsqueda global o filtros si aplica (salvo cuando se usa InfiniteScrollTable, que lleva la búsqueda en `searchBar`).
- `children` = si paginación infinite: `InfiniteScrollTable`; si no, paginación (barra) + `DataTable`/SimpleTable + etc.

### 4. Tabla (`DataTable`)

En ambos modos:

- Usar `DataTable` desde `src/components/UI`.
- `<thead>`: fila de encabezados con `SortableHeader` para columnas ordenables; segunda fila con `Input variant="filter"` si `USA_FILTROS_INLINE`.
- `<tbody>`: filas con zebra/hover; celdas de texto, `StatusBadge` para estatus, `ActionCell` para acciones según `ACCIONES_FILA`.
- Handler `handleInlineFilterChange` y estado `inlineFilters`; resetear `currentPage` al filtrar.

### 5. Búsqueda global

Si `USA_BUSQUEDA_GLOBAL = true`: incluir `GlobalSearchBar` en `topBar` (vista_completa) o contenedor cercano (solo_tabla); implementar `handleGlobalSearch` que filtre la lista y actualice el dataset visible.

### 6. Paginación

Si `USA_PAGINACION = true`:
- **TIPO_PAGINACION = "barra"** (o no indicado): usar `PaginationBar`, estados `currentPage`/`itemsPerPage`, cálculo de `totalPages` y slice paginado; resetear página al cambiar filtros o itemsPerPage. Opciones de `itemsPerPage`: usar `TAMANOS_PAGINA` si se proporciona; si no, `[15, 30, 50, 100]` (valor inicial ej. 30).
- **TIPO_PAGINACION = "infinite"**: usar el componente **InfiniteScrollTable** de `src/components/UI`. Pasar la lista ya filtrada/ordenada como `data`; `pageSize` = primer valor de `TAMANOS_PAGINA` o 30; `resetKey` que cambie al cambiar búsqueda, filtros inline u orden. Si `USA_BUSQUEDA_GLOBAL` es true, pasar prop `searchBar` (criterios, valor, handlers). Pasar columnas, sortConfig, onSort, **showInlineFilters** con estado inicial **false** (filtros ocultos hasta que el usuario pulse el botón), onToggleInlineFilters, inlineFilters, onInlineFilterChange, onClearInlineFilters, acciones según ACCIONES_FILA. `showResultsInfo: true` para el pie "Mostrando X de Y". No implementar a mano visibleCount, ref ni InfiniteScrollSentinel. La columna de acciones tiene ancho fijo (w-24) en el componente SimpleTable.

### 7. Acciones por fila

Si hay `ACCIONES_FILA`: arreglo de acciones para `ActionCell` con iconos `lucide-react`, `onClick`, `title`, `variant` si aplica.

### 8. Imports y restricciones

- Componentes solo de `src/components/UI`; para vista completa usar `TablePageLayout` desde `src/components/layout/TablePageLayout.jsx`.
- Iconos solo desde `lucide-react`.
- No crear estilos nuevos; reutilizar clases existentes.

---

## Archivos del proyecto implicados

- Vista objetivo: `ARCHIVO_DESTINO`.
- Layout: `src/components/layout/TablePageLayout.jsx` (modo `vista_completa`).
- No tocar: `menuData.jsx`, `Sidebar.jsx`, `App.jsx`.
