import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MainLayout from '../layouts/MainLayout';

const OrdersAssigned = () => {
  return (
    <MainLayout>
      <View style={styles.center}>
        <Text style={styles.text}>¡Bienvenido a OrdersAssigned!</Text>
      </View>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
  },
});

export default OrdersAssigned; 