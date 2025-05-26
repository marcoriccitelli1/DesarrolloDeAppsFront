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
import CustomTextField from '../components/CustomTextField';
import CustomButton from '../components/CustomButton';
import { AuthContext } from '../context/AuthContext';
import { useAxios } from '../hooks/useAxios';

console.log("LoginScreen: renderizando componente");

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const axios = useAxios();

  // Debug: verifica que login y axios no sean undefined
  console.log("LoginScreen: login del contexto:", login);
  console.log("LoginScreen: axios:", axios);

  const handleLogin = async () => {
    setError('');
    try {
      console.log("LoginScreen: intentando login con", email, password);
      const response = await axios.post('/auth/login', {
        email,
        password,
      });
      console.log("LoginScreen: respuesta del backend:", response.data);
      const { token } = response.data;
      await login(token);
    } catch (err) {
      console.log("LoginScreen: error en login:", err, err?.response?.data);
      setError(
        err.response?.data?.error || 'Email o contraseña incorrectos'
      );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.logoContainer}>
          <Image source={require('../../assets/logonuevo.png')} style={styles.logo} />
          <Text style={styles.title}>Iniciar Sesión</Text>
        </View>
        <View style={styles.card}>
          <View style={styles.inputContainer}>
            <CustomTextField
              value={email}
              onChangeText={setEmail}
              placeholder="Correo electrónico"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <CustomTextField
              value={password}
              onChangeText={setPassword}
              placeholder="Contraseña"
              secureTextEntry
            />
          </View>
          <CustomButton title="Iniciar Sesión" onPress={handleLogin} />
          <CustomButton 
            title="Crear Cuenta" 
            onPress={() => navigation.navigate('Register')} 
          />
          <Text 
            style={styles.forgotPassword} 
            onPress={() => navigation.navigate('ForgotPassword')}>
            ¿Olvidaste tu contraseña?
          </Text>
          {error ? <Text style={{ color: 'red', marginTop: 8 }}>{error}</Text> : null}
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
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
});

export default LoginScreen;