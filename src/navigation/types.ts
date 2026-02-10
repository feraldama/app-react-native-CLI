import type { Product } from '../types/product';

export type RootStackParamList = {
  Home: undefined;
  Detail: { product: Product };
  Favorites: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
