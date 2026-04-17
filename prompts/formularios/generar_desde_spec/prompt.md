# Generar / actualizar formulario desde FormSpec (JSON)

Este prompt genera o actualiza una única vista de formulario a partir de un objeto JSON llamado FormSpec.

El formulario debe usar exclusivamente los componentes UI existentes del proyecto:

PageCard  
ViewHeader  
FormSection  
Label  
Input  
Select  
SearchableSelect  
Checkbox  
Switch  
Button  
Toast  

No crear estilos nuevos.

No modificar:

- Sidebar
- menuData
- App.jsx
- Layout global

Solo generar o modificar el archivo indicado en `target.file`.

---

# Regla fundamental

NO inventar nada fuera del JSON.

No agregar campos  
No agregar validaciones  
No agregar secciones  
No agregar opciones de select  

Si algo no está en el JSON, no debe aparecer en el código.

---

# Input

El input es un único JSON llamado FormSpec.

Ejemplo de invocación:

Usa prompts/formularios/generar_desde_spec/prompt.md

Input:

@form-specs/catalogos/material.form.json

---

# Estructura del FormSpec

{
  "specVersion": 1,

  "target": {
    "file": "src/views/catalogos/NuevoMaterialView.tsx",
    "component": "NuevoMaterialView",
    "mode": "vista_completa"
  },

  "page": {
    "title": "Nuevo material",
    "description": "Captura los datos básicos",
    "actions": []
  },

  "callbacks": {
    "onSubmit": null
  },

  "dataSource": {
    "defaultValues": {}
  },

  "form": {
    "gridCols": 12,
    "sections": [],
    "fields": [],
    "rules": []
  }
}

---

# Validación del spec (PRE-CHECK)

Antes de generar código validar:

Target

- target.file debe comenzar con src/
- target.component debe ser PascalCase
- target.mode debe ser "vista_completa" o "solo_formulario"

Fields

- No puede haber names duplicados
- ui.span debe estar entre 1 y 12

Si ui.type es:

select  
searchableSelect  
radioGroup  

Debe existir options.

options.source = local → requiere items  
options.source = mock → requiere mockId

Sections

Cada campo listado en section.fields debe existir en form.fields.

Rules

Solo se permiten:

dateRange  
requiredIf  
minIf  

Todos los campos referenciados deben existir.

Actions

navigate → requiere action.to  
callback → requiere callbackName

Si hay errores:

NO generar código.

Responder con lista de errores y corrección sugerida.

---

# Estrategia de generación

Si el archivo target.file no existe

→ crear el archivo.

Si el archivo existe

→ actualizar solo el componente indicado en target.component.

No modificar otros componentes del archivo.

---

# React Hook Form

Todos los formularios deben usar:

useForm  
yupResolver  
Yup

Estructura base:

const schema = yup.object({...})

const {
 register,
 control,
 handleSubmit,
 watch,
 formState:{errors}
} = useForm({
 resolver: yupResolver(schema),
 defaultValues: dataSource.defaultValues
})

Mostrar errores:

errors[field]?.message

---

# Layout

mode = vista_completa

Wrapper raíz:

<div className="flex flex-col h-full bg-slate-50 p-4 lg:p-6 overflow-hidden">

Si page.backLink está definido, renderizar **encima** del PageCard (misma ubicación que en Requisiciones) una fila con BackLink:

<div className="flex items-center justify-between mb-4">
  <BackLink onClick={() => navigate(page.backLink.destination)}>
    {page.backLink.label}
  </BackLink>
</div>

Ejemplo de label: "Volver a Requisiciones", "Volver a Insumos", "Volver a Materiales". destination es la ruta del listado (ej. /compras/requisiciones, /gestion-proyectos/insumos).

Luego:

PageCard  
  ViewHeader  
  FormSection  
  form

ViewHeader:

title = page.title  
subtitle = page.subtitle  

actions = botones de page.actions (Guardar con variant "success", etc.). No incluir aquí el "Regresar"; ese es el BackLink de arriba.

Botón Guardar (submit): usar **variant "success"** (verde). Label "Guardar" en alta, "Guardar cambios" en edición si aplica.

---

mode = solo_formulario

No usar PageCard ni ViewHeader.

Generar solo:

<form>  
FormSection  
fields  
</form>

---

# Mapeo de campos

ui.type → componente

input → Input  
textarea → Input textarea  
select → Select  
searchableSelect → SearchableSelect  
checkbox → Checkbox  
switch → Switch  
radioGroup → Select (fallback)

---

# Tipos de Input

ui.inputType puede ser:

text  
number  
currency  
date  
datetime  

---

# Grid

Dentro de cada sección:

grid grid-cols-12 gap-4

Cada campo:

col-span-${ui.span}

---

# Options

Local

options:{
 source:"local",
 items:[
  {value:"A",label:"A"}
 ]
}

Mock

options:{
 source:"mock",
 mockId:"PROVEEDORES_MOCK"
}

---

# Dependencias de campo

dependency:{
 field:"tipo",
 equals:"credito",
 showIfTrue:true
}

Usar watch(field) para controlar visibilidad.

---

# Validación Yup

Required

yup.string().required(message)

String

minLength  
maxLength  
pattern  
email  

Number

yup.number().min().max()

Checkbox obligatorio

yup.boolean().oneOf([true],message)

---

# Reglas globales

dateRange

start  
end  
allowEmpty  
message  

Validar end >= start.

requiredIf

field requerido si when === equals.

minIf

field >= min cuando when === equals.

---

# Acciones

submit

handleSubmit(onSubmit)

navigate

import { useNavigate } from "react-router-dom"

const navigate = useNavigate()

navigate(action.to)

callback

callbackName(values)

---

# Toast

Si existe acción submit:

mostrar Toast success o error.

Si el submit falla por validación del formulario (campos requeridos o reglas):

- Mostrar Toast en rojo (`variant: "error"`).
- Usar exactamente este texto en el título: `Faltan datos por capturar`.
- Mantener el texto en formato normal (no forzar mayúsculas).

Auto ocultar en 2–3 segundos.

---

# Resultado esperado

1 Validar FormSpec  
2 Si hay errores → listarlos  
3 Si es válido → generar o actualizar target.file  
4 No inventar lógica fuera del JSON
