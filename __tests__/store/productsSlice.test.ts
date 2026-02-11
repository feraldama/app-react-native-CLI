import { configureStore } from '@reduxjs/toolkit';
import productsReducer, {
  fetchProducts,
  fetchMoreProducts,
  resetProducts,
} from '../../src/store/productsSlice';
import * as api from '../../src/api/client';

jest.mock('../../src/api/client');

const mockedApi = api as jest.Mocked<typeof api>;

const mockProducts = [
  { id: 1, title: 'Product 1', description: 'D1', price: 10, thumbnail: 'http://x/1.jpg' },
  { id: 2, title: 'Product 2', description: 'D2', price: 20, thumbnail: 'http://x/2.jpg' },
];

type Store = ReturnType<typeof configureStore<{ products: ReturnType<typeof productsReducer> }>>;

describe('productsSlice', () => {
  let store: Store;

  beforeEach(() => {
    store = configureStore({
      reducer: { products: productsReducer },
    }) as Store;
    jest.clearAllMocks();
  });

  it('resetProducts resets state to initial', () => {
    store.dispatch(resetProducts());
    expect(store.getState().products).toEqual({
      items: [],
      status: 'idle',
      error: null,
      page: 0,
      hasMore: true,
      total: 0,
      searchQuery: '',
    });
  });

  it('fetchProducts success populates items', async () => {
    mockedApi.getProducts.mockResolvedValue({
      products: mockProducts,
      total: 100,
      skip: 0,
      limit: 10,
    });

    await store.dispatch(fetchProducts({ searchQuery: '' }));

    expect(store.getState().products.items).toEqual(mockProducts);
    expect(store.getState().products.status).toBe('succeeded');
    expect(store.getState().products.total).toBe(100);
    expect(store.getState().products.hasMore).toBe(true);
  });

  it('fetchProducts failure sets error', async () => {
    mockedApi.getProducts.mockRejectedValue(new Error('Network error'));

    await store.dispatch(fetchProducts({ searchQuery: '' }));

    expect(store.getState().products.status).toBe('failed');
    expect(store.getState().products.error).toContain('Network');
  });

  it('fetchMoreProducts appends items without duplicates', async () => {
    mockedApi.getProducts
      .mockResolvedValueOnce({ products: mockProducts, total: 100, skip: 0, limit: 10 })
      .mockResolvedValueOnce({
        products: [{ id: 3, title: 'P3', description: 'D3', price: 30, thumbnail: 'http://x/3.jpg' }],
        total: 100,
        skip: 10,
        limit: 10,
      });

    await store.dispatch(fetchProducts({ searchQuery: '' }));
    await store.dispatch(fetchMoreProducts());

    expect(store.getState().products.items).toHaveLength(3);
    expect(store.getState().products.items[2].id).toBe(3);
  });
});
