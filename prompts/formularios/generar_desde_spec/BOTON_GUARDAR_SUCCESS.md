# Botón Guardar (success) y enlace "Volver" — Convención FormSpec

## Aplicado en spec y prompt

- **spec.md**: `page.actions[]` para submit usa **variant "success"** (verde); `page.backLink` define el enlace "Volver a [Nombre]" encima del PageCard.
- **prompt.md**: Layout vista_completa incluye BackLink con `page.backLink.label` y `page.backLink.destination`; botón Guardar con variant "success"; "Guardar cambios" en edición.

## Reglas

1. **Botón Guardar (submit)**
   - Variant **"success"** (verde). Referencia: `src/components/UI/Button/Button.tsx`, tipos en `src/components/UI/types.ts` (`ButtonVariant`).
   - Label: "Guardar" en alta, **"Guardar cambios"** en modo edición cuando exista id de registro.

2. **Enlace "Regresar"**
   - No es un botón en el ViewHeader. Se usa **BackLink** encima del PageCard (misma ubicación que en Requisiciones).
   - Texto: **"Volver a [Nombre del listado]"** (ej. "Volver a Requisiciones", "Volver a Insumos").
   - En el spec: `page.backLink`: `{ "label": "Volver a ...", "destination": "/ruta/listado" }`.

## Referencia de implementación
- Requisiciones: `src/modules/compras/requisiciones/NuevaRequisicionView.tsx` (BackLink + ViewHeader con Guardar).
- Explosión: `src/modules/gestion-proyectos/insumos/NuevaExplosionView.tsx`.
