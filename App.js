import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import Home from './src/screens/Home';
<<<<<<< HEAD
import OrdersAssigned from './src/screens/OrdersAssigned';
import OrdersRecord from './src/screens/OrdersRecord';

=======
>>>>>>> d6f1243f4e1f0ccfc055fa8bd12a023add7e842d
export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />
<<<<<<< HEAD
      <OrdersRecord />
=======
      <Home />
>>>>>>> d6f1243f4e1f0ccfc055fa8bd12a023add7e842d
    </SafeAreaView>
  );
}