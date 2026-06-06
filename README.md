# Plantilla prompts — front ERP

Plantilla de aplicación web orientada a **interfaces tipo ERP** (sidebar, vistas de listado y formularios) junto con **prompts reutilizables**: menú, formularios, tablas y convenciones documentadas en reglas del editor.

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

## Variables de entorno (mock)

En desarrollo local, actualmente se usan estas variables en `.env.development`:

```env.development
VITE_API_BASE_URL=http://localhost:5214
VITE_BASE_URL=/
VITE_SHOW_COMPONENTES=false
VITE_SHOW_EXAMPLES=false
```
### Descripción

| Variable | Descripción |
|-----------|------------|
| `VITE_API_BASE_URL` | URL base de la API utilizada por la aplicación. |
| `VITE_BASE_URL` | URL base donde se publica la app. |
| `VITE_SHOW_COMPONENTES` | Habilita el módulo de demostración de componentes UI. |
| `VITE_SHOW_EXAMPLES` | Habilita vistas de ejemplo y demostraciones internas. |

### Ejemplo para ambiente local

```env
VITE_API_BASE_URL=http://localhost/RequisicionesAPI
VITE_BASE_URL=/Requisiciones/
VITE_SHOW_COMPONENTES=false
VITE_SHOW_EXAMPLES=false
```

### Ejemplo para ambiente productivo

```env
VITE_API_BASE_URL=http://62.151.179.204/RequisicionesAPI
VITE_BASE_URL=/Requisiciones/
VITE_SHOW_COMPONENTES=false
VITE_SHOW_EXAMPLES=false
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
| `src/modules/` | Módulos por dominio |
| `src/views/` | Vistas generales |
| `src/utils/` | Utilidades y helpers |

El módulo **Componentes** expone pantallas de referencia (inputs, tablas, infinite scroll, layout, feedback, tabs, carga de archivos, etc.) alineadas con el kit de `src/components/UI`.

## Arquitectura

La aplicación está basada en una arquitectura modular orientada a ERP.

## Configuración del router

<BrowserRouter
    basename={import.meta.env.VITE_BASE_URL.replace(/\/$/, '')}
>

### Flujo general

1. `App.jsx` registra las rutas.
2. Las rutas privadas se renderizan dentro de `MainLayout`.
3. `MainLayout` contiene Sidebar, Header y área de contenido.
4. Cada módulo implementa su propia lógica, vistas y servicios.
5. Los componentes reutilizables se centralizan en `src/components/UI`.
6. Los servicios consumen APIs y entregan datos a las vistas.
7. Las vistas únicamente coordinan estado y renderizado.

## Organización de módulos

Se recomienda que cada módulo siga una estructura similar:

```text
src/modules/
└── usuarios/
    ├── pages/
    ├── components/
    ├── services/
    ├── models/
    ├── hooks/
    └── utils/
```

### Descripción

| Carpeta | Propósito |
|----------|------------|
| `pages` | Pantallas principales |
| `components` | Componentes específicos del módulo |
| `services` | Consumo de APIs |
| `models` | Interfaces y tipos |
| `hooks` | Hooks personalizados |
| `utils` | Funciones auxiliares |

## Convenciones de nombres

### Componentes

Utilizar PascalCase.

```tsx
UsuarioForm.tsx
UsuarioTable.tsx
DetalleRequisicionModal.tsx
```

### Hooks

Utilizar prefijo `use`.

```tsx
useUsuarios.ts
useInfiniteScroll.ts
useAuth.ts
```

### Servicios

Utilizar sufijo `Api`.

```tsx
usuarioApi.ts
requisicionApi.ts
catalogoApi.ts
```

### Modelos y tipos

```tsx
Usuario.ts
Requisicion.ts
Catalogo.ts
```

### Variables

```ts
const nombreUsuario = '';
const fechaSolicitud = '';
const listaRequisiciones = [];
```

## Componentes UI

La biblioteca ubicada en:

```text
src/components/UI
```

contiene componentes reutilizables para:

- Inputs
- Selects
- DatePicker
- Tablas
- Infinite Scroll
- Modales
- Confirmaciones
- Alertas
- Tabs
- Drawer
- Upload de archivos
- Feedback visual

### Regla importante

Antes de crear un componente nuevo, verificar si ya existe una implementación equivalente dentro de la biblioteca UI.

## Consumo de APIs

Todo acceso a APIs debe centralizarse en servicios.

### Ejemplo

```ts
export async function listarUsuarios() {
  return api.get('/usuarios');
}
```

### Reglas

- No realizar llamadas HTTP directamente desde componentes visuales.
- Evitar lógica de negocio dentro del JSX.
- Mantener la comunicación con backend dentro de la carpeta `services`.

## Manejo de estado

### Estado local

```tsx
useState
```

### Efectos

```tsx
useEffect
```

### Hooks personalizados

Utilizar hooks para encapsular lógica reutilizable.

```tsx
useUsuarios()
useCatalogos()
```

### Recomendaciones

- Mantener componentes pequeños.
- Evitar estados innecesariamente complejos.
- Separar lógica de presentación y negocio.

## Autenticación y permisos

La autenticación debe obtenerse mediante:

```ts
useAuth()
```

### Recomendaciones

- Validar permisos antes de mostrar acciones sensibles.
- Ocultar botones y opciones que no correspondan al perfil.
- Centralizar la lógica de permisos siempre que sea posible.

## Creación de nuevas vistas

### Paso 1

Crear la página:

```text
src/modules/clientes/pages/ClientesPage.tsx
```

### Paso 2

Crear el servicio:

```text
src/modules/clientes/services/clienteApi.ts
```

### Paso 3

Crear componentes específicos del módulo:

```text
src/modules/clientes/components/
```

### Paso 4

Registrar la ruta en:

```text
src/App.jsx
```

### Paso 5

Agregar opción al menú:

```text
src/data/menuData.jsx
```

### Paso 6

Reutilizar componentes existentes del kit UI.

## Plantillas de documentos Word

La aplicación utiliza plantillas de Microsoft Word para la generación de documentos oficiales de requisiciones.

Las plantillas se encuentran en:

```text
public/plantillas/
```

### Plantillas disponibles

| Archivo | Descripción |
|----------|------------|
| `requisicionbienesmayor.docx` | Documento de requisición para bienes de monto mayor. |
| `requisicionbienesMenor.docx` | Documento de requisición para bienes de monto menor. |
| `requisicionserviciosmayor.docx` | Documento de requisición para servicios de monto mayor. |
| `requisicionServiciosmenor.docx` | Documento de requisición para servicios de monto menor. |

### Consideraciones importantes

- Estas plantillas son utilizadas por el proceso de generación de documentos Word.
- Los placeholders definidos dentro de las plantillas deben coincidir con los datos enviados desde la aplicación.
- Cualquier modificación en los nombres de variables dentro de la plantilla debe reflejarse también en el código que genera el documento.
- No cambiar el nombre de los archivos sin actualizar las referencias correspondientes en la aplicación.
- Las plantillas deben mantenerse dentro de la carpeta `public/documentos/plantillas` para que puedan ser accesibles durante la ejecución.

### Placeholders

Las plantillas utilizan variables dinámicas para reemplazar información al momento de generar el documento.

Ejemplo:

```text
{unidadSolicitante}
{nombreSolicitante}
{fechaSolicitud}
{justificacionGasto}
```

### Partidas

Las plantillas que contienen partidas utilizan estructuras repetitivas (loops) para renderizar múltiples registros.

Ejemplo conceptual:

```text
{#partidas}
{numeroPartida}
{descripcion}
{unidadMedida}
{cantidad}
{/partidas}
```

### Recomendaciones

- Antes de modificar una plantilla, realizar una copia de respaldo.
- Validar siempre la generación completa del documento después de cualquier cambio.
- Mantener consistencia entre los DTO del backend, la estructura enviada por el frontend y los placeholders de la plantilla.