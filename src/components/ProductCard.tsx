import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  isFavorite?: boolean;
  onFavoritePress?: () => void;
}

export function ProductCard({ product, onPress, isFavorite = false, onFavoritePress }: ProductCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Image
        source={{ uri: product.thumbnail }}
        style={styles.thumbnail}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
      </View>
      {onFavoritePress != null && (
        <TouchableOpacity
          style={styles.starButton}
          onPress={(e) => {
            e?.stopPropagation?.();
            onFavoritePress();
          }}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={[styles.star, isFavorite && styles.starFilled]}>
            {isFavorite ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  thumbnail: { width: 100, height: 100, backgroundColor: '#eee' },
  info: { flex: 1, padding: 12, justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: '600', color: '#111', marginBottom: 4 },
  price: { fontSize: 18, fontWeight: '700', color: '#2563eb' },
  starButton: {
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  star: {
    fontSize: 28,
    color: '#ccc',
  },
  starFilled: {
    color: '#f59e0b',
  },
});
