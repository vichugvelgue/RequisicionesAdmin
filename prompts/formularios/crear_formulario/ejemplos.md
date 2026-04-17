# Ejemplos de invocación – Crear/actualizar formulario

## Ejemplo 1: Formulario completo de “Nuevo material”

**Invocación:**  
Usa `prompts/formularios/crear_formulario/prompt.md`

**Input:**
- ARCHIVO_DESTINO = @src/views/catalogos/NuevoMaterialView.tsx
- NOMBRE_COMPONENTE_VISTA = NuevoMaterialView
- MODO_SALIDA = vista_completa
- TITULO_PAGINA = Nuevo material
- DESCRIPCION = Captura los datos básicos del material.
- FUENTE_DATOS = El formulario maneja un estado local de React Hook Form con `defaultValues` vacíos; en el futuro podrá recibir un `material` como prop para modo edición.
- ACCIONES_PRINCIPALES = [
  { id: 'guardar', label: 'Guardar', variante: 'primary', icono: 'Save', tipoAccion: 'submit' },
  { id: 'cancelar', label: 'Cancelar', variante: 'secondary', icono: 'X', tipoAccion: 'navegar', destino: 'Dashboard' }
]
- CAMPOS = [
  { id: 'nombre', label: 'Nombre', tipoCampo: 'texto', requerido: true, mensajeRequerido: 'El nombre es obligatorio', anchoCols: 'col-span-8' },
  { id: 'clave', label: 'Clave interna', tipoCampo: 'texto', requerido: true, anchoCols: 'col-span-4' },
  { id: 'unidad', label: 'Unidad de medida', tipoCampo: 'select', requerido: true, anchoCols: 'col-span-4', opciones: [
      { value: 'PZA', label: 'Pieza' },
      { value: 'M2', label: 'Metro cuadrado' },
      { value: 'M3', label: 'Metro cúbico' }
    ]
  },
  { id: 'descripcion', label: 'Descripción', tipoCampo: 'textarea', requerido: false, ayuda: 'Describe brevemente el material', anchoCols: 'col-span-12' },
  { id: 'estatus', label: 'Estatus', tipoCampo: 'select', requerido: true, anchoCols: 'col-span-4', opciones: [
      { value: 'Activa', label: 'Activa' },
      { value: 'Baja', label: 'Baja' }
    ]
  }
]
- SECCIONES = [
  {
    id: 'generales',
    titulo: 'Datos generales',
    subtitulo: 'Información principal del material',
    campos: ['nombre', 'clave', 'unidad', 'descripcion', 'estatus']
  }
]

**Resultado esperado (resumen):**
- Se crea/actualiza `src/views/catalogos/NuevoMaterialView.tsx` con un componente `NuevoMaterialView` que:
  - Usa el layout tipo Requisiciones: wrapper con fondo `bg-slate-50`, `PageCard` y `ViewHeader` con título y botones de Guardar/Cancelar.
  - Inicializa React Hook Form + Yup con campos `nombre`, `clave`, `unidad`, `descripcion`, `estatus`.
  - Renderiza un formulario dentro de un `FormSection` “Datos generales” con grilla `grid-cols-12` y los anchos definidos.
  - Valida campos requeridos y muestra errores debajo de cada input.
  - Tras enviar el formulario, muestra Toast de éxito (y en caso de error, Toast de error); el Toast se oculta solo a los 2–3 segundos.

---

## Ejemplo 2: Solo bloque de formulario para filtros avanzados

**Invocación:**  
Usa `prompts/formularios/crear_formulario/prompt.md`

**Input:**
- ARCHIVO_DESTINO = @src/components/filters/FiltroPagosAvanzado.tsx
- NOMBRE_COMPONENTE_VISTA = FiltroPagosAvanzado
- MODO_SALIDA = solo_formulario
- FUENTE_DATOS = El componente recibe una prop `onApply` que se llama con los valores validados del formulario cuando el usuario hace submit.
- CAMPOS = [
  { id: 'fechaInicio', label: 'Fecha inicio', tipoCampo: 'fecha', requerido: false, anchoCols: 'col-span-6' },
  { id: 'fechaFin', label: 'Fecha fin', tipoCampo: 'fecha', requerido: false, anchoCols: 'col-span-6' },
  { id: 'proveedor', label: 'Proveedor', tipoCampo: 'searchableSelect', requerido: false, anchoCols: 'col-span-12', opciones: 'PROVEEDORES_MOCK' },
  { id: 'estatus', label: 'Estatus', tipoCampo: 'select', requerido: false, anchoCols: 'col-span-6', opciones: [
      { value: '', label: 'Todos' },
      { value: 'Pendiente', label: 'Pendiente' },
      { value: 'Pagado', label: 'Pagado' },
      { value: 'Cancelado', label: 'Cancelado' }
    ]
  },
  { id: 'soloConFactura', label: 'Solo con factura', tipoCampo: 'checkbox', requerido: false, anchoCols: 'col-span-6' }
]
- VALIDACIONES_GLOBALES = [
  { id: 'rangoFechas', descripcion: 'Si ambas fechas están llenas, fechaFin debe ser mayor o igual a fechaInicio.' }
]

**Resultado esperado (resumen):**
- Se crea/actualiza `src/components/filters/FiltroPagosAvanzado.tsx` con un componente `FiltroPagosAvanzado` que:
  - **No** usa `PageCard` ni `ViewHeader`, solo el `<form>` y la grilla de campos.
  - Usa React Hook Form + Yup para manejar valores y validar el rango de fechas con un `.test(...)` a nivel de esquema.
  - Llama a `onApply(valores)` al hacer submit cuando el formulario es válido.

---

## Ejemplo 3: Formulario demo con todas las validaciones

**Invocación:**  
Usa `prompts/formularios/crear_formulario/prompt.md`

**Input:**
- ARCHIVO_DESTINO = @src/views/demo/FormularioValidacionesDemoView.tsx
- NOMBRE_COMPONENTE_VISTA = FormularioValidacionesDemoView
- MODO_SALIDA = vista_completa
- TITULO_PAGINA = Formulario de validaciones demo
- DESCRIPCION = Demostración de todos los tipos de validación soportados.
- FUENTE_DATOS = El formulario se maneja totalmente con React Hook Form y no recibe props externas; se inicializa con `defaultValues` básicos.
- ACCIONES_PRINCIPALES = [
  { id: 'guardar', label: 'Probar validaciones', variante: 'primary', icono: 'Check', tipoAccion: 'submit' }
]
- CAMPOS = [
  { id: 'nombre', label: 'Nombre', tipoCampo: 'texto', requerido: true, mensajeRequerido: 'El nombre es obligatorio', anchoCols: 'col-span-6', validaciones: { minLength: 3, maxLength: 50, pattern: '^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$', mensajeErrorPattern: 'Solo se permiten letras y espacios' } },
  { id: 'email', label: 'Correo electrónico', tipoCampo: 'texto', requerido: true, anchoCols: 'col-span-6', validaciones: { pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$', mensajeErrorPattern: 'Correo electrónico inválido' } },
  { id: 'edad', label: 'Edad', tipoCampo: 'numero', requerido: true, anchoCols: 'col-span-4', validaciones: { min: 18, max: 99 } },
  { id: 'monto', label: 'Monto', tipoCampo: 'moneda', requerido: true, anchoCols: 'col-span-4', validaciones: { min: 0, max: 100000 } },
  { id: 'fechaInicio', label: 'Fecha inicio', tipoCampo: 'fecha', requerido: true, anchoCols: 'col-span-4', validaciones: { formatoFecha: 'dd/MM/yyyy' } },
  { id: 'fechaFin', label: 'Fecha fin', tipoCampo: 'fecha', requerido: true, anchoCols: 'col-span-4', validaciones: { formatoFecha: 'dd/MM/yyyy' } },
  { id: 'tipoCredito', label: 'Tipo de crédito', tipoCampo: 'select', requerido: true, anchoCols: 'col-span-4', opciones: [
      { value: 'contado', label: 'Contado' },
      { value: 'credito', label: 'Crédito' }
    ]
  },
  { id: 'diasCredito', label: 'Días de crédito', tipoCampo: 'numero', requerido: false, anchoCols: 'col-span-4', ayuda: 'Campo obligatorio solo cuando el tipo es Crédito', validaciones: { min: 0, max: 120 } },
  { id: 'aceptaTerminos', label: 'Acepto términos y condiciones', tipoCampo: 'checkbox', requerido: true, mensajeRequerido: 'Debes aceptar los términos para continuar', anchoCols: 'col-span-12' }
]
- SECCIONES = [
  {
    id: 'basicos',
    titulo: 'Datos básicos',
    subtitulo: 'Campos de texto y email',
    campos: ['nombre', 'email']
  },
  {
    id: 'numericosFechas',
    titulo: 'Números y fechas',
    subtitulo: 'Rangos de valores y fechas relacionadas',
    campos: ['edad', 'monto', 'fechaInicio', 'fechaFin']
  },
  {
    id: 'credito',
    titulo: 'Crédito',
    subtitulo: 'Validaciones condicionales',
    campos: ['tipoCredito', 'diasCredito']
  },
  {
    id: 'legales',
    titulo: 'Legales',
    campos: ['aceptaTerminos']
  }
]
- VALIDACIONES_GLOBALES = [
  {
    id: 'rangoFechas',
    descripcion: 'fechaFin debe ser mayor o igual que fechaInicio si ambas están definidas.'
  },
  {
    id: 'diasCreditoCuandoAplica',
    descripcion: 'Si tipoCredito = \"credito\", entonces diasCredito es requerido y debe ser mayor que 0.'
  }
]

**Resultado esperado (resumen):**
- Se crea/actualiza `src/views/demo/FormularioValidacionesDemoView.tsx` con un componente que:
  - Usa el layout de página estándar (wrapper, `PageCard`, `ViewHeader`, `FormSection` agrupando campos).
  - Define un tipo `FormValues` y un esquema Yup con:
    - `yup.string().required().min().max().matches()` para `nombre`.
    - `yup.string().required().matches(...)` para `email`.
    - `yup.number().required().min().max()` para `edad` y `monto`.
    - `yup.date()` (o string tratado como fecha) para `fechaInicio` y `fechaFin`, con un test global para asegurar el rango correcto.
    - `yup.string().required()` para `tipoCredito`.
    - Regla condicional global que hace `diasCredito` requerido y mayor que 0 cuando `tipoCredito = 'credito'`.
    - `yup.boolean().oneOf([true], '...')` para `aceptaTerminos`.
  - Usa React Hook Form (`useForm` + `yupResolver(schema)`) para manejar el formulario y muestra todos los mensajes de error debajo de cada campo.

