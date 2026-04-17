# Estrategia de generación: kind = "hijo"

Aplicar cuando el MenuSpec tiene `kind === "hijo"`. Añade una subopción a un padre existente (menuData + Sidebar si Compras + App).

1. **menuData.jsx**
   - Si el padre usa formato `{ id, label }` (ej. COMPONENTES_SUBMENU): añadir al array correspondiente (según parentRef) un objeto `{ id: child.id, label: child.label }`. El nombre del array se deriva de parentRef (ej. "Componentes" → COMPONENTES_SUBMENU).
   - Si el padre usa array de strings (ej. COMPRAS_SUBMENU): añadir el string que coincida con la vista (normalmente child.id). Para Compras, si la nueva opción debe navegar, añadir child.id (o el string usado) al array COMPRAS_NAVIGABLE en Sidebar.jsx.

2. **Sidebar.jsx**
   - Si parentRef es "Compras" y la navegación se controla con COMPRAS_NAVIGABLE: añadir child.id (o el valor usado en menuData) a COMPRAS_NAVIGABLE para que al hacer clic se llame a setActiveView. Para padres tipo Componentes no hace falta cambiar Sidebar: el .map ya recorre el array y cada SidebarSubmenuItem usa item.id.

3. **App.jsx**
   - Importar la vista correspondiente a child.id (el desarrollador debe crearla o usar otro prompt).
   - Añadir la rama: `activeView === child.id && <Vista setActiveView={setActiveView} />`.

Archivos: `src/data/menuData.jsx`, `src/components/layout/Sidebar.jsx` (solo para Compras si aplica), `src/App.jsx`.
