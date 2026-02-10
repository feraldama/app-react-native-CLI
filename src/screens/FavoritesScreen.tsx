import React, { useCallback } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import type { RootStackParamList } from '../navigation/types';
import type { RootState } from '../store';
import { ProductCard } from '../components/ProductCard';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Favorites'>;

export function FavoritesScreen() {
  const navigation = useNavigation<Nav>();
  const { ids, entities } = useSelector((s: RootState) => s.favorites);
  const items = ids.map((id) => entities[id]).filter(Boolean);

  const renderItem = useCallback(
    ({ item }: { item: (typeof items)[0] }) => (
      <ProductCard
        product={item}
        onPress={() => navigation.navigate('Detail', { product: item })}
      />
    ),
    [navigation]
  );

  if (items.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No tienes favoritos</Text>
        <Text style={styles.emptySubtext}>Agrega productos desde el detalle</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      renderItem={renderItem}
      contentContainerStyle={styles.listContent}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  listContent: { padding: 12, paddingBottom: 24 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#333' },
  emptySubtext: { marginTop: 8, color: '#666' },
});
