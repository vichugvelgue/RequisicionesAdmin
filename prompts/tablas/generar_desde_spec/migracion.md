# Migración: parámetros sueltos (crear_tabla) → TableSpec JSON

Esta guía indica cómo pasar del prompt **crear_tabla** (parámetros sueltos) al prompt **generar_desde_spec** (un solo JSON TableSpec).

---

## Tabla de correspondencia

| Parámetro actual (crear_tabla) | TableSpec (generar_desde_spec) |
|--------------------------------|--------------------------------|
| ARCHIVO_DESTINO                | **target.file** — Ruta del archivo (quitar `@` si se usaba). |
| NOMBRE_COMPONENTE_VISTA        | **target.component** — Mismo nombre en PascalCase. |
| MODO_SALIDA                    | **target.mode** — Valores: `"vista_completa"` \| `"solo_tabla"`. |
| TIPO_TABLA                     | **target.tableType** — Valores: `"simple"` \| `"con_paginacion"` \| `"con_filtros"` \| `"completa"`. |
| COLUMNAS                       | **table.columns[]** — Ver mapeo de columnas abajo. |
| FUENTE_DATOS                   | **table.dataSource** — Ver mapeo de dataSource abajo. |
| ACCIONES_FILA                  | **table.rowActions[]** — Ver mapeo de acciones abajo. |
| USA_BUSQUEDA_GLOBAL            | **table.globalSearch** (boolean). |
| CRITERIOS_BUSQUEDA             | **table.searchCriteria** (array de strings). |
| USA_PAGINACION                 | **table.pagination** (boolean). |
| TAMANOS_PAGINA                 | **table.pageSizes** (array de números, ej. [10, 30, 50]). |
| USA_FILTROS_INLINE             | **table.inlineFilters** (boolean). |
| USA_EXPORTAR                   | **table.export** (boolean). |
| HELPER_EXPORTAR                | **table.exportHelperName** (string). |
| TITULO_PAGINA                  | **page.title** — Título del ViewHeader / TablePageLayout. |
| DESCRIPCION                    | **page.description** — Descripción bajo el título. |

---

## Mapeo de COLUMNAS → table.columns

Cada objeto de **COLUMNAS** se convierte en **table.columns[]** con las mismas propiedades; los nombres ya coinciden en el spec:

| Parámetro actual | TableSpec |
|------------------|-----------|
| id               | **id** |
| label            | **label** |
| ordenable        | **ordenable** |
| usaFiltroInline   | **usaFiltroInline** |
| ancho            | **ancho** |
| tipoCelda        | **tipoCelda** — Valores: `"texto"` \| `"estatus"` \| `"acciones"`. |
| usaStatusBadge   | **usaStatusBadge** |
| transformacionDisplay | **transformacionDisplay** |

No se añaden columnas ni propiedades no definidas en el spec.

---

## Mapeo de FUENTE_DATOS → table.dataSource

**FUENTE_DATOS** es una descripción en texto (ej. "La vista recibe una prop `materiales` que es un arreglo de objetos `{ id, nombre, estatus }`"). Se traduce a **table.dataSource**:

- Si los datos vienen por **prop**: `dataSource.type = "prop"`, `dataSource.propName` = nombre de la prop (ej. "materiales"), y opcionalmente `dataSource.recordShape` = lista de campos (ej. ["id", "nombre", "estatus"]).
- Si los datos vienen de **estado local**: `dataSource.type = "state"`, `dataSource.stateName` = nombre del estado (ej. "pagos"), y opcionalmente `dataSource.recordShape`.

Ejemplo:

- Antes: FUENTE_DATOS = "La vista recibe una prop `materiales` que es un arreglo de objetos `{ id, nombre, estatus }`."
- Después: `"dataSource": { "type": "prop", "propName": "materiales", "recordShape": ["id", "nombre", "estatus"] }`

---

## Mapeo de ACCIONES_FILA → table.rowActions

Cada elemento de **ACCIONES_FILA** se convierte en **table.rowActions[]**:

| Parámetro actual (crear_tabla) | TableSpec |
|--------------------------------|-----------|
| id                             | **id** |
| icono                          | **icon** — Nombre del icono Lucide (ej. "Edit", "Printer"). |
| titulo                         | **title** — Texto del tooltip. |
| comportamiento                 | **behavior** — Descripción corta de qué hace el handler. |

Ejemplo:

- Antes: `{ id: 'editar', icono: 'Edit', titulo: 'Editar', comportamiento: 'setear requisición a editar y navegar a NuevaRequisicion' }`
- Después: `{ "id": "editar", "icon": "Edit", "title": "Editar", "behavior": "setear requisición a editar y navegar a NuevaRequisicion" }`

---

## Acción principal del header (page.action)

En **crear_tabla** no hay un parámetro explícito para el botón principal del header; a veces se describe en el contexto. En TableSpec se usa **page.action**:

- **page.action.label** — Texto del botón (ej. "Nueva requisición").
- **page.action.icon** — Icono Lucide (ej. "Plus").
- **page.action.type** — `"navigate"` o `"callback"`.
- **page.action.destination** — Vista a la que navegar (si type = navigate).
- **page.action.callbackName** — Nombre de la prop (si type = callback).

Si en crear_tabla no se definía botón de acción, en TableSpec usar `page.action: null` o omitir.

---

## Ejemplo resumido

**Antes (crear_tabla):**

- ARCHIVO_DESTINO = @src/views/catalogos/CatalogoMaterialesView.jsx  
- NOMBRE_COMPONENTE_VISTA = CatalogoMaterialesView  
- MODO_SALIDA = vista_completa  
- TIPO_TABLA = simple  
- FUENTE_DATOS = La vista recibe una prop `materiales` que es un arreglo de objetos `{ id, nombre, estatus }`.  
- COLUMNAS = [ { id: 'id', label: 'ID', ordenable: false, usaFiltroInline: false, ancho: 'w-[10%]', tipoCelda: 'texto' }, { id: 'nombre', label: 'Nombre', ... }, { id: 'estatus', label: 'Estatus', tipoCelda: 'estatus', usaStatusBadge: true } ]  
- USA_BUSQUEDA_GLOBAL = false, USA_PAGINACION = false, USA_FILTROS_INLINE = false  
- TITULO_PAGINA = Catálogo de materiales  

**Después (TableSpec):**

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
    "dataSource": { "type": "prop", "propName": "materiales", "recordShape": ["id", "nombre", "estatus"] },
    "globalSearch": false,
    "pagination": false,
    "inlineFilters": false,
    "export": false,
    "rowActions": []
  }
}
```

Para ejemplos completos copy-paste, ver **spec.md** (Ejemplo 1: tabla simple, Ejemplo 2: tabla completa, Ejemplo 3: solo_tabla).
