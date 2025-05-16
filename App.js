import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';

=======
>>>>>>> d6f1243f4e1f0ccfc055fa8bd12a023add7e842d
export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />
      <RegisterScreen />
    </SafeAreaView>
  );
}