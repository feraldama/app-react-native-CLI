import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { useAppDispatch } from './src/store';
import { NavigationContainer } from '@react-navigation/native';
import { store } from './src/store';
import { loadFavoritesFromStorage } from './src/store/favoritesSlice';
import { setFavorites } from './src/store/favoritesSlice';
import { AppStack } from './src/navigation/AppStack';

function AppContent() {
  const dispatch = useAppDispatch();
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    loadFavoritesFromStorage().then((list) => {
      dispatch(setFavorites(list));
    });
  }, [dispatch]);

  return (
    <>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        <AppStack />
      </NavigationContainer>
      <Toast />
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
