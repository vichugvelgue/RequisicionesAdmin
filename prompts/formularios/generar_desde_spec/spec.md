# FormSpec — Esquema del JSON canónico

Documentación del objeto **FormSpec** usado como entrada única para generar o actualizar vistas de formulario. El agente debe respetar esta estructura y valores permitidos; no inventar propiedades ni valores no documentados.

---

## Estructura general

```json
{
  "target": { ... },
  "page": { ... },
  "form": { ... }
}
```

- **target** (obligatorio): archivo de salida, nombre del componente y modo de generación.
- **page** (obligatorio en vista_completa; opcional en solo_formulario): título, subtítulo y acciones del header.
- **form** (obligatorio): campos, secciones y reglas de validación.

---

## 1. target

| Propiedad   | Tipo   | Obligatorio | Descripción |
|------------|--------|-------------|-------------|
| file       | string | Sí          | Ruta del archivo a generar/actualizar (ej. `src/views/catalogos/NuevoMaterialView.tsx`). |
| component  | string | Sí          | Nombre del componente principal (PascalCase). Se exporta como `export function {{component}}(...)`. |
| mode       | string | Sí          | `"vista_completa"` \| `"solo_formulario"`. Vista completa = PageCard + ViewHeader + form + Toast si hay submit; solo_formulario = solo form + lógica RHF/Yup. |

**Valores permitidos para mode:** exactamente `"vista_completa"` o `"solo_formulario"`.

---

## 2. page

Usado cuando `target.mode === "vista_completa"`. En `solo_formulario` puede omitirse o ir vacío.

| Propiedad  | Tipo   | Obligatorio | Descripción |
|------------|--------|-------------|-------------|
| title      | string | Recomendado | Título del ViewHeader. |
| subtitle   | string | No          | Descripción bajo el título. |
| backLink   | object | No          | Enlace "Volver" encima del PageCard (misma ubicación que en Requisiciones). Ver 2.1. |
| actions    | array  | No          | Lista de botones en el ViewHeader (Guardar, etc.). No incluir aquí el "Regresar"; usar backLink. |

### 2.1 page.backLink (vista_completa)

Opcional. Si está definido, se renderiza **encima del PageCard** un `BackLink` con la misma ubicación que en Requisiciones (patrón estándar para todos los formularios).

| Propiedad   | Tipo   | Obligatorio | Descripción |
|-------------|--------|-------------|-------------|
| label       | string | Sí          | Texto del enlace (ej. `"Volver a Requisiciones"`, `"Volver a Insumos"`). |
| destination | string | Sí          | Ruta a la que navegar al hacer clic (ej. `"/compras/requisiciones"`, `"/gestion-proyectos/insumos"`). |

### 2.2 page.actions[]

Cada elemento (botones dentro del ViewHeader, p. ej. Guardar):

| Propiedad     | Tipo   | Obligatorio | Descripción |
|---------------|--------|-------------|-------------|
| type          | string | Sí          | `"submit"` \| `"navigate"` \| `"callback"`. |
| label         | string | Sí          | Texto del botón. |
| variant       | string | No          | Variante del Button. **Para submit usar `"success"` (verde).** Por defecto `"success"` para submit. |
| icon          | string | No          | Nombre del icono Lucide (ej. `"Save"`, `"X"`). |
| destination   | string | Sí si type=navigate | Ruta a la que navegar. |
| callbackName  | string | Sí si type=callback | Nombre de la prop a invocar (ej. `"onApply"`). |

**Valores permitidos para type:** exactamente `"submit"`, `"navigate"` o `"callback"`.

**Botón Guardar (submit):** usar **variant `"success"`** (verde). En modo edición el label será **"Guardar cambios"** si el spec o la vista lo indican.

---

## 3. form

| Propiedad | Tipo  | Obligatorio | Descripción |
|-----------|-------|-------------|-------------|
| fields   | array | Sí          | Definición de cada campo del formulario. |
| sections | array | Sí          | Agrupación en FormSection: título, subtítulo y orden de campos. |
| rules    | array | No          | Validaciones globales tipadas (dateRange, requiredIf, minIf). |

### 3.1 form.fields[]

Cada campo:

| Propiedad   | Tipo   | Obligatorio | Descripción |
|-------------|--------|-------------|-------------|
| name        | string | Sí          | Identificador del campo (clave en el objeto de valores). |
| label       | string | Sí          | Texto del Label. |
| ui          | object | Sí          | Tipo de control y ancho en la grilla. |
| placeholder | string | No          | Placeholder del input. |
| help        | string | No          | Texto de ayuda debajo del campo. |
| options     | object | Sí si type=select/searchableSelect | Opciones del select (ver abajo). |
| dependency  | object | No          | Visibilidad/habilitación condicional. |
| validation  | object | No          | Reglas Yup a nivel de campo. |

**ui:**

| Propiedad | Tipo   | Obligatorio | Descripción |
|-----------|--------|-------------|-------------|
| type      | string | Sí          | `"input"` \| `"textarea"` \| `"select"` \| `"searchableSelect"` \| `"checkbox"` \| `"switch"` \| `"radioGroup"`. |
| inputType | string | No          | Solo cuando type = "input". Valores: `"text"` \| `"number"` \| `"currency"` \| `"date"` \| `"datetime"`. Por defecto `"text"`. |
| span      | number | Sí          | Columnas en grilla 12 (1..12). Se mapea a `col-span-{{span}}`. |

**options** (para select y searchableSelect):

| Propiedad | Tipo   | Obligatorio | Descripción |
|-----------|--------|-------------|-------------|
| source    | string | Sí          | `"local"` \| `"mock"`. |
| items     | array  | Sí si source=local | Lista `[{ "value": string, "label": string }]`. |
| mockId    | string | Sí si source=mock | Identificador del catálogo mock (ej. `"PROVEEDORES_MOCK"`, `"OBRAS_MOCK"`). |

**dependency:**

| Propiedad         | Tipo    | Obligatorio | Descripción |
|-------------------|---------|-------------|-------------|
| field             | string  | Sí          | Nombre del campo del que depende. |
| equals            | string \| number \| boolean | Sí | Valor que debe tener ese campo. |
| mostrarSiVerdadero | boolean | No          | Si true (default), mostrar cuando se cumple; si false, ocultar cuando se cumple. |

**validation (por campo):**

| Propiedad | Tipo    | Descripción |
|-----------|---------|-------------|
| required  | boolean | Campo obligatorio. |
| message   | string  | Mensaje cuando falla required (o mensaje por defecto). |
| minLength | number  | Mínimo de caracteres (string). |
| maxLength | number  | Máximo de caracteres (string). |
| min       | number  | Valor mínimo (número). |
| max       | number  | Valor máximo (número). |
| pattern   | string  | Regex en string. |
| patternMessage | string | Mensaje cuando falla pattern. |
| email     | boolean | Validar formato email. |

### 3.2 form.sections[]

| Propiedad | Tipo   | Obligatorio | Descripción |
|-----------|--------|-------------|-------------|
| id        | string | Sí          | Identificador único de la sección. |
| title     | string | Sí          | Título del FormSection. |
| subtitle  | string | No          | Subtítulo. |
| fields    | array  | Sí          | Lista de `name` de campos (orden de aparición). Todos deben existir en form.fields. |

### 3.3 form.rules[] (validaciones globales)

Solo se admiten estos tres tipos. Cada regla tiene **type** y el resto de propiedades según el tipo.

**type: "dateRange"**

| Propiedad  | Tipo    | Descripción |
|------------|---------|-------------|
| start      | string  | Nombre del campo fecha inicio. |
| end        | string  | Nombre del campo fecha fin. |
| allowEmpty | boolean | Si true, no exigir que estén llenos; si ambos están llenos, end >= start. |
| message    | string  | Mensaje de error. |

**type: "requiredIf"**

| Propiedad | Tipo   | Descripción |
|-----------|--------|-------------|
| field     | string | Campo que se hace requerido condicionalmente. |
| when      | string | Campo que se evalúa. |
| equals    | string \| number \| boolean | Valor que activa la condición. |
| message   | string | Mensaje de error. |

**type: "minIf"**

| Propiedad | Tipo    | Descripción |
|-----------|---------|-------------|
| field     | string  | Campo numérico a validar. |
| when      | string  | Campo que se evalúa. |
| equals    | string \| number \| boolean | Valor que activa la condición. |
| min       | number  | Valor mínimo exigido para `field`. |
| message   | string  | Mensaje de error. |

---

## Defaults sugeridos

- **page.backLink**: si no se indica en vista_completa, no se renderiza fila con BackLink (se recomienda definirlo para consistencia con Requisiciones).
- **page.actions**: si no se indica, no se generan botones en el header (en solo_formulario suele usarse callback). Para submit usar siempre variant `"success"`.
- **ui.span**: si se omite, se puede asumir 12 (ancho completo).
- **validation.required**: por defecto false.
- **form.rules**: array vacío si no se especifica.

---

## Ejemplo 1: Nuevo material (vista_completa)

Incluye: backLink "Volver a…" encima del PageCard, select con options local, sección única, botón Guardar verde (success), Toast implícito.

```json
{
  "target": {
    "file": "src/views/catalogos/NuevoMaterialView.tsx",
    "component": "NuevoMaterialView",
    "mode": "vista_completa"
  },
  "page": {
    "title": "Nuevo material",
    "subtitle": "Captura los datos básicos del material.",
    "backLink": {
      "label": "Volver a Materiales",
      "destination": "/catalogos/materiales"
    },
    "actions": [
      { "type": "submit", "label": "Guardar", "variant": "success", "icon": "Save" }
    ]
  },
  "form": {
    "fields": [
      { "name": "nombre", "label": "Nombre", "ui": { "type": "input", "span": 8 }, "validation": { "required": true, "message": "El nombre es obligatorio" } },
      { "name": "clave", "label": "Clave interna", "ui": { "type": "input", "span": 4 }, "validation": { "required": true } },
      { "name": "unidad", "label": "Unidad de medida", "ui": { "type": "select", "span": 4 }, "validation": { "required": true }, "options": { "source": "local", "items": [ { "value": "PZA", "label": "Pieza" }, { "value": "M2", "label": "Metro cuadrado" }, { "value": "M3", "label": "Metro cúbico" } ] } },
      { "name": "descripcion", "label": "Descripción", "ui": { "type": "textarea", "span": 12 }, "help": "Describe brevemente el material" },
      { "name": "estatus", "label": "Estatus", "ui": { "type": "select", "span": 4 }, "validation": { "required": true }, "options": { "source": "local", "items": [ { "value": "Activa", "label": "Activa" }, { "value": "Baja", "label": "Baja" } ] } }
    ],
    "sections": [
      { "id": "generales", "title": "Datos generales", "subtitle": "Información principal del material", "fields": ["nombre", "clave", "unidad", "descripcion", "estatus"] }
    ],
    "rules": []
  }
}
```

---

## Ejemplo 2: FiltroPagosAvanzado (solo_formulario, callback onApply)

Incluye: searchableSelect con mock, dateRange, campos fecha y checkbox. Acción callback para aplicar filtros.

```json
{
  "target": {
    "file": "src/components/filters/FiltroPagosAvanzado.tsx",
    "component": "FiltroPagosAvanzado",
    "mode": "solo_formulario"
  },
  "page": {
    "title": "",
    "subtitle": "",
    "actions": [
      { "type": "callback", "label": "Aplicar", "variant": "primary", "icon": "Filter", "callbackName": "onApply" }
    ]
  },
  "form": {
    "fields": [
      { "name": "fechaInicio", "label": "Fecha inicio", "ui": { "type": "input", "inputType": "date", "span": 6 }, "validation": {} },
      { "name": "fechaFin", "label": "Fecha fin", "ui": { "type": "input", "inputType": "date", "span": 6 }, "validation": {} },
      { "name": "proveedor", "label": "Proveedor", "ui": { "type": "searchableSelect", "span": 12 }, "options": { "source": "mock", "mockId": "PROVEEDORES_MOCK" } },
      { "name": "estatus", "label": "Estatus", "ui": { "type": "select", "span": 6 }, "options": { "source": "local", "items": [ { "value": "", "label": "Todos" }, { "value": "Pendiente", "label": "Pendiente" }, { "value": "Pagado", "label": "Pagado" }, { "value": "Cancelado", "label": "Cancelado" } ] } },
      { "name": "soloConFactura", "label": "Solo con factura", "ui": { "type": "checkbox", "span": 6 } }
    ],
    "sections": [
      { "id": "filtros", "title": "Filtros", "fields": ["fechaInicio", "fechaFin", "proveedor", "estatus", "soloConFactura"] }
    ],
    "rules": [
      { "type": "dateRange", "start": "fechaInicio", "end": "fechaFin", "allowEmpty": true, "message": "La fecha fin debe ser mayor o igual a la fecha de inicio." }
    ]
  }
}
```

---

## Ejemplo 3: requiredIf para diasCredito (fragmento de form)

Regla que hace obligatorio `diasCredito` cuando `tipoCredito` es `"credito"`:

```json
"rules": [
  { "type": "requiredIf", "field": "diasCredito", "when": "tipoCredito", "equals": "credito", "message": "Días de crédito es obligatorio cuando el tipo es Crédito." },
  { "type": "minIf", "field": "diasCredito", "when": "tipoCredito", "equals": "credito", "min": 1, "message": "Días de crédito debe ser al menos 1 cuando el tipo es Crédito." }
]
```

---

Para el flujo de generación y la validación previa del spec, ver **prompt.md**. Para migrar desde parámetros sueltos (ARCHIVO_DESTINO, CAMPOS, SECCIONES, etc.), ver **migracion.md**.
