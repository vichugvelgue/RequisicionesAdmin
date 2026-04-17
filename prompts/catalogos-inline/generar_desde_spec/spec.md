# CatalogoInlineSpec - Esquema JSON canónico

Contrato para generar o actualizar catálogos inline homogéneos usando como base el patrón de `CatalogoInlineView`.

## Estructura general

```json
{
  "specVersion": 1,
  "target": { "...": "..." },
  "page": { "...": "..." },
  "catalog": { "...": "..." },
  "behavior": { "...": "..." },
  "dataSource": { "...": "..." }
}
```

- `target` y `catalog` y `behavior` y `dataSource` son obligatorios.
- `page` es opcional.

---

## 1) target

| Propiedad | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `file` | string | Si | Ruta del archivo a crear/actualizar. Debe iniciar con `src/`. |
| `component` | string | Si | Nombre del componente principal en PascalCase. |
| `mode` | string | Si | `"vista_completa"` o `"solo_tabla"`. |

Reglas:
- Si `target.file` existe: actualizar solo `target.component`.
- Si no existe: crear archivo nuevo.

---

## 2) page (opcional)

| Propiedad | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `title` | string | Recomendado | Titulo visible en `ViewHeader`. |
| `description` | string | No | Texto auxiliar debajo del header o sobre la tabla. |
| `action` | object | No | Boton principal en header. |

`page.action`:

| Propiedad | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `label` | string | Si | Texto del boton. |
| `icon` | string | No | Icono Lucide (preferido `Plus`). |
| `behavior` | string | No | Descripcion de accion (ej. abrir insert row). |

---

## 3) catalog

| Propiedad | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `columns` | array | Si | Columnas de `InlineInsertInfiniteTable`. |
| `search` | object | Si | Configuracion de busqueda global. |
| `inlineFilters` | object | Si | Configuracion de filtros inline. |
| `sort` | object | Si | Orden inicial. |
| `statusField` | string | Si | Campo de estado textual (ej. `estatus`). |
| `statusOptions` | array | Si | Opciones validas de estado en mayusculas. |

`catalog.columns[]`:

| Propiedad | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `key` | string | Si | Llave del registro o `"_actions"`. |
| `label` | string | Si | Texto del encabezado. |
| `width` | string | No | Clase de ancho Tailwind. |
| `sortable` | boolean | No | Si permite ordenamiento. |
| `filterable` | boolean | No | Si participa en filtros inline. |
| `editable` | boolean | No | Si permite edicion inline. |
| `insertable` | boolean | No | Si participa en alta inline. |
| `uppercase` | boolean | No | Si el valor se normaliza a mayusculas. |

`catalog.search`:

| Propiedad | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `enabled` | boolean | Si | Habilita `GlobalSearchBar`. |
| `criteriaOptions` | array | Si | Opciones para selector de criterio. |
| `defaultCriteria` | string | Si | Criterio inicial. |

`catalog.inlineFilters`:

| Propiedad | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `enabled` | boolean | Si | Habilita filtros por columna. |
| `visibleByDefault` | boolean | No | Por defecto `false`. |
| `fields` | array | Si | Campos a filtrar. |

`catalog.sort`:

| Propiedad | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `key` | string | Si | Columna de orden inicial. |
| `direction` | string | Si | `"asc"` o `"desc"`. |

---

## 4) behavior

| Propiedad | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `insert` | object | Si | Alta inline. |
| `edit` | object | Si | Edicion inline. |
| `delete` | object | Si | Eliminacion con modal. |
| `toast` | object | Si | Feedback visual. |
| `actionsIcons` | object | Si | Mapa fijo de iconos por accion. |

`behavior.insert`:
- `enabled`: boolean.
- `autoId`: boolean.
- `idPrefix`: string opcional.
- `editableFields`: string[].

`behavior.edit`:
- `enabled`: boolean.
- `editableFields`: string[].

`behavior.delete`:
- `enabled`: boolean.
- `confirmModal`: object obligatorio cuando `enabled=true`.

`behavior.delete.confirmModal`:

| Propiedad | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `title` | string | Si | Titulo de modal (ej. `Confirmar eliminacion`). |
| `variant` | string | Si | Debe ser `"danger"`. |
| `confirmLabel` | string | Si | Recomendado `Eliminar`. |
| `cancelLabel` | string | Si | Recomendado `Cancelar`. |
| `messageTemplate` | string | Si | Mensaje con placeholder de registro (ej. `¿Deseas eliminar el registro {id}?`). |

`behavior.toast`:
- `enabled`: boolean.
- `durationMs`: number (default 3000).
- `messages`: `{ created, updated, deleted }`.

`behavior.actionsIcons` (estricto):
- `add`: `"Plus"`
- `edit`: `"Pencil"`
- `delete`: `"Trash2"`
- `save`: `"Check"`
- `cancel`: `"X"`

No se permiten variaciones salvo solicitud explicita del usuario.

---

## 5) dataSource

| Propiedad | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `type` | string | Si | `"state"` o `"prop"`. |
| `stateName` | string | Si cuando `type=state` | Nombre de estado local. |
| `propName` | string | Si cuando `type=prop` | Nombre de prop con registros. |
| `recordShape` | array | No | Campos esperados por registro. |
| `initialData` | array | No | Datos iniciales para demos/ejemplos. |

---

## PRE-CHECK obligatorio

Antes de generar codigo validar:

1. `target.file` inicia con `src/`.
2. `target.component` en PascalCase.
3. `target.mode` es `"vista_completa"` o `"solo_tabla"`.
4. `catalog.columns` tiene `key` unicos y existe columna `"_actions"`.
5. `catalog.statusOptions` en mayusculas.
6. `behavior.delete.confirmModal.variant` es `"danger"`.
7. `behavior.actionsIcons` coincide exactamente con el mapa oficial.
8. Si `catalog.search.enabled=true`, `criteriaOptions` no puede estar vacio.
9. Si `catalog.inlineFilters.enabled=true`, `fields` no puede estar vacio.

Si falla cualquier regla: no generar codigo y devolver lista de errores con sugerencia.

---

## Criterios de salida

El componente generado debe:
- usar `PageCard + ViewHeader` cuando `target.mode = "vista_completa"`,
- usar `InlineInsertInfiniteTable`,
- soportar alta/edicion/eliminacion inline segun `behavior`,
- incluir `ConfirmModal` de eliminacion y `Toast`,
- mantener texto de celdas editable en mayusculas donde aplique.
