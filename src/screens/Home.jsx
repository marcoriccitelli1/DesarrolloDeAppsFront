import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MainLayout from '../layouts/MainLayout';

const Home = () => {
  return (
    <MainLayout>
      <View style={styles.center}>
        <Text style={styles.text}>¡Bienvenido a la Home!</Text>
      </View>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f6fa',
  },
  text: {
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
  },
});

export default Home; 