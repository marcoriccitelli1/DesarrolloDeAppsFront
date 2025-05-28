import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const UnassignedOrderCard = ({ order }) => {
  return (
    <View style={styles.card}>
      {/* Header violeta claro con ícono y número de pedido */}
      <View style={styles.header}>
        <MaterialCommunityIcons name="filter-variant" size={22} color="#fff" style={styles.headerIcon} />
        <Text style={styles.headerText}>Pedido #{order.id}</Text>
      </View>
      {/* Info estante y góndola */}
      <View style={styles.infoContent}>
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="eye-outline" size={20} color="#a085ff" style={styles.infoIcon} />
          <Text style={styles.infoLabel}>Estante: <Text style={styles.infoValue}>{order.estante ?? '-'}</Text></Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="map-marker-outline" size={20} color="#a085ff" style={styles.infoIcon} />
          <Text style={styles.infoLabel}>Góndola: <Text style={styles.infoValue}>{order.gondola ?? '-'}</Text></Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginVertical: 12,
    width: '92%',
    alignSelf: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ece6fa',
    elevation: 1,
    shadowColor: '#a085ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#a085ff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  headerIcon: {
    marginRight: 8,
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  infoContent: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: '#faf8ff',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoIcon: {
    marginRight: 8,
  },
  infoLabel: {
    fontSize: 15,
    color: '#444',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 15,
    color: '#222',
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#ece6fa',
    marginVertical: 6,
    marginLeft: 28,
    borderRadius: 2,
  },
});

export default UnassignedOrderCard; 