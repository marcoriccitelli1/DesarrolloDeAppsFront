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
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomTextField from '../components/CustomTextField';
import CustomButton from '../components/CustomButton';
import { AuthContext } from '../context/AuthContext';
import { useAuthService } from '../services/authService';



const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const authService = useAuthService();
  const insets = useSafeAreaInsets();



  const handleLogin = async () => {
    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {

      const result = await authService.login(email, password);
      
      if (result.success) {

        const { token } = result.data;
        await login(token);
      } else {
        setError(result.error);
      }
    } catch (err) {

      setError('Error al intentar iniciar sesión');
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
            <Pressable 
              onPress={() => !loading && navigation.navigate('ForgotPassword')}
            >
              <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
            </Pressable>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
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