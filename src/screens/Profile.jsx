import React, { useContext, useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAxios } from '../hooks/useAxios';

const Profile = () => {
  const [userData, setUserData] = useState({ name: 'Cargando...', email: 'Cargando...' });
  const { logout } = useContext(AuthContext);
  const navigation = useNavigation();
  const axios = useAxios();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('/user/getUser');
      setUserData(response.data);
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos del usuario');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sí, cerrar sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Error al cerrar sesión:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View 
      style={[
        styles.mainContainer,
        { paddingTop: insets.top }
      ]}
    >
      <StatusBar
        backgroundColor="#6c4eb6"
        barStyle="light-content"
      />
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tu Perfil</Text>
        </View>
        <Text style={styles.name}>{userData?.name || 'Usuario'}</Text>
        <View style={styles.userInfo}>
          <Text style={styles.userInfoText}>{userData?.email}</Text>
        </View>
        <View style={styles.optionsContainer}>
          <TouchableOpacity 
            style={styles.option}
            onPress={() => {
              console.log('Intentando navegar a ChangePassword');
              navigation.navigate('ChangePassword');
              console.log('Navegación completada');
            }}
          >
            <Text style={styles.optionText}>Cambiar Contraseña</Text>
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity style={styles.option} onPress={handleLogout}>
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
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
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6c4eb6',
    marginBottom: 20,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  userInfo: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  userInfoText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  optionsContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  option: {
    paddingVertical: 10,
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
    fontSize: 16,
    color: 'red',
  },
});

export default Profile; 