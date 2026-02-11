import React from 'react';
import Toast from 'react-native-toast-message';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../store';
import type { RootStackParamList } from '../navigation/types';
import { toggleFavorite } from '../store/favoritesSlice';
import { colors, spacing, borderRadius } from '../theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Detail'>;
type DetailRoute = RouteProp<RootStackParamList, 'Detail'>;

export function DetailScreen() {
  const { params } = useRoute<DetailRoute>();
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const product = params.product;
  const favoriteIds = useAppSelector((s) => s.favorites.ids);
  const isFavorite = favoriteIds.includes(String(product.id));

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(product));
    Toast.show({
      type: 'success',
      text1: isFavorite ? 'Quitado de favoritos' : 'Agregado a favoritos',
    });
  };

  const imageUrl = product.images?.[0] ?? product.thumbnail;
  const [imageError, setImageError] = React.useState(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {!imageError ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]} />
      )}
      <View style={styles.body}>
        {product.brand ? (
          <Text style={styles.brand}>{product.brand}</Text>
        ) : null}
        <Text style={styles.title}>{product.title}</Text>
        <View style={styles.priceRow}>
          {product.discountPercentage ? (
            <>
              <Text style={styles.priceOriginal}>
                ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
              </Text>
              <Text style={styles.price}>${product.price.toFixed(2)}</Text>
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>
                  -{product.discountPercentage.toFixed(0)}%
                </Text>
              </View>
            </>
          ) : (
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          )}
        </View>
        <View style={styles.metaRow}>
          {product.rating != null ? (
            <Text style={styles.rating}>
              ★ {product.rating.toFixed(1)}
            </Text>
          ) : null}
          {product.category ? (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{product.category}</Text>
            </View>
          ) : null}
          {product.availabilityStatus ? (
            <Text style={styles.stock}>{product.availabilityStatus}</Text>
          ) : product.stock != null ? (
            <Text style={styles.stock}>
              {product.stock > 0 ? `${product.stock} en stock` : 'Agotado'}
            </Text>
          ) : null}
        </View>
        <Text style={styles.description}>{product.description}</Text>
        <TouchableOpacity
          style={[styles.favButton, isFavorite && styles.favButtonActive]}
          onPress={handleToggleFavorite}
          accessibilityLabel={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          accessibilityHint="Doble tap para guardar o quitar de favoritos"
        >
          <Text style={styles.favButtonText}>
            {isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.navigate('Favorites')}
          accessibilityLabel="Ver favoritos"
          accessibilityHint="Doble tap para ir a la lista de favoritos"
        >
          <Text style={styles.linkButtonText}>Ver favoritos</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  content: { paddingBottom: spacing.xxl },
  image: { width: '100%', height: 280, backgroundColor: colors.border },
  imagePlaceholder: { backgroundColor: colors.border },
  body: { padding: spacing.lg },
  brand: {
    fontSize: 14,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  title: { fontSize: 22, fontWeight: '700', marginBottom: spacing.sm },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: spacing.md,
  },
  price: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: '600',
  },
  priceOriginal: {
    fontSize: 16,
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: colors.danger,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: { fontSize: 12, color: colors.surface, fontWeight: '600' },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  rating: { fontSize: 14, color: colors.text },
  categoryBadge: {
    backgroundColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryText: { fontSize: 12, color: colors.textSecondary },
  stock: { fontSize: 14, color: colors.textMuted },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  favButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  favButtonActive: { backgroundColor: colors.danger },
  favButtonText: { color: colors.surface, fontWeight: '600' },
  linkButton: { paddingVertical: spacing.md, alignItems: 'center' },
  linkButtonText: { color: colors.primary },
});
