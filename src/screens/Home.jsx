import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, SafeAreaView, Platform, StatusBar } from 'react-native';
import UnassignedOrderCard from '../components/UnassignedOrderCard';
import { useAxios } from '../hooks/useAxios';
import { getToken } from '../utils/tokenStorage';

const Home = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axios = useAxios();

  const fetchUnassignedOrders = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) {
        setError('No autenticado');
        setLoading(false);
        return;
      }
      const response = await axios.get('/orders/getOrders', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Respuesta del backend:', response.data);
      // Soporte para ambas estructuras: array directo o { orders: [...] }
      if (Array.isArray(response.data)) {
        setOrders(response.data);
      } else if (Array.isArray(response.data.orders)) {
        setOrders(response.data.orders);
      } else {
        setOrders([]);
      }
    } catch (err) {
      setError('Error al cargar los pedidos sin asignar');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnassignedOrders();
  }, []);

  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Pedidos sin Asignar</Text>
        </View>
      </SafeAreaView>
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#6C4BA2" />
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : orders.length === 0 ? (
          <Text style={styles.emptyText}>No hay pedidos sin asignar</Text>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
            renderItem={({ item }) => <UnassignedOrderCard order={item} />}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fff',
  },
  headerContainer: {
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0,
    paddingBottom: 12,
    alignItems: 'center',
    borderBottomWidth: 0,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    letterSpacing: 0.5,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 32,
    paddingTop: 16,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 40,
  },
  error: {
    color: '#ff3b30',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
});

export default Home; 