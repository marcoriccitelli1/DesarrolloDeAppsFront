import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const getEstadoColor = (estado) => {
  if (!estado) return '#bdbdbd';
  if (estado.toLowerCase() === 'entregado') return '#7c4dff';
  if (estado.toLowerCase() === 'no entregado') return '#ff7043';
  return '#6C4BA2';
};

const formatHoraFin = (horaFin) => {
  if (!horaFin) return 'Sin fecha de entrega';
  // Firestore Timestamp
  if (typeof horaFin === 'object' && horaFin._seconds) {
    const date = new Date(horaFin._seconds * 1000);
    if (isNaN(date.getTime())) return 'Sin fecha de entrega';
    return date.toLocaleDateString('es-AR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }
  // String o número
  const date = new Date(horaFin);
  if (isNaN(date.getTime())) return 'Sin fecha de entrega';
  return date.toLocaleDateString('es-AR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

const calcularHorasYMinutos = (horaInicio, horaFin) => {
  if (!horaInicio || !horaFin) return 'No disponible';
  // Firestore Timestamp
  const inicio = (typeof horaInicio === 'object' && horaInicio._seconds)
    ? horaInicio._seconds * 1000
    : new Date(horaInicio).getTime();
  const fin = (typeof horaFin === 'object' && horaFin._seconds)
    ? horaFin._seconds * 1000
    : new Date(horaFin).getTime();
  if (isNaN(inicio) || isNaN(fin)) return 'No disponible';
  const diffMs = fin - inicio;
  const horas = Math.floor(diffMs / (1000 * 60 * 60));
  const minutos = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${horas}h ${minutos}m`;
};

const ComponentOrdersRecord = ({ order }) => {
  const colorEstado = getEstadoColor(order.estado);
  return (
    <View style={styles.card}>
      {/* Header con estado */}
      <View style={[styles.header, { backgroundColor: colorEstado }]}> 
        <Text style={styles.estado}>{order.estado || 'Estado'}</Text>
      </View>
      {/* Contenido con íconos y datos */}
      <View style={styles.body}>
        <View style={styles.row}>
          <MaterialCommunityIcons name="clock-outline" size={20} color="#7c4dff" style={styles.icon} />
          <Text style={styles.infoText}>
            {calcularHorasYMinutos(order.horaInicio, order.horaFin)}
          </Text>
        </View>
        <View style={styles.row}>
          <MaterialCommunityIcons name="account-outline" size={20} color="#7c4dff" style={styles.icon} />
          <Text style={styles.infoText}>{order.cliente || 'Sin cliente'}</Text>
        </View>
        <View style={styles.row}>
          <MaterialCommunityIcons name="map-marker-outline" size={20} color="#7c4dff" style={styles.icon} />
          <Text style={styles.infoText}>
            {order.ubicacion
              ? order.ubicacion
              : (order.estante && order.gondola
                ? `Estante: ${order.estante} - Góndola: ${order.gondola}`
                : 'Sin ubicación')}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginVertical: 12,
    width: '92%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  header: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    alignItems: 'center',
  },
  estado: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textTransform: 'capitalize',
    letterSpacing: 1,
  },
  body: {
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    marginRight: 12,
  },
  infoText: {
    fontSize: 15,
    color: '#333',
    flex: 1,
    flexWrap: 'wrap',
  },
});

export default ComponentOrdersRecord; 