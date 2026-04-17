# Estrategia de generación: kind = "division"

Aplicar cuando el MenuSpec tiene `kind === "division"`. Solo se modifica `target.file` (Sidebar.jsx).

1. **Import:** Si `SidebarDivision` no está importado en Sidebar.jsx, agregar el import desde `./sidebar/index.js` (junto al resto de imports de ese módulo). No modificar el componente SidebarDivision; solo añadir la instancia en Sidebar.

2. **Localizar el nodo de referencia** en el JSX de Sidebar.jsx según division.position.reference:
   - **by = "parentLabel"**: buscar el elemento `<SidebarParentExpandable` que tenga `label="{value}"` (sustituir {value} por division.position.reference.value).
   - **by = "divisionText"**: buscar el elemento `<SidebarDivision text="{value}" />` (sustituir {value} por division.position.reference.value).
   - **by = "buttonLabel"**: buscar el elemento `<SidebarItem` (o similar) que tenga `label="{value}"`.

3. **Insertar** `<SidebarDivision text="{division.text}" />`:
   - Si division.position.type = "before": insertar justo antes del nodo de referencia (en la misma profundidad, dentro del mismo contenedor).
   - Si division.position.type = "after": insertar justo después del nodo de referencia.

4. **Estilos:** El componente SidebarDivision ya usa las clases definidas en el proyecto (mt-3 mb-1 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest). No modificar el componente; solo añadir la instancia en Sidebar.

5. **Archivos a tocar:** Solo src/components/layout/Sidebar.jsx.
