import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, StatusBar, RefreshControl, ScrollView } from 'react-native';
import { useOrderService } from '../services/orderService';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { openAllRoutes } from '../services/routeService';

import AssignedOrderCard from '../components/AssignedOrderCard';
import ErrorDisplay from '../components/ErrorDisplay';
import EmptyStateDisplay from '../components/EmptyStateDisplay';
import CustomButton from '../components/CustomButton';

const OrdersAssigned = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const orderService = useOrderService();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
   
      const result = await orderService.getAssignedOrders();
      
      if (result.success) {

        setOrders(result.data);
      } else {
        if (result.status === 404) {
          setOrders([]);
          setError(null); // No es un error, sino un estado vacío
        } else {
          setError(result.error);
        }
      }
    } catch (err) {

      setError('Ocurrió un error inesperado. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: false
    });

    const unsubscribe = navigation.addListener('focus', () => {

      fetchOrders();
    });

    return unsubscribe;
  }, [navigation, fetchOrders]);

  const handleOrderPress = (order) => {
    navigation.navigate('OrderDetail', { order });
  };

  const handleOpenAllRoutes = () => {
    openAllRoutes(orders);
  };

  const renderContent = () => {

    
    if (loading && !refreshing) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6c4eb6" />
        </View>
      );
    }

    if (error) {
      return <ErrorDisplay error={error} />;
    }

    if (!loading && orders.length === 0) {
      return (
        <EmptyStateDisplay
          icon="📦"
          mainMessage="Todavía no hay pedidos asignados"
          subMessage="Los pedidos aparecerán aquí cuando sean asignados a tu cuenta"
        />
      );
    }

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
          <Text style={styles.headerTitle}>Mis Pedidos</Text>
        </View>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContentContainer,
            { paddingBottom: (insets.bottom || 16) + 100 }
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
        {orders.length > 0 && (
          <View style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: (insets.bottom || 16) + 60,
            backgroundColor: 'transparent',
            alignItems: 'center',
            padding: 12,
            zIndex: 100,
            pointerEvents: 'box-none'
          }}>
            <View style={{ width: '90%' }}>
              <CustomButton
                title="Ver Ruta de todos los pedidos"
                onPress={handleOpenAllRoutes}
                style={{ backgroundColor: '#4285F4' }}
                textStyle={{ color: '#fff', fontWeight: 'bold' }}
                icon={<MaterialCommunityIcons name="map-marker" size={20} color="#fff" />}
              />
            </View>
          </View>
        )}
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