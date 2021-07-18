import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import { OrderBookScreen } from '../features/OrderBook';

const Stack = createStackNavigator();

const RootStack = () => (
  <SafeAreaView style={styles.container}>
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1b262d',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="OrderBook"
        component={OrderBookScreen}
        options={{
          title: 'Order Book',
        }}
      />
    </Stack.Navigator>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b262d',
  },
});

export { RootStack };
