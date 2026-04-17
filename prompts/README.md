# Prompts reutilizables – Menú y sidebar

Prompts reutilizables para generar funcionalidades sin repetir lógica. Están organizados por función: **menu** (menú y sidebar), **tablas**, **formularios** y **catalogos-inline**.

## Estructura

Los prompts se agrupan por función en subcarpetas de `prompts/`. Dentro de cada función (ej. `menu/`), cada prompt tiene su **subcarpeta** con dos archivos:

- **`prompt.md`** – Descripción, Input (parámetros) e instrucciones del prompt.
- **`ejemplos.md`** – Ejemplos de invocación con Input de ejemplo y resultado esperado.

## Cómo usar

1. Elige el prompt según lo que quieras añadir (índice abajo).
2. Lee `prompt.md` de esa carpeta para los parámetros de Input y las instrucciones.
3. Invoca: **Usa prompts/menu/crear_hijo/prompt.md** (o la ruta del prompt elegido).
4. Pasa los valores de Input en el mensaje (ej. "Input: PADRE=Componentes, VIEW_ID=ComponentesModals, LABEL=Modals").
5. Si necesitas referencia, consulta `ejemplos.md` en la misma carpeta.

## Índice – Prompts de menú (`prompts/menu/`)

**Recomendado (desde JSON):** [menu/generar_desde_spec/](./menu/generar_desde_spec/) — Un único punto de entrada que acepta un MenuSpec en JSON. Cubre los 7 casos (división, padre sin/con submenú, hijo con/sin vista) mediante el campo `kind`. Invocación: Usa prompts/menu/generar_desde_spec/prompt.md + Input: archivo JSON (ver [spec.md](./menu/generar_desde_spec/spec.md) y [migracion.md](./menu/generar_desde_spec/migracion.md)). Los prompts crear_* siguen disponibles como alternativa con parámetros sueltos.

| Carpeta | Qué añade | Input principal | Archivos |
|---------|-----------|-----------------|----------|
| [menu/generar_desde_spec/](./menu/generar_desde_spec/) | Cualquier opción de menú desde JSON (division, parent_*, hijo, hijo_con_vista) | Archivo MenuSpec JSON (kind + bloques según tipo) | [prompt.md](./menu/generar_desde_spec/prompt.md), [spec.md](./menu/generar_desde_spec/spec.md), [migracion.md](./menu/generar_desde_spec/migracion.md), kinds/*.md |
| [menu/crear_division/](./menu/crear_division/) | Etiqueta/división (ej. "Módulos") | TEXTO, POSICION | [prompt.md](./menu/crear_division/prompt.md), [ejemplos.md](./menu/crear_division/ejemplos.md) |
| [menu/crear_padre_sin_submenu/](./menu/crear_padre_sin_submenu/) | Opción de primer nivel sin submenú | LABEL, NOMBRE_ICONO, VIEW_ID (opcional) | [prompt.md](./menu/crear_padre_sin_submenu/prompt.md), [ejemplos.md](./menu/crear_padre_sin_submenu/ejemplos.md) |
| [menu/crear_padre_sin_submenu_con_vista_base/](./menu/crear_padre_sin_submenu_con_vista_base/) | Opción de primer nivel sin submenú + vista con layout base | LABEL, NOMBRE_ICONO, VIEW_ID, TITULO_PAGINA, DESCRIPCION (opc.), RUTA_MODULO (opc.) | [prompt.md](./menu/crear_padre_sin_submenu_con_vista_base/prompt.md), [ejemplos.md](./menu/crear_padre_sin_submenu_con_vista_base/ejemplos.md) |
| [menu/crear_padre_con_submenu/](./menu/crear_padre_con_submenu/) | Opción expandible con subopciones | NOMBRE_PADRE, NOMBRE_ICONO, SUBMENU | [prompt.md](./menu/crear_padre_con_submenu/prompt.md), [ejemplos.md](./menu/crear_padre_con_submenu/ejemplos.md) |
| [menu/crear_padre_con_submenu_y_vistas_base/](./menu/crear_padre_con_submenu_y_vistas_base/) | Opción expandible + hijos + vista con layout base por cada hijo | NOMBRE_PADRE, NOMBRE_ICONO, SUBMENU, RUTA_MODULO (opc.) | [prompt.md](./menu/crear_padre_con_submenu_y_vistas_base/prompt.md), [ejemplos.md](./menu/crear_padre_con_submenu_y_vistas_base/ejemplos.md) |
| [menu/crear_hijo/](./menu/crear_hijo/) | Subopción dentro de un padre existente | PADRE, VIEW_ID, LABEL | [prompt.md](./menu/crear_hijo/prompt.md), [ejemplos.md](./menu/crear_hijo/ejemplos.md) |
| [menu/crear_hijo_con_vista_base/](./menu/crear_hijo_con_vista_base/) | Subopción + vista con layout base generada | PADRE, VIEW_ID, LABEL, TITULO_PAGINA, DESCRIPCION (opc.), RUTA_MODULO (opc.) | [prompt.md](./menu/crear_hijo_con_vista_base/prompt.md), [ejemplos.md](./menu/crear_hijo_con_vista_base/ejemplos.md) |

## Prompts de tablas (`prompts/tablas/`)

Para generar vistas con tablas desde JSON (TableSpec) o con parámetros sueltos, ver `prompts/tablas/generar_desde_spec/` y `prompts/tablas/crear_tabla/`. Las tablas con **infinite scroll** (búsqueda global, filtros por columna, orden, acciones y pie "Mostrando X de Y") se generan usando el componente **InfiniteScrollTable** de `src/components/UI`; ver las instrucciones en cada prompt.

## Prompts de catálogos inline (`prompts/catalogos-inline/`)

Para generar catálogos inline homogéneos (alta, edición, eliminación con modal, búsqueda, filtros inline y orden) usar:

- [catalogos-inline/generar_desde_spec/](./catalogos-inline/generar_desde_spec/) — Prompt recomendado desde JSON (`CatalogoInlineSpec`).
  - [prompt.md](./catalogos-inline/generar_desde_spec/prompt.md)
  - [spec.md](./catalogos-inline/generar_desde_spec/spec.md)
  - [ejemplos.md](./catalogos-inline/generar_desde_spec/ejemplos.md)

Estándares obligatorios del dominio:
- `InlineInsertInfiniteTable` como tabla base.
- `ConfirmModal` para eliminar con `variant="danger"`.
- Iconos fijos por acción: `Plus`, `Pencil`, `Trash2`, `Check`, `X`.

## Archivos del proyecto implicados

- **Menú (datos):** `src/data/menuData.jsx`
- **Sidebar (UI):** `src/components/layout/Sidebar.jsx`, `src/components/layout/sidebar/*.jsx`
- **Vistas:** `src/App.jsx` (condiciones por `activeView`)
- **Iconos:** [Lucide](https://lucide.dev/icons/) vía `lucide-react`
