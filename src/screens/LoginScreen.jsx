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
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomTextField from '../components/CustomTextField';
import CustomButton from '../components/CustomButton';
import { AuthContext } from '../context/AuthContext';
import { useAxios } from '../hooks/useAxios';
import app from '../config/firebase';
import { getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';

const auth = getAuth(app);

const SocialButton = ({ icon, text, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.socialButton}>
    <Image source={icon} style={styles.socialIcon} />
    <Text style={styles.socialText}>{text}</Text>
  </TouchableOpacity>
);

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const axios = useAxios();
  const insets = useSafeAreaInsets();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/auth/login', { email, password });
      console.log('Respuesta login:', response.data);
      const { token } = response.data;
      await login(token);
      console.log('Token guardado:', await getToken());
      
    } catch (err) {
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

  const handleProviderLogin = async (providerType) => {
    if (!providerType) {
      setError('Proveedor no especificado');
      return;
    }
  
    setError('');
    setLoading(true);
  
    try {
      let provider;
      if (providerType === 'google') {
        provider = new GoogleAuthProvider();
      } else if (providerType === 'facebook') {
        provider = new FacebookAuthProvider();
      } else {
        setError('Proveedor no soportado');
        setLoading(false);
        return;
      }
  
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();
  
      // Opcional: Verifica formato JWT
      if (!/^[\w-]+\.[\w-]+\.[\w-]+$/.test(idToken)) {
        console.error("El idToken no tiene formato JWT:", idToken);
        setError("Token inválido");
        setLoading(false);
        return;
      }
  
      console.log("idToken que se envía al backend:", idToken, idToken.length);
  
      const response = await axios.post('/auth/loginWithProvider', { idToken, provider: providerType });
  
      const { token } = response.data;
      await login(token);
  
    } catch (err) {
      console.error('LOGIN PROVIDER ERROR:', err);
  
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.status === 401) {
        setError('Cuenta no registrada o correo no verificado');
      } else {
        setError(err.message || 'Error al iniciar sesión con el proveedor');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleLogin = () => handleProviderLogin('google');
  
  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
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
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>O</Text>
              <View style={styles.dividerLine} />
            </View>
            <SocialButton
              icon={require('../../assets/google-logo.png')}
              text="Continuar con Google"
              onPress={handleGoogleLogin}
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
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  dividerText: {
    marginHorizontal: 8,
    color: '#888',
    fontWeight: '500',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#fff', 
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 6,
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  socialIcon: {
    width: 18,
    height: 18,
    marginRight: 10,
    resizeMode: 'contain',
  },
  socialText: {
    color: '#333', 
    fontWeight: '600',
    fontSize: 15,
  },  
});

export default LoginScreen;
