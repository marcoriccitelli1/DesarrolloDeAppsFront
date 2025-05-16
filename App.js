import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import Home from './src/screens/Home';
import OrdersAssigned from './src/screens/OrdersAssigned';
import OrdersRecord from './src/screens/OrdersRecord';
import Profile from './src/screens/Profile';
import ChangePasswordScreen from './src/screens/ChangePasswordScreen';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />
      <ChangePasswordScreen/>
    </SafeAreaView>
  );
}