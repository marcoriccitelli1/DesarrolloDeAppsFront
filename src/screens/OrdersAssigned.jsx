import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, StatusBar, RefreshControl, ScrollView } from 'react-native';
import { useAxios } from '../hooks/useAxios';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AssignedOrderCard from '../components/AssignedOrderCard';

const OrdersAssigned = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const axios = useAxios();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Haciendo petición a /orders/getAssignedOrders...');
      const response = await axios.get('/orders/getAssignedOrders');
      
      console.log('Respuesta completa:', response);
      console.log('Response.data:', response.data);
      console.log('Response.status:', response.status);
      
      if (!response.data) {
        throw new Error('No se recibieron datos del servidor');
      }
      
      let ordersData = [];
      if (response.data.orders) {
        ordersData = response.data.orders;
        console.log('Usando response.data.orders');
      } else if (Array.isArray(response.data)) {
        ordersData = response.data;
        console.log('Usando response.data como array');
      } else if (response.data.data && Array.isArray(response.data.data)) {
        ordersData = response.data.data;
        console.log('Usando response.data.data');
      } else {
        console.log('Estructura de datos inesperada:', response.data);
        ordersData = [];
      }
      
      console.log('Pedidos procesados:', ordersData);
      setOrders(ordersData);
    } catch (err) {
      console.error('Error en fetchOrders:', err);
      console.error('Error response:', err.response ? JSON.stringify(err.response) : 'N/A');
      console.error('Error message:', err.message);
      
      if (err.response && err.response.status === 404) {
        setOrders([]);
        setError(null); // Correcto: no es un error, sino un estado vacío.
      } else if (!err.response || err.message === 'Network Error') {
        setError('No hay conexión a internet. Por favor, verifica tu conexión.');
      } else if (err.response) {
        switch (err.response.status) {
          case 401:
            setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
            break;
          case 403:
            setError('No tienes permisos para ver estos pedidos.');
            break;
          case 500:
            setError('Error en el servidor. Por favor, intenta más tarde.');
            break;
          default:
            setError(`Error ${err.response.status}: ${err.response.data?.message || 'Ocurrió un error al cargar los pedidos.'}`);
        }
      } else {
        setError('Ocurrió un error inesperado. Por favor, intenta nuevamente.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [axios]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: false
    });

    const unsubscribe = navigation.addListener('focus', () => {
      console.log("La pantalla ha ganado foco, actualizando pedidos...");
      fetchOrders();
    });

    return unsubscribe;
  }, [navigation, fetchOrders]);

  const handleOrderPress = (order) => {
    navigation.navigate('OrderDetail', { order });
  };

  const renderContent = () => {
    console.log('Estado actual - loading:', loading, 'refreshing:', refreshing, 'orders.length:', orders.length, 'error:', error);
    
    if (loading && !refreshing) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6c4eb6" />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.fullScreenCenter}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.error}>{error}</Text>
          </View>
        </View>
      );
    }

    if (!loading && orders.length === 0) {
      return (
        <View style={styles.fullScreenCenter}>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.text}>Todavía no hay pedidos asignados</Text>
            <Text style={styles.subText}>Los pedidos aparecerán aquí cuando sean asignados a tu cuenta</Text>
          </View>
        </View>
      );
    }

    console.log('Renderizando pedidos:', orders);
    return (
      <View style={styles.listContainer}>
        {orders.map((order) => (
          <AssignedOrderCard
            key={order.id?.toString() || Math.random().toString()}
            order={order}
            onPress={handleOrderPress}
          />
        ))}
      </View>
    );
  };

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
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Pedidos Asignados</Text>
        </View>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContentContainer,
            { paddingBottom: insets.bottom + 20 }
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#6c4eb6']}
              tintColor="#6c4eb6"
            />
          }
        >
          {renderContent()}
        </ScrollView>
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
  scrollContentContainer: {
    flexGrow: 1,
    backgroundColor: '#f9f6fa',
  },
  center: {
    flex: 1,
    backgroundColor: '#f9f6fa',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingTop: 20,
  },
  text: {
    fontSize: 18,
    color: '#6c4eb6',
    fontWeight: '600',
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
    lineHeight: 20,
  },
  error: {
    color: '#E74C3C',
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
  errorContainer: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FDF2F1',
    borderRadius: 12,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  errorIcon: {
    fontSize: 40,
    marginBottom: 16,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 32,
    paddingTop: 16,
    width: '100%',
  },
  fullScreenCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f6fa',
  },
});

export default OrdersAssigned;