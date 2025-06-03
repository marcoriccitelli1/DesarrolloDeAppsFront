import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Image, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Home from '../screens/Home';
import OrdersAssigned from '../screens/OrdersAssigned';
import OrdersRecord from '../screens/OrdersRecord';
import Profile from '../screens/Profile';

const Tab = createBottomTabNavigator();

const QRButton = () => (
  <View style={styles.qrButton}>
    <Image 
      source={require('../../assets/qr.png')} 
      style={styles.qrIcon}
    />
  </View>
);

const TabNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 0,
          position: 'absolute',
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -3,
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarActiveTintColor: '#6c4eb6',
        tabBarInactiveTintColor: '#999',
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={Home}
        options={{
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="OrdersAssignedTab"
        component={OrdersAssigned}
        options={{
          tabBarLabel: 'Pedidos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="QRTab"
        component={Home}
        options={{
          tabBarLabel: '',
          tabBarIcon: () => <QRButton />,
        }}
      />
      <Tab.Screen
        name="OrdersRecordTab"
        component={OrdersRecord}
        options={{
          tabBarLabel: 'Historial',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={Profile}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  qrButton: {
    width: 76,
    height: 76,
    backgroundColor: '#6c4eb6',
    borderRadius: 38,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    position: 'relative',
    top: 10
  },
  qrIcon: {
    width: 55,
    height: 55,
    tintColor: '#fff',
  },
});

export default TabNavigator; 