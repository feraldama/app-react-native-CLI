/**
 * Store Redux: configureStore y tipo RootState.
 * Al iniciar la app se debe dispatch loadFavoritesFromStorage -> setFavorites.
 */

import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './productsSlice';
import favoritesReducer from './favoritesSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    favorites: favoritesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
