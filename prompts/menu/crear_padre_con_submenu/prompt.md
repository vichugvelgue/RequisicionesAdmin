# Crear opción padre con submenú

Añade una opción expandible (como "Componentes" o "Compras") con una o varias subopciones que navegan a vistas. Usa `SidebarParentExpandable` y `SidebarSubmenuItem`, datos en menuData y vistas en App.

## Input

| Parámetro       | Descripción                                                                 |
|-----------------|-----------------------------------------------------------------------------|
| `NOMBRE_PADRE`  | Nombre del ítem expandible (ej. "Inventarios").                            |
| `NOMBRE_ICONO`  | Nombre del icono Lucide para el padre (ej. Package, Folder).               |
| `SUBMENU`       | Lista de subopciones. Formato: array de `{ id: string, label: string }`. Cada `id` será el valor de `activeView` (ej. `[{ id: 'InventariosEntrada', label: 'Entrada' }, { id: 'InventariosSalida', label: 'Salida' }]`). |

## Prompt

1. **menuData.jsx**  
   - En `src/data/menuData.jsx`, crear una constante nueva (ej. `INVENTARIOS_SUBMENU` o `{{NOMBRE_PADRE}}_SUBMENU`) con el array de `{ id, label }` indicado en SUBMENU.  
   - Exportar la constante.

2. **Sidebar.jsx**  
   - Importar el icono desde `lucide-react` y la nueva constante desde menuData.  
   - Añadir un estado para abrir/cerrar, ej. `const [isNombrePadreOpen, setIsNombrePadreOpen] = useState(false);`.  
   - Renderizar un bloque `<SidebarParentExpandable>` con:  
     - `icon={<NombreIcono className="w-4 h-4" />}`  
     - `label="{{NOMBRE_PADRE}}"`  
     - `open={isNombrePadreOpen}`  
     - `onToggle={() => setIsNombrePadreOpen(!isNombrePadreOpen)}`  
     - `isActive={activeView.startsWith('NombrePadre')}` (ajustar el prefijo al convenio de ids, ej. 'Inventarios')  
     - `children`: un `.map` del array del submenú que renderice `<SidebarSubmenuItem key={item.id} id={item.id} label={item.label} isActive={activeView === item.id} onClick={() => setActiveView(item.id)} />`.

3. **App.jsx**  
   - Por cada elemento del SUBMENU: importar la vista correspondiente y añadir la rama `activeView === 'item.id' && <Vista setActiveView={setActiveView} />`.

Archivos: `src/data/menuData.jsx`, `src/components/layout/Sidebar.jsx`, `src/App.jsx`.
