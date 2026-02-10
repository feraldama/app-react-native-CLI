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

## Decisiones

- **API:** DummyJSON (`/products`, `/products/search?q=`) con paginación real.
- **Estado:** Redux Toolkit (productsSlice con createAsyncThunk, favoritesSlice normalizado).
- **Favoritos:** Persistencia con AsyncStorage; se cargan al iniciar la app.
- **Búsqueda:** Debounce 300ms; sin paginación en búsqueda (la API devuelve todos los resultados).
- **Navegación:** React Navigation (native stack). Botón "Favoritos" en header de Home.
