/**
 * App principal: Provider (Redux), carga de favoritos, navegación.
 * @format
 */

import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { store } from './src/store';
import { loadFavoritesFromStorage } from './src/store/favoritesSlice';
import { setFavorites } from './src/store/favoritesSlice';
import { AppStack } from './src/navigation/AppStack';

function AppContent() {
  const dispatch = useDispatch();
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    loadFavoritesFromStorage().then((list) => {
      dispatch(setFavorites(list) as never);
    });
  }, [dispatch]);

  return (
    <>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        <AppStack />
      </NavigationContainer>
    </>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <AppContent />
      </Provider>
    </SafeAreaProvider>
  );
}

export default App;
