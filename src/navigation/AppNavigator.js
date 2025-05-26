import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import Home from '../screens/Home';
import OrdersAssigned from '../screens/OrdersAssigned';
import OrdersRecord from '../screens/OrdersRecord';
import Profile from '../screens/Profile';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated } = useContext(AuthContext);

  if (isAuthenticated === null) {
    return null;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      {isAuthenticated ? (
        // Pantallas protegidas
        <>
          <Stack.Screen 
            name="Home" 
            component={Home}
            options={{ headerShown: false, animation: 'none' }}
          />
          <Stack.Screen 
            name="OrdersAssigned" 
            component={OrdersAssigned}
            options={{ headerShown: false, animation: 'none' }}
          />
          <Stack.Screen 
            name="OrdersRecord" 
            component={OrdersRecord}
            options={{ headerShown: false, animation: 'none' }}
          />
          <Stack.Screen 
            name="Profile" 
            component={Profile}
            options={{ headerShown: false, animation: 'none' }}
          />
        </>
      ) : (
        // Pantallas públicas
        <>
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="ForgotPassword" 
            component={ForgotPasswordScreen}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator; 