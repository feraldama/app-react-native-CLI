import React, { useCallback, useEffect } from 'react';
import Toast from 'react-native-toast-message';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchProducts, fetchMoreProducts } from '../store/productsSlice';
import { toggleFavorite } from '../store/favoritesSlice';
import { useDebounce } from '../hooks/useDebounce';
import { ProductCard } from '../components/ProductCard';
import { SearchInput } from '../components/SearchInput';
import { colors, spacing } from '../theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Home'>;
const ITEM_HEIGHT = 124;

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const { items, status, error, hasMore, searchQuery } = useAppSelector((s) => s.products);
  const favoriteIds = useAppSelector((s) => s.favorites.ids);
  const [searchText, setSearchText] = React.useState('');
  const [refreshing, setRefreshing] = React.useState(false);
  const debouncedSearch = useDebounce(searchText, 300);

  const loadInitial = useCallback(
    (query?: string) => {
      dispatch(fetchProducts({ searchQuery: query ?? debouncedSearch }));
    },
    [dispatch, debouncedSearch]
  );

  useEffect(() => {
    loadInitial(debouncedSearch);
  }, [debouncedSearch, loadInitial]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    (dispatch(fetchProducts({ searchQuery: debouncedSearch })) as Promise<unknown>)
      .finally(() => setRefreshing(false));
  }, [dispatch, debouncedSearch]);

  const loadMore = useCallback(() => {
    if (searchQuery || !hasMore || status === 'loading') return;
    dispatch(fetchMoreProducts());
  }, [dispatch, searchQuery, hasMore, status]);

  const renderItem = useCallback(
    ({ item }: { item: (typeof items)[0] }) => {
      const isFav = favoriteIds.includes(String(item.id));
      return (
        <ProductCard
          product={item}
          onPress={() => navigation.navigate('Detail', { product: item })}
          isFavorite={isFav}
          onFavoritePress={() => {
            dispatch(toggleFavorite(item));
            Toast.show({
              type: 'success',
              text1: isFav ? 'Quitado de favoritos' : 'Agregado a favoritos',
            });
          }}
        />
      );
    },
    [navigation, favoriteIds, dispatch]
  );

  const isLoading = status === 'loading' && items.length === 0;
  const isLoadingMore = status === 'loading' && items.length > 0;

  return (
    <View style={styles.container}>
      <SearchInput
        value={searchText}
        onChangeText={setSearchText}
        placeholder="Buscar por título..."
      />
      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Cargando productos...</Text>
        </View>
      ) : error && items.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => loadInitial()}
            accessibilityLabel="Reintentar"
            accessibilityHint="Doble tap para intentar cargar productos de nuevo"
          >
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={renderItem}
          getItemLayout={
            items.length > 0
              ? (_, index) => ({
                  length: ITEM_HEIGHT,
                  offset: ITEM_HEIGHT * index,
                  index,
                })
              : undefined
          }
          contentContainerStyle={[
            styles.listContent,
            items.length === 0 && styles.emptyListContent,
          ]}
          ListEmptyComponent={
            status === 'succeeded' && items.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateIcon}>🔍</Text>
                <Text style={styles.emptyStateTitle}>Sin resultados</Text>
                <Text style={styles.emptyStateText}>
                  {searchQuery
                    ? `No hay productos que coincidan con "${searchQuery}"`
                    : 'No se encontraron productos. Prueba otra búsqueda.'}
                </Text>
              </View>
            ) : null
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            isLoadingMore ? (
              <View style={styles.footer}>
                <ActivityIndicator />
              </View>
            ) : hasMore && !searchQuery && items.length > 0 ? (
              <TouchableOpacity
                style={styles.loadMoreButton}
                onPress={loadMore}
                accessibilityLabel="Cargar más productos"
                accessibilityHint="Doble tap para cargar más productos en la lista"
              >
                <Text style={styles.loadMoreText}>Cargar más</Text>
              </TouchableOpacity>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  listContent: { padding: spacing.md, paddingBottom: spacing.xl },
  emptyListContent: { flexGrow: 1 },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyStateIcon: { fontSize: 56, marginBottom: spacing.md },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 15,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  loadingText: { marginTop: spacing.md, color: colors.textMuted },
  errorText: { color: colors.danger, textAlign: 'center', marginBottom: spacing.lg },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 8,
  },
  retryText: { color: colors.surface, fontWeight: '600' },
  footer: { padding: spacing.lg, alignItems: 'center' },
  loadMoreButton: { padding: spacing.lg, alignItems: 'center' },
  loadMoreText: { color: colors.primary, fontWeight: '600' },
});
