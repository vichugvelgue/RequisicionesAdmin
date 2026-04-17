# TableSpec — Esquema del JSON canónico

Documentación del objeto **TableSpec** usado como entrada única para generar o actualizar vistas de tabla. El agente debe respetar esta estructura y valores permitidos; no inventar propiedades ni valores no documentados.

---

## Estructura general

```json
{
  "specVersion": 1,
  "target": { ... },
  "page": { ... },
  "table": { ... }
}
```

- **target** (obligatorio): archivo de salida, nombre del componente, modo y tipo de tabla.
- **page** (obligatorio cuando target.mode === "vista_completa"; opcional en solo_tabla): título, descripción y acción principal del header.
- **table** (obligatorio): columnas, fuente de datos, búsqueda, paginación, filtros, exportar y acciones por fila.

---

## 1. target

| Propiedad  | Tipo   | Obligatorio | Descripción |
|------------|--------|-------------|-------------|
| file       | string | Sí          | Ruta del archivo a generar/actualizar (ej. `src/views/catalogos/CatalogoMaterialesView.jsx`). |
| component  | string | Sí          | Nombre del componente principal (PascalCase). Se exporta como `export function {{component}}(...)`. |
| mode       | string | Sí          | `"vista_completa"` \| `"solo_tabla"`. vista_completa = TablePageLayout + topBar + tabla; solo_tabla = integrar solo el bloque de tabla (respetando layout existente si el archivo ya tiene uno). |
| tableType  | string | Sí          | `"simple"` \| `"con_paginacion"` \| `"con_filtros"` \| `"completa"`. simple = solo encabezados y filas; completa = búsqueda + filtros + orden + paginación. |

**Valores permitidos para mode:** exactamente `"vista_completa"` o `"solo_tabla"`.

**Layout (solo_tabla):** Si **target.file ya existe** y contiene layout (PageCard, ViewHeader, título + acción + divisor): conservar ese layout y solo reemplazar o insertar el bloque de tabla (y su lógica) en el área de contenido. Si **target.file no existe**: generar solo el bloque de tabla; si table.pagination es true el bloque es InfiniteScrollTable; si no, contenedor con tabla (SimpleTable/DataTable). Bloque de tabla con ancho completo (`w-full` / `flex-1 min-w-0` según contenedor).

**Valores permitidos para tableType:** exactamente `"simple"`, `"con_paginacion"`, `"con_filtros"` o `"completa"`.

---

## 2. page

Usado cuando `target.mode === "vista_completa"`. En `solo_tabla` puede omitirse.

| Propiedad    | Tipo   | Obligatorio | Descripción |
|--------------|--------|-------------|-------------|
| title        | string | Recomendado | Título del ViewHeader / TablePageLayout. |
| description  | string | No          | Descripción bajo el título. |
| action       | object | No          | Botón principal del header (label, icon, tipo de acción). |

### 2.1 page.action

| Propiedad    | Tipo   | Obligatorio | Descripción |
|--------------|--------|-------------|-------------|
| label        | string | Sí          | Texto del botón (ej. "Nuevo material"). |
| icon         | string | No          | Nombre del icono Lucide (ej. "Plus"). |
| type         | string | No          | `"navigate"` \| `"callback"`. Por defecto se asume navegación o callback según destino. |
| destination  | string | No          | Vista a la que navegar (ej. "NuevoMaterial") si type es navigate. |
| callbackName | string | No          | Nombre de la prop a invocar (ej. "onAdd") si type es callback. |

---

## 3. table

| Propiedad      | Tipo    | Obligatorio | Descripción |
|----------------|---------|-------------|-------------|
| columns        | array   | Sí          | Definición de cada columna. |
| dataSource     | object  | Sí          | Cómo llega la data (prop o state) y forma del registro. |
| globalSearch   | boolean | No          | Si true, incluir GlobalSearchBar. Por defecto false. |
| searchCriteria | array   | No          | Lista de criterios de búsqueda (strings). Requerido si globalSearch es true. |
| pagination     | boolean | No          | Si true, usar infinite scroll (la generación usará el componente InfiniteScrollTable); no usar barra de páginas. Por defecto false. |
| pageSizes      | array   | No          | Tamaño de carga por scroll (ej. [30]); el primer valor es el pageSize (cuántas filas se muestran inicialmente y cuántas se añaden al cargar más). Si no se envía, se usa 30. |
| inlineFilters  | boolean | No          | Si true, fila de filtros por columna con Input variant="filter". Por defecto false. |
| inlineFiltersVisibleByDefault | boolean | No | Si true, la fila de filtros inline se muestra al cargar; si false o se omite, la fila de filtros está **oculta** hasta que el usuario pulse el botón de alternar (icono filtro). Por defecto **false**. |
| export         | boolean | No          | Si true, botón de exportar. Por defecto false. Cuando **globalSearch y export son true**, la generación usa **TableFilterBar** (filters + onApply + actions) para mantener consistencia: Buscar y Exportar en la misma barra encima de la tabla. Si además en la capa de filtros se definen fechas (por ejemplo rango inicio/fin), esas se implementan con filtros `type: 'date'` en `TableFilterBar` usando el componente de fecha estándar con botón de limpiar (DateInputWithClear, vía `clearable: true`). |
| exportHelperName | string | No          | Nombre del helper para exportar (ej. "exportRequisicionesTableToExcel"). Requerido si export es true. |
| rowActions     | array   | No          | Acciones por fila para ActionCell. |

### 3.1 table.columns[]

Cada columna:

| Propiedad            | Tipo    | Obligatorio | Descripción |
|----------------------|---------|-------------|-------------|
| id                   | string  | Sí          | Nombre del campo en cada registro (ej. "id", "fecha", "estatus"). |
| label                | string  | Sí          | Texto en el thead (vacío para columna de acciones). |
| ordenable            | boolean | No          | Si permite ordenamiento con SortableHeader. Por defecto false. |
| usaFiltroInline       | boolean | No          | Si tiene Input de filtro en la fila de filtros. Por defecto false. |
| ancho                | string  | No          | Clases Tailwind de ancho (ej. "w-[8%]", "w-[30%] min-w-[200px]"). Si se omite, el agente debe asignar ancho equitativo (100% / número de columnas de contenido) a las columnas sin ancho. La columna de acciones (tipoCelda "acciones") no se define aquí; el componente SimpleTable aplica ancho fijo reducido (w-24) por defecto. |
| tipoCelda            | string  | No          | `"texto"` \| `"estatus"` \| `"acciones"`. Por defecto "texto". |
| usaStatusBadge       | boolean | No          | Si true, renderizar con StatusBadge (para tipoCelda "estatus"). Por defecto false. |
| transformacionDisplay | string | No          | Descripción de cómo mostrar el valor (ej. "formatear fecha dd/mm/yyyy", "catálogo OBRAS_MOCK"). |

**Valores permitidos para tipoCelda:** exactamente `"texto"`, `"estatus"` o `"acciones"`.

Si existe `table.rowActions`, debe haber exactamente una columna con `tipoCelda: "acciones"`.

### 3.2 table.dataSource

| Propiedad   | Tipo   | Obligatorio | Descripción |
|-------------|--------|-------------|-------------|
| type        | string | Sí          | `"prop"` \| `"state"`. Indica si los datos vienen por prop o de estado local. |
| propName    | string | Sí si type=prop | Nombre de la prop que contiene el array (ej. "materiales", "requisiciones"). |
| stateName   | string | Sí si type=state | Nombre del estado que contiene el array (ej. "pagos"). |
| recordShape | array  | No          | Lista de nombres de campos en cada registro (ej. ["id", "nombre", "estatus"]) para documentación. |
| mock        | object | No          | Opción para generar datos dummy y guardarlos en un archivo (solo desarrollo/demo). Ver 3.2.1. |

#### 3.2.1 dataSource.mock (opcional)

Si se desea que el agente genere un archivo con datos de ejemplo:

| Propiedad    | Tipo    | Obligatorio | Descripción |
|--------------|---------|-------------|-------------|
| enabled      | boolean | Sí          | Si true, generar archivo con array de registros dummy. |
| targetFile   | string  | Sí si enabled | Ruta del archivo bajo `src/data/` (ej. `src/data/catalogos/materiales.mock.ts`). |
| size         | number  | No          | Cantidad de registros a generar. Por defecto 100 si no se envía; debe ser ≥ 1 si se envía. |

Uso: desarrollo y demos. El desarrollador importa el array y lo pasa como prop a la vista; el prompt no modifica App.jsx.

### 3.3 table.rowActions[]

Cada acción por fila:

| Propiedad  | Tipo   | Obligatorio | Descripción |
|------------|--------|-------------|-------------|
| id         | string | Sí          | Identificador de la acción (ej. "editar", "exportar"). |
| icon       | string | Sí          | Nombre del icono Lucide (ej. "Edit", "Printer", "Ban"). |
| title      | string | Sí          | Texto del tooltip. |
| behavior   | string | Sí          | Descripción corta de qué hace el handler (ej. "llamar exportRequisicionToExcel(requisicion)", "abrir modal de confirmación para cancelar"). |

---

## Validación previa (PRE-CHECK)

Antes de generar código, validar:

**target**

- target.file debe comenzar con `src/`.
- target.component debe ser PascalCase (ej. CatalogoMaterialesView).
- target.mode debe ser exactamente `"vista_completa"` o `"solo_tabla"`.
- target.tableType debe ser exactamente `"simple"`, `"con_paginacion"`, `"con_filtros"` o `"completa"`.

**table.columns**

- Cada columna debe tener `id` y `label` (label puede ser "" para columna de acciones).
- No puede haber dos columnas con el mismo `id`.
- Si `table.rowActions` tiene al menos un elemento, debe existir una columna con `tipoCelda: "acciones"`.

**table.dataSource**

- Debe estar definido con `type` y, según el tipo, `propName` o `stateName`.
- Si `dataSource.mock.enabled === true`: `dataSource.mock.targetFile` es obligatorio y debe comenzar con `src/data/`. Si existe `mock.size`, debe ser ≥ 1.

**Coherencia**

- Si target.tableType es `"con_filtros"` o `"completa"`, al menos una columna debería tener usaFiltroInline true si se desean filtros por columna; table.inlineFilters debe ser true en ese caso.
- Si table.export es true, table.exportHelperName debe estar definido.
- Si table.globalSearch es true, table.searchCriteria puede estar definido (recomendado).

Si hay errores: NO modificar archivos. Responder con la lista de errores y corrección sugerida.

---

## Ejemplo 1: Tabla simple de catálogo (vista_completa)

Catálogo de materiales sin búsqueda, filtros ni paginación.

```json
{
  "specVersion": 1,
  "target": {
    "file": "src/views/catalogos/CatalogoMaterialesView.jsx",
    "component": "CatalogoMaterialesView",
    "mode": "vista_completa",
    "tableType": "simple"
  },
  "page": {
    "title": "Catálogo de materiales",
    "description": "",
    "action": null
  },
  "table": {
    "columns": [
      { "id": "id", "label": "ID", "ordenable": false, "usaFiltroInline": false, "ancho": "w-[10%]", "tipoCelda": "texto" },
      { "id": "nombre", "label": "Nombre", "ordenable": false, "usaFiltroInline": false, "ancho": "w-[60%]", "tipoCelda": "texto" },
      { "id": "estatus", "label": "Estatus", "ordenable": false, "usaFiltroInline": false, "ancho": "w-[20%]", "tipoCelda": "estatus", "usaStatusBadge": true }
    ],
    "dataSource": {
      "type": "prop",
      "propName": "materiales",
      "recordShape": ["id", "nombre", "estatus"]
    },
    "globalSearch": false,
    "pagination": false,
    "inlineFilters": false,
    "export": false,
    "rowActions": []
  }
}
```

**Resultado esperado:** Archivo con componente CatalogoMaterialesView que usa TablePageLayout con title "Catálogo de materiales", tabla con DataTable/SimpleTable y las tres columnas; sin topBar, sin paginación ni filtros.

---

## Ejemplo 2: Tabla completa (búsqueda, filtros, orden, paginación, acciones)

Requisiciones con búsqueda global, filtros por columna, ordenamiento, paginación, exportar y acciones por fila.

```json
{
  "specVersion": 1,
  "target": {
    "file": "src/views/compras/RequisicionesLiteView.jsx",
    "component": "RequisicionesLiteView",
    "mode": "vista_completa",
    "tableType": "completa"
  },
  "page": {
    "title": "Requisiciones (versión lite)",
    "description": "",
    "action": { "label": "Nueva requisición", "icon": "Plus", "type": "navigate", "destination": "NuevaRequisicion" }
  },
  "table": {
    "columns": [
      { "id": "id", "label": "ID", "ordenable": true, "usaFiltroInline": true, "ancho": "w-[8%]", "tipoCelda": "texto" },
      { "id": "fecha", "label": "Fecha", "ordenable": true, "usaFiltroInline": true, "ancho": "w-[10%]", "tipoCelda": "texto", "transformacionDisplay": "formatear fecha dd/mm/yyyy" },
      { "id": "obra", "label": "Obra", "ordenable": true, "usaFiltroInline": true, "ancho": "w-[30%] min-w-[200px]", "tipoCelda": "texto", "transformacionDisplay": "catálogo OBRAS_MOCK" },
      { "id": "comprador", "label": "Comprador", "ordenable": true, "usaFiltroInline": true, "ancho": "w-[20%] min-w-[150px]", "tipoCelda": "texto", "transformacionDisplay": "catálogo COMPRADORES_MOCK" },
      { "id": "solicita", "label": "Solicita", "ordenable": true, "usaFiltroInline": true, "ancho": "w-[12%]", "tipoCelda": "texto" },
      { "id": "tipo", "label": "Tipo", "ordenable": true, "usaFiltroInline": true, "ancho": "w-[10%]", "tipoCelda": "texto" },
      { "id": "estatus", "label": "Estatus", "ordenable": false, "usaFiltroInline": true, "ancho": "w-[8%]", "tipoCelda": "estatus", "usaStatusBadge": true },
      { "id": "acciones", "label": "", "tipoCelda": "acciones" }
    ],
    "dataSource": {
      "type": "prop",
      "propName": "requisiciones",
      "recordShape": ["id", "fecha", "obra", "comprador", "solicita", "tipo", "estatus"]
    },
    "globalSearch": true,
    "searchCriteria": ["Coincidencia", "Obra/Egreso Administrativo", "Comprador", "Fecha", "ID Obra", "ID"],
    "pagination": true,
    "pageSizes": [30],
    "inlineFilters": true,
    "export": true,
    "exportHelperName": "exportRequisicionesTableToExcel",
    "rowActions": [
      { "id": "exportar", "icon": "Printer", "title": "Imprimir a Excel", "behavior": "llamar helper exportRequisicionToExcel(requisicion)" },
      { "id": "editar", "icon": "Edit", "title": "Editar", "behavior": "setear requisición a editar y navegar a NuevaRequisicion" },
      { "id": "cancelar", "icon": "Ban", "title": "Cancelar", "behavior": "abrir modal de confirmación para cancelar requisición si estatus !== Cancelada" }
    ]
  }
}
```

**Resultado esperado:** Vista con TablePageLayout, title y action; **TableFilterBar** (filters tipo search + onApply "Buscar" + actions con "Exportar") encima de la tabla cuando globalSearch y export son true (Buscar y Exportar en la misma barra); children con InfiniteScrollTable sin searchBar (la búsqueda se aplica desde TableFilterBar), infinite scroll, filtros inline, ordenamiento, columnas con transformaciones y StatusBadge, columna de acciones, pie "Mostrando X de Y".

---

## Ejemplo 3: Solo tabla (solo_tabla, con paginación)

Componente de tabla reutilizable sin layout de página.

```json
{
  "specVersion": 1,
  "target": {
    "file": "src/components/reports/ReportePagosTable.jsx",
    "component": "ReportePagosTable",
    "mode": "solo_tabla",
    "tableType": "con_paginacion"
  },
  "page": null,
  "table": {
    "columns": [
      { "id": "id", "label": "ID", "ordenable": true, "usaFiltroInline": false, "ancho": "w-[15%]", "tipoCelda": "texto" },
      { "id": "concepto", "label": "Concepto", "ordenable": true, "usaFiltroInline": false, "ancho": "w-[45%]", "tipoCelda": "texto" },
      { "id": "monto", "label": "Monto", "ordenable": true, "usaFiltroInline": false, "ancho": "w-[20%]", "tipoCelda": "texto" },
      { "id": "fecha", "label": "Fecha", "ordenable": true, "usaFiltroInline": false, "ancho": "w-[20%]", "tipoCelda": "texto" }
    ],
    "dataSource": {
      "type": "prop",
      "propName": "pagos",
      "recordShape": ["id", "concepto", "monto", "fecha"]
    },
    "globalSearch": false,
    "pagination": true,
    "pageSizes": [10, 25],
    "inlineFilters": false,
    "export": false,
    "rowActions": []
  }
}
```

**Resultado esperado:** Componente ReportePagosTable que no usa TablePageLayout; exporta solo el bloque de tabla usando InfiniteScrollTable (infinite scroll, pie "Mostrando X de Y"), listo para incrustar en modal, tab o otra vista.

---

Para el flujo de generación y la validación en detalle, ver **prompt.md**. Para migrar desde el prompt crear_tabla (parámetros sueltos), ver **migracion.md**.
