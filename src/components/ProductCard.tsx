import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { Product } from '../types/product';
import { colors, spacing, borderRadius } from '../theme';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  isFavorite?: boolean;
  onFavoritePress?: () => void;
}

export const ProductCard = React.memo(function ProductCard({
  product,
  onPress,
  isFavorite = false,
  onFavoritePress,
}: ProductCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    scaleAnim.setValue(1);
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.3,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 3,
      }),
    ]).start();
  }, [isFavorite]);

  const [imageError, setImageError] = React.useState(false);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel={`Producto ${product.title}, precio ${product.price} dólares`}
      accessibilityHint="Doble tap para ver detalle del producto"
    >
      <View style={styles.thumbnailWrapper}>
        {!imageError ? (
          <Image
            source={{ uri: product.thumbnail }}
            style={styles.thumbnail}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
            onError={() => setImageError(true)}
          />
        ) : (
          <View style={[styles.thumbnail, styles.placeholder]} />
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
      </View>
      {onFavoritePress != null && (
        <TouchableOpacity
          style={styles.starButton}
          accessibilityRole="button"
          accessibilityLabel={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          accessibilityHint="Doble tap para marcar o desmarcar como favorito"
          onPress={(e) => {
            e?.stopPropagation?.();
            onFavoritePress();
          }}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Text style={[styles.star, isFavorite && styles.starFilled]}>
              {isFavorite ? '★' : '☆'}
            </Text>
          </Animated.View>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  thumbnailWrapper: { width: 100, height: 100 },
  thumbnail: { width: 100, height: 100, backgroundColor: colors.border },
  placeholder: { backgroundColor: colors.border },
  info: { flex: 1, padding: spacing.md, justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: spacing.xs },
  price: { fontSize: 18, fontWeight: '700', color: colors.primary },
  starButton: {
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  star: {
    fontSize: 28,
    color: colors.starEmpty,
  },
  starFilled: {
    color: colors.star,
  },
});
