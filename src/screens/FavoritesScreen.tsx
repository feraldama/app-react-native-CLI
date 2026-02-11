import React, { useCallback } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppSelector } from '../store';
import type { RootStackParamList } from '../navigation/types';
import { ProductCard } from '../components/ProductCard';
import type { Product } from '../types/product';
import { colors, spacing } from '../theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Favorites'>;

export function FavoritesScreen() {
  const navigation = useNavigation<Nav>();
  const { ids, entities } = useAppSelector((s) => s.favorites);
  const items: Product[] = ids
    .map((id) => entities[id])
    .filter((p): p is Product => p != null);

  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
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
        <View style={styles.emptyContent}>
          <Text style={styles.emptyText}>No tienes favoritos</Text>
          <Text style={styles.emptySubtext}>
            Agrega productos desde el detalle o tocando la estrella en la lista
          </Text>
        </View>
      </View>
    );
  }

  const ITEM_HEIGHT = 124;
  return (
    <FlatList
      data={items}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      renderItem={renderItem}
      getItemLayout={(_, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
      })}
      contentContainerStyle={styles.listContent}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  listContent: { padding: spacing.md, paddingBottom: spacing.xl },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl * 2,
  },
  emptyContent: {
    alignItems: 'center',
    maxWidth: 280,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  emptySubtext: {
    marginTop: spacing.sm,
    fontSize: 15,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
