# Migración: prompts crear_* (parámetros sueltos) → MenuSpec JSON

Esta guía indica cómo pasar de cada prompt clásico de menú (parámetros sueltos) al prompt **generar_desde_spec** (un solo JSON MenuSpec). Cada sección corresponde a un prompt y su kind equivalente.

---

## crear_division → kind = "division"

### Tabla de correspondencia

| Parámetro actual (crear_division) | MenuSpec (generar_desde_spec) |
|-----------------------------------|-------------------------------|
| TEXTO                             | **division.text** — Texto de la etiqueta (ej. "Demostración", "Administración"). |
| POSICION (interpretado)           | **division.position** — Objeto con type y reference (ver abajo). |

**Cómo traducir POSICION a division.position:**

| POSICION (texto libre) | division.position.type | division.position.reference.by | division.position.reference.value |
|------------------------|------------------------|----------------------------------|-----------------------------------|
| "antes de la sección **X**" (X = label de un padre expandible, ej. Compras, Tesorería) | "before" | "parentLabel" | "X" |
| "después de la sección **X**" | "after" | "parentLabel" | "X" |
| "antes de la división **Y**" o "después de la división **Y**" (Y = texto de una SidebarDivision, ej. Módulos) | "before" o "after" según corresponda | "divisionText" | "Y" |
| "antes del botón **Z**" o "después del botón **Z**" (Z = label de un SidebarItem, ej. Dashboard) | "before" o "after" según corresponda | "buttonLabel" | "Z" |

---

## Ejemplo 1: Antes de Compras (crear_division → MenuSpec)

**Antes (crear_division):**

- Invocación: Usa prompts/menu/crear_division/prompt.md  
- Input: TEXTO = Demostración, POSICION = antes de la sección Compras  

**Después (generar_desde_spec):**

Invocación:

Usa prompts/menu/generar_desde_spec/prompt.md

Input:

Archivo JSON con el siguiente contenido (por ejemplo `specs/menu/sidebar/demostracion.menu.json`):

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
        "value": "Compras"
      }
    }
  }
}
```

---

## Ejemplo 2: Después de la división Módulos (crear_division → MenuSpec)

**Antes (crear_division):**

- Invocación: Usa prompts/menu/crear_division/prompt.md  
- Input: TEXTO = Administración, POSICION = después de la división "Módulos"  

**Después (generar_desde_spec):**

Invocación:

Usa prompts/menu/generar_desde_spec/prompt.md

Input:

Archivo JSON con el siguiente contenido (por ejemplo `specs/menu/sidebar/administracion.menu.json`):

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

### Resumen division

- **TEXTO** → `division.text`
- **POSICION = "antes de la sección X"** → `division.position.type = "before"` + `division.position.reference.by = "parentLabel"` + `division.position.reference.value = "X"`
- **POSICION = "después de la división Y"** → `division.position.type = "after"` + `division.position.reference.by = "divisionText"` + `division.position.reference.value = "Y"`

---

## crear_padre_sin_submenu → kind = "parent_sin_submenu"

| Parámetro actual | MenuSpec |
|------------------|----------|
| LABEL | **parent.label** |
| NOMBRE_ICONO | **parent.icon** |
| VIEW_ID (opcional) | **parent.viewId** |

**Ejemplo JSON:** Ver spec.md sección parent_sin_submenu. Invocación: Usa prompts/menu/generar_desde_spec/prompt.md con Input: archivo JSON con specVersion, kind: "parent_sin_submenu", parent: { label, icon, viewId? }.

---

## crear_padre_sin_submenu_con_vista_base → kind = "parent_sin_submenu_con_vista"

| Parámetro actual | MenuSpec |
|------------------|----------|
| LABEL | **parent.label** |
| NOMBRE_ICONO | **parent.icon** |
| VIEW_ID | **parent.viewId** |
| TITULO_PAGINA | **view.title** |
| TEXTO_BOTON_ACCION | **view.buttonAction** |
| RUTA_MODULO | **view.modulePath** |

**Ejemplo JSON:** Ver spec.md sección parent_sin_submenu_con_vista.

---

## crear_padre_con_submenu → kind = "parent_con_submenu"

| Parámetro actual | MenuSpec |
|------------------|----------|
| NOMBRE_PADRE | **parent.label** |
| NOMBRE_ICONO | **parent.icon** |
| SUBMENU | **parent.submenu** (array de { id, label }) |

Opcional: posición en Sidebar → **parent.position** (ej. "después de Compras"). **Ejemplo JSON:** Ver spec.md sección parent_con_submenu.

---

## crear_padre_con_submenu_y_vistas_base → kind = "parent_con_submenu_y_vistas"

| Parámetro actual | MenuSpec |
|------------------|----------|
| NOMBRE_PADRE | **parent.label** |
| NOMBRE_ICONO | **parent.icon** |
| SUBMENU | **parent.submenu** (cada item puede tener tituloPagina, textoBotonAccion) |
| RUTA_MODULO | **modulePath** |
| UBICACION | **parent.position** |

**Ejemplo JSON:** Ver spec.md sección parent_con_submenu_y_vistas.

---

## crear_hijo → kind = "hijo"

| Parámetro actual | MenuSpec |
|------------------|----------|
| PADRE | **parentRef** (ej. "Componentes", "Compras") |
| VIEW_ID | **child.id** |
| LABEL | **child.label** |

Si el padre es Compras y la opción debe navegar → **child.navigable: true** (o añadir el id a COMPRAS_NAVIGABLE según la estrategia en kinds/hijo.md). **Ejemplo JSON:** Ver spec.md sección hijo.

---

## crear_hijo_con_vista_base → kind = "hijo_con_vista"

| Parámetro actual | MenuSpec |
|------------------|----------|
| PADRE | **parentRef** |
| VIEW_ID | **child.id** |
| LABEL | **child.label** |
| TITULO_PAGINA | **view.title** |
| TEXTO_BOTON_ACCION | **view.buttonAction** |
| RUTA_MODULO | **view.modulePath** |

**Ejemplo JSON:** Ver spec.md sección hijo_con_vista.

---

Para el esquema completo y más ejemplos, ver **spec.md**. Para el flujo de generación, ver **prompt.md**.
