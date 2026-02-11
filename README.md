# app-react-native-CLI

Prueba Técnica - Front: app React Native CLI (sin Expo) que lista productos desde una API pública, permite ver detalle y gestionar favoritos con Redux.

## Cómo correr

```bash
npm install
# iOS:
cd ios && pod install && cd ..

npm start          # Metro en un terminal
npm run android    # En otro: Android
npm run ios        # En otro: iOS
```

### Android (SDK)

Si el build falla por "SDK location not found", crea `android/local.properties` con:

```
sdk.dir=C:/Users/TU_USUARIO/AppData/Local/Android/Sdk
```

O define la variable de entorno `ANDROID_HOME` con esa ruta.

---

## Cumplimiento de requisitos

### Objetivo

- React Native CLI (NO Expo) ✅
- Listar productos consumiendo API pública ✅
- Ver detalle ✅
- Gestionar favoritos con Redux ✅

### Requisitos funcionales

#### 1) Listado (Home)

| Requisito                                   | Implementación                                                         |
| ------------------------------------------- | ---------------------------------------------------------------------- |
| Imagen, título, precio                      | `ProductCard` muestra thumbnail, título y precio                       |
| Loading (spinner o skeleton)                | `ActivityIndicator` durante carga inicial                              |
| Error (mensaje + botón "Reintentar")        | Pantalla de error con texto y botón que vuelve a disparar el fetch     |
| Pull to refresh                             | `RefreshControl` en el `FlatList`                                      |
| Paginación (infinite scroll o "Cargar más") | Ambos: `onEndReached` (infinite scroll) + botón "Cargar más" en footer |
| API con paginación real                     | DummyJSON soporta `limit` y `skip`                                     |

#### 2) Búsqueda

| Requisito                    | Implementación                     |
| ---------------------------- | ---------------------------------- |
| Input de búsqueda por título | `SearchInput` en Home              |
| Debounce 300ms               | Hook `useDebounce` con delay 300ms |

#### 3) Detalle

| Requisito                                  | Implementación                                                 |
| ------------------------------------------ | -------------------------------------------------------------- |
| Al tocar ítem → pantalla detalle           | Navegación a `DetailScreen` con params `product`               |
| Imagen grande, título, precio, descripción | Mostrados en detalle (imagen adapta altura según aspect ratio) |
| Agregar/Quitar favoritos                   | Botón que dispara `toggleFavorite`                             |

#### 4) Favoritos (Redux)

| Requisito                                            | Implementación                                                           |
| ---------------------------------------------------- | ------------------------------------------------------------------------ |
| Pantalla "Favoritos" con lista de productos marcados | `FavoritesScreen` con lista desde Redux                                  |
| Persistencia con AsyncStorage                        | `persistFavorites()` al cambiar; `loadFavoritesFromStorage()` al iniciar |

### Requisitos técnicos

| Requisito                                             | Implementación                                                         |
| ----------------------------------------------------- | ---------------------------------------------------------------------- |
| React Native + TypeScript                             | Proyecto base RN CLI con TypeScript                                    |
| Redux Toolkit (createSlice, createAsyncThunk)         | `productsSlice` y `favoritesSlice`                                     |
| Axios (instancia con baseURL y configuración)         | `src/api/client.ts` con `baseURL: https://dummyjson.com`               |
| Estado productos: items, status, error, page, hasMore | `productsSlice` con todos estos campos                                 |
| Favoritos normalizados (ids + entities)               | `favoritesSlice`: `ids: string[]`, `entities: Record<string, Product>` |
| API DummyJSON                                         | `GET /products?limit=10&skip=0`, `GET /products/search?q=...`          |

---

## Estructura del proyecto

```
src/
├── api/client.ts       # Axios con baseURL DummyJSON
├── store/              # productsSlice, favoritesSlice
├── types/product.ts    # Product, ProductsResponse
├── hooks/useDebounce.ts
├── navigation/         # Stack (Home, Detail, Favorites)
├── screens/            # HomeScreen, DetailScreen, FavoritesScreen
├── components/        # ProductCard, SearchInput
└── theme.ts           # Colores, espaciados
```

## Decisiones técnicas adicionales

- **Retry:** 3 reintentos automáticos (2s entre intentos) en fallos de red
- **Tipado Redux:** `useAppDispatch`, `useAppSelector` para evitar casts
- **Tests:** Jest para slices, useDebounce, ProductCard, App
- **UX:** Toast al agregar/quitar favoritos (verde/rojo); estrella en lista para marcar sin entrar al detalle; estado vacío en búsqueda sin resultados

## Tests

```bash
npm test
```

## Commits

Se recomiendan commits claros por funcionalidad (ej: `fix: Corregir tipo de notificación en el manejo de favoritos en DetailScreen y HomeScreen`, `feat: Integrar Toast para notificaciones y refactorizar el componente ProductCard con animaciones y accesibilidad`).
