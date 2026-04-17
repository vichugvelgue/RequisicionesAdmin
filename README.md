# Plantilla prompts Cursor — front ERP

Plantilla de aplicación web orientada a **interfaces tipo ERP** (sidebar, vistas de listado y formularios) junto con **prompts reutilizables** para Cursor: menú, formularios, tablas y convenciones documentadas en reglas del editor.

## Stack

- **React 19** + **Vite 7**
- **React Router** para rutas bajo `MainLayout`
- **Tailwind CSS 3** para estilos
- **TypeScript** y **JavaScript** (código mezclado según módulos)
- **lucide-react** para iconos
- **react-day-picker** para fechas (integrado en componentes de UI)

## Arranque rápido

```bash
npm install
npm run dev
```

Otros scripts:

- `npm run build` — build de producción
- `npm run preview` — vista previa del build
- `npm run lint` — ESLint

## Estructura del código

| Ruta | Rol |
|------|-----|
| `src/App.jsx` | Definición de rutas |
| `src/main.jsx` | Entrada de la app |
| `src/components/layout/` | Layout principal, sidebar, topbar |
| `src/components/UI/` | Biblioteca de UI (tablas, formularios, modales, fechas, etc.) |
| `src/components/common/` | Componentes compartidos fuera del kit base |
| `src/data/menuData.jsx` | Datos del menú lateral |
| `src/modules/` | Módulos por dominio (p. ej. `componentes/` como galería de demos) |
| `src/views/` | Vistas sueltas (p. ej. dashboard) |
| `src/utils/` | Utilidades (`dateFormat`, formatos monetarios, etc.) |

El módulo **Componentes** expone pantallas de referencia (inputs, tablas, infinite scroll, layout, feedback, tabs, carga de archivos, etc.) alineadas con el kit de `src/components/UI`.

## Prompts (`prompts/`)

En `prompts/` hay especificaciones para que el agente (o un desarrollador) genere cambios de forma consistente:

- **Menú y sidebar:** divisiones, padres, hijos, vistas base; punto de entrada recomendado `prompts/menu/generar_desde_spec/` con MenuSpec en JSON.
- **Tablas:** `prompts/tablas/` (incluye enfoque con **InfiniteScrollTable** donde aplique).
- **Formularios:** `prompts/formularios/` (`generar_desde_spec`, `crear_formulario`).

Índice detallado y flujo de invocación: **[prompts/README.md](./prompts/README.md)**.

Si pides crear menú, formulario o tabla **sin** indicar un prompt concreto, en el proyecto se espera consultar `prompts/README.md` y, cuando corresponda, guiar por el spec `generar_desde_spec` del dominio (ver `.cursor/rules/prompts-flujo.mdc`).

## Convenciones (Cursor)

En **`.cursor/rules/`** están las guías que el asistente debe seguir en este workspace, entre ellas:

- **Layout 1080p**, menú/sidebar, reutilización de `src/components/UI`, iconos solo Lucide.
- **Tablas:** texto en celdas en mayúsculas (datos); cantidades con 4 decimales y montos con 2 donde se use `DecimalStringCellInput` y patrones afines.
- **Fechas:** presentación estándar **DD-MMM-YYYY** (mes en tres letras en español) vía `src/utils/dateFormat.js` y componentes de fecha de UI.

## Licencia y propiedad

El campo `private: true` en `package.json` indica uso interno o de plantilla; ajusta licencia y metadatos si publicas el repositorio.
