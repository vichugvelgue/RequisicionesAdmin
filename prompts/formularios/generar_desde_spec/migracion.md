# Migración: parámetros sueltos → FormSpec JSON

Esta guía indica cómo pasar del prompt **crear_formulario** (parámetros sueltos) al prompt **generar_desde_spec** (un solo JSON FormSpec).

---

## Tabla de correspondencia

| Parámetro actual (crear_formulario) | FormSpec (generar_desde_spec) |
|-------------------------------------|-------------------------------|
| ARCHIVO_DESTINO                      | **target.file** — Ruta del archivo (quitar `@` si se usaba). |
| NOMBRE_COMPONENTE_VISTA             | **target.component** — Mismo nombre en PascalCase. |
| MODO_SALIDA                         | **target.mode** — Valores: `"vista_completa"` \| `"solo_formulario"`. |
| TITULO_PAGINA                       | **page.title** — Título del ViewHeader. |
| DESCRIPCION                         | **page.subtitle** — Descripción bajo el título. |
| ACCIONES_PRINCIPALES                | **page.actions[]** — Ver mapeo de acciones abajo. |
| FUENTE_DATOS                        | Sin campo directo — Ver nota al final. |
| CAMPOS                              | **form.fields[]** — Ver mapeo de campos abajo. |
| SECCIONES                           | **form.sections[]** — Ver mapeo de secciones abajo. |
| VALIDACIONES_GLOBALES               | **form.rules[]** — Reglas tipadas (dateRange, requiredIf, minIf). |
| MODO_EDICION                        | Opcional en spec — Se puede extender con `form.editMode` o asumir por defecto solo alta. |

---

## Mapeo de ACCIONES_PRINCIPALES → page.actions

Cada elemento de `ACCIONES_PRINCIPALES` se convierte en un objeto de **page.actions**:

| Parámetro actual     | FormSpec |
|----------------------|----------|
| id                   | No se usa; el orden en el array define el orden de los botones. |
| label                | **label** |
| variante             | **variant** (ej. `"primary"`, `"secondary"`) |
| icono                | **icon** (nombre del icono Lucide, ej. `"Save"`, `"X"`) |
| tipoAccion: "submit" | **type: "submit"** — No añadir destination ni callbackName. |
| tipoAccion: "navegar" | **type: "navigate"** + **destination**: valor de `destino` (ej. `"Dashboard"`). |
| tipoAccion / callback | **type: "callback"** + **callbackName**: nombre de la prop (ej. `"onApply"`). |

Ejemplo:

- Antes: `{ id: 'guardar', label: 'Guardar', variante: 'primary', icono: 'Save', tipoAccion: 'submit' }`
- Después: `{ "type": "submit", "label": "Guardar", "variant": "primary", "icon": "Save" }`

- Antes: `{ id: 'cancelar', label: 'Cancelar', variante: 'secondary', icono: 'X', tipoAccion: 'navegar', destino: 'Dashboard' }`
- Después: `{ "type": "navigate", "label": "Cancelar", "variant": "secondary", "icon": "X", "destination": "Dashboard" }`

---

## Mapeo de CAMPOS → form.fields

Cada objeto de **CAMPOS** se convierte en un **form.fields[]**:

| Parámetro actual | FormSpec |
|------------------|----------|
| id               | **name** — Mismo valor. |
| label            | **label** |
| tipoCampo        | **ui.type** — Ver tabla de tipos abajo. |
| anchoCols        | **ui.span** — Extraer el número: `col-span-6` → 6, `col-span-12` → 12. |
| placeholder      | **placeholder** |
| ayuda            | **help** |
| requerido        | **validation.required** (boolean). |
| mensajeRequerido | **validation.message** (para required). |
| validaciones.minLength, maxLength, min, max, pattern, mensajeErrorPattern, email | **validation** — Mismo nombre o pattern → pattern, mensajeErrorPattern → patternMessage. |
| opciones (array local) | **options**: `{ "source": "local", "items": [ { "value", "label" } ] }`. |
| opciones (string mock: OBRAS_MOCK, PROVEEDORES_MOCK, etc.) | **options**: `{ "source": "mock", "mockId": "PROVEEDORES_MOCK" }` (mismo nombre del mock). |
| dependencia      | **dependency**: `{ "field": campo, "equals": valorIgualA, "mostrarSiVerdadero": mostrarSiVerdadero ?? true }`. |

**Tabla tipoCampo → ui.type (y opcionalmente ui.inputType):**

| tipoCampo (actual) | ui.type          | ui.inputType (opcional) |
|--------------------|------------------|--------------------------|
| texto              | "input"          | "text" (default)         |
| textarea           | "textarea"       | —                        |
| numero             | "input"          | "number"                 |
| moneda             | "input"          | "currency"               |
| fecha              | "input"          | "date"                   |
| datetime           | "input"          | "datetime"               |
| select             | "select"         | —                        |
| searchableSelect   | "searchableSelect" | —                      |
| checkbox           | "checkbox"       | —                        |
| switch             | "switch"         | —                        |
| radioGroup         | "radioGroup"     | —                        |

---

## Mapeo de SECCIONES → form.sections

Cada elemento de **SECCIONES** se convierte en **form.sections[]**:

| Parámetro actual | FormSpec |
|------------------|----------|
| id               | **id** |
| titulo           | **title** |
| subtitulo        | **subtitle** |
| campos           | **fields** — Misma lista de nombres (ids) de campos. |

---

## Mapeo de VALIDACIONES_GLOBALES → form.rules

Las validaciones globales se expresan como reglas **tipadas**. Solo se admiten tres tipos:

1. **Rango de fechas (fechaFin >= fechaInicio)**  
   - Descripción libre tipo “Si ambas fechas están llenas, fechaFin debe ser mayor o igual a fechaInicio.”  
   - FormSpec:  
     `{ "type": "dateRange", "start": "fechaInicio", "end": "fechaFin", "allowEmpty": true, "message": "..." }`

2. **Campo requerido condicional (ej. diasCredito cuando tipoCredito = 'credito')**  
   - FormSpec:  
     `{ "type": "requiredIf", "field": "diasCredito", "when": "tipoCredito", "equals": "credito", "message": "..." }`

3. **Mínimo condicional (ej. diasCredito >= 1 cuando tipoCredito = 'credito')**  
   - FormSpec:  
     `{ "type": "minIf", "field": "diasCredito", "when": "tipoCredito", "equals": "credito", "min": 1, "message": "..." }`

Si tienes una descripción en texto libre (ej. “si tipo = 'Crédito' entonces diasCredito es requerido”), tradúcela manualmente a una o más reglas de tipo **requiredIf** / **minIf** con los nombres de campo y valores exactos.

---

## FUENTE_DATOS

**FUENTE_DATOS** no tiene un campo 1:1 en FormSpec. El generador asume por defecto:

- Estado local con React Hook Form y **defaultValues** vacíos (formulario de alta).

Si en el futuro se necesita modo edición (datos desde prop), se puede extender el spec con algo como:

- `form.dataSource`: `"local"` \| `"prop"`
- `form.propName`: nombre de la prop (ej. `"registro"` o `"material"`)

Hasta entonces, para formularios que “reciben un registro para editar”, se puede documentar en comentarios o en la descripción del prompt; el generador puede asumir que el componente puede recibir una prop opcional de registro y usarla en `defaultValues` si se indica en texto junto al JSON.

---

## Ejemplo resumido

**Antes (parámetros sueltos):**

- ARCHIVO_DESTINO = @src/views/catalogos/NuevoMaterialView.tsx  
- NOMBRE_COMPONENTE_VISTA = NuevoMaterialView  
- MODO_SALIDA = vista_completa  
- TITULO_PAGINA = Nuevo material  
- CAMPOS = [ { id: 'nombre', label: 'Nombre', tipoCampo: 'texto', requerido: true, anchoCols: 'col-span-8' }, ... ]  
- SECCIONES = [ { id: 'generales', titulo: 'Datos generales', campos: ['nombre', ...] } ]

**Después (FormSpec):**

```json
{
  "target": { "file": "src/views/catalogos/NuevoMaterialView.tsx", "component": "NuevoMaterialView", "mode": "vista_completa" },
  "page": { "title": "Nuevo material", "subtitle": "", "actions": [ ... ] },
  "form": {
    "fields": [ { "name": "nombre", "label": "Nombre", "ui": { "type": "input", "span": 8 }, "validation": { "required": true } }, ... ],
    "sections": [ { "id": "generales", "title": "Datos generales", "fields": ["nombre", ...] } ],
    "rules": []
  }
}
```

Para ejemplos completos copy-paste, ver **spec.md** (ejemplos Nuevo material y FiltroPagosAvanzado).
