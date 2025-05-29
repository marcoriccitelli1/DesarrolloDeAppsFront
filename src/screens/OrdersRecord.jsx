import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, StatusBar } from 'react-native';
import { useAxios } from '../hooks/useAxios';
import { getToken } from '../utils/tokenStorage';
import ComponentOrdersRecord from '../components/ComponentOrdersRecord';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const OrdersRecord = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axios = useAxios();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

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
    <View 
      style={[
        styles.mainContainer,
        { paddingTop: insets.top }
      ]}
    >
      <StatusBar
        backgroundColor="#6c4eb6"
        barStyle="light-content"
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Historial de Pedidos</Text>
        </View>
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#6c4eb6'
  },
  container: {
    flex: 1,
    backgroundColor: '#f9f6fa',
  },
  header: {
    height: 60,
    backgroundColor: '#6c4eb6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    elevation: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    borderBottomWidth: 0,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.5,
  },
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