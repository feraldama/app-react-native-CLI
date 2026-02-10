/**
 * Cliente Axios para DummyJSON.
 * BaseURL y funciones para productos (listado paginado y búsqueda).
 */

import axios from 'axios';
import type { ProductsResponse } from '../types/product';

const BASE_URL = 'https://dummyjson.com';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

const LIMIT = 10;

/**
 * Listado paginado de productos.
 * GET /products?limit=10&skip=0
 */
export async function getProducts(limit = LIMIT, skip = 0): Promise<ProductsResponse> {
  const { data } = await apiClient.get<ProductsResponse>('/products', {
    params: { limit, skip },
  });
  return data;
}

/**
 * Búsqueda de productos por título/descripción.
 * GET /products/search?q=...
 */
export async function searchProducts(q: string): Promise<ProductsResponse> {
  const { data } = await apiClient.get<ProductsResponse>('/products/search', {
    params: { q },
  });
  return data;
}
