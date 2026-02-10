import React from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import type { RootStackParamList } from '../navigation/types';
import type { RootState } from '../store';
import { toggleFavorite } from '../store/favoritesSlice';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Detail'>;
type DetailRoute = RouteProp<RootStackParamList, 'Detail'>;

export function DetailScreen() {
  const { params } = useRoute<DetailRoute>();
  const navigation = useNavigation<Nav>();
  const dispatch = useDispatch();
  const product = params.product;
  const favoriteIds = useSelector((s: RootState) => s.favorites.ids);
  const isFavorite = favoriteIds.includes(String(product.id));

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(product) as never);
  };

  const imageUrl = product.images?.[0] ?? product.thumbnail;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
      <View style={styles.body}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        <Text style={styles.description}>{product.description}</Text>
        <TouchableOpacity
          style={[styles.favButton, isFavorite && styles.favButtonActive]}
          onPress={handleToggleFavorite}
        >
          <Text style={styles.favButtonText}>
            {isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.navigate('Favorites')}
        >
          <Text style={styles.linkButtonText}>Ver favoritos</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { paddingBottom: 32 },
  image: { width: '100%', height: 280, backgroundColor: '#eee' },
  body: { padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  price: { fontSize: 20, color: '#2563eb', fontWeight: '600', marginBottom: 12 },
  description: { fontSize: 16, color: '#444', lineHeight: 24, marginBottom: 24 },
  favButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  favButtonActive: { backgroundColor: '#dc2626' },
  favButtonText: { color: '#fff', fontWeight: '600' },
  linkButton: { paddingVertical: 12, alignItems: 'center' },
  linkButtonText: { color: '#2563eb' },
});
