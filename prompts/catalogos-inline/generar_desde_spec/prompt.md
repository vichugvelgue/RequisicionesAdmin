# Generar catalogo inline desde CatalogoInlineSpec (JSON)

Este prompt crea o actualiza un catalogo inline homologado para el sistema.

## Objetivo

Generar una vista o bloque de catalogo inline con estructura consistente:
- `PageCard + ViewHeader` (si es vista completa),
- `InlineInsertInfiniteTable`,
- alta inline,
- edicion inline,
- eliminacion con `ConfirmModal`,
- feedback con `Toast`,
- busqueda global + filtros inline + ordenamiento.

No crear estilos nuevos. Usar componentes de `src/components/UI`.

---

## Input

Entrada esperada:
- Ruta a archivo JSON que cumpla `spec.md`, por ejemplo:
  - `@src/modules/maestros/specs/catalogo-marcas.inline.json`

Si el usuario no pasa JSON:
1. Solicitar datos minimos para construir `CatalogoInlineSpec`.
2. Guardar spec en `src/modules/{{modulo}}/specs/{{nombre}}.inline.json`.
3. Continuar flujo normal con ese spec.

---

## Regla fundamental

No inventar propiedades, columnas o comportamientos fuera del spec.

Si algo no esta en el JSON, no debe aparecer en el codigo.

---

## PRE-CHECK (obligatorio)

Validar las reglas de `spec.md` antes de escribir codigo.

Errores comunes bloqueantes:
- falta columna `"_actions"`,
- modal de eliminacion sin `variant="danger"`,
- iconos de acciones distintos al mapa oficial,
- busqueda habilitada sin criterios,
- filtros inline habilitados sin campos.

Si hay errores:
- no modificar archivos,
- responder con lista de errores y correccion sugerida.

---

## Estrategia de generacion

1. Resolver `target.file`.
   - Si existe: modificar solo `target.component`.
   - Si no existe: crearlo.

2. Aplicar `target.mode`.
   - `vista_completa`: incluir layout base con `PageCard + ViewHeader`.
   - `solo_tabla`: generar solo bloque de tabla y logica asociada.

3. Construir la tabla.
   - Usar `InlineInsertInfiniteTable`.
   - Mapear columnas de `catalog.columns`.
   - Implementar sort desde `catalog.sort`.
   - Implementar filtros inline desde `catalog.inlineFilters`.
   - Implementar busqueda global desde `catalog.search` con `GlobalSearchBar`.

4. Alta inline (`behavior.insert`).
   - Soportar fila `insertRow`.
   - Enter guarda, Escape cancela.
   - Campos configurados en `editableFields`.
   - Normalizar a mayusculas cuando `uppercase=true`.

5. Edicion inline (`behavior.edit`).
   - Al entrar en editar, precargar draft.
   - Guardar con icono y accion estandar.
   - Cancelar revierte draft temporal.

6. Eliminacion inline (`behavior.delete`).
   - Solicitar confirmacion con `ConfirmModal`.
   - Configuracion minima obligatoria:
     - `title` desde spec,
     - `variant="danger"`,
     - icono de eliminar (`Trash2`),
     - `confirmLabel` y `cancelLabel` del spec,
     - mensaje usando `messageTemplate`.
   - Confirmar ejecuta handler real de borrado.
   - Cancelar solo cierra modal.

7. Toast (`behavior.toast`).
   - Mostrar feedback consistente para crear/editar/eliminar.
   - Respetar `durationMs`.

---

## Estandar de iconos por accion (obligatorio)

Usar siempre:
- Agregar: `Plus`
- Editar: `Pencil`
- Eliminar: `Trash2`
- Guardar: `Check`
- Cancelar edicion: `X`

No reemplazar por otros iconos salvo instruccion explicita del usuario.

---

## Restricciones

- No tocar `menuData`, `Sidebar` ni `App.jsx` salvo solicitud explicita.
- No agregar librerias nuevas para iconos.
- No crear CSS o estilos custom nuevos.
- Mantener comportamiento usable en 1080p.

---

## Resultado esperado

1. Spec validado.
2. Archivo objetivo generado/actualizado.
3. Catalogo inline consistente con el patron canónico.
4. Sin cambios colaterales fuera del archivo objetivo (excepto cuando se crea spec nuevo).
