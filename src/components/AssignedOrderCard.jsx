import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const getEstadoStyle = (estado) => {
  switch (estado?.toLowerCase()) {
    case 'asignado':
      return {
        backgroundColor: '#2196F3',
        text: 'Asignado'
      };
    case 'en_proceso':
    case 'en proceso':
      return {
        backgroundColor: '#FF9800',
        text: 'En Proceso'
      };
    case 'completado':
      return {
        backgroundColor: '#4CAF50',
        text: 'Completado'
      };
    case 'cancelado':
      return {
        backgroundColor: '#F44336',
        text: 'Cancelado'
      };
    default:
      return {
        backgroundColor: '#FFC107',
        text: 'En curso'
      };
  }
};

const AssignedOrderCard = ({ order, onPress }) => {
  const estadoStyle = getEstadoStyle(order.estado);
  
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => onPress && onPress(order)}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons name="package-variant" size={22} color="#fff" style={styles.headerIcon} />
          <Text style={styles.pedidoText}>Pedido #{order.id || 'Sin ID'}</Text>
        </View>
        <View style={[styles.estadoContainer, { backgroundColor: estadoStyle.backgroundColor }]}>
          <Text style={styles.estadoText}>{estadoStyle.text}</Text>
        </View>
      </View>
      
      <View style={styles.body}>
        {order.estante && (
          <>
            <View style={styles.row}>
              <MaterialCommunityIcons name="package-variant-closed" size={20} color="#6c4eb6" style={styles.icon} />
              <Text style={styles.infoText}>
                Estante: {order.estante}
              </Text>
            </View>
            <View style={styles.separator} />
          </>
        )}

        {order.gondola && (
          <>
            <View style={styles.row}>
              <MaterialCommunityIcons name="store" size={20} color="#6c4eb6" style={styles.icon} />
              <Text style={styles.infoText}>
                Góndola: {order.gondola}
              </Text>
            </View>
            <View style={styles.separator} />
          </>
        )}

        {order.cliente && (
          <>
            <View style={styles.row}>
              <MaterialCommunityIcons name="account-outline" size={20} color="#6c4eb6" style={styles.icon} />
              <Text style={styles.infoText}>
                Cliente: {order.cliente}
              </Text>
            </View>
            <View style={styles.separator} />
          </>
        )}

        {order.destino && (
          <View style={styles.row}>
            <MaterialCommunityIcons name="map-marker-outline" size={20} color="#6c4eb6" style={styles.icon} />
            <Text style={styles.infoText}>
              Destino: {order.destino}
            </Text>
          </View>
        )}

        {order.fechaAsignacion && (
          <>
            <View style={styles.separator} />
            <View style={styles.row}>
              <MaterialCommunityIcons name="calendar-clock" size={20} color="#6c4eb6" style={styles.icon} />
              <Text style={styles.infoText}>
                Asignado: {new Date(order.fechaAsignacion).toLocaleDateString('es-ES')}
              </Text>
            </View>
          </>
        )}

        {order.prioridad && (
          <>
            <View style={styles.separator} />
            <View style={styles.row}>
              <MaterialCommunityIcons 
                name={order.prioridad === 'alta' ? 'flag' : 'flag-outline'} 
                size={20} 
                color={order.prioridad === 'alta' ? '#F44336' : '#6c4eb6'} 
                style={styles.icon} 
              />
              <Text style={[
                styles.infoText, 
                order.prioridad === 'alta' && styles.prioridadAlta
              ]}>
                Prioridad: {order.prioridad.charAt(0).toUpperCase() + order.prioridad.slice(1)}
              </Text>
            </View>
          </>
        )}
      </View>
    </TouchableOpacity>
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
  prioridadAlta: {
    color: '#F44336',
    fontWeight: 'bold',
  },
});

export default AssignedOrderCard;