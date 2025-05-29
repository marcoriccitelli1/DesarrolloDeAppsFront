import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, NetInfo, RefreshControl, ScrollView, StatusBar } from 'react-native';
import { useAxios } from '../hooks/useAxios';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const OrdersAssigned = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const axios = useAxios();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: false
    });
  }, [navigation]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/orders');
      
      if (!response.data) {
        throw new Error('No se recibieron datos del servidor');
      }
      
      setOrders(response.data.orders || []);
      setIsConnected(true);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setOrders([]);
        setError(null);
      } else if (err.message === 'Network Error') {
        setError('No hay conexión a internet. Por favor, verifica tu conexión.');
        setIsConnected(false);
      } else if (err.response) {
        switch (err.response.status) {
          case 401:
            setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
            break;
          case 403:
            setError('No tienes permisos para ver estas órdenes.');
            break;
          case 500:
            setError('Error en el servidor. Por favor, intenta más tarde.');
            break;
          default:
            setError('Ocurrió un error al cargar las órdenes.');
        }
      } else {
        setError('Ocurrió un error inesperado. Por favor, intenta nuevamente.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchOrders();
  }, []);

  useEffect(() => {
    // Función para verificar la conexión
    const checkConnection = async () => {
      try {
        const response = await axios.get('/health');
        if (response.status === 200) {
          // Si la conexión se restableció, recargamos los datos
          if (!isConnected) {
            setIsConnected(true);
            fetchOrders();
          }
        }
      } catch (err) {
        if (err.message === 'Network Error') {
          setError('No hay conexión a internet. Por favor, verifica tu conexión.');
          setIsConnected(false);
        }
      }
    };

    // Verificar la conexión cada 3 segundos
    const intervalId = setInterval(checkConnection, 3000);

    // Cargar datos iniciales
    fetchOrders();

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, [axios, isConnected]);

  const renderContent = () => {
    if (loading || refreshing) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6A1B9A" />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.error}>{error}</Text>
        </View>
      );
    }

    if (orders.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📦</Text>
          <Text style={styles.text}>Todavía no hay pedidos asignados</Text>
          <Text style={styles.subText}>Los pedidos aparecerán aquí cuando sean asignados a tu cuenta</Text>
        </View>
      );
    }

    return (
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
          style={styles.center}
          contentContainerStyle={styles.scrollContent}
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
  center: {
    flex: 1,
    backgroundColor: '#f9f6fa',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
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
  orderItem: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
});

export default OrdersAssigned; 