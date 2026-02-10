import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { Product } from '../types/product';
import { getProducts, searchProducts } from '../api/client';

const LIMIT = 10;

export type ProductsStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

interface ProductsState {
  items: Product[];
  status: ProductsStatus;
  error: string | null;
  page: number;
  hasMore: boolean;
  total: number;
  searchQuery: string;
}

const initialState: ProductsState = {
  items: [],
  status: 'idle',
  error: null,
  page: 0,
  hasMore: true,
  total: 0,
  searchQuery: '',
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (
    { searchQuery = '' }: { searchQuery?: string } = {},
    { rejectWithValue }
  ) => {
    try {
      if (searchQuery.trim()) {
        const res = await searchProducts(searchQuery.trim());
        return { ...res, searchQuery: searchQuery.trim() };
      }
      const res = await getProducts(LIMIT, 0);
      return { ...res, searchQuery: '' };
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Error al cargar productos';
      return rejectWithValue(message);
    }
  }
);

export const fetchMoreProducts = createAsyncThunk(
  'products/fetchMoreProducts',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { products: ProductsState };
    const { page, searchQuery } = state.products;
    if (searchQuery) return rejectWithValue('No paginar en búsqueda');
    try {
      const skip = page * LIMIT;
      const res = await getProducts(LIMIT, skip);
      return res;
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Error al cargar más';
      return rejectWithValue(message);
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    resetProducts() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchProducts.pending, (state, { meta }) => {
        state.status = 'loading';
        state.error = null;
        state.searchQuery = meta.arg?.searchQuery ?? '';
        state.items = [];
        state.page = 0;
      })
      .addCase(fetchProducts.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.items = payload.products;
        state.total = payload.total;
        state.page = 1;
        state.hasMore = state.items.length < payload.total;
      })
      .addCase(fetchProducts.rejected, (state, { payload }) => {
        state.status = 'failed';
        state.error = (payload as string) ?? 'Error desconocido';
      });

    builder
      .addCase(fetchMoreProducts.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchMoreProducts.fulfilled, (state, { payload }) => {
        const existingIds = new Set(state.items.map((p) => p.id));
        const newProducts = payload.products.filter((p) => !existingIds.has(p.id));
        state.items = state.items.concat(newProducts);
        state.page += 1;
        state.hasMore = state.items.length < payload.total;
      })
      .addCase(fetchMoreProducts.rejected, (state, { payload }) => {
        state.error = (payload as string) ?? null;
      });
  },
});

export const { resetProducts } = productsSlice.actions;
export default productsSlice.reducer;
