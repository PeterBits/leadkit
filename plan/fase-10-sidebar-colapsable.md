# Fase 10 - Sidebar Colapsable en Desktop

## Objetivo

Permitir colapsar/expandir la sidebar de escritorio, mostrando solo iconos cuando esta colapsada, con tooltips al hover y persistencia de la preferencia del usuario en localStorage.

---

## 10.1 Hook useLocalStorage

- [x] Crear `src/utils/local-storage.ts`:
  - Hook generico `useLocalStorage<T>(key, defaultValue)`
  - Lectura sincrona en el inicializador de `useState` (sin flicker)
  - Escritura a localStorage en cada cambio de estado

---

## 10.2 Interfaz SidebarProps

- [x] Crear `src/types/interfaces/layout.ts` con `SidebarProps { collapsed: boolean; onToggle: () => void }`
- [x] Exportar desde `src/types/interfaces/index.ts`

---

## 10.3 Layout.tsx

- [x] Usar `useLocalStorage('leadkit-sidebar-collapsed', false)` para el estado
- [x] Pasar `collapsed` y `onToggle` como props a `<Sidebar />`
- [x] Margen dinamico del `<main>`: `sm:ml-[68px]` (colapsado) vs `sm:ml-60` (expandido)
- [x] Transicion suave con `transition-[margin-left] duration-300 ease-in-out`

---

## 10.4 Sidebar.tsx

- [x] Recibir props `collapsed` y `onToggle` (tipadas con `SidebarProps`)
- [x] Transicion de ancho: `w-[68px]` (colapsado) vs `w-60` (expandido) con `transition-[width] duration-300`
- [x] Header: "LK" cuando colapsado, "LEADKIT" cuando expandido
- [x] Boton toggle en la parte superior (header), icono `ChevronsLeft`/`ChevronsRight` de Lucide
- [x] NavLinks: cuando colapsado, centrar icono (`justify-center`), ocultar label
- [x] Tooltips CSS puro: `group`/`group-hover` mostrando label a la derecha al hover en modo colapsado
- [x] Mobile: sin cambios, BottomNav sigue funcionando igual

---

## 10.5 Documentacion

- [x] Actualizar `README.md`:
  - Descripcion: sidebar colapsable
  - Navegacion: ancho expandido/colapsado, tooltips, persistencia localStorage
  - Estructura del proyecto: anadir `local-storage.ts` y `layout.ts`
  - Tabla de componentes: Sidebar marcado como colapsable
  - Responsive design: sidebar colapsable en desktop

---

## Resumen de archivos

### Nuevos (2)

| Archivo | Proposito |
|---------|-----------|
| `src/utils/local-storage.ts` | Hook generico `useLocalStorage<T>` para persistencia en localStorage |
| `src/types/interfaces/layout.ts` | Interfaz `SidebarProps` para componente Sidebar |

### Modificados (4)

| Archivo | Cambio |
|---------|--------|
| `src/types/interfaces/index.ts` | Export `SidebarProps` |
| `src/components/layout/Layout.tsx` | Estado colapsado con `useLocalStorage`, margen dinamico con transicion |
| `src/components/layout/Sidebar.tsx` | Renderizado colapsado/expandido, tooltips, boton toggle en header |
| `README.md` | Documentacion actualizada |

---

## Comportamiento

| Estado | Ancho | Header | NavLinks | Toggle |
|--------|-------|--------|----------|--------|
| Expandido (default) | 240px (`w-60`) | "LEADKIT" | Icono + label | `ChevronsLeft` en header |
| Colapsado | 68px (`w-[68px]`) | "LK" | Icono centrado + tooltip hover | `ChevronsRight` en header |

- **Transicion:** 300ms ease-in-out en ancho y margen
- **Persistencia:** `localStorage` key `leadkit-sidebar-collapsed`
- **Mobile:** Sin cambios

---

## Verificacion

1. [x] `npm run build` compila sin errores
2. [ ] Sidebar se colapsa/expande con animacion suave al click del boton en header
3. [ ] Tooltips aparecen al hover cuando esta colapsada
4. [ ] Recargar la pagina y verificar que el estado persiste
5. [ ] Vista mobile sin cambios (BottomNav funciona igual)
