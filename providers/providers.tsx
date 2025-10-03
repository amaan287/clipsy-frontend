'use client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store/index';
import { View, Text, ActivityIndicator } from 'react-native';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate 
        loading={
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
            <Text style={{ marginTop: 10 }}>Loading...</Text>
          </View>
        } 
        persistor={persistor}
      >
        {children}
      </PersistGate>
    </Provider>
  );
}