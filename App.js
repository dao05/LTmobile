import React, { useContext, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import { DataProvider } from './src/context/DataContext';
import { AuthNavigator, MainNavigator } from './src/navigation/RootNavigator';

const Stack = createStackNavigator();

const RootNavigator = () => {
  const authContext = useContext(AuthContext);
  const { isLoading, userToken } = authContext;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animationEnabled: true,
        }}
      >
        {userToken == null ? (
          <Stack.Group
            screenOptions={{
              animationTypeForReplace: true,
            }}
          >
            <Stack.Screen
              name="Auth"
              component={AuthNavigator}
            />
          </Stack.Group>
        ) : (
          <Stack.Group
            screenOptions={{
              animationTypeForReplace: true,
            }}
          >
            <Stack.Screen
              name="MainApp"
              component={MainNavigator}
            />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <AuthProvider>
          <DataProvider>
            <RootNavigator />
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
          </DataProvider>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
