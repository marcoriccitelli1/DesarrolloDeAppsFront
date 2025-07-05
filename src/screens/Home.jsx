import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, StatusBar, RefreshControl } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import UnassignedOrderCard from '../components/UnassignedOrderCard';
import { useOrderService } from '../services/orderService';

const Home = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const orderService = useOrderService();
  const insets = useSafeAreaInsets();

  const fetchUnassignedOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await orderService.getUnassignedOrders();
      
      if (result.success) {
        setOrders(result.data);
        setIsConnected(true);
      } else {
        setError(result.error);
        if (result.isNetworkError) {
          setIsConnected(false);
        }
      }
    } catch (err) {
      console.error('Error inesperado:', err);
      setError('Error al cargar los pedidos sin asignar');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setError(null);
    setOrders([]);
    fetchUnassignedOrders();
  }, []);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const result = await orderService.checkConnection();
        if (result.success && result.isConnected) {
          if (!isConnected) {
            setIsConnected(true);
            fetchUnassignedOrders();
          }
        }
      } catch (err) {
        console.error('Error checking connection:', err);
        setIsConnected(false);
      }
    };

    const intervalId = setInterval(checkConnection, 3000);
    fetchUnassignedOrders();
    return () => clearInterval(intervalId);
  }, [orderService, isConnected]);

  const renderContent = () => {
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
            <Text style={styles.text}>No hay pedidos sin asignar</Text>
            <Text style={styles.subText}>Los pedidos aparecerán aquí cuando estén disponibles</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        {orders.map((item) => (
          <UnassignedOrderCard key={item.id?.toString() || Math.random().toString()} order={item} />
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
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Pedidos sin Asignar</Text>
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
    paddingTop: 16,
    paddingBottom: 80,
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
  fullScreenCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f6fa',
  },
});

export default Home;