# Ejemplos de invocacion - Catalogo inline desde spec

## Ejemplo 1: Catalogo inline base (vista completa)

**Invocacion:**  
Usa `prompts/catalogos-inline/generar_desde_spec/prompt.md`

**Input:**  
`@src/modules/ejemplos/specs/catalogo-marcas.inline.json`

**Spec (resumen):**
- `target.file = src/modules/maestros/marcas/CatalogoMarcasView.tsx`
- `target.component = CatalogoMarcasView`
- `target.mode = vista_completa`
- `catalog.columns = id, clave, descripcion, estatus, _actions`
- `behavior.delete.confirmModal.variant = danger`
- `behavior.actionsIcons = Plus/Pencil/Trash2/Check/X`

**Resultado esperado (resumen):**
- Vista con `PageCard + ViewHeader`.
- Tabla `InlineInsertInfiniteTable`.
- Alta/edicion/eliminacion inline.
- Modal de eliminacion estandarizado.
- Toast de confirmacion en eliminar/editar.
- Iconografia consistente por accion.

---

## Ejemplo 2: Solo tabla inline para incrustar

**Invocacion:**  
Usa `prompts/catalogos-inline/generar_desde_spec/prompt.md`

**Input:**  
`src/modules/proveedores/specs/catalogo-tipos-proveedor.inline.json`

**Spec (resumen):**
- `target.file = src/modules/proveedores/tipos/CatalogoTiposProveedorInline.tsx`
- `target.component = CatalogoTiposProveedorInline`
- `target.mode = solo_tabla`
- `catalog.search.enabled = true`
- `catalog.inlineFilters.enabled = true`
- `behavior.insert.enabled = true`
- `behavior.edit.enabled = true`
- `behavior.delete.enabled = true`

**Resultado esperado (resumen):**
- Componente reusable sin layout de pagina completo.
- Incluye busqueda global, filtros inline y ordenamiento.
- Incluye `ConfirmModal` con `variant="danger"` y labels de eliminar/cancelar.
- Respeta iconos oficiales por accion.

---

## Ejemplo 3: Spec invalido (debe rechazar generacion)

**Invocacion:**  
Usa `prompts/catalogos-inline/generar_desde_spec/prompt.md`

**Input:**  
`@src/modules/maestros/specs/catalogo-invalid.inline.json`

**Errores del spec:**
- `behavior.delete.confirmModal.variant = warning`
- `behavior.actionsIcons.delete = Trash`

**Resultado esperado (resumen):**
- No modificar archivos.
- Responder lista de errores con correccion:
  - `variant` debe ser `danger`.
  - Icono de eliminar debe ser `Trash2`.
