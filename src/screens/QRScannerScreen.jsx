import { useState, useEffect, useRef, useContext } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Button, ActivityIndicator, Surface, IconButton } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQRCodeService } from '../services/qrCodeService';
import { useAxios } from '../hooks/useAxios';
import { AuthContext } from '../context/AuthContext';
import CustomModal from '../components/CustomModal';

const QRScannerScreen = ({ navigation }) => {
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const scannedRef = useRef(false); 
  const insets = useSafeAreaInsets();
  const { takeOrder } = useQRCodeService();
  const axios = useAxios();
  const { user } = useContext(AuthContext);

  const [permission, requestPermission] = useCameraPermissions();
  const [cameraKey, setCameraKey] = useState(0);

  useEffect(() => {
    (async () => {
      requestPermission();
    })();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Resetea el estado del scanner y fuerza el remount de la cámara
      scannedRef.current = false;
      setScanned(false);
      setCameraKey(prevKey => prevKey + 1);
    });

    return unsubscribe;
  }, [navigation]);

  const handleBarCodeScanned = async ({ type, data }) => {
    if (scannedRef.current) return;

    scannedRef.current = true;
    setLoading(true);

    try {
      const response = await axios.post(`/orders/takeOrder/${data}`);

      setShowSuccessModal(true);
    } catch (error) {
      let errorMessage = 'Error al procesar el pedido';
      
      if (error.response) {
        errorMessage = error.response.data?.message || 'Error al procesar el pedido';
      } else if (error.request) {
        errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
      } else {
        errorMessage = error.message || 'Error desconocido';
      }

      setErrorMessage(errorMessage);
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={styles.text}>Solicitando permiso de cámara...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
        <View style={[styles.container, { paddingBottom: insets.bottom }]}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Qr Scanner</Text>
          </View>
          <View style={styles.fullScreenCenter}>
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📷</Text>
              <Text style={styles.text}>No hay acceso a la cámara</Text>
              <Text style={styles.subText}>Necesitas permitir el acceso a la cámara para escanear códigos QR</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Qr Scanner</Text>
        </View>
        {!scanned ? (
          <View style={styles.cameraContainer}>
            <CameraView
              key={cameraKey}
              style={[styles.camera, { marginBottom: 60 }]}
              barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
              onBarcodeScanned={handleBarCodeScanned}
              enableTorch={flashEnabled}
            />
            <View style={styles.controlsContainer}>
              <View style={styles.flashButtonContainer}>
                <IconButton
                  icon={flashEnabled ? "flash" : "flash-off"}
                  size={30}
                  iconColor="#fff"
                  style={styles.flashButton}
                  onPress={() => setFlashEnabled(!flashEnabled)}
                />
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.scanAgainContainer}>
            <IconButton
              icon="camera"
              size={30}
              iconColor="#fff"
              style={styles.scanAgainButton}
              onPress={() => {
                setScanned(false);
                scannedRef.current = false;
              }}
            />
          </View>
        )}
      </View>
      
      {/* Modal de éxito */}
      <CustomModal
        visible={showSuccessModal}
        message="El pedido ha sido asignado y marcado como entregado correctamente."
        acceptText="Aceptar"
        onAccept={() => {
          setShowSuccessModal(false);
          navigation.navigate('OrdersAssignedTab');
        }}
        showButtons={true}
        showCancelButton={false}
        acceptButtonStyle={{ backgroundColor: '#4CAF50' }}
      />

      {/* Modal de error */}
      <CustomModal
        visible={showErrorModal}
        message={errorMessage}
        acceptText="Aceptar"
        onAccept={() => {
          setShowErrorModal(false);
          scannedRef.current = false;
        }}
        showButtons={true}
        showCancelButton={false}
        acceptButtonStyle={{ backgroundColor: '#f44336' }}
      />
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
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
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
  fullScreenCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f6fa',
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
  controlsContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    gap: 10,
  },
  flashButtonContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 25,
  },
  flashButton: {
    margin: 0,
  },
  scanAgainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f6fa',
  },
  scanAgainButton: {
    margin: 0,
  },
});

export default QRScannerScreen;
