import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';

const Navbar = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // Determinar el tab activo según la ruta actual
  const getActiveTab = () => {
    switch (route.name) {
      case 'OrdersAssigned':
        return 'Pedidos';
      case 'OrdersRecord':
        return 'Historial';
      case 'Profile':
        return 'Perfil';
      default:
        return '';
    }
  };
  const activeTab = getActiveTab();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Home')}>
        <Icon name="home-outline" size={28} color={activeTab === 'Menu' ? '#6c4eb6' : '#222'} />
        <Text style={[styles.label, activeTab === 'Menu' && styles.activeLabel]}>Menú</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('OrdersAssigned')}>
        <Icon name="clock-outline" size={28} color={activeTab === 'Pedidos' ? '#6c4eb6' : '#222'} />
        <Text style={[styles.label, activeTab === 'Pedidos' && styles.activeLabel]}>Pedidos</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.qrButton} onPress={() => {/* Aquí puedes poner navegación a QR si tienes esa pantalla */}}>
        <Image source={require('../../assets/qr.png')} style={styles.qrImage} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('OrdersRecord')}>
        <Icon name="history" size={28} color={activeTab === 'Historial' ? '#6c4eb6' : '#222'} />
        <Text style={[styles.label, activeTab === 'Historial' && styles.activeLabel]}>Historial</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Profile')}>
        <Icon name="account-outline" size={28} color={activeTab === 'Perfil' ? '#6c4eb6' : '#222'} />
        <Text style={[styles.label, activeTab === 'Perfil' && styles.activeLabel]}>Perfil</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 90,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingBottom: 18,
  },
  item: {
    alignItems: 'center',
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#222',
    marginTop: 2,
  },
  activeLabel: {
    color: '#6c4eb6',
    fontWeight: 'bold',
  },
  qrButton: {
    backgroundColor: '#6c4eb6',
    width: 74,
    height: 74,
    borderRadius: 37,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -37,
    borderWidth: 5,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
  },
  qrImage: {
    width: 48,
    height: 48,
    resizeMode: 'contain',
    tintColor: '#fff',
  },
});

export default Navbar; 