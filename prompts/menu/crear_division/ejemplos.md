# Ejemplos de invocación – Crear división

## Ejemplo 1: División "Demostración" antes de Compras

**Invocación:**  
Usa prompts/menu/crear_division/prompt.md

**Input:**
- TEXTO = Demostración
- POSICION = antes de la sección Compras

**Resultado:** En Sidebar.jsx, justo antes del bloque `<SidebarParentExpandable label="Compras" ...>`, se añade:
```jsx
<SidebarDivision text="Demostración" />
```

---

## Ejemplo 2: División "Administración" después de Módulos

**Invocación:**  
Usa prompts/menu/crear_division/prompt.md

**Input:**
- TEXTO = Administración
- POSICION = después de la división "Módulos"

**Resultado:** En Sidebar.jsx, justo después de `<SidebarDivision text="Módulos" />`, se añade:
```jsx
<SidebarDivision text="Administración" />
```
