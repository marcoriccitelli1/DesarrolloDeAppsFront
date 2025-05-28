import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useAxios } from '../hooks/useAxios';
import { useNavigation } from '@react-navigation/native';

const OrdersAssigned = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axios = useAxios();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: false
    });
  }, [navigation]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/orders');
        setOrders(response.data.orders || []);
      } catch (err) {
        setError('No se pudieron cargar las órdenes.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [axios]);

  return (
    <View style={styles.center}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : orders.length === 0 ? (
        <Text style={styles.text}>No hay órdenes asignadas.</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          renderItem={({ item }) => (
            <View style={styles.orderItem}>
              <Text style={styles.text}>ID: {item.id}</Text>
              {item.estante && <Text>Estante: {item.estante}</Text>}
              {item.gondola && <Text>Góndola: {item.gondola}</Text>}
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#f9f6fa',
    padding: 16,
  },
  text: {
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    fontSize: 16,
    marginTop: 10,
  },
  orderItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default OrdersAssigned; 