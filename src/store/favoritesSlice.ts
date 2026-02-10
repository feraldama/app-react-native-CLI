/**
 * Redux slice: favoritos normalizados (ids + entities).
 * Persistencia con AsyncStorage; cargar al iniciar, guardar al cambiar.
 */

import { createSlice } from '@reduxjs/toolkit';
import type { Product } from '../types/product';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@favoritos';

export interface FavoritesState {
  ids: string[];
  entities: Record<string, Product>;
}

const initialState: FavoritesState = {
  ids: [],
  entities: {},
};

async function persistFavorites(state: FavoritesState) {
  try {
    const list = state.ids.map((id) => state.entities[id]).filter(Boolean);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
  } catch (_) {
    // ignore
  }
}

export function loadFavoritesFromStorage(): Promise<Product[]> {
  return AsyncStorage.getItem(FAVORITES_KEY).then((raw) => {
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  });
}

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setFavorites(_, { payload }: { payload: Product[] }) {
      const ids: string[] = [];
      const entities: Record<string, Product> = {};
      payload.forEach((p) => {
        const id = String(p.id);
        if (!entities[id]) {
          ids.push(id);
          entities[id] = p;
        }
      });
      return { ids, entities };
    },
    addFavorite(state, { payload }: { payload: Product }) {
      const id = String(payload.id);
      if (state.entities[id]) return state;
      state.ids.push(id);
      state.entities[id] = payload;
      persistFavorites(state);
    },
    removeFavorite(state, { payload }: { payload: string }) {
      const id = String(payload);
      const idx = state.ids.indexOf(id);
      if (idx === -1) return state;
      state.ids.splice(idx, 1);
      delete state.entities[id];
      persistFavorites(state);
    },
    toggleFavorite(state, { payload }: { payload: Product }) {
      const id = String(payload.id);
      if (state.entities[id]) {
        const idx = state.ids.indexOf(id);
        state.ids.splice(idx, 1);
        delete state.entities[id];
      } else {
        state.ids.push(id);
        state.entities[id] = payload;
      }
      persistFavorites(state);
    },
  },
});

export const { setFavorites, addFavorite, removeFavorite, toggleFavorite } =
  favoritesSlice.actions;
export default favoritesSlice.reducer;
