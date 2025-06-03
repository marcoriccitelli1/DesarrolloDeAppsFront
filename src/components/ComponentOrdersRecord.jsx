import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const getEstadoStyle = (estado) => {
  if (estado?.toLowerCase() === 'entregado') {
    return {
      backgroundColor: '#4CAF50',
      text: 'entregado'
    };
  }
  return {
    backgroundColor: '#FF5252',
    text: 'no entregado'
  };
};

const calcularDuracion = (horaInicio, horaFin) => {
  if (!horaInicio || !horaFin) return 'No disponible';
  
  // Convertir timestamps de Firestore si es necesario
  const inicio = horaInicio._seconds ? horaInicio._seconds * 1000 : new Date(horaInicio).getTime();
  const fin = horaFin._seconds ? horaFin._seconds * 1000 : new Date(horaFin).getTime();
  
  if (isNaN(inicio) || isNaN(fin)) return 'No disponible';
  
  const diffMs = fin - inicio;
  const minutos = Math.floor(diffMs / (1000 * 60));
  const segundos = Math.floor((diffMs % (1000 * 60)) / 1000);
  
  return `${minutos} min ${segundos} s`;
};

const ComponentOrdersRecord = ({ order }) => {
  const estadoStyle = getEstadoStyle(order.estado);
  
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons name="filter-variant" size={22} color="#fff" style={styles.headerIcon} />
          <Text style={styles.pedidoText}>Pedido #{order.id || 'Sin ID'}</Text>
        </View>
        <View style={[styles.estadoContainer, { backgroundColor: estadoStyle.backgroundColor }]}>
          <Text style={styles.estadoText}>{estadoStyle.text}</Text>
        </View>
      </View>
      
      <View style={styles.body}>
        <View style={styles.row}>
          <MaterialCommunityIcons name="clock-outline" size={20} color="#6c4eb6" style={styles.icon} />
          <Text style={styles.infoText}>
            Duración: {calcularDuracion(order.horaInicio, order.horaFin)}
          </Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.row}>
          <MaterialCommunityIcons name="account-outline" size={20} color="#6c4eb6" style={styles.icon} />
          <Text style={styles.infoText}>
            Cliente: {order.cliente || 'Sin cliente'}
          </Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.row}>
          <MaterialCommunityIcons name="map-marker-outline" size={20} color="#6c4eb6" style={styles.icon} />
          <Text style={styles.infoText}>
            Dirección: {order.destino || order.ubicacion || 'Sin dirección'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginVertical: 8,
    width: '92%',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 7,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#6c4eb6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 8,
  },
  pedidoText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  estadoContainer: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  estadoText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  body: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#ece6fa',
    marginVertical: 3,
    marginLeft: 28,
    borderRadius: 2,
  },
  icon: {
    marginRight: 12,
  },
  infoText: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
});

export default ComponentOrdersRecord; 