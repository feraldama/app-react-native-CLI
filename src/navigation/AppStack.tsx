import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import { HomeScreen } from '../screens/HomeScreen';
import { DetailScreen } from '../screens/DetailScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const styles = StyleSheet.create({
  headerButton: { marginRight: 8 },
  headerButtonText: { color: '#fff', fontWeight: '600' },
});

function FavoritesHeaderButton() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Home'>>();
  return (
    <TouchableOpacity onPress={() => navigation.navigate('Favorites')} style={styles.headerButton}>
      <Text style={styles.headerButtonText}>Favoritos</Text>
    </TouchableOpacity>
  );
}

function ProductsHeaderButton() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Favorites'>>();
  return (
    <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.headerButton}>
      <Text style={styles.headerButtonText}>Productos</Text>
    </TouchableOpacity>
  );
}

export function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#2563eb' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Productos',
          headerRight: FavoritesHeaderButton,
        }}
      />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={{ title: 'Detalle' }}
      />
      <Stack.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          title: 'Favoritos',
          headerRight: ProductsHeaderButton,
        }}
      />
    </Stack.Navigator>
  );
}
