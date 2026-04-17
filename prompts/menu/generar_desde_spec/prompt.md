# Generar elemento de menú desde MenuSpec (JSON)

Este prompt genera o actualiza un elemento del menú (sidebar, menuData, App, y opcionalmente módulos/vistas) a partir de un único JSON llamado MenuSpec. El tipo de operación se determina por el campo **kind**.

No inventar nada fuera del JSON. No modificar archivos no indicados en la estrategia del kind correspondiente.

---

# Regla fundamental

NO inventar nada fuera del JSON.

No agregar opciones, divisiones, vistas ni propiedades no definidas en el spec.  
Si algo no está en el JSON, no debe aparecer en el código.

---

# Input

El input es un único JSON llamado MenuSpec.

Ejemplo de invocación:

Usa prompts/menu/generar_desde_spec/prompt.md

Input:

@menu-specs/sidebar/mi_division.menu.json

(La ruta puede ser cualquier archivo JSON que cumpla el esquema documentado en spec.md.)

---

# Tipos soportados (kind)

Valores permitidos de **kind** (ver spec.md para la estructura de cada uno):

- **division** — Etiqueta de sección en el sidebar (SidebarDivision). Solo toca Sidebar.jsx.
- **parent_sin_submenu** — Opción de primer nivel sin hijos (opcional viewId). menuData, Sidebar, App.
- **parent_sin_submenu_con_vista** — Igual + crea módulo y vista con layout base.
- **parent_con_submenu** — Padre expandible con N hijos. menuData, Sidebar, App.
- **parent_con_submenu_y_vistas** — Padre + N hijos + N vistas base (módulo + index).
- **hijo** — Añade un hijo a un padre existente. menuData, Sidebar (si aplica), App.
- **hijo_con_vista** — Hijo + vista con layout base. menuData, App, módulo + index.

Si **kind** no es uno de los anteriores, NO generar código y responder: "kind no soportado. Valores permitidos: division, parent_sin_submenu, parent_sin_submenu_con_vista, parent_con_submenu, parent_con_submenu_y_vistas, hijo, hijo_con_vista."

---

# Validación del spec (PRE-CHECK)

Antes de generar código, validar el MenuSpec según la sección correspondiente al **kind** en spec.md:

- **Todos los kinds:** specVersion (número), kind (string permitido), y los bloques obligatorios del kind (target, division, parent, child, etc.).
- **division:** target.file = src/components/layout/Sidebar.jsx; division.text no vacío; division.position.type "before"|"after"; division.position.reference.by y value válidos.
- **parent_* y hijo_*:** ver tablas y PRE-CHECK de cada tipo en spec.md.

Si hay errores: NO generar código. Responder con lista de errores y corrección sugerida.

---

# Regla de orden para hijos

Para los kinds que crean o agregan hijos (**parent_con_submenu**, **parent_con_submenu_y_vistas**, **hijo**, **hijo_con_vista**):

- Insertar el/los hijos definidos en el JSON.
- Dejar el array final del submenú en `menuData` ordenado por `label` ascendente (A-Z), sin distinguir mayúsculas/minúsculas.
- El criterio de orden aplica al resultado final del submenú, no a la posición de inserción manual.

No reordenar opciones padre ni divisiones del sidebar: ese orden se mantiene manual por decisión del desarrollador.

---

# Estrategia de generación

Según el valor de **kind**, aplicar **únicamente** las instrucciones del archivo indicado:

| kind | Archivo de instrucciones |
|------|--------------------------|
| division | kinds/division.md |
| parent_sin_submenu | kinds/parent_sin_submenu.md |
| parent_sin_submenu_con_vista | kinds/parent_sin_submenu_con_vista.md |
| parent_con_submenu | kinds/parent_con_submenu.md |
| parent_con_submenu_y_vistas | kinds/parent_con_submenu_y_vistas.md |
| hijo | kinds/hijo.md |
| hijo_con_vista | kinds/hijo_con_vista.md |

Leer el contenido de ese archivo y ejecutar los pasos allí descritos usando los datos del MenuSpec. No combinar con otros kinds en una misma invocación.

---

# Resultado esperado

1. Validar MenuSpec según PRE-CHECK (spec.md).
2. Si hay errores → listarlos y no modificar archivos.
3. Si es válido → aplicar la estrategia del archivo kinds/{{kind}}.md correspondiente.
4. No inventar lógica ni elementos fuera del JSON.
