import React, { useContext, useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAxios } from '../hooks/useAxios';
import CustomModal from '../components/CustomModal';

const Profile = () => {
  const [userData, setUserData] = useState({ name: 'Cargando...', email: 'Cargando...' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { logout } = useContext(AuthContext);
  const navigation = useNavigation();
  const axios = useAxios();
  const insets = useSafeAreaInsets();

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/user/getUser');
      setUserData(response.data);
      setIsConnected(true);
    } catch (err) {
      if (err.message === 'Network Error') {
        setError('No hay conexión a internet. Por favor, verifica tu conexión.');
        setIsConnected(false);
      } else if (err.response) {
        switch (err.response.status) {
          case 401:
            setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
            break;
          case 403:
            setError('No tienes permisos para ver tu perfil.');
            break;
          case 500:
            setError('Error en el servidor. Por favor, intenta más tarde.');
            break;
          default:
            setError('Error al cargar los datos del perfil');
        }
      } else {
        setError('Error al cargar los datos del perfil');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setError(null);
    fetchUserData();
  }, []);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await axios.get('/health');
        if (response.status === 200) {
          if (!isConnected) {
            setIsConnected(true);
            fetchUserData();
          }
        }
      } catch (err) {
        if (err.message === 'Network Error') {
          setError('No hay conexión a internet. Por favor, verifica tu conexión.');
          setIsConnected(false);
        }
      }
    };

    const intervalId = setInterval(checkConnection, 3000);
    fetchUserData();
    return () => clearInterval(intervalId);
  }, [axios, isConnected]);

  // Efecto para limpiar el mensaje de error después de 3 segundos
  useEffect(() => {
    let timeoutId;
    if (error) {
      timeoutId = setTimeout(() => {
        setError(null);
      }, 3000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [error]);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
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
      return (
        <View style={styles.fullScreenCenter}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.error}>{error}</Text>
          </View>
        </View>
      );
    }

    return (
      
      <View style={styles.contentContainer}>
        <View style={styles.optionContent}>
          <Ionicons name="person-outline" size={24} color="#6c4eb6" />
          <Text style={styles.name}>{userData?.name || 'Usuario'}</Text>
        </View>
        <View style={styles.userInfo}>
          <Pressable style={styles.option} onPress={() => {}}>
            <View style={styles.optionContent}>
              <Ionicons name="mail-outline" size={24} color="#6c4eb6" />
              <Text style={styles.optionText}>{userData?.email || 'Email'}</Text>
            </View>
          </Pressable>
        </View>
        <View style={styles.optionsContainer}>
          <Pressable 
            style={styles.option}
            onPress={() => {
              console.log('Intentando navegar a ChangePassword');
              navigation.navigate('ChangePassword');
              console.log('Navegación completada');
            }}
          >
            <View style={styles.optionContent}>
              <Ionicons name="key-outline" size={24} color="#6c4eb6" />
              <Text style={styles.optionText}>Cambiar Contraseña</Text>
            </View>
          </Pressable>
          <View style={styles.separator} />
          <Pressable style={styles.option} onPress={handleLogout}>
            <View style={styles.optionContent}>
              <Ionicons name="log-out-outline" size={24} color="#E74C3C" />
              <Text style={[styles.optionText, styles.logoutText]}>Cerrar Sesión</Text>
            </View>
          </Pressable>
        </View>
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
          <Pressable 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </Pressable>
          <Text style={styles.headerTitle}>Tu Perfil</Text>
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

      <CustomModal
        visible={showLogoutModal}
        message="¿Estás seguro que deseas cerrar sesión?"
        onAccept={handleConfirmLogout}
        onCancel={() => setShowLogoutModal(false)}
        acceptText="Cerrar sesión"
        cancelText="Cancelar"
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
    padding: 5,
    position: 'absolute',
    left: 15,
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
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  userInfo: {
    marginBottom: 20,
  },
  optionsContainer: {
    marginTop: 10,
  },
  option: {
    paddingVertical: 10,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginVertical: 8,
  },
  logoutText: {
    color: '#E74C3C',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  errorIcon: {
    fontSize: 40,
    marginBottom: 16,
  },
  fullScreenCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f6fa',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6c4eb6',
    marginBottom: 20,
    marginTop: 20,
  },
});

export default Profile; 