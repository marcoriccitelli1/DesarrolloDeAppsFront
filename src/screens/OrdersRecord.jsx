import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useAxios } from '../hooks/useAxios';
import { getToken } from '../utils/tokenStorage';
import ComponentOrdersRecord from '../components/ComponentOrdersRecord';
import { useNavigation } from '@react-navigation/native';

const OrdersRecord = () => {
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
      setLoading(true);
      setError(null);
      try {
        const token = await getToken();
        if (!token) {
          setError('No autenticado.');
          setLoading(false);
          return;
        }
        const response = await axios.get('/orders/getOrdersRecord', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setOrders(response.data || []);
      } catch (err) {
        setError('No se pudieron cargar los pedidos históricos.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [axios]);

  return (
    <View style={styles.center}>
      {loading ? (
        <ActivityIndicator size="large" color="#6C4BA2" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : orders.length === 0 ? (
        <Text style={styles.text}>No hay pedidos históricos.</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          renderItem={({ item }) => <ComponentOrdersRecord order={item} />}
          contentContainerStyle={{ paddingBottom: 32, paddingTop: 16 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'flex-start',
    width: '100%',
    paddingBottom: 40,
    backgroundColor: '#f5f5f5',
    paddingTop: 32,
    paddingHorizontal: 16,
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
});

export default OrdersRecord; 