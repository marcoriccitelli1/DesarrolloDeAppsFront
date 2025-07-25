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
import { useUserService } from '../services/userService';
import CustomModal from '../components/CustomModal';
import ErrorDisplay from '../components/ErrorDisplay';

const Profile = () => {
  const [userData, setUserData] = useState({ name: 'Cargando...', email: 'Cargando...' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { logout } = useContext(AuthContext);
  const navigation = useNavigation();
  const userService = useUserService();
  const insets = useSafeAreaInsets();

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await userService.getUserProfile();
      if (result.success) {
        setUserData(result.data);
        setIsConnected(true);
      } else {
        setError(result.error);
        if (result.isNetworkError) {
          setIsConnected(false);
        }
      }
    } catch (err) {
      setError('Error al cargar los datos del perfil');
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
        const result = await userService.checkConnection();
        if (result.success && result.isConnected) {
          if (!isConnected) {
            setIsConnected(true);
            fetchUserData();
          }
        }
      } catch (err) {
        setIsConnected(false);
      }
    };
    const intervalId = setInterval(checkConnection, 3000);
    fetchUserData();
    return () => clearInterval(intervalId);
  }, [isConnected]);

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
    } catch (error) {}
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
              navigation.navigate('ChangePassword');
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