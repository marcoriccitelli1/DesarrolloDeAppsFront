import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Platform, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CustomButton from '../components/CustomButton';
import CustomModal from '../components/CustomModal';
import { useAxios } from '../hooks/useAxios';
import { AuthContext } from '../context/AuthContext';

const DetailItem = ({ icon, label, value }) => (
  <View style={styles.item}>
    <MaterialCommunityIcons name={icon} size={22} color="#6c4eb6" style={styles.icon} />
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const OrderDetailScreen = ({ route, navigation }) => {
  const { order } = route.params;
  const insets = useSafeAreaInsets();
  const axios = useAxios();
  const { user } = useContext(AuthContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [modalError, setModalError] = useState('');

  const openGoogleMaps = () => {
    const location = order.destino;
    const encodedLocation = encodeURIComponent(location);
    const url = Platform.select({
      ios: `maps:0,0?q=${encodedLocation}`,
      android: `geo:0,0?q=${encodedLocation}`
    });

    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          const browserUrl = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
          return Linking.openURL(browserUrl);
        }
      })
      .catch(err => console.error('Error al abrir Google Maps:', err));
  };
  
  const handleFinalizeOrder = async () => {
    setModalError(''); 
  
    if (confirmationCode.length !== 5) {
      setModalError("El código debe tener 5 dígitos.");
      return;
    }
    
    try {
      const body = {
        orderId: order.id,
        codigoRecepcion: parseInt(confirmationCode, 10)
      };
      
      const response = await axios.post('/orders/finishOrder', body);
      
      if (response.data.success) {
        setModalVisible(false);
        Alert.alert("Éxito", response.data.message || "El pedido ha sido finalizado correctamente.", [
          { text: "OK", onPress: () => navigation.goBack() }
        ]);
      } else {
        setModalError(response.data.message || 'Error al finalizar el pedido.');
      }
  
    } catch (error) {
      console.log('Error completo al finalizar:', JSON.stringify(error, null, 2));
      let displayMessage = 'Ocurrió un error inesperado.';
  
      if (error.response) {
        displayMessage = error.response.data?.message || `Error del servidor: ${error.response.status}`;
      } else if (error.request) {
        displayMessage = 'No se pudo conectar con el servidor. Revisa tu conexión.';
      }
  
      setModalError(displayMessage);
    }
  }; 
  
  const openConfirmationModal = () => {
    console.log("Botón 'Finalizar Pedido' presionado. Abriendo modal de confirmación...");
    setConfirmationCode('');
    setModalError(''); 
    setModalVisible(true);
  };

  return (
    <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalles del Pedido</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <View style={styles.orderIdContainer}>
              <MaterialCommunityIcons name="barcode" size={28} color="#6c4eb6" />
              <Text style={styles.orderIdText}>Pedido #{order.id}</Text>
            </View>
            <DetailItem icon="account-outline" label="Cliente:" value={order.cliente} />
            <DetailItem icon="map-marker-outline" label="Destino:" value={order.destino} />
            <DetailItem icon="information-outline" label="Estado:" value={order.estado} />
            <DetailItem icon="package-variant-closed" label="Estante:" value={order.estante} />
            <DetailItem icon="store" label="Góndola:" value={order.gondola} />
            {order.fechaInicial && (
              <DetailItem icon="calendar-clock" label="Fecha Asignación:" value={new Date(order.fechaInicial).toLocaleString('es-AR')} />
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <CustomButton
            title="Ver Ruta en Maps"
            onPress={openGoogleMaps}
            style={styles.mapsButton}
            textStyle={styles.buttonText}
            icon={<MaterialCommunityIcons name="map-marker" size={20} color="#fff" />}
          />
          <CustomButton
            title="Finalizar Pedido"
            onPress={openConfirmationModal}
            style={styles.completeButton}
            textStyle={styles.buttonText}
            icon={<MaterialCommunityIcons name="check-bold" size={20} color="#fff" />}
          />
        </View>

        <CustomModal
          visible={modalVisible}
          message="Ingrese el código de recepción para poder finalizar la entrega"
          onAccept={handleFinalizeOrder}
          onCancel={() => {
            setModalVisible(false);
            setModalError('');
          }}
          showInput={true}
          inputValue={confirmationCode}
          onInputChange={(text) => {
            setConfirmationCode(text);
            if (modalError) setModalError(''); 
          }}
          inputKeyboardType="numeric"
          inputMaxLength={5}
          acceptText="Aceptar"
          cancelText="Cancelar"
          showCancelButton={true}
          errorText={modalError}
        />
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
  backButton: {
    position: 'absolute',
    left: 10,
    zIndex: 2,
    padding: 4,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.5,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 110,
    backgroundColor: '#f9f6fa',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 22,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    marginTop: 10,
    marginBottom: 30,
  },
  orderIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    justifyContent: 'center',
  },
  orderIdText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6c4eb6',
    marginLeft: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  icon: {
    marginRight: 8,
  },
  label: {
    fontWeight: 'bold',
    color: '#6c4eb6',
    minWidth: 120,
    marginRight: 4,
    fontSize: 15,
  },
  value: {
    fontSize: 15,
    color: '#333',
    flexShrink: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingTop: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  mapsButton: {
    backgroundColor: '#4285F4', 
    marginBottom: 12,
  },
  completeButton: {
    backgroundColor: '#34A853', 
  },
  buttonText: {
    color: '#fff',
    marginLeft: 10,
  },
});

export default OrderDetailScreen;