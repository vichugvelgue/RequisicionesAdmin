# Crear división/etiqueta en el sidebar

Añade una etiqueta de sección en el sidebar (como "Módulos"), sin navegación, usando el componente `SidebarDivision`.

## Input

Pasa estos valores al usar este prompt:

| Parámetro  | Descripción                                                                 |
|------------|-----------------------------------------------------------------------------|
| `TEXTO`    | Texto de la etiqueta (ej. "Módulos", "Demostración"). Se muestra en mayúsculas. |
| `POSICION` | Dónde insertar: "antes de" o "después de" + elemento de referencia (ej. "antes de la sección Compras", "después del botón Dashboard"). |

## Prompt

1. En `src/components/layout/Sidebar.jsx`, importar `SidebarDivision` desde `./sidebar/index.js` si aún no está importado.
2. Insertar `<SidebarDivision text="{{TEXTO}}" />` en la posición indicada ({{POSICION}}).
3. El componente usa las clases: `mt-3 mb-1 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest`. No modificar el componente; solo añadir la instancia en Sidebar.

Archivos a tocar: solo `src/components/layout/Sidebar.jsx`.
