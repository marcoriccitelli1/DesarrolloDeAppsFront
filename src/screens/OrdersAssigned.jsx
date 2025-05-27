import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import MainLayout from '../layouts/MainLayout';
import { useAxios } from '../hooks/useAxios';

const OrdersAssigned = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axios = useAxios();

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
    <MainLayout>
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
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
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
  },
});

export default OrdersAssigned; 