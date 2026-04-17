> Prompt para que el agente genere o actualice **vistas de formularios** usando los **componentes de UI existentes** (`PageCard`, `ViewHeader`, `FormSection`, `Label`, `Input`, `Select`, `SearchableSelect`, `Checkbox`, `Switch`, `Button`, `StatusBadge`, `ConfirmModal`, `Toast`, etc.) y el layout genérico de página (patrón Requisiciones).
+
# Crear/actualizar formulario (React Hook Form + Yup)
+
Genera o modifica una vista que muestra un **formulario** estándar del ERP, basado en:
+
- Layout de página: `PageCard` + `ViewHeader` + `FormSection` (cuando aplica).
- Manejo de formulario con **React Hook Form**.
- Validación con **Yup** mediante `yupResolver`.

Soporta:

- Vistas de formulario completas (pantalla de alta/edición).
- Solo el **bloque de formulario** para incrustar en otra vista.
- Agrupación por secciones, distintos tipos de campo y reglas de validación.

---

## Input

Define estos parámetros al invocar el prompt.

| Parámetro                 | Descripción |
|---------------------------|------------|
| `ARCHIVO_DESTINO`         | **Obligatorio.** Archivo donde se generará o actualizará la vista de formulario. Acepta ruta relativa (ej. `src/views/compras/NuevaRequisicionView.jsx`) o referencia Cursor con `@` (ej. `@src/views/compras/NuevaRequisicionView.jsx`). |
| `NOMBRE_COMPONENTE_VISTA` | **Obligatorio.** Nombre del componente React principal de la vista (ej. `FormularioProveedorView`). Debe exportarse con `export function {{NOMBRE_COMPONENTE_VISTA}}(...) { ... }`. |
| `MODO_SALIDA`             | **Obligatorio.** Controla la forma en que se genera el código. Valores esperados: `vista_completa` \| `solo_formulario`. `vista_completa` genera una página de formulario con layout completo; `solo_formulario` genera solo el bloque JSX y lógica del formulario para incrustar en otra vista. |
| `TITULO_PAGINA`           | Opcional. Título para el `ViewHeader` (ej. `"Nuevo material"`, `"Editar proveedor"`). Si se omite y `MODO_SALIDA = vista_completa`, derivar un título razonable a partir del contexto. |
| `DESCRIPCION`             | Opcional. Descripción corta a mostrar debajo del título si la vista lo necesita. |
| `ACCIONES_PRINCIPALES`    | Opcional. Lista de acciones principales en el header (normalmente botones), ej.: `[{ id: 'guardar', label: 'Guardar', variante: 'primary', icono: 'Save', tipoAccion: 'submit' }, { id: 'cancelar', label: 'Cancelar', variante: 'secondary', icono: 'X', tipoAccion: 'navegar', destino: 'Requisiciones' }]`. |
| `FUENTE_DATOS`            | **Obligatorio.** Describe cómo llegan los datos al formulario: nombre del objeto de valores (ej. `registro`, `material`, `formValues`), si viene como prop o se maneja como estado local, y si hay modo edición/alta (ej. \"si `registro` viene definido, es edición; si no, alta\"). |
| `CAMPOS`                  | **Obligatorio.** Lista de definición de campos del formulario (ver detalle más abajo). |
| `SECCIONES`               | Opcional. Agrupación de campos en bloques de `FormSection` con título/subtítulo, layout de columnas y orden de campos. |
| `VALIDACIONES_GLOBALES`   | Opcional. Reglas de validación que involucran más de un campo (ej. \"fechaFin >= fechaInicio\", \"si tipo = 'Crédito' entonces `diasCredito` es requerido\"). Se traducen a tests de Yup a nivel de esquema. |
| `MODO_EDICION`            | Opcional. Flags para controlar el comportamiento en edición: campos solo lectura, valores iniciales especiales, visibilidad condicional, etc. Ej.: `{ soportaEdicion: true, camposSoloLectura: ['id', 'folio'] }`. |

### Detalle del parámetro `CAMPOS`

`CAMPOS` debe describir cada campo del formulario como una lista de objetos:

```text
{
  id: string;
  label: string;
  tipoCampo: 'texto' | 'textarea' | 'numero' | 'moneda' | 'fecha' | 'datetime' | 'select' | 'searchableSelect' | 'checkbox' | 'switch' | 'radioGroup';
  placeholder?: string;
  requerido?: boolean;
  mensajeRequerido?: string;
  ayuda?: string;
  anchoCols?: string; // ej. 'col-span-6', 'col-span-12'
  opciones?: 'OBRAS_MOCK' | 'COMPRADORES_MOCK' | 'PROVEEDORES_MOCK' | Array<{ value: string; label: string }>;
  dependencia?: {
    campo: string;
    valorIgualA?: string | number | boolean;
    mostrarSiVerdadero?: boolean; // por defecto true
  };
  validaciones?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;           // regex en forma de string
    mensajeErrorPattern?: string;
    formatoFecha?: 'dd/MM/yyyy' | 'ISO' | string;
  };
}
```

Campos clave:

- `id`: nombre del campo en el objeto de valores (`registro[id]`).
- `label`: texto visible al usuario.
- `tipoCampo`: decide qué componente de UI usar:
  - `texto`, `textarea`, `numero`, `moneda`, `fecha`, `datetime` → `Input` (con variantes o `type` adecuado).
  - `select` → `Select`.
  - `searchableSelect` → `SearchableSelect`.
  - `checkbox`, `switch` → componente de toggle correspondiente.
  - `radioGroup` → grupo de opciones exclusivas.
- `anchoCols`: controla el ancho relativo en una grilla `grid-cols-12` (ej. 2 campos `col-span-6`, 3 campos `col-span-4`, etc.).
- `opciones`: para selects; puede apuntar a catálogos mock (`OBRAS_MOCK`, etc.) o una lista local de opciones.
- `dependencia`: visibilidad/estado condicional en función de otro campo.
- `validaciones`: reglas adicionales que se traducen al esquema Yup.

---

## React Hook Form + Yup

Todos los formularios generados con este prompt deben usar:

- **React Hook Form** (`useForm`, `Controller` cuando aplique).
- **Yup** como esquema de validación, integrado vía `yupResolver`.

Comportamiento esperado:

- Construir un esquema base:

```ts
const schema = yup.object({
  // derivado de CAMPOS y VALIDACIONES_GLOBALES
});
```

- Inicializar el formulario:

```ts
const {
  control,
  register,
  handleSubmit,
  formState: { errors },
  reset,
} = useForm<FormValues>({
  resolver: yupResolver(schema),
  defaultValues: {/* según FUENTE_DATOS y MODO_EDICION */},
});
```

- Para campos simples (`texto`, `numero`, `moneda`, `fecha`, `datetime`): usar `register`.
- Para componentes controlados (`Select`, `SearchableSelect`, `Switch`, `Checkbox`, `radioGroup`): usar `Controller` con `control`.
- Mostrar errores debajo de cada campo usando `errors[id]?.message`.

Traducción de reglas de `CAMPOS` a Yup:

- `requerido: true` → `.required(mensajeRequerido || 'Campo requerido')`.
- `minLength`, `maxLength` en campos de texto → `yup.string().min(...).max(...)`.
- `min`, `max` en campos numéricos/moneda → `yup.number().min(...).max(...)`.
- `pattern` → `.matches(new RegExp(pattern), mensajeErrorPattern || 'Formato inválido')`.
- `formatoFecha` → usar `yup.date()` y, si aplica, normalizar/parsear en el onChange/onBlur del campo.

`VALIDACIONES_GLOBALES` se traducen a `.test(...)` en el esquema principal (ej. verificar que `fechaFin >= fechaInicio`).

---

## Instrucciones para el agente

### 1. Resolver `ARCHIVO_DESTINO`

- Si `ARCHIVO_DESTINO` comienza con `@`, quitar el `@` y usar el resto como ruta relativa dentro del repo.
- Si no tiene `@`, usar la ruta tal cual.
- Si el archivo **existe**, **modificar o reemplazar** únicamente el componente `{{NOMBRE_COMPONENTE_VISTA}}` para agregar o actualizar el formulario según el Input.
- Si el archivo **no existe**, crearlo con el contenido adecuado según `MODO_SALIDA`.

### 2. Comportamiento según `MODO_SALIDA`

#### `MODO_SALIDA = "vista_completa"`

- Generar una **vista de formulario completa** usando el patrón Requisiciones:
  - Wrapper raíz: `<div className="flex-1 flex flex-col min-h-0 bg-slate-50 p-4 lg:p-6 overflow-auto">`.
  - `PageCard` como contenedor principal.
  - `ViewHeader` con:
    - `title` = `TITULO_PAGINA` (o derivado del contexto).
    - `subtitle` opcional si `DESCRIPCION` está presente.
    - `action` = bloque de botones derivados de `ACCIONES_PRINCIPALES` (usando `Button` con iconos Lucide).
  - Uno o varios `FormSection` para organizar los campos, según `SECCIONES` (o una sola sección por defecto).
- Incluir el formulario con `<form onSubmit={handleSubmit(onSubmit)}>...</form>` alrededor de los campos.
- Manejar envío:
  - `onSubmit` recibe los datos validados desde React Hook Form.
  - Ejecutar las acciones definidas en `ACCIONES_PRINCIPALES` (por ejemplo, disparar un callback, llamar a un helper, navegar usando `setActiveView`, etc.).
- **Feedback al guardar (Toast)** — cuando exista al menos una acción principal de tipo `submit` (ej. Guardar):
  - Estado local para el Toast: p. ej. un objeto `toast` con `{ visible, variant, title, description }` o variables `showToast`, `toastVariant`, `toastTitle`/`toastDescription`.
  - En `onSubmit`: en **éxito** (tras guardar o tras el placeholder), mostrar Toast con `variant="success"`, título contextual (ej. "Guardado correctamente") y descripción opcional; en **error** (try/catch o cuando falle la operación), mostrar Toast con `variant="error"` y mensaje de error.
  - Auto-ocultar: `useEffect` que, cuando el Toast esté visible, programe un `setTimeout` de 2–3 s para ocultarlo y limpie el timeout en el cleanup.
  - Renderizar `<Toast visible={...} title={...} variant={...} description={...} />` en la vista (p. ej. al final del JSX).
  - Si el guardado es aún mock (ej. `console.log`), mostrar igual Toast de éxito para dejar el flujo listo; al conectar la API, añadir Toast de error en el `catch`.

#### `MODO_SALIDA = "solo_formulario"`

- **No** usar `PageCard` ni `ViewHeader`.
- Generar **solo el bloque de formulario** y la lógica de React Hook Form + Yup (incluyendo esquema, `useForm`, `handleSubmit`, `errors`) listo para incrustar dentro de otro layout.
- El componente puede ser el mismo `{{NOMBRE_COMPONENTE_VISTA}}` o un subcomponente, según convenga, pero debe estar completamente funcional por sí mismo.

### 3. Layout del formulario

- Usar `FormSection` desde `components/UI` para agrupar campos por lógica (datos generales, datos fiscales, parámetros, etc.).
- Dentro de cada `FormSection`, usar un contenedor con grilla:

```jsx
<FormSection title="Datos generales">
  <div className="grid grid-cols-12 gap-4">
    {/* campos con anchoCols mapeado a col-span-X */}
  </div>
</FormSection>
```

- Para cada campo:
  - `Label` + componente de entrada (`Input`, `Select`, `SearchableSelect`, etc.).
  - Texto de ayuda (`ayuda`) en una etiqueta pequeña debajo, si se proporcionó.
  - Mensaje de error usando `errors[id]?.message`.

### 4. Uso de componentes UI

- Entradas:
  - `Input` para texto, números, montos y fechas simples.
  - `Select` y `SearchableSelect` para catálogos.
  - `Checkbox`/`Switch`/radio group para booleanos y opciones excluyentes.
- Acciones:
  - `Button` para Guardar/Cancelar/Nuevo, usando variantes existentes (`primary`, `secondary`, `danger`, etc.).
- Feedback/estado:
  - **Toast**: Para feedback al guardar (éxito/error) en formularios con acción de tipo submit; implementar según la subsección "Feedback al guardar (Toast)" anterior. Para otros usos (ej. "Partida agregada"), opcional según contexto.
  - `StatusBadge` para mostrar estatus del registro cuando aplique.
  - `ConfirmModal` para confirmar acciones destructivas (ej. eliminar/cancelar).

### 5. Estado, handlers y edición

- El estado principal del formulario debe provenir de **React Hook Form**:
  - No usar `useState` por campo salvo que sea estrictamente necesario para UI auxiliar (ej. toggles internos que no formen parte de los datos).
- Para edición:
  - Usar `defaultValues` en `useForm` basados en `FUENTE_DATOS` y `MODO_EDICION`.
  - Respetar `camposSoloLectura` deshabilitando inputs cuando corresponda.

### 6. Convenciones y restricciones

- No crear estilos nuevos; reutilizar las clases utilitarias y patrones que ya existen en vistas como `RequisicionesView` y `ComponentesLayoutView`.
- Mantener componentes funcionales y tipos existentes (`SetActiveViewProps`, etc.).
- Limitar cambios **al archivo de la vista objetivo**; no modificar menú, sidebar ni `App.jsx`.

---

## Archivos del proyecto implicados

- Vista objetivo: `ARCHIVO_DESTINO`.
- Componentes de formulario y layout: `src/components/UI/*`, `src/components/layout/*`.
- No tocar: `src/data/menuData.jsx`, `src/components/layout/Sidebar.jsx`, `src/App.jsx`.

---

Para ver ejemplos concretos de invocación y resultado esperado, consulta `ejemplos.md` en esta misma carpeta.

