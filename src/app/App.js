import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RootStack } from '../navigation/RootStack';
import { store } from './store';

export default function App() {
  return (
    <Provider store={store}>
      {/* <SafeAreaProvider> */}
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
      {/* </SafeAreaProvider> */}
    </Provider>
  );
}
