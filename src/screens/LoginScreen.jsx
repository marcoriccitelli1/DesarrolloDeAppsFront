import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomTextField from '../components/CustomTextField';
import CustomButton from '../components/CustomButton';
import { AuthContext } from '../context/AuthContext';
import { useAxios } from '../hooks/useAxios';

console.log("LoginScreen: renderizando componente");

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const axios = useAxios();
  const insets = useSafeAreaInsets();

  console.log("LoginScreen: login del contexto:", login);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      console.log("LoginScreen: intentando login con", email);
      const response = await axios.post('/auth/login', {
        email,
        password,
      });
      
      console.log("LoginScreen: respuesta del backend:", response.data);
      const { token } = response.data;
      await login(token);
    } catch (err) {
      console.log("LoginScreen: error en login:", err?.response?.data);
      if (err.response?.status === 401) {
        setError('Email o contraseña incorrectos');
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Error al intentar iniciar sesión');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View 
      style={[
        styles.safeArea,
        { paddingTop: insets.top }
      ]}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <View style={styles.logoContainer}>
            <Image source={require('../../assets/logonuevo.png')} style={styles.logo} />
            <Text style={styles.title}>Iniciar Sesión</Text>
          </View>
          <View style={[styles.card, { marginBottom: insets.bottom + 20 }]}>
          <View style={[styles.card, { marginBottom: insets.bottom + 20 }]}>
            <View style={styles.inputContainer}>
              <CustomTextField
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setError('');
                }}
                placeholder="Correo electrónico"
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
              <CustomTextField
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setError('');
                }}
                placeholder="Contraseña"
                secureTextEntry
                editable={!loading}
              />
            </View>
            <CustomButton 
              title="Iniciar Sesión" 
              onPress={handleLogin}
              disabled={loading} 
            />
            <CustomButton 
              title="Crear Cuenta" 
              onPress={() => navigation.navigate('Register')}
              disabled={loading}
            />
            <Text 
              style={styles.forgotPassword} 
              onPress={() => !loading && navigation.navigate('ForgotPassword')}>
              ¿Olvidaste tu contraseña?
            </Text>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
<<<<<<< HEAD
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
=======
>>>>>>> 8824e2fe37ac011cbda979ff7495a9e2b6cecc6e
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  card: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    alignItems: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 10,
  },
  forgotPassword: {
    color: '#3b5fff',
    fontSize: 15,
    textDecorationLine: 'underline',
    marginTop: 5,
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default LoginScreen;