# Crear opción hija dentro de un padre existente

Añade una subopción a un padre que ya existe (ej. una nueva opción bajo "Componentes" o "Compras"). Los hijos se renderizan con `SidebarSubmenuItem` en el .map del padre; al añadir la entrada al array en menuData, el nuevo ítem aparece en el menú. Falta añadir la vista en App.

## Input

| Parámetro  | Descripción                                                                 |
|------------|-----------------------------------------------------------------------------|
| `PADRE`    | Nombre del padre: "Componentes" o "Compras" (o el nombre de la constante en menuData, ej. COMPONENTES_SUBMENU / COMPRAS_SUBMENU). |
| `VIEW_ID`  | Id de la vista (valor de `activeView` al hacer clic en la opción).         |
| `LABEL`    | Texto del ítem en el menú (ej. "Modals", "Requisiciones").                  |

## Prompt

1. **menuData.jsx**  
   - Si el padre usa formato `{ id, label }` (ej. COMPONENTES_SUBMENU): añadir al array correspondiente un objeto `{ id: '{{VIEW_ID}}', label: '{{LABEL}}' }`.  
   - Si el padre usa array de strings (ej. COMPRAS_SUBMENU): añadir el string que coincida con la vista (normalmente `VIEW_ID` o el mismo valor que se usará en setActiveView). Para Compras, en Sidebar solo algunas opciones llaman a `setActiveView`; si la nueva opción debe navegar, añadir `VIEW_ID` (o el string usado) al array `COMPRAS_NAVIGABLE` en Sidebar.jsx.

2. **Sidebar.jsx**  
   - Si el padre es "Compras" y la navegación se controla con una lista (ej. `COMPRAS_NAVIGABLE`), añadir `{{VIEW_ID}}` (o el string del ítem) a esa lista para que al hacer clic se llame a `setActiveView`.  
   - Para padres tipo Componentes no hace falta cambiar Sidebar: el .map ya recorre el array y cada `SidebarSubmenuItem` usa `item.id` para navegación.

3. **App.jsx**  
   - Importar la vista correspondiente a {{VIEW_ID}}.  
   - Añadir la rama: `activeView === '{{VIEW_ID}}' && <Vista setActiveView={setActiveView} />`.

Archivos: `src/data/menuData.jsx`, `src/components/layout/Sidebar.jsx` (solo para Compras si aplica), `src/App.jsx`.
