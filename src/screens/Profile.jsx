import React, { useContext, useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
<<<<<<< HEAD
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
=======
  SafeAreaView,
  StatusBar,
  ActivityIndicator 
} from 'react-native';
>>>>>>> 8824e2fe37ac011cbda979ff7495a9e2b6cecc6e
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAxios } from '../hooks/useAxios';

const Profile = () => {
<<<<<<< HEAD
  const [userData, setUserData] = useState({ name: 'Cargando...', email: 'Cargando...' });
  const { logout } = useContext(AuthContext);
  const navigation = useNavigation();
  const axios = useAxios();
  const insets = useSafeAreaInsets();
=======
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useContext(AuthContext);
  const navigation = useNavigation();
  const axios = useAxios();
>>>>>>> 8824e2fe37ac011cbda979ff7495a9e2b6cecc6e

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
<<<<<<< HEAD
=======
    } finally {
      setLoading(false);
>>>>>>> 8824e2fe37ac011cbda979ff7495a9e2b6cecc6e
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

<<<<<<< HEAD
  return (
    <View 
      style={[
        styles.mainContainer,
        { paddingTop: insets.top }
      ]}
    >
=======
  if (loading) {
    return (
      <View style={[styles.mainContainer, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#6c4eb6" />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
>>>>>>> 8824e2fe37ac011cbda979ff7495a9e2b6cecc6e
      <StatusBar
        backgroundColor="#6c4eb6"
        barStyle="light-content"
      />
<<<<<<< HEAD
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </TouchableOpacity>
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
=======
      <SafeAreaView style={styles.safeAreaTop} />
      <SafeAreaView style={styles.safeAreaBottom}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{userData?.name || 'Usuario'}</Text>
          <View style={styles.userInfo}>
            <Text style={styles.userInfoText}>{userData?.email}</Text>
          </View>
          <View style={styles.optionsContainer}>
            <TouchableOpacity 
              style={styles.option}
              onPress={() => navigation.navigate('ChangePassword')}
            >
              <Text style={styles.optionText}>Cambiar Contraseña</Text>
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity style={styles.option} onPress={handleLogout}>
              <Text style={styles.logoutText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
>>>>>>> 8824e2fe37ac011cbda979ff7495a9e2b6cecc6e
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#6c4eb6'
  },
<<<<<<< HEAD
=======
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  safeAreaTop: {
    flex: 0,
    backgroundColor: '#6c4eb6'
  },
  safeAreaBottom: {
    flex: 1,
    backgroundColor: '#f9f6fa'
  },
>>>>>>> 8824e2fe37ac011cbda979ff7495a9e2b6cecc6e
  container: {
    flex: 1,
    backgroundColor: '#f9f6fa',
  },
  header: {
    height: 60,
    backgroundColor: '#6c4eb6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backButton: {
    padding: 5,
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