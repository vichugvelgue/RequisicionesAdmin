# MenuSpec — Esquema del JSON canónico

Documentación del objeto **MenuSpec** usado como entrada única para generar o actualizar elementos del menú (sidebar, menuData, App, módulos). El campo **kind** determina el tipo de operación. Valores permitidos: `division`, `parent_sin_submenu`, `parent_sin_submenu_con_vista`, `parent_con_submenu`, `parent_con_submenu_y_vistas`, `hijo`, `hijo_con_vista`. El agente debe respetar esta estructura; no inventar propiedades ni valores no documentados.

---

## Estructura general

Según **kind**, el JSON incluye distintos bloques (target, division, parent, child, view). Ver la sección correspondiente a cada kind más abajo.

---

## kind = "division"

Bloques: **target**, **division**.

### target (division)

| Propiedad | Tipo   | Obligatorio | Descripción |
|-----------|--------|-------------|-------------|
| file      | string | Sí          | Debe ser `src/components/layout/Sidebar.jsx`. |

**Validación:** `target.file` debe comenzar con `src/` y ser `src/components/layout/Sidebar.jsx`.

### division

| Propiedad | Tipo   | Obligatorio | Descripción |
|-----------|--------|-------------|-------------|
| text      | string | Sí          | Texto de la etiqueta (ej. "Módulos", "Demostración"). Se muestra en mayúsculas en el sidebar. |
| position  | object | Sí          | Dónde insertar la división: antes o después de un elemento de referencia. |

### 2.1 division.position

| Propiedad  | Tipo   | Obligatorio | Descripción |
|------------|--------|-------------|-------------|
| type       | string | Sí          | `"before"` \| `"after"`. Insertar antes o después del elemento de referencia. |
| reference  | object | Sí          | Cómo localizar el elemento de referencia en el JSX. |

**Valores permitidos para type:** exactamente `"before"` o `"after"`.

### 2.2 division.position.reference

| Propiedad | Tipo   | Obligatorio | Descripción |
|-----------|--------|-------------|-------------|
| by        | string | Sí          | Tipo de nodo a buscar. Valores: `"parentLabel"` \| `"divisionText"` \| `"buttonLabel"`. |
| value     | string | Sí          | Texto a buscar (label del padre, texto de una división, o label de un botón/item). |

**Valores permitidos para by:**

- **parentLabel**: buscar un `SidebarParentExpandable` cuyo `label` coincida con `value` (ej. "Compras", "Tesorería", "Componentes").
- **divisionText**: buscar un `<SidebarDivision text="..." />` cuyo `text` coincida con `value` (ej. "Módulos").
- **buttonLabel**: buscar un `SidebarItem` (o elemento de navegación simple) cuyo `label` coincida con `value` (ej. "Dashboard").

---

## Validación previa (PRE-CHECK) para kind = "division"

Antes de generar código, validar:

- **target**: `target.file` debe comenzar con `src/` y, para divisiones, ser `src/components/layout/Sidebar.jsx`.
- **division.text**: no puede ser vacío (string con al menos un carácter).
- **division.position.type**: debe ser exactamente `"before"` o `"after"`.
- **division.position.reference.by**: debe ser exactamente `"parentLabel"`, `"divisionText"` o `"buttonLabel"`.
- **division.position.reference.value**: no puede ser vacío.

Si hay errores: NO modificar archivos. Responder con la lista de errores y corrección sugerida.

---

## Ejemplo 1: División "Demostración" antes de Compras

Inserción de una etiqueta de sección justo antes del bloque expandible "Compras".

```json
{
  "specVersion": 1,
  "kind": "division",
  "target": {
    "file": "src/components/layout/Sidebar.jsx"
  },
  "division": {
    "text": "Demostración",
    "position": {
      "type": "before",
      "reference": {
        "by": "parentLabel",
        "value": "Reportes"
      }
    }
  }
}
```

**Resultado esperado:** En `Sidebar.jsx`, justo antes de `<SidebarParentExpandable ... label="Compras" ...>`, se añade:

```jsx
<SidebarDivision text="Demostración" />
```

---

## Ejemplo 2: División "Administración" después de Módulos

Inserción de una etiqueta de sección justo después de la división con texto "Módulos".

```json
{
  "specVersion": 1,
  "kind": "division",
  "target": {
    "file": "src/components/layout/Sidebar.jsx"
  },
  "division": {
    "text": "Administración",
    "position": {
      "type": "after",
      "reference": {
        "by": "divisionText",
        "value": "Módulos"
      }
    }
  }
}
```

**Resultado esperado:** En `Sidebar.jsx`, justo después de `<SidebarDivision text="Módulos" />`, se añade:

```jsx
<SidebarDivision text="Administración" />
```

---

## kind = "parent_sin_submenu"

Opción de primer nivel sin hijos (SidebarItem). Opcionalmente navega a una vista. Archivos: menuData.jsx, Sidebar.jsx, App.jsx (si viewId).

| Bloque / propiedad | Tipo   | Obligatorio | Descripción |
|--------------------|--------|-------------|-------------|
| parent             | object | Sí          | Datos del ítem de primer nivel. |
| parent.label       | string | Sí          | Texto en el menú (ej. "Reportes"). |
| parent.icon        | string | Sí          | Nombre del icono Lucide (ej. BarChart2, FileText). |
| parent.viewId      | string | No          | Id de vista (activeView). Si se omite, el ítem no navega. |

**PRE-CHECK:** parent.label y parent.icon no vacíos. Icon debe ser un nombre válido de Lucide.

**Ejemplo mínimo:**

```json
{
  "specVersion": 1,
  "kind": "parent_sin_submenu",
  "parent": {
    "label": "Reportes",
    "icon": "BarChart2",
    "viewId": "Reportes"
  }
}
```

---

## kind = "parent_sin_submenu_con_vista"

Igual que parent_sin_submenu pero siempre con vista; además crea el módulo y la vista con layout base (patrón Requisiciones).

| Bloque / propiedad   | Tipo   | Obligatorio | Descripción |
|----------------------|--------|-------------|-------------|
| parent               | object | Sí          | label, icon (igual que parent_sin_submenu). viewId es obligatorio aquí. |
| parent.label         | string | Sí          | Texto en el menú. |
| parent.icon          | string | Sí          | Nombre del icono Lucide. |
| parent.viewId        | string | Sí          | Id de vista / activeView. |
| view                 | object | Sí          | Datos de la vista a generar. |
| view.title           | string | Sí          | Título del ViewHeader. |
| view.buttonAction    | string | No          | Texto del botón de acción. Por defecto "Acción principal". |
| view.modulePath      | string | No          | Ruta del módulo (ej. "reportes"). Por defecto label en minúsculas. |

**PRE-CHECK:** parent.label, parent.icon, parent.viewId, view.title no vacíos.

**Ejemplo mínimo:**

```json
{
  "specVersion": 1,
  "kind": "parent_sin_submenu_con_vista",
  "parent": { "label": "Reportes", "icon": "BarChart2", "viewId": "Reportes" },
  "view": { "title": "Reportes", "buttonAction": "Generar reporte", "modulePath": "reportes" }
}
```

---

## kind = "parent_con_submenu"

Padre expandible con N hijos. Archivos: menuData.jsx, Sidebar.jsx, App.jsx. No genera vistas.

| Bloque / propiedad | Tipo  | Obligatorio | Descripción |
|--------------------|-------|-------------|-------------|
| parent             | object | Sí         | label, icon, submenu. |
| parent.label       | string | Sí         | Nombre del ítem expandible (ej. "Inventarios"). |
| parent.icon        | string | Sí         | Nombre del icono Lucide. |
| parent.submenu     | array  | Sí         | Array de `{ id: string, label: string }`. id = activeView. |
| parent.position    | string | No         | Dónde insertar en Sidebar (ej. "después de Compras"). Por defecto: después de Compras. |

**PRE-CHECK:** parent.label, parent.icon no vacíos; parent.submenu al menos un elemento; cada item con id y label no vacíos.

**Ejemplo mínimo:**

```json
{
  "specVersion": 1,
  "kind": "parent_con_submenu",
  "parent": {
    "label": "Inventarios",
    "icon": "Package",
    "submenu": [
      { "id": "InventariosEntrada", "label": "Entrada" },
      { "id": "InventariosSalida", "label": "Salida" }
    ],
    "position": "después de Compras"
  }
}
```

---

## kind = "parent_con_submenu_y_vistas"

Padre expandible + N hijos + genera N vistas base (módulo con subcarpetas y layout Requisiciones por cada hijo).

| Bloque / propiedad     | Tipo   | Obligatorio | Descripción |
|------------------------|--------|-------------|-------------|
| parent                 | object | Sí          | label, icon, submenu, position (opcional). |
| parent.label           | string | Sí          | Nombre del ítem expandible. |
| parent.icon            | string | Sí          | Nombre del icono Lucide. |
| parent.submenu         | array  | Sí          | Array de `{ id, label, tituloPagina?, textoBotonAccion? }`. |
| parent.position        | string | No          | Ubicación en Sidebar. Por defecto: después de Compras. |
| modulePath             | string | No          | Ruta del módulo (ej. "inventarios"). Por defecto: label en minúsculas. |

**PRE-CHECK:** parent.label, parent.icon no vacíos; submenu al menos un elemento; cada item con id y label.

**Ejemplo mínimo:**

```json
{
  "specVersion": 1,
  "kind": "parent_con_submenu_y_vistas",
  "parent": {
    "label": "Inventarios",
    "icon": "Package",
    "submenu": [
      { "id": "InventariosEntrada", "label": "Entrada", "tituloPagina": "Entrada de inventario", "textoBotonAccion": "Nueva Entrada" },
      { "id": "InventariosSalida", "label": "Salida" }
    ]
  },
  "modulePath": "inventarios"
}
```

---

## kind = "hijo"

Añade una subopción a un padre existente. Archivos: menuData.jsx, Sidebar.jsx (si padre es Compras: COMPRAS_NAVIGABLE), App.jsx.

| Bloque / propiedad | Tipo   | Obligatorio | Descripción |
|--------------------|--------|-------------|-------------|
| parentRef           | string | Sí          | Nombre del padre en menú (ej. "Componentes", "Compras"). Determina el array en menuData (COMPONENTES_SUBMENU, COMPRAS_SUBMENU, etc.). |
| child               | object | Sí          | id, label. |
| child.id             | string | Sí          | activeView (ej. ComponentesModals). |
| child.label          | string | Sí          | Texto en el menú (ej. "Modals"). |
| child.navigable      | boolean| No          | Si el padre es Compras y usa COMPRAS_NAVIGABLE, true para que el ítem llame a setActiveView. Por defecto true para padres tipo Componentes. |

**PRE-CHECK:** parentRef, child.id, child.label no vacíos.

**Ejemplo mínimo:**

```json
{
  "specVersion": 1,
  "kind": "hijo",
  "parentRef": "Componentes",
  "child": { "id": "ComponentesModals", "label": "Modals", "navigable": true }
}
```

---

## kind = "hijo_con_vista"

Hijo + genera el archivo de vista con layout base en el módulo del padre. Archivos: menuData.jsx, App.jsx, modules/.../View.tsx, index.ts.

| Bloque / propiedad   | Tipo   | Obligatorio | Descripción |
|----------------------|--------|-------------|-------------|
| parentRef            | string | Sí          | Nombre del padre (ej. "Componentes"). |
| child                | object | Sí          | id, label (igual que hijo). |
| view                 | object | Sí          | title; buttonAction (opcional); modulePath (opcional, ej. "componentes"). Subcarpeta se deriva de label/id. |
| view.title           | string | Sí          | Título en ViewHeader. |
| view.buttonAction    | string | No          | Texto del botón. Por defecto "Acción principal". |
| view.modulePath      | string | No          | Carpeta del módulo (ej. "componentes"). |

**PRE-CHECK:** parentRef, child.id, child.label, view.title no vacíos.

**Ejemplo mínimo:**

```json
{
  "specVersion": 1,
  "kind": "hijo_con_vista",
  "parentRef": "Componentes",
  "child": { "id": "ComponentesModals", "label": "Modals" },
  "view": { "title": "Modals", "buttonAction": "Nueva acción", "modulePath": "componentes" }
}
```

---

Para el flujo de generación y la validación en detalle, ver **prompt.md**. Para migrar desde los prompts crear_* (parámetros sueltos), ver **migracion.md**.
