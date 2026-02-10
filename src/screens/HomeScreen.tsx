import React, { useCallback, useEffect } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import type { RootStackParamList } from '../navigation/types';
import type { RootState } from '../store';
import { fetchProducts, fetchMoreProducts } from '../store/productsSlice';
import { useDebounce } from '../hooks/useDebounce';
import { ProductCard } from '../components/ProductCard';
import { SearchInput } from '../components/SearchInput';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Home'>;
const LIMIT = 10;

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch = useDispatch();
  const { items, status, error, hasMore, searchQuery } = useSelector(
    (s: RootState) => s.products
  );
  const [searchText, setSearchText] = React.useState('');
  const [refreshing, setRefreshing] = React.useState(false);
  const debouncedSearch = useDebounce(searchText, 300);

  const loadInitial = useCallback(
    (query?: string) => {
      dispatch(fetchProducts({ searchQuery: query ?? debouncedSearch }) as never);
    },
    [dispatch, debouncedSearch]
  );

  useEffect(() => {
    loadInitial(debouncedSearch);
  }, [debouncedSearch]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    (dispatch(fetchProducts({ searchQuery: debouncedSearch }) as never) as Promise<unknown>)
      .finally(() => setRefreshing(false));
  }, [dispatch, debouncedSearch]);

  const loadMore = useCallback(() => {
    if (searchQuery || !hasMore || status === 'loading') return;
    dispatch(fetchMoreProducts() as never);
  }, [dispatch, searchQuery, hasMore, status]);

  const renderItem = useCallback(
    ({ item }: { item: (typeof items)[0] }) => (
      <ProductCard
        product={item}
        onPress={() => navigation.navigate('Detail', { product: item })}
      />
    ),
    [navigation]
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
          <TouchableOpacity style={styles.retryButton} onPress={() => loadInitial()}>
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
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
              <TouchableOpacity style={styles.loadMoreButton} onPress={loadMore}>
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
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  listContent: { padding: 12, paddingBottom: 24 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  loadingText: { marginTop: 12, color: '#666' },
  errorText: { color: '#c00', textAlign: 'center', marginBottom: 16 },
  retryButton: { backgroundColor: '#2563eb', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  retryText: { color: '#fff', fontWeight: '600' },
  footer: { padding: 16, alignItems: 'center' },
  loadMoreButton: { padding: 16, alignItems: 'center' },
  loadMoreText: { color: '#2563eb', fontWeight: '600' },
});
