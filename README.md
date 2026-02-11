# app-react-native-CLI

Prueba Técnica - Front: app React Native CLI que lista productos (API DummyJSON), detalle y favoritos con Redux.

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

## Estructura del proyecto

```
src/
├── api/           # Cliente Axios (DummyJSON)
├── store/         # Redux: productsSlice, favoritesSlice
├── types/         # Tipos TypeScript (Product)
├── hooks/         # useDebounce
├── navigation/    # Stack (Home, Detail, Favorites)
├── screens/       # HomeScreen, DetailScreen, FavoritesScreen
├── components/    # ProductCard, SearchInput
└── theme.ts       # Colores, espaciados, borderRadius
```

## Decisiones técnicas

| Aspecto | Decisión |
|---------|----------|
| **API** | DummyJSON (`/products`, `/products/search?q=`) con paginación real (limit/skip) |
| **Estado** | Redux Toolkit: productsSlice (createAsyncThunk), favoritesSlice normalizado (ids + entities) |
| **Favoritos** | Persistencia con AsyncStorage; se cargan al iniciar la app |
| **Búsqueda** | Debounce 300ms; sin paginación en búsqueda (API devuelve todos los resultados) |
| **Navegación** | React Navigation (native stack). Botones en header: Favoritos ↔ Productos |
| **Tipado Redux** | useAppDispatch, useAppSelector para tipo seguro |
| **Retry** | 3 reintentos automáticos (2s entre intentos) en fallos de red |
| **Theme** | Colores y espaciados centralizados en `theme.ts` |
| **Accesibilidad** | accessibilityLabel y accessibilityHint en elementos interactivos |
| **Optimización** | React.memo (ProductCard), getItemLayout en FlatList |
| **UX** | Toast al agregar/quitar favoritos; animación en estrella; placeholder en imágenes con error |

## Tests

```bash
npm test
```

- **productsSlice:** fetchProducts, fetchMoreProducts, resetProducts, deduplicación
- **useDebounce:** valor inicial y actualización tras delay
- **ProductCard:** render sin crash
- **App:** render completo (con mocks de Toast y AsyncStorage)

## Capturas

_Incluir aquí capturas de la app (listado, detalle, favoritos) si se desea._
